import type { PlanSettings, ActionItem, ReviewStep } from '../data/artifactData';

interface ExecutionCallbacks {
  updateArtifactSettings: (id: string, settings: Partial<PlanSettings>) => void;
  addNotification: (notification: {
    title: string;
    message: string;
    type?: 'info' | 'action_needed' | 'completed';
    conversationId?: string;
  }) => void;
}

class PlanExecutionEngine {
  private artifactId: string;
  private conversationId: string;
  private settings: PlanSettings;
  private callbacks: ExecutionCallbacks;
  private timers: NodeJS.Timeout[] = [];
  private paused: boolean = false;
  private currentSectionIndex: number = 0;
  private currentItemIndex: number = 0;

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

    // Start with the first section
    this.currentSectionIndex = 0;
    this.currentItemIndex = 0;
    this.executeSection();
  }

  private executeSection(): void {
    if (this.paused) return;

    // Check if we've completed all sections
    if (this.currentSectionIndex >= this.settings.sections.length) {
      this.complete();
      return;
    }

    const section = this.settings.sections[this.currentSectionIndex];
    if (!section) {
      // All sections complete
      this.complete();
      return;
    }

    // Queue items up to the first review gate in this section
    this.queueItemsUpToNextGate();

    // Start executing items with staggered timing
    this.currentItemIndex = 0;
    this.executeNextItem();
  }

  private queueItemsUpToNextGate(): void {
    const section = this.settings.sections[this.currentSectionIndex];
    if (!section) return;

    const updatedSections = [...this.settings.sections];
    const updatedItems = [...section.actionItems];
    let startIdx = this.currentItemIndex;

    for (let i = startIdx; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      if (item.status === 'planned') {
        updatedItems[i] = { ...item, status: 'queued' };
      }
      // Stop queuing after item that has a review gate
      const hasGate = this.settings.reviewSteps?.some(rs => rs.afterItem === item.id && rs.status !== 'passed');
      if (hasGate) break;
    }

    updatedSections[this.currentSectionIndex] = { ...section, actionItems: updatedItems };
    this.settings.sections = updatedSections;

    this.callbacks.updateArtifactSettings(this.artifactId, {
      sections: updatedSections,
    });
  }

  private executeNextItem(): void {
    if (this.paused) return;

    const section = this.settings.sections[this.currentSectionIndex];
    const item = section?.actionItems[this.currentItemIndex];

    if (!item) {
      // Section complete, advance to next section
      this.advanceToNextSection();
      return;
    }

    // Set item to working
    this.updateItemStatus(this.currentSectionIndex, this.currentItemIndex, 'working');

    // Random duration 3-5 seconds
    const duration = 3000 + Math.random() * 2000;

    const timer = setTimeout(() => {
      // Set item to done
      this.updateItemStatus(this.currentSectionIndex, this.currentItemIndex, 'done');

      // Check for review gate after this item
      const staggerTimer = setTimeout(() => {
        this.checkForReviewAfterItem(item.id);
      }, 1500);

      this.timers.push(staggerTimer);
    }, duration);

    this.timers.push(timer);
  }

  private checkForReviewAfterItem(itemId: string): void {
    const reviewStep = this.settings.reviewSteps?.find(
      rs => rs.afterItem === itemId && rs.status !== 'passed'
    );

    if (reviewStep) {
      this.pauseForReview(reviewStep);
    } else {
      // Move to next item
      this.currentItemIndex++;
      const section = this.settings.sections[this.currentSectionIndex];
      if (this.currentItemIndex >= (section?.actionItems.length ?? 0)) {
        this.advanceToNextSection();
      } else {
        this.executeNextItem();
      }
    }
  }

  private pauseForReview(reviewStep: ReviewStep): void {
    this.paused = true;

    // Update review step to ready (find by ID)
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
  }

  resume(): void {
    if (!this.paused) return;

    this.paused = false;

    // Small delay before continuing
    const timer = setTimeout(() => {
      // Continue with remaining items in current section
      this.currentItemIndex++;
      const section = this.settings.sections[this.currentSectionIndex];
      if (this.currentItemIndex >= (section?.actionItems.length ?? 0)) {
        this.advanceToNextSection();
      } else {
        // Queue remaining items up to the next gate, then continue executing
        this.queueItemsUpToNextGate();
        this.executeNextItem();
      }
    }, 1000);

    this.timers.push(timer);
  }

  private advanceToNextSection(): void {
    this.currentSectionIndex++;
    this.currentItemIndex = 0;

    if (this.currentSectionIndex >= this.settings.sections.length) {
      // All sections complete
      this.complete();
    } else {
      // Execute next section
      this.executeSection();
    }
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
