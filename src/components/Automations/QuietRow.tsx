import type { RunningAutomation } from '../../data/automationsData';

interface QuietRowProps {
  automation: RunningAutomation;
  onNavigate: (planId: string) => void;
  isLast?: boolean;
}

export function QuietRow({ automation, onNavigate, isLast = false }: QuietRowProps) {
  const isWorking = automation.status === 'working';
  const progressPct = automation.progress
    ? (automation.progress.current / automation.progress.total) * 100
    : 0;

  return (
    <div
      onClick={() => onNavigate(automation.planId)}
      className={`
        flex items-center gap-3.5
        px-5 py-3 text-[13px]
        hover:bg-[var(--surface-neutral-xx-weak)]
        transition-colors cursor-pointer
        ${!isLast ? 'border-b border-[var(--border-neutral-x-weak)]' : ''}
      `}
    >
      {/* Status dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: isWorking ? 'var(--color-primary-strong)' : '#059669' }}
      />

      {/* Name */}
      <span className="font-semibold text-[var(--text-neutral-strong)] whitespace-nowrap">
        {automation.name}
      </span>

      {/* Meta */}
      <span className="text-xs text-[var(--text-neutral-weak)] flex-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">
        {automation.meta}
      </span>

      {/* Progress bar or spacer */}
      {automation.progress ? (
        <div className="h-1.5 bg-[var(--surface-neutral-x-weak)] rounded-full overflow-hidden w-20 shrink-0">
          <div
            className="h-full rounded-full bg-[var(--color-primary-strong)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      ) : (
        <div className="w-20 shrink-0" />
      )}

      {/* Timestamp */}
      <span className="text-[11px] text-[var(--text-neutral-weak)] whitespace-nowrap">
        {automation.lastUpdate}
      </span>

      {/* Ellipsis */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="
          w-8 h-8 rounded-lg border-none bg-transparent shrink-0
          flex items-center justify-center
          text-[var(--text-neutral-medium)]
          hover:bg-[var(--surface-neutral-xx-weak)]
          hover:text-[var(--text-neutral-strong)]
          transition-colors cursor-pointer
        "
      >
        <i className="fa-solid fa-ellipsis text-xs" />
      </button>

      {/* Chevron */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(automation.planId);
        }}
        className="
          w-8 h-8 rounded-lg border-none bg-transparent shrink-0
          flex items-center justify-center
          text-[var(--text-neutral-medium)]
          hover:bg-[var(--surface-neutral-xx-weak)]
          hover:text-[var(--text-neutral-strong)]
          transition-colors cursor-pointer
        "
      >
        <i className="fa-solid fa-chevron-right text-[11px]" />
      </button>
    </div>
  );
}
