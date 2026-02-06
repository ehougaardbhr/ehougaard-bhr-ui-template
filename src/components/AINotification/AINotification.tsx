import { useEffect, useState } from 'react';
import { Icon } from '../Icon';
import { useAINotifications } from '../../contexts/AINotificationContext';
import type { AINotification } from '../../contexts/AINotificationContext';

const typeConfig = {
  info: {
    accentColor: '#5eb3d4',
    icon: 'sparkles' as const,
  },
  action_needed: {
    accentColor: '#f0a36e',
    icon: 'sparkles' as const,
  },
  completed: {
    accentColor: '#87c276',
    icon: 'check-circle' as const,
  },
};

function NotificationCard({
  notification,
  onDismiss,
}: {
  notification: AINotification;
  onDismiss: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const config = typeConfig[notification.type || 'info'];

  useEffect(() => {
    // Trigger slide-in animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClick = () => {
    if (notification.conversationId) {
      localStorage.setItem('bhr-chat-panel-open', 'true');
      localStorage.setItem('bhr-chat-expanded', 'false');
      localStorage.setItem('bhr-selected-conversation', notification.conversationId);
    }
    onDismiss(notification.id);
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 ease-out"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
        border: '1px solid var(--border-neutral-weak)',
        width: 360,
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible ? 1 : 0,
      }}
      onClick={handleClick}
    >
      {/* Accent bar on left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: config.accentColor }}
      />

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{ backgroundColor: `${config.accentColor}20` }}
        >
          <Icon name={config.icon} size={16} style={{ color: config.accentColor }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-neutral-strong)] truncate">
            {notification.title}
          </p>
          <p className="text-xs text-[var(--text-neutral-medium)] mt-0.5 line-clamp-2">
            {notification.message}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
          className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-[var(--surface-neutral-xx-weak)] transition-colors shrink-0"
        >
          <Icon name="xmark" size={12} className="text-[var(--text-neutral-weak)]" />
        </button>
      </div>
    </div>
  );
}

export function AINotificationStack() {
  const { notifications, dismissNotification } = useAINotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
}
