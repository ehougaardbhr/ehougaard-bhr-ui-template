import { Button } from '../Button';
import { Icon } from '../Icon';
import { LEAVE_CHIP_CLASSES, formatDayLong } from './heatmap';
import type { TimeOffEntry } from '../../data/teamTimeOffData';

interface IncomingRequestBannerProps {
  request: TimeOffEntry;
  /** approved count on the request's day, BEFORE approving this one */
  currentApproved: number;
  teamSize: number;
  threshold: number;
  onApprove: () => void;
  onDeny: () => void;
  onView: () => void;
}

export function IncomingRequestBanner({
  request,
  currentApproved,
  teamSize,
  threshold,
  onApprove,
  onDeny,
  onView,
}: IncomingRequestBannerProps) {
  const currentPct = Math.round((currentApproved / teamSize) * 100);
  const projectedPct = Math.round(((currentApproved + 1) / teamSize) * 100);
  const thresholdPct = Math.round(threshold * 100);
  const wouldCross = (currentApproved + 1) / teamSize > threshold && currentApproved / teamSize <= threshold;
  const alreadyOver = currentApproved / teamSize > threshold;

  return (
    <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] p-4 mb-4"
      style={{ boxShadow: 'var(--shadow-300)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[var(--color-primary-weak)] text-[var(--color-primary-strong)] text-[11px] font-bold uppercase tracking-wide">
          <Icon name="bell" size={11} /> New request
        </span>
        <span className="text-[12px] text-[var(--text-neutral-medium)]">needs your review</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img src={request.avatarUrl} alt={request.employeeName} className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[var(--text-neutral-strong)] flex items-center gap-2 flex-wrap">
              {request.employeeName}
              <span className={`inline-flex items-center h-5 px-2 rounded-full border text-[11px] font-semibold ${LEAVE_CHIP_CLASSES[request.leaveType]}`}>
                {request.leaveType}
              </span>
            </p>
            <button onClick={onView} className="text-[13px] text-[var(--color-link)] hover:underline">
              {formatDayLong(request.date)} — jump to day
            </button>
          </div>
        </div>

        {/* Coverage impact */}
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-[var(--text-neutral-medium)]">That day is at</span>
          <span className="font-bold text-[var(--text-neutral-strong)]">{currentApproved}/{teamSize} · {currentPct}%</span>
          <Icon name="chevron-right" size={13} className="text-[var(--icon-neutral-strong)]" />
          <span className={`font-bold ${wouldCross || alreadyOver ? 'text-red-600' : 'text-[var(--text-neutral-strong)]'}`}>
            {currentApproved + 1}/{teamSize} · {projectedPct}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outlined" size="small" onClick={onDeny}>Deny</Button>
          <Button variant="primary" size="small" onClick={onApprove}>Approve</Button>
        </div>
      </div>

      {(wouldCross || alreadyOver) && (
        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[var(--border-neutral-x-weak)]">
          <Icon name="triangle-exclamation" size={14} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[12px] leading-snug text-[var(--text-neutral-medium)]">
            {alreadyOver
              ? `This day is already over your ${thresholdPct}% coverage threshold.`
              : `Approving pushes this day to ${projectedPct}% — over your ${thresholdPct}% coverage threshold.`}
          </p>
        </div>
      )}
    </div>
  );
}
