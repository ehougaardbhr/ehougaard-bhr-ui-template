import { Icon } from '../Icon';
import type { ClockWidgetData } from '../../data/timesheetData';

interface ClockWidgetCardProps {
  clockData: ClockWidgetData;
  onToggleClock: () => void;
}

export function ClockWidgetCard({ clockData, onToggleClock }: ClockWidgetCardProps) {
  const isClockedIn = clockData.status === 'clocked-in';

  return (
    <aside className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] p-6" style={{ boxShadow: 'var(--shadow-300)' }}>
      <div className="flex flex-col items-center text-center border-b border-[var(--border-neutral-x-weak)] pb-4">
        <Icon name="circle-user" size={34} className="text-[var(--icon-neutral-strong)]" />
        <p className="mt-2 text-[35px] leading-[35px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
        </p>
        <p className="mt-3 text-[52px] leading-[52px] font-semibold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {clockData.todayTotalLabel}
        </p>
        <p className="mt-2 text-[25px] leading-[25px] text-[var(--text-neutral-medium)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {clockData.clockMetaLabel}
        </p>

        <div className="mt-4 flex items-center gap-2 w-full">
          <button
            onClick={onToggleClock}
            className="h-12 flex-1 rounded-full bg-[var(--color-primary-strong)] text-white text-[30px] leading-[30px] font-semibold"
            style={{ fontFamily: 'Fields, system-ui, sans-serif', boxShadow: 'var(--shadow-100)' }}
          >
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
          <button className="h-12 w-12 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] flex items-center justify-center" style={{ boxShadow: 'var(--shadow-100)' }}>
            <Icon name="caret-down" size={10} className="text-[var(--icon-neutral-strong)]" />
          </button>
        </div>
      </div>

      <div className="pt-4 border-b border-[var(--border-neutral-x-weak)] pb-4 text-center">
        <p className="text-[32px] leading-[32px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>This Week</p>
        <p className="mt-2 text-[50px] leading-[50px] font-semibold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>{clockData.weekTotalLabel}</p>
        <p className="mt-2 text-[25px] leading-[25px] text-[var(--text-neutral-medium)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>{clockData.weekRangeLabel}</p>
      </div>

      <div className="py-4 border-b border-[var(--border-neutral-x-weak)]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-[var(--radius-x-small)] bg-[var(--surface-neutral-xx-weak)] flex items-center justify-center">
            <Icon name="calendar" size={12} className="text-[var(--icon-neutral-strong)]" />
          </div>
          <div>
            <p className="text-[31px] leading-[31px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>{clockData.payPeriodHoursLabel}</p>
            <p className="text-[23px] leading-[23px] text-[var(--text-neutral-medium)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>Pay Period</p>
            <p className="text-[23px] leading-[23px] text-[var(--text-neutral-medium)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>{clockData.payPeriodRangeLabel}</p>
          </div>
        </div>
      </div>

      <div className="py-3 border-b border-[var(--border-neutral-x-weak)]">
        <p className="text-[25px] leading-[25px] text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>Paid Hours</p>
        <p className="mt-1 text-[31px] leading-[31px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>{clockData.paidHoursLabel}</p>
      </div>

      <div className="py-3 border-b border-[var(--border-neutral-x-weak)]">
        <p className="text-[25px] leading-[25px] text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>Meal & Rest Breaks</p>
        <p className="mt-1 text-[31px] leading-[31px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>{clockData.mealBreaksLabel}</p>
      </div>

      <div className="mt-4 rounded-[var(--radius-x-small)] bg-[var(--surface-neutral-xx-weak)] px-4 py-3 flex items-center gap-2">
        <Icon name="check-circle" size={14} className="text-[var(--icon-neutral-strong)]" />
        <p className="text-[22px] leading-[22px] text-[var(--text-neutral-medium)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>{clockData.approvalLabel}</p>
      </div>
    </aside>
  );
}

export default ClockWidgetCard;
