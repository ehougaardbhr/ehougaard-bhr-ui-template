import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import type { Artifact, PlanSettings, PlanStatus } from '../../data/artifactData';

interface PlanInlineCardProps {
  artifact: Artifact;
  compact?: boolean;
}

const statusConfig: Record<PlanStatus, { label: string; bg: string; text: string }> = {
  draft: {
    label: 'Draft',
    bg: 'var(--surface-neutral-x-weak)',
    text: 'var(--text-neutral-medium)',
  },
  pending_approval: {
    label: 'Pending Approval',
    bg: '#FEF3C7',
    text: '#92400E',
  },
  approved: {
    label: 'Approved',
    bg: '#D1FAE5',
    text: '#065F46',
  },
  in_progress: {
    label: 'In Progress',
    bg: '#DBEAFE',
    text: '#1E40AF',
  },
  completed: {
    label: 'Completed',
    bg: '#D1FAE5',
    text: '#065F46',
  },
};

export function PlanInlineCard({ artifact, compact = false }: PlanInlineCardProps) {
  const navigate = useNavigate();
  const settings = artifact.settings as PlanSettings;

  const sectionCount = settings.sections.length;
  const allActionItems = settings.sections.flatMap(s => s.actionItems || []);
  const completedCount = allActionItems.filter(ai => ai.status === 'completed').length;
  const totalCount = allActionItems.length;

  const status = statusConfig[settings.status];

  const handleClick = () => {
    navigate(`/artifact/plan/${artifact.id}`);
  };

  return (
    <div
      className="rounded-xl my-3 p-6 cursor-pointer hover:border-[var(--border-neutral-medium)] transition-colors"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
        border: '1px solid var(--border-neutral-weak)',
      }}
      onClick={handleClick}
    >
      {/* Header with title */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3
          className="font-bold"
          style={{
            fontSize: '20px',
            lineHeight: '28px',
            fontFamily: 'Fields, system-ui, sans-serif',
            color: 'var(--color-primary-strong)',
          }}
        >
          {artifact.title}
        </h3>
      </div>

      {/* Meta info row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Status badge */}
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: status.bg,
            color: status.text,
          }}
        >
          {status.label}
        </span>

        {/* Section count */}
        <span
          className="inline-flex items-center gap-1.5 text-xs"
          style={{
            color: 'var(--text-neutral-medium)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <Icon name="list" size={12} />
          {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
        </span>

        {/* Action items summary */}
        {totalCount > 0 && (
          <span
            className="inline-flex items-center gap-1.5 text-xs"
            style={{
              color: 'var(--text-neutral-medium)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <Icon name="check-circle" size={12} />
            {completedCount} of {totalCount} items completed
          </span>
        )}
      </div>

      {/* Description */}
      {artifact.content && (
        <p
          className="text-sm mb-4 line-clamp-2"
          style={{
            color: 'var(--text-neutral-medium)',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: '20px',
          }}
        >
          {artifact.content}
        </p>
      )}

      {/* Review Plan button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        style={{
          backgroundColor: 'var(--color-primary-strong)',
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        <Icon name="file-lines" size={14} />
        Review Plan
      </button>
    </div>
  );
}

export default PlanInlineCard;
