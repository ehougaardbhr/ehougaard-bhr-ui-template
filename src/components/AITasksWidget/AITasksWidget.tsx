import { Icon } from '../Icon';

interface AITask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'waiting';
  conversationId?: string;
}

const mockTasks: AITask[] = [
  { id: '1', name: 'Generating backfill plan', status: 'completed', conversationId: '20' },
  { id: '2', name: 'Screening talent pool candidates', status: 'running', conversationId: '20' },
];

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
  if (mockTasks.length === 0) {
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
      {mockTasks.map((task) => {
        const config = statusConfig[task.status];
        return (
          <div
            key={task.id}
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

            {/* Task name */}
            <span className="flex-1 text-sm text-[var(--text-neutral-strong)] truncate">
              {task.name}
            </span>

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
