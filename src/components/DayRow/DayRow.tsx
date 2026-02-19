import { Icon } from '../Icon';
import type { TimesheetDay } from '../../data/timesheetData';

interface DayRowProps {
  day: TimesheetDay;
}

function entryIcon(type: 'regular' | 'pto' | 'sick' | undefined) {
  if (type === 'pto') return 'plane';
  if (type === 'sick') return 'temperature-half';
  return 'clock';
}

export function DayRow({ day }: DayRowProps) {
  return (
    <div className="grid grid-cols-[96px_160px_minmax(0,1fr)] gap-6 px-3 py-5 border-b border-[var(--border-neutral-x-weak)] last:border-b-0">
      <div className="h-[74px] w-[74px] rounded-[10px] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] flex flex-col items-center justify-center">
        <span className="text-[33px] leading-[33px] font-semibold text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {day.dayLabel}
        </span>
        <span className="text-[24px] leading-[24px] text-[var(--text-neutral-medium)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {day.dateLabel}
        </span>
      </div>

      <div className="pt-2">
        <p className="text-[34px] leading-[34px] text-[var(--text-neutral-medium)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          {day.durationLabel}
        </p>
        {day.timeRangeLabel && (
          <p className="mt-2 text-[26px] leading-[26px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
            {day.timeRangeLabel}
          </p>
        )}
      </div>

      <div className="pt-2 min-h-[50px]">
        {day.entries.length === 0 ? (
          <p className="text-[26px] leading-[26px] text-[var(--text-neutral-weak)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
            {day.isEditable ? 'No entries yet' : 'Read only'}
          </p>
        ) : (
          <div className="space-y-1">
            {day.entries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-2">
                <Icon name={entryIcon(entry.type)} size={12} className="text-[var(--icon-neutral-strong)]" />
                <span className="text-[26px] leading-[26px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
                  {entry.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DayRow;
