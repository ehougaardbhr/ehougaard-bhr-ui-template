import { Icon } from '../Icon';

interface TimesheetToolbarProps {
  title: string;
  payPeriodLabel: string;
}

export function TimesheetToolbar({ title, payPeriodLabel }: TimesheetToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <Icon name="clock" size={20} className="text-[var(--color-primary-strong)]" />
        <h2 className="text-[42px] leading-[50px] font-semibold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button className="h-9 min-w-[170px] px-4 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-xx-weak)] text-[15px] leading-[22px] text-[var(--text-neutral-medium)] flex items-center justify-between" style={{ boxShadow: 'var(--shadow-100)' }}>
          {payPeriodLabel}
          <Icon name="caret-down" size={10} className="text-[var(--icon-neutral-strong)]" />
        </button>
        <button className="h-9 w-9 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] flex items-center justify-center" style={{ boxShadow: 'var(--shadow-100)' }}>
          <Icon name="gear" size={14} className="text-[var(--icon-neutral-x-strong)]" />
        </button>
        <button className="h-9 px-3 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] flex items-center gap-2" style={{ boxShadow: 'var(--shadow-100)' }}>
          <Icon name="rotate-left" size={12} className="text-[var(--icon-neutral-x-strong)]" />
          <span className="text-[15px] leading-[22px] font-semibold text-[var(--text-neutral-strong)]">History</span>
        </button>
        <button className="h-9 w-9 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] flex items-center justify-center" style={{ boxShadow: 'var(--shadow-100)' }}>
          <Icon name="arrow-down-to-line" size={14} className="text-[var(--icon-neutral-x-strong)]" />
        </button>
      </div>
    </div>
  );
}

export default TimesheetToolbar;
