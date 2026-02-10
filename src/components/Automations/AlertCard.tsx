import type { AutomationAlert } from '../../data/automationsData';
import { alertTypeConfig } from '../../data/automationsData';

interface AlertCardProps {
  alert: AutomationAlert;
  onNavigate: (planId: string) => void;
}

export function AlertCard({ alert, onNavigate }: AlertCardProps) {
  const config = alertTypeConfig[alert.type];

  return (
    <div
      style={{
        background: 'var(--surface-neutral-white)',
        borderRadius: 12,
        padding: '18px 22px',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'start',
        gap: 14,
        border: '1px solid var(--border-neutral-weak)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s',
        cursor: 'default',
      }}
      className="alert-card-hover"
    >
      {/* Left color bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: config.color,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          background: config.bgLight,
          color: config.color,
        }}
      >
        <i className={config.icon} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row: type label + age */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: config.color,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <i className={config.icon} />
            {config.label}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-neutral-weak)', marginLeft: 'auto' }}>
            {alert.age}
          </span>
        </div>

        {/* Title */}
        <div
          onClick={() => onNavigate(alert.planId)}
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-neutral-xx-strong)',
            marginBottom: 4,
            cursor: 'pointer',
          }}
          className="alert-title-hover"
        >
          {alert.title}
        </div>

        {/* Preview: findings (review type) */}
        {alert.type === 'review' && alert.findings && (
          <div style={{ marginTop: 6, padding: '0 0 0 2px' }}>
            {alert.findings.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '3px 0',
                  fontSize: 12,
                  color: 'var(--text-neutral-strong)',
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: f.severity === 'red' ? '#DC2626' : '#D97706',
                  }}
                />
                <span style={{ fontWeight: 600 }}>{f.label}</span>
                <span style={{ color: 'var(--text-neutral-medium)' }}>{f.detail}</span>
              </div>
            ))}
          </div>
        )}

        {/* Preview: rows (approve/paused type) */}
        {alert.type !== 'review' && alert.previewRows && (
          <div style={{ marginTop: 6, padding: '0 0 0 2px' }}>
            {alert.previewRows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '2px 0',
                  fontSize: 12,
                  color: 'var(--text-neutral-strong)',
                  lineHeight: 1.5,
                }}
              >
                <i
                  className={row.iconClass}
                  style={{ color: config.color, fontSize: 10, width: 12, textAlign: 'center' }}
                />
                <span dangerouslySetInnerHTML={{ __html: row.text }} />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <button
            onClick={() => onNavigate(alert.planId)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              background: 'var(--color-primary-strong)',
              color: 'white',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
          >
            {alert.ctaIcon && <i className={alert.ctaIcon} style={{ fontSize: 11 }} />}
            {alert.ctaLabel}
          </button>
          <button
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
            }}
            className="icon-btn-hover"
          >
            <i className="fa-solid fa-ellipsis" />
          </button>
        </div>
      </div>
    </div>
  );
}
