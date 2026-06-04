import { useState } from 'react';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import type { AutoApprovedRow } from '../../data/timesheetAgentData';

interface AutoApprovedBannerProps {
  rows: AutoApprovedRow[];
  onUndo: (id: string) => void;
}

function formatApprovedAt(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function AutoApprovedBanner({ rows, onUndo }: AutoApprovedBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (rows.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-small)] border border-[var(--color-primary-medium)]/30 bg-[var(--surface-selected-weak)] overflow-hidden">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-[var(--color-primary-strong)] flex items-center justify-center">
            <Icon name="check" size={10} className="text-white" />
          </div>
          <span className="text-[13px] font-semibold text-[var(--color-primary-strong)]">
            Agent auto-approved {rows.length} timesheets — no issues found
          </span>
        </div>
        <Icon
          name="chevron-down"
          size={11}
          className={`text-[var(--color-primary-strong)] transition-transform ${isExpanded ? '' : '-rotate-90'}`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-[var(--color-primary-medium)]/20 bg-[var(--surface-neutral-white)]">
          <div className="divide-y divide-[var(--border-neutral-xx-weak)]">
            {rows.map((row) => (
              <div key={row.id} className="px-4 py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={row.avatarUrl} alt={row.employeeName} size="small" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)] truncate">{row.employeeName}</p>
                    <p className="text-[11px] text-[var(--text-neutral-medium)]">
                      {row.payPeriod} · {row.totalHours}h total · Auto-approved {formatApprovedAt(row.approvedAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onUndo(row.id)}
                  className="shrink-0 text-[12px] font-semibold text-[var(--text-neutral-medium)] hover:text-[var(--text-neutral-strong)] underline"
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-[var(--border-neutral-xx-weak)]">
            <button className="text-[12px] font-semibold text-[var(--color-primary-strong)] hover:underline">
              View all auto-approved timesheets →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoApprovedBanner;
