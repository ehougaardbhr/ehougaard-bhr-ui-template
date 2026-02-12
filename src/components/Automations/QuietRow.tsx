import { useState } from 'react';
import type { RunningAutomation } from '../../data/automationsData';

interface QuietRowProps {
  automation: RunningAutomation;
  onNavigate: (planId: string) => void;
  isLast?: boolean;
}

export function QuietRow({ automation, onNavigate, isLast = false }: QuietRowProps) {
  const [enabled, setEnabled] = useState(true);
  const isWorking = automation.status === 'working';
  const progressPct = automation.progress
    ? (automation.progress.current / automation.progress.total) * 100
    : 0;

  return (
    <div
      onClick={() => onNavigate(automation.planId)}
      className={`
        relative flex items-center gap-3.5
        pl-5 pr-20 py-4
        hover:bg-[var(--surface-neutral-xx-weak)]
        transition-colors cursor-pointer
        ${!isLast ? 'border-b border-[var(--border-neutral-x-weak)]' : ''}
        ${!enabled ? 'opacity-50' : ''}
      `}
    >
      {/* Status dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: !enabled ? 'var(--text-neutral-weak)' : isWorking ? 'var(--color-primary-strong)' : '#059669' }}
      />

      {/* Name */}
      <span className="text-base font-semibold text-[var(--text-neutral-strong)] whitespace-nowrap">
        {automation.name}
      </span>

      {/* Meta */}
      <span className="text-sm text-[var(--text-neutral-weak)] flex-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">
        {automation.meta}
      </span>

      {/* Progress bar or spacer */}
      {automation.progress ? (
        <div className="h-1.5 bg-[var(--surface-neutral-x-weak)] rounded-full overflow-hidden w-20 shrink-0">
          <div
            className={`h-full rounded-full transition-all duration-300 ${enabled ? 'bg-[var(--color-primary-strong)]' : 'bg-[var(--border-neutral-medium)]'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      ) : (
        <div className="w-20 shrink-0" />
      )}

      {/* Timestamp */}
      <span className="text-sm text-[var(--text-neutral-weak)] whitespace-nowrap">
        {automation.lastUpdate}
      </span>

      {/* Toggle — pinned 32px from right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEnabled(!enabled);
        }}
        className={`
          absolute right-6 w-9 h-5 rounded-full
          border-none cursor-pointer
          transition-colors duration-200
          ${enabled
            ? 'bg-[var(--color-primary-strong)]'
            : 'bg-[var(--border-neutral-medium)]'
          }
        `}
        aria-label={enabled ? 'Disable agent' : 'Enable agent'}
      >
        <div
          className={`
            absolute top-0.5 w-4 h-4 rounded-full
            bg-white shadow-sm
            transition-transform duration-200
            ${enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}
          `}
        />
      </button>
    </div>
  );
}
