import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faClipboardCheck,
  faPause,
  faCheck,
  faXmark,
  faEllipsis,
  faPlay,
  faListCheck,
  faUsers,
  faCircleHalfStroke,
  faArrowTrendDown,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { AutomationAlert } from '../../data/automationsData';

interface AlertCardProps {
  alert: AutomationAlert;
  onNavigate: (planId: string) => void;
}

const typeIcons: Record<AutomationAlert['type'], IconDefinition> = {
  review: faEye,
  approve: faClipboardCheck,
  paused: faPause,
};

const typeLabels: Record<AutomationAlert['type'], string> = {
  review: 'I have something to show you',
  approve: 'I need your approval',
  paused: 'Paused — waiting on you',
};

// Map preview row icon classes to FA icon objects
const previewIconMap: Record<string, IconDefinition> = {
  'fa-solid fa-list-check': faListCheck,
  'fa-solid fa-users': faUsers,
  'fa-solid fa-circle-half-stroke': faCircleHalfStroke,
  'fa-solid fa-arrow-trend-down': faArrowTrendDown,
};

export function AlertCard({ alert, onNavigate }: AlertCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-[var(--surface-neutral-white)]
        border border-[var(--border-neutral-x-weak)]
        rounded-[var(--radius-small)]
        flex items-start gap-3.5
        px-5 py-4 mb-3
        transition-shadow duration-150
        hover:shadow-md
      `}
      style={{ boxShadow: 'var(--shadow-300)' }}
    >
      {/* Icon circle */}
      <div
        className="
          w-[38px] h-[38px] rounded-[10px] shrink-0
          flex items-center justify-center
          bg-[var(--surface-neutral-x-weak)]
          text-[var(--icon-neutral-strong)]
        "
      >
        <FontAwesomeIcon icon={typeIcons[alert.type]} fontSize={15} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: type label + age */}
        <div className="flex items-center gap-2 mb-0.5">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--text-neutral-medium)]">
            {typeLabels[alert.type]}
          </div>
          <span className="text-xs text-[var(--text-neutral-weak)] ml-auto">
            {alert.age}
          </span>
        </div>

        {/* Title */}
        <div
          onClick={() => onNavigate(alert.planId)}
          className="
            text-sm font-semibold
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
                {previewIconMap[row.iconClass] && (
                  <FontAwesomeIcon
                    icon={previewIconMap[row.iconClass]}
                    className="text-[var(--icon-neutral-strong)] shrink-0"
                    style={{ fontSize: 10, width: 12 }}
                  />
                )}
                <span dangerouslySetInnerHTML={{ __html: row.text }} />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2.5">
          {alert.type === 'approve' ? (
            <>
              <button
                onClick={() => onNavigate(alert.planId)}
                className="
                  px-3.5 py-1.5 rounded-lg
                  text-sm font-medium
                  text-[var(--text-neutral-strong)]
                  bg-[var(--surface-neutral-white)]
                  hover:bg-[var(--surface-neutral-xx-weak)]
                  border border-[var(--border-neutral-medium)]
                  inline-flex items-center gap-1.5
                  transition-colors cursor-pointer
                "
                style={{ boxShadow: 'var(--shadow-100)' }}
              >
                <FontAwesomeIcon icon={faCheck} fontSize={11} />
                Approve
              </button>
              <button
                className="
                  px-3.5 py-1.5 rounded-lg
                  text-sm font-medium
                  text-[var(--text-neutral-strong)]
                  bg-[var(--surface-neutral-white)]
                  hover:bg-[var(--surface-neutral-xx-weak)]
                  border border-[var(--border-neutral-medium)]
                  inline-flex items-center gap-1.5
                  transition-colors cursor-pointer
                "
                style={{ boxShadow: 'var(--shadow-100)' }}
              >
                <FontAwesomeIcon icon={faXmark} fontSize={11} />
                Deny
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate(alert.planId)}
              className="
                px-3.5 py-1.5 rounded-lg
                text-sm font-medium
                text-[var(--text-neutral-strong)]
                bg-[var(--surface-neutral-white)]
                hover:bg-[var(--surface-neutral-xx-weak)]
                border border-[var(--border-neutral-medium)]
                inline-flex items-center gap-1.5
                transition-colors cursor-pointer
              "
              style={{ boxShadow: 'var(--shadow-100)' }}
            >
              {alert.type === 'paused' && <FontAwesomeIcon icon={faPlay} fontSize={11} />}
              {alert.ctaLabel}
            </button>
          )}
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
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        </div>
      </div>
    </div>
  );
}
