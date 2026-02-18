import { Icon } from '../Icon';
import type { TimesheetDay } from '../../data/timesheetData';
import { DayRow } from '../DayRow';

interface TimesheetCardProps {
  periodLabel: string;
  days: TimesheetDay[];
}

export function TimesheetCard({ periodLabel, days }: TimesheetCardProps) {
  return (
    <section className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] p-7" style={{ boxShadow: 'var(--shadow-300)' }}>
      <div className="flex items-center gap-3 pb-5">
        <div className="h-10 w-10 rounded-[var(--radius-x-small)] bg-[var(--surface-neutral-xx-weak)] flex items-center justify-center">
          <Icon name="calendar" size={14} className="text-[var(--color-primary-strong)]" />
        </div>
        <h3 className="text-[44px] leading-[52px] font-semibold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {periodLabel}
        </h3>
      </div>

      <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-6">
        {days.map((day) => (
          <DayRow key={day.id} day={day} />
        ))}
      </div>
    </section>
  );
}

export default TimesheetCard;
