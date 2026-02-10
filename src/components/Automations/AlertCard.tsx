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
      className={`
        relative overflow-hidden
        bg-[var(--surface-neutral-white)]
        border border-[var(--border-neutral-x-weak)]
        rounded-[var(--radius-small)]
        flex items-start gap-3.5
        px-5 py-4 mb-2
        transition-shadow duration-150
        hover:shadow-md
      `}
      style={{ boxShadow: 'var(--shadow-300)' }}
    >
      {/* Left color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: config.color }}
      />

      {/* Icon circle */}
      <div
        className={`
          w-[38px] h-[38px] rounded-[10px] shrink-0
          flex items-center justify-center text-[15px]
          ${config.bgLightClass} ${config.darkBgLightClass}
        `}
        style={{ color: config.color }}
      >
        <i className={config.icon} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: type label + age */}
        <div className="flex items-center gap-2 mb-0.5">
          <div
            className="text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: config.color }}
          >
            <i className={config.icon} />
            {config.label}
          </div>
          <span className="text-[11px] text-[var(--text-neutral-weak)] ml-auto">
            {alert.age}
          </span>
        </div>

        {/* Title */}
        <div
          onClick={() => onNavigate(alert.planId)}
          className="
            text-[15px] font-semibold
            text-[var(--text-neutral-xx-strong)]
            mb-1 cursor-pointer
            hover:text-[var(--color-primary-strong)]
            transition-colors
          "
        >
          {alert.title}
        </div>

        {/* Preview: findings (review type) */}
        {alert.type === 'review' && alert.findings && (
          <div className="mt-1.5 pl-0.5">
            {alert.findings.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-0.5 text-xs text-[var(--text-neutral-strong)] leading-relaxed"
              >
                <div
                  className="w-[7px] h-[7px] rounded-full shrink-0"
                  style={{ background: f.severity === 'red' ? '#DC2626' : '#D97706' }}
                />
                <span className="font-semibold">{f.label}</span>
                <span className="text-[var(--text-neutral-medium)]">{f.detail}</span>
              </div>
            ))}
          </div>
        )}

        {/* Preview: rows (approve/paused type) */}
        {alert.type !== 'review' && alert.previewRows && (
          <div className="mt-1.5 pl-0.5">
            {alert.previewRows.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-0.5 text-xs text-[var(--text-neutral-strong)] leading-relaxed"
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
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={() => onNavigate(alert.planId)}
            className="
              px-3.5 py-1.5 rounded-lg
              text-[13px] font-medium text-white
              bg-[var(--color-primary-strong)]
              hover:bg-[var(--color-primary-medium)]
              border border-transparent
              inline-flex items-center gap-1.5
              transition-colors cursor-pointer
            "
          >
            {alert.ctaIcon && <i className={alert.ctaIcon} style={{ fontSize: 11 }} />}
            {alert.ctaLabel}
          </button>
          <button
            className="
              w-8 h-8 rounded-lg border-none bg-transparent
              flex items-center justify-center
              text-[var(--text-neutral-medium)]
              hover:bg-[var(--surface-neutral-xx-weak)]
              hover:text-[var(--text-neutral-strong)]
              transition-colors cursor-pointer
            "
          >
            <i className="fa-solid fa-ellipsis" />
          </button>
        </div>
      </div>
    </div>
  );
}
