import type { PlanSettings, ActionItem } from '../data/artifactData';

interface ExecutionCallbacks {
  updateArtifactSettings: (id: string, settings: Partial<PlanSettings>) => void;
  addNotification: (notification: {
    title: string;
    message: string;
    type?: 'info' | 'action_needed' | 'completed';
    conversationId?: string;
  }) => void;
  onReviewGateReached?: (conversationId: string, message: string, suggestions?: string[]) => void;
}

interface ItemLocation {
  sectionIndex: number;
  itemIndex: number;
}

class PlanExecutionEngine {
  private artifactId: string;
  private conversationId: string;
  private settings: PlanSettings;
  private callbacks: ExecutionCallbacks;
  private timers: NodeJS.Timeout[] = [];
  private paused: boolean = false;
  private executingItems: Set<string> = new Set();

  constructor(artifactId: string, conversationId: string, settings: PlanSettings, callbacks: ExecutionCallbacks) {
    this.artifactId = artifactId;
    this.conversationId = conversationId;
    this.settings = settings;
    this.callbacks = callbacks;
  }

  start(): void {
    // Fire "Plan Started" notification
    this.callbacks.addNotification({
      type: 'info',
      title: 'Plan Started',
      message: `Working on: ${this.settings.sections[0]?.title || 'Plan'}`,
      conversationId: this.conversationId,
    });

    // Kick off the dependency-based scheduler
    this.scheduleReady();
  }

  private findItemLocation(itemId: string): ItemLocation | null {
    for (let si = 0; si < this.settings.sections.length; si++) {
      const section = this.settings.sections[si];
      for (let ii = 0; ii < section.actionItems.length; ii++) {
        if (section.actionItems[ii].id === itemId) {
          return { sectionIndex: si, itemIndex: ii };
        }
      }
    }
    return null;
  }

  private getItemById(itemId: string): ActionItem | null {
    for (const section of this.settings.sections) {
      for (const item of section.actionItems) {
        if (item.id === itemId) return item;
      }
    }
    return null;
  }

  private isItemReady(item: ActionItem): boolean {
    // Only schedule planned items
    if (item.status !== 'planned') return false;

    // Already executing
    if (this.executingItems.has(item.id)) return false;

    // Check all dependencies are done
    const deps = item.dependsOn || [];
    for (const depId of deps) {
      const depItem = this.getItemById(depId);
      if (!depItem || depItem.status !== 'done') return false;

      // Check if an approval gate sits after this dependency and hasn't passed
      // Only artifact-type reviews block execution (findings reviews are informational)
      const gate = this.settings.reviewSteps?.find(
        rs => rs.afterItem === depId && rs.type === 'artifact' && rs.status !== 'passed'
      );
      if (gate) return false;
    }

    return true;
  }

  private scheduleReady(): void {
    if (this.paused) return;

    // Find all ready items across all sections
    const readyItems: Array<{ item: ActionItem; loc: ItemLocation }> = [];

    for (let si = 0; si < this.settings.sections.length; si++) {
      const section = this.settings.sections[si];
      for (let ii = 0; ii < section.actionItems.length; ii++) {
        const item = section.actionItems[ii];
        if (this.isItemReady(item)) {
          readyItems.push({ item, loc: { sectionIndex: si, itemIndex: ii } });
        }
      }
    }

    // Queue and execute ready items with staggered starts
    readyItems.forEach(({ item, loc }, index) => {
      // Queue immediately
      this.updateItemStatus(loc.sectionIndex, loc.itemIndex, 'queued');

      // Stagger execution start by 200-400ms per item
      const staggerDelay = index * (200 + Math.random() * 200);
      const timer = setTimeout(() => {
        this.executeItem(item.id, loc);
      }, staggerDelay);
      this.timers.push(timer);
    });

    // Check if we're done or stuck waiting for reviews
    if (readyItems.length === 0 && this.executingItems.size === 0) {
      const allDone = this.settings.sections.every(s =>
        s.actionItems.every(item => item.status === 'done')
      );
      if (allDone) {
        this.complete();
      }
      // Otherwise we're waiting for a review gate — paused state
    }
  }

  private executeItem(itemId: string, loc: ItemLocation): void {
    if (this.paused) return;

    this.executingItems.add(itemId);
    this.updateItemStatus(loc.sectionIndex, loc.itemIndex, 'working');

    // Random duration 3-5 seconds
    const duration = 3000 + Math.random() * 2000;

    const timer = setTimeout(() => {
      this.executingItems.delete(itemId);
      this.updateItemStatus(loc.sectionIndex, loc.itemIndex, 'done');

      // Check for review gate after this item
      const staggerTimer = setTimeout(() => {
        this.checkReviewGateAfterItem(itemId);
        // Schedule next wave of ready items
        this.scheduleReady();
      }, 500);
      this.timers.push(staggerTimer);
    }, duration);

    this.timers.push(timer);
  }

  private checkReviewGateAfterItem(itemId: string): void {
    // Only activate artifact-type reviews as gates (findings reviews are informational)
    const reviewStep = this.settings.reviewSteps?.find(
      rs => rs.afterItem === itemId && rs.type === 'artifact' && rs.status !== 'passed'
    );

    if (reviewStep) {
      // Activate the review gate
      const updatedReviewSteps = (this.settings.reviewSteps || []).map(rs =>
        rs.id === reviewStep.id ? { ...rs, status: 'ready' as const } : rs
      );

      this.settings.reviewSteps = updatedReviewSteps;

      this.callbacks.updateArtifactSettings(this.artifactId, {
        reviewSteps: updatedReviewSteps,
      });

      // Fire notification
      this.callbacks.addNotification({
        type: 'action_needed',
        title: 'Needs Your Review',
        message: reviewStep.description,
        conversationId: this.conversationId,
      });

      // Post AI chat message with summary + suggested prompts
      if (this.callbacks.onReviewGateReached) {
        const doneCount = this.settings.sections.flatMap(s => s.actionItems).filter(i => i.status === 'done').length;
        const totalCount = this.settings.sections.flatMap(s => s.actionItems).length;
        const gateMessage = `I've completed ${doneCount} of ${totalCount} steps. I'll need your approval on: **${reviewStep.description}**. You can review the deliverables above and approve when ready.`;
        this.callbacks.onReviewGateReached(
          this.conversationId,
          gateMessage,
          this.settings.suggestedPrompts
        );
      }
    }
  }

  resume(): void {
    // Mark all 'ready' review steps as 'passed' (UI already updated artifact context,
    // but we need to sync the engine's internal state)
    if (this.settings.reviewSteps) {
      this.settings.reviewSteps = this.settings.reviewSteps.map(rs =>
        rs.status === 'ready' ? { ...rs, status: 'passed' as const } : rs
      );
    }

    this.paused = false;

    // Small delay before continuing
    const timer = setTimeout(() => {
      this.scheduleReady();
    }, 500);

    this.timers.push(timer);
  }

  private complete(): void {
    // Set plan status to completed
    this.callbacks.updateArtifactSettings(this.artifactId, {
      status: 'completed',
    });

    // Fire completion notification
    this.callbacks.addNotification({
      type: 'completed',
      title: 'Plan Complete',
      message: `All items completed`,
      conversationId: this.conversationId,
    });

    // Cleanup
    this.stop();
  }

  pause(): void {
    this.paused = true;
  }

  stop(): void {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];

    // Remove from registry
    executionRegistry.delete(this.artifactId);
  }

  private updateItemStatus(sectionIndex: number, itemIndex: number, status: ActionItem['status']): void {
    const updatedSections = [...this.settings.sections];
    const section = updatedSections[sectionIndex];

    if (section && section.actionItems[itemIndex]) {
      section.actionItems[itemIndex] = {
        ...section.actionItems[itemIndex],
        status,
      };

      this.settings.sections = updatedSections;

      this.callbacks.updateArtifactSettings(this.artifactId, {
        sections: updatedSections,
      });
    }
  }
}

// Singleton registry to persist engines across React re-renders
const executionRegistry = new Map<string, PlanExecutionEngine>();

export function startPlanExecution(
  artifactId: string,
  conversationId: string,
  settings: PlanSettings,
  callbacks: ExecutionCallbacks
): void {
  // Stop any existing execution for this artifact
  const existing = executionRegistry.get(artifactId);
  if (existing) {
    existing.stop();
  }

  // Create and start new engine
  const engine = new PlanExecutionEngine(artifactId, conversationId, settings, callbacks);
  executionRegistry.set(artifactId, engine);
  engine.start();
}

export function resumePlanExecution(artifactId: string): void {
  const engine = executionRegistry.get(artifactId);
  if (engine) {
    engine.resume();
  }
}

export function stopPlanExecution(artifactId: string): void {
  const engine = executionRegistry.get(artifactId);
  if (engine) {
    engine.stop();
  }
}
