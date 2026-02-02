import { Icon } from '../Icon';
import { Button } from '../Button';

interface SuccessNotificationProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  show: boolean;
}

export function SuccessNotification({
  title,
  description,
  actionLabel,
  onAction,
  onDismiss,
  show
}: SuccessNotificationProps) {
  if (!show) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
      <div
        className="flex items-center gap-4 px-6 py-4 rounded-xl"
        style={{
          background: 'linear-gradient(180deg, #008A00 0%, #006B00 100%)',
          boxShadow: '3px 3px 10px 2px rgba(56, 49, 47, 0.1)',
          minWidth: '400px'
        }}
      >
        {/* Check Icon */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="check" size={16} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="text-[16px] font-semibold leading-[24px] text-white">
            {title}
          </div>
          {description && (
            <div className="text-[14px] font-normal leading-[20px] text-white/90 mt-0.5">
              {description}
            </div>
          )}
        </div>

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="standard"
            size="small"
            className="!bg-white/10 !text-white !border-white/40 hover:!bg-white/20"
          >
            {actionLabel}
          </Button>
        )}

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <Icon name="xmark" size={14} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SuccessNotification;
