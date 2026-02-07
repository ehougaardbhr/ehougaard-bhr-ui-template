import type { PlanSettings, PlanSection, ActionItem, ReviewStep } from '../data/artifactData';

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

    // Set all items in current section to queued
    this.updateSectionItemsStatus(this.currentSectionIndex, 'queued');

    // Start executing items with staggered timing
    this.currentItemIndex = 0;
    this.executeNextItem();
  }

  private executeNextItem(): void {
    if (this.paused) return;

    const section = this.settings.sections[this.currentSectionIndex];
    const item = section?.actionItems[this.currentItemIndex];

    if (!item) {
      // Section complete, check for review step
      this.checkForReviewStep();
      return;
    }

    // Set item to working
    this.updateItemStatus(this.currentSectionIndex, this.currentItemIndex, 'working');

    // Random duration 3-5 seconds
    const duration = 3000 + Math.random() * 2000;

    const timer = setTimeout(() => {
      // Set item to done
      this.updateItemStatus(this.currentSectionIndex, this.currentItemIndex, 'done');

      // Move to next item
      this.currentItemIndex++;

      // Stagger next item by 1.5s
      const staggerTimer = setTimeout(() => {
        this.executeNextItem();
      }, 1500);

      this.timers.push(staggerTimer);
    }, duration);

    this.timers.push(timer);
  }

  private checkForReviewStep(): void {
    // Check if there's a review step after current section
    const reviewStep = this.settings.reviewSteps?.[this.currentSectionIndex];

    if (reviewStep && reviewStep.status !== 'passed') {
      // Pause at review step
      this.pauseForReview(reviewStep);
    } else {
      // Move to next section
      this.advanceToNextSection();
    }
  }

  private pauseForReview(reviewStep: ReviewStep): void {
    this.paused = true;

    // Update review step to ready
    const updatedReviewSteps = [...(this.settings.reviewSteps || [])];
    updatedReviewSteps[this.currentSectionIndex] = { ...reviewStep, status: 'ready' };

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

    // Small delay before advancing to next section
    const timer = setTimeout(() => {
      this.advanceToNextSection();
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

  private updateSectionItemsStatus(sectionIndex: number, status: ActionItem['status']): void {
    const updatedSections = [...this.settings.sections];
    const section = updatedSections[sectionIndex];

    if (section) {
      section.actionItems = section.actionItems.map(item => ({
        ...item,
        status,
      }));

      this.settings.sections = updatedSections;

      this.callbacks.updateArtifactSettings(this.artifactId, {
        sections: updatedSections,
      });
    }
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
