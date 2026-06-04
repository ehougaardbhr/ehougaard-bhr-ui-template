import type { FlagType } from '../../data/timesheetAgentData';

interface TimesheetFlagBadgeProps {
  type: FlagType | 'clean';
  className?: string;
}

const badgeConfig: Record<FlagType | 'clean', { label: string; classes: string }> = {
  'break-violation': {
    label: 'Break Violation',
    classes: 'bg-red-50 text-red-700 border-red-200',
  },
  'unapproved-ot': {
    label: 'Unapproved OT',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'missed-punch': {
    label: 'Missed Punch',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'clean': {
    label: 'Clean',
    classes: 'bg-[var(--surface-selected-weak)] text-[var(--color-primary-strong)] border-[var(--border-neutral-x-weak)]',
  },
};

export function TimesheetFlagBadge({ type, className = '' }: TimesheetFlagBadgeProps) {
  const config = badgeConfig[type];
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-[var(--radius-full)] border text-[11px] font-semibold whitespace-nowrap ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}

export default TimesheetFlagBadge;
