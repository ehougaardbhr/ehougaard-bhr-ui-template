import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faClipboardCheck,
  faPause,

  faListCheck,
  faUsers,
  faCircleHalfStroke,
  faArrowTrendDown,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { AutomationAlert } from '../../data/automationsData';
import { Button } from '../Button/Button';

interface AlertCardProps {
  alert: AutomationAlert;
  onNavigate: (planId: string) => void;
}

const typeIcons: Record<AutomationAlert['type'], IconDefinition> = {
  review: faEye,
  approve: faClipboardCheck,
  paused: faPause,
};

const typePills: Record<AutomationAlert['type'], { label: string; bg: string; text: string }> = {
  review: { label: 'Ready for review', bg: '#ECFEFF', text: '#155E75' },
  approve: { label: 'Needs approval', bg: '#FEF3C7', text: '#92400E' },
  paused: { label: 'Paused', bg: '#FEF3C7', text: '#92400E' },
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

      {/* Age — top right */}
      <span className="absolute top-4 right-5 text-sm text-[var(--text-neutral-weak)]">
        {alert.age}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-28">
        {/* Title + pill */}
        <div className="flex items-center gap-2 mb-1">
          <div
            onClick={() => onNavigate(alert.planId)}
            className="
              text-base font-semibold
              text-[var(--text-neutral-xx-strong)]
              cursor-pointer
              hover:text-[var(--color-primary-strong)]
              transition-colors
            "
          >
            {alert.title}
          </div>
          <span
            className="text-xs font-semibold leading-none px-2 py-1 rounded-full whitespace-nowrap shrink-0"
            style={{ backgroundColor: typePills[alert.type].bg, color: typePills[alert.type].text }}
          >
            {typePills[alert.type].label}
          </span>
        </div>

        {/* Preview: findings (review type) */}
        {alert.type === 'review' && alert.findings && (
          <div className="mt-1.5 pl-0.5">
            {alert.findings.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-0.5 text-sm text-[var(--text-neutral-strong)] leading-relaxed"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
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
                className="flex items-center gap-2 py-0.5 text-sm text-[var(--text-neutral-strong)] leading-relaxed"
              >
                {previewIconMap[row.iconClass] && (
                  <FontAwesomeIcon
                    icon={previewIconMap[row.iconClass]}
                    className="text-[var(--icon-neutral-strong)] shrink-0"
                    style={{ fontSize: 12, width: 14 }}
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
              <Button size="small" icon="check" onClick={() => onNavigate(alert.planId)}>
                Approve
              </Button>
              <Button size="small" icon="xmark">
                Deny
              </Button>
            </>
          ) : (
            <Button
              size="small"
              icon={alert.type === 'paused' ? 'play' : undefined}
              onClick={() => onNavigate(alert.planId)}
            >
              {alert.ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
