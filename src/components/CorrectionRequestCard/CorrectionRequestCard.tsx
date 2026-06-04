import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type { CorrectionRequest } from '../../data/timesheetAgentData';

interface CorrectionRequestCardProps {
  request: CorrectionRequest;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  onAskMore: (id: string) => void;
}

function formatSubmittedAt(isoString: string) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const statusConfig = {
  pending: null,
  approved: {
    label: 'Approved',
    classes: 'bg-[var(--surface-selected-weak)] text-[var(--color-primary-strong)] border-[var(--border-neutral-x-weak)]',
  },
  denied: {
    label: 'Denied',
    classes: 'bg-red-50 text-red-700 border-red-200',
  },
};

export function CorrectionRequestCard({
  request,
  onApprove,
  onDeny,
  onAskMore,
}: CorrectionRequestCardProps) {
  const statusBadge = statusConfig[request.status];

  return (
    <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] overflow-hidden">
      <div className="px-4 py-3 flex items-start justify-between gap-4 border-b border-[var(--border-neutral-xx-weak)]">
        <div className="flex items-center gap-3">
          <Avatar src={request.avatarUrl} alt={request.employeeName} size="small" />
          <div>
            <p className="text-[14px] font-semibold text-[var(--text-neutral-strong)]">{request.employeeName}</p>
            <p className="text-[12px] text-[var(--text-neutral-medium)]">
              {request.day} · Submitted {formatSubmittedAt(request.submittedAt)}
            </p>
          </div>
        </div>
        {statusBadge && (
          <span className={`inline-flex items-center h-6 px-2.5 rounded-[var(--radius-full)] border text-[11px] font-semibold whitespace-nowrap ${statusBadge.classes}`}>
            {statusBadge.label}
          </span>
        )}
      </div>

      <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-x-small)] border border-red-200 bg-red-50/40 px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="circle-info" size={12} className="text-red-600" />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700">What's wrong</p>
          </div>
          <p className="text-[13px] text-[var(--text-neutral-strong)] leading-[1.4]">{request.issue}</p>
        </div>
        <div className="rounded-[var(--radius-x-small)] border border-[var(--color-primary-medium)]/30 bg-[var(--surface-selected-weak)] px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="check-circle" size={12} className="text-[var(--color-primary-strong)]" />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary-strong)]">Requested fix</p>
          </div>
          <p className="text-[13px] text-[var(--text-neutral-strong)] leading-[1.4]">{request.requestedFix}</p>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="px-4 py-3 border-t border-[var(--border-neutral-xx-weak)] flex items-center gap-2">
          <Button
            variant="primary"
            size="small"
            className="!h-8 !px-3 !text-[13px]"
            onClick={() => onApprove(request.id)}
          >
            Approve
          </Button>
          <Button
            variant="standard"
            size="small"
            className="!h-8 !px-3 !text-[13px]"
            onClick={() => onDeny(request.id)}
          >
            Deny
          </Button>
          <Button
            variant="ghost"
            size="small"
            className="!h-8 !px-3 !text-[13px]"
            onClick={() => onAskMore(request.id)}
          >
            Ask for more info
          </Button>
        </div>
      )}
    </div>
  );
}

export default CorrectionRequestCard;
