import { Icon } from '../Icon';
import { LEAVE_CHIP_CLASSES, formatDayLong, type DayData } from './heatmap';
import type { TimeOffEntry } from '../../data/teamTimeOffData';

interface DayDetailPopoverProps {
  data: DayData;
  anchor: DOMRect;
  teamSize: number;
  threshold: number;
  onClose: () => void;
}

const POPOVER_WIDTH = 300;

function PersonRow({ entry, pending }: { entry: TimeOffEntry; pending?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <img src={entry.avatarUrl} alt={entry.employeeName} className="w-7 h-7 rounded-full object-cover shrink-0" />
      <span className="flex-1 min-w-0 truncate text-[13px] font-medium text-[var(--text-neutral-strong)]">
        {entry.employeeName}
      </span>
      <span className={`inline-flex items-center h-5 px-2 rounded-full border text-[11px] font-semibold ${LEAVE_CHIP_CLASSES[entry.leaveType]}`}>
        {entry.leaveType}
      </span>
      {pending && (
        <span className="inline-flex items-center h-5 px-2 rounded-full border border-dashed border-[var(--border-neutral-medium)] text-[11px] font-semibold text-[var(--text-neutral-medium)]">
          Pending
        </span>
      )}
    </div>
  );
}

export function DayDetailPopover({ data, anchor, teamSize, threshold, onClose }: DayDetailPopoverProps) {
  // Position under the cell, clamped to the viewport.
  const left = Math.min(
    Math.max(8, anchor.left),
    window.innerWidth - POPOVER_WIDTH - 8,
  );
  const top = Math.min(anchor.bottom + 6, window.innerHeight - 20);

  const approvedPct = Math.round(data.approvedPct * 100);
  const potentialPct = Math.round(data.potentialPct * 100);

  return (
    <>
      {/* click-outside catcher */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 rounded-[var(--radius-x-small)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] p-3.5"
        style={{ left, top, width: POPOVER_WIDTH, boxShadow: '3px 3px 12px 2px rgba(56, 49, 47, 0.14)' }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[14px] font-bold text-[var(--text-neutral-strong)]">{formatDayLong(data.dateKey)}</p>
            <p className="text-[12px] text-[var(--text-neutral-medium)]">
              {data.approved.length} of {teamSize} out
              <span className="font-semibold"> · {approvedPct}%</span>
              {data.overThreshold && (
                <span className="text-red-600 font-semibold"> · over threshold</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--surface-neutral-xx-weak)]">
            <Icon name="xmark" size={14} className="text-[var(--icon-neutral-strong)]" />
          </button>
        </div>

        {data.becomesOverThreshold && (
          <div className="flex items-start gap-2 mb-2 p-2 rounded-[var(--radius-xx-small)] bg-amber-50 border border-amber-200">
            <Icon name="triangle-exclamation" size={13} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-snug text-amber-800">
              Approving all pending would take this day to {potentialPct}% — over your {Math.round(threshold * 100)}% threshold.
            </p>
          </div>
        )}

        {data.approved.length > 0 && (
          <div className="divide-y divide-[var(--border-neutral-xx-weak)]">
            {data.approved.map((e) => <PersonRow key={e.id} entry={e} />)}
          </div>
        )}

        {data.pending.length > 0 && (
          <>
            <p className="mt-2 mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-neutral-weak)]">
              Pending
            </p>
            <div className="divide-y divide-[var(--border-neutral-xx-weak)]">
              {data.pending.map((e) => <PersonRow key={e.id} entry={e} pending />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
