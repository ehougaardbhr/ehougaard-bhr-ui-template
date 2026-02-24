import { Button } from './Button';
import { Icon } from './Icon';

export default function CoverageByDayRow({ day, isExpanded, status, details, onToggle, onViewDay, onFillOpenShift }) {
  return (
    <div className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] bg-[var(--surface-neutral-white)]">
      <div
        data-testid={`coverage-row-toggle-${day.id}`}
        className="px-3 py-2.5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-[130px]">
            <Icon
              name="chevron-right"
              size={12}
              className={`text-[var(--icon-neutral-strong)] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
            <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">{day.label} · {day.subLabel}</p>
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${status.dotClass}`} />
            <p
              className="text-[13px] text-[var(--text-neutral-strong)] truncate"
              title={status.tooltip}
              data-testid={`coverage-status-${day.id}`}
            >
              {status.text}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0" onClick={(event) => event.stopPropagation()}>
            <Button size="small" variant="standard" className="!h-7 !px-3 !text-[12px]" onClick={() => onViewDay(day.id)}>
              View Day
            </Button>
            <Button size="small" variant="outlined" className="!h-7 !px-3 !text-[12px]" onClick={() => onFillOpenShift(day.id)}>
              Fill Open Shift
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div data-testid={`coverage-row-panel-${day.id}`} className="mt-2.5 p-3 rounded-[var(--radius-xx-small)] bg-[var(--surface-neutral-xx-weak)] border border-[var(--border-neutral-xx-weak)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[12px] text-[var(--text-neutral-medium)]">
              <p>Open shifts: <span className="font-semibold text-[var(--text-neutral-strong)]">{details.openShifts}</span></p>
              <p>PTO/call-outs: <span className="font-semibold text-[var(--text-neutral-strong)]">{details.ptoCallouts}</span></p>
              <p>Approaching OT: <span className="font-semibold text-[var(--text-neutral-strong)]">{details.approachingOt}</span></p>
              <p>Coverage delta: <span className="font-semibold text-[var(--text-neutral-strong)]">{details.coverageDelta}</span></p>
            </div>
            <p className="mt-2 text-[12px] text-[var(--text-neutral-medium)]">
              Coverage drivers: <span className="text-[var(--text-neutral-strong)]">{details.coverageDrivers}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
