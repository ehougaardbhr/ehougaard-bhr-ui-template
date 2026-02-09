import { Icon } from '../Icon';
import type { PlanDetailData } from '../../data/planDetailData';

interface PlanDetailHeaderProps {
  plan: PlanDetailData;
  onOpenInChat: () => void;
}

const statusConfig = {
  running: {
    icon: 'clipboard-list' as const,
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    badgeBg: '#DBEAFE',
    badgeColor: '#2563EB',
    badgeIcon: 'spinner' as const,
    progressColor: '#2563EB',
  },
  paused: {
    icon: 'clipboard-list' as const,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    badgeIcon: 'hand' as const,
    progressColor: '#2563EB',
  },
  completed: {
    icon: 'clipboard-check' as const,
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    badgeBg: '#D1FAE5',
    badgeColor: '#059669',
    badgeIcon: 'check' as const,
    progressColor: '#059669',
  },
};

export function PlanDetailHeader({ plan, onOpenInChat }: PlanDetailHeaderProps) {
  const config = statusConfig[plan.status];
  const progressPct = plan.totalItems > 0 ? (plan.completedItems / plan.totalItems) * 100 : 0;

  return (
    <div
      className="bg-[var(--surface-neutral-white)] rounded-2xl border border-[var(--border-neutral-weak)] p-5 mb-5"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {/* Top section */}
      <div className="flex items-center gap-3.5 mb-3.5">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-base flex-shrink-0"
          style={{ backgroundColor: config.iconBg, color: config.iconColor }}
        >
          <Icon name={config.icon} size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold mb-0.5 text-[var(--text-neutral-x-strong)]">{plan.title}</h1>
          <div className="flex items-center gap-3.5 flex-wrap text-xs text-[var(--text-neutral-medium)]">
            {/* Status badge */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: config.badgeBg, color: config.badgeColor }}
            >
              <Icon name={config.badgeIcon} size={11} />
              {plan.statusLabel}
            </span>

            {/* Started/Completed date */}
            <div className="flex items-center gap-1">
              <Icon name="clock" size={10} variant="regular" />
              {plan.completedAt || plan.startedAt}
            </div>

            {/* Open in chat link */}
            <button
              onClick={onOpenInChat}
              className="flex items-center gap-1 text-[var(--color-primary-strong)] hover:underline"
            >
              <Icon name="comment" size={10} variant="regular" />
              {plan.status === 'completed' ? 'View conversation' : 'Open in chat'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3.5">
        <div className="flex-1 h-[5px] bg-[var(--surface-neutral-weak)] rounded-[3px] overflow-hidden">
          <div
            className="h-full rounded-[3px] transition-all duration-300"
            style={{ width: `${progressPct}%`, backgroundColor: config.progressColor }}
          />
        </div>
        <div className="text-xs font-semibold text-[var(--text-neutral-medium)] whitespace-nowrap">
          {plan.status === 'completed'
            ? `${plan.completedItems} of ${plan.totalItems} · ${plan.totalReviews} reviews · ${plan.totalArtifacts} artifacts`
            : `${plan.completedItems} of ${plan.totalItems} complete`}
        </div>
      </div>
    </div>
  );
}
