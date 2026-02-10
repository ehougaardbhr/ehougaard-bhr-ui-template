import type { RunningAutomation } from '../../data/automationsData';

interface QuietRowProps {
  automation: RunningAutomation;
  onNavigate: (planId: string) => void;
}

const statusColors: Record<string, string> = {
  working: '#2563EB',
  done: '#059669',
};

export function QuietRow({ automation, onNavigate }: QuietRowProps) {
  const dotColor = statusColors[automation.status] || statusColors.working;
  const progressPct = automation.progress
    ? (automation.progress.current / automation.progress.total) * 100
    : 0;

  return (
    <div
      onClick={() => onNavigate(automation.planId)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 18px',
        background: 'var(--surface-neutral-white)',
        border: '1px solid var(--border-neutral-weak)',
        borderRadius: 8,
        marginBottom: 4,
        fontSize: 13,
        transition: 'background 0.12s',
        cursor: 'pointer',
      }}
      className="quiet-row-hover"
    >
      {/* Status dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          background: dotColor,
        }}
      />

      {/* Name */}
      <span
        style={{
          fontWeight: 600,
          color: 'var(--text-neutral-strong)',
          minWidth: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {automation.name}
      </span>

      {/* Meta */}
      <span
        style={{
          fontSize: 12,
          color: 'var(--text-neutral-weak)',
          flex: 1,
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {automation.meta}
      </span>

      {/* Progress bar or spacer */}
      {automation.progress ? (
        <div
          style={{
            height: 6,
            background: 'var(--surface-neutral-x-weak)',
            borderRadius: 3,
            overflow: 'hidden',
            width: 80,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 3,
              width: `${progressPct}%`,
              background: dotColor,
            }}
          />
        </div>
      ) : (
        <div style={{ width: 80, flexShrink: 0 }} />
      )}

      {/* Timestamp */}
      <span style={{ fontSize: 11, color: 'var(--text-neutral-weak)', whiteSpace: 'nowrap' }}>
        {automation.lastUpdate}
      </span>

      {/* Ellipsis */}
      <button
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-neutral-medium)',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
        className="icon-btn-hover"
      >
        <i className="fa-solid fa-ellipsis" style={{ fontSize: 12 }} />
      </button>

      {/* Chevron */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(automation.planId);
        }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-neutral-medium)',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
        className="icon-btn-hover"
      >
        <i className="fa-solid fa-chevron-right" style={{ fontSize: 11 }} />
      </button>
    </div>
  );
}
