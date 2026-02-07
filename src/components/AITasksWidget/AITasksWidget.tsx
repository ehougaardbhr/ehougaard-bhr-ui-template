import { Icon } from '../Icon';
import { useArtifact } from '../../contexts/ArtifactContext';
import { useChat } from '../../contexts/ChatContext';
import type { PlanSettings } from '../../data/artifactData';

interface AITask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'waiting';
  conversationId?: string;
  progress?: string;
}

const statusConfig = {
  running: {
    icon: null, // uses spinner
    color: 'var(--color-primary-strong)',
    label: 'Running',
  },
  completed: {
    icon: 'check-circle' as const,
    color: 'var(--color-primary-strong)',
    label: 'Done',
  },
  waiting: {
    icon: 'clock' as const,
    color: 'var(--text-neutral-weak)',
    label: 'Waiting',
  },
};

export function AITasksWidget() {
  const { artifacts } = useArtifact();
  const { selectConversation } = useChat();

  // Derive tasks from running/completed plan artifacts
  const tasks: AITask[] = artifacts
    .filter(a => a.type === 'plan')
    .map(artifact => {
      const settings = artifact.settings as PlanSettings;

      // Calculate progress
      const allItems = settings.sections.flatMap(s => s.actionItems || []);
      const doneItems = allItems.filter(i => i.status === 'done');
      const totalItems = allItems.length;

      // Determine status
      let status: 'running' | 'completed' | 'waiting';
      const hasReadyReview = settings.reviewSteps?.some(rs => rs.status === 'ready');

      if (settings.status === 'completed') {
        status = 'completed';
      } else if (hasReadyReview) {
        status = 'waiting';
      } else if (settings.status === 'running') {
        status = 'running';
      } else {
        return null; // Don't show proposed plans
      }

      return {
        id: artifact.id,
        name: artifact.title,
        status,
        conversationId: artifact.conversationId,
        progress: `${doneItems.length}/${totalItems}`,
      };
    })
    .filter((t): t is AITask => t !== null);

  const handleTaskClick = (task: AITask) => {
    if (task.conversationId) {
      selectConversation(task.conversationId);
      // Open chat panel via localStorage
      localStorage.setItem('bhr-chat-panel-open', 'true');
      window.dispatchEvent(new Event('storage'));
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-8">
        <Icon name="sparkles" size={32} className="text-[var(--text-neutral-weak)] mb-3" />
        <p className="text-sm text-[var(--text-neutral-medium)]">No AI tasks running</p>
        <p className="text-xs text-[var(--text-neutral-weak)] mt-1">
          Start a conversation to create tasks
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {tasks.map((task) => {
        const config = statusConfig[task.status];
        return (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer"
          >
            {/* Status indicator */}
            <div className="flex items-center justify-center w-5 h-5 shrink-0">
              {task.status === 'running' ? (
                <div
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${config.color}`, borderTopColor: 'transparent' }}
                />
              ) : (
                <Icon
                  name={config.icon!}
                  size={16}
                  style={{ color: config.color }}
                />
              )}
            </div>

            {/* Task name + progress */}
            <div className="flex-1 min-w-0">
              <span className="text-sm text-[var(--text-neutral-strong)] truncate block">
                {task.name}
              </span>
              {task.progress && (
                <span className="text-xs text-[var(--text-neutral-weak)]">
                  {task.progress} complete
                </span>
              )}
            </div>

            {/* Status label */}
            <span
              className="text-xs font-medium shrink-0"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default AITasksWidget;
