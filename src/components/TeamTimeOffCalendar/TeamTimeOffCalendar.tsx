import { useMemo, useState } from 'react';
import { Icon } from '../Icon';
import {
  team,
  timeOffEntries,
  incomingRequestId,
  defaultViewYear,
  defaultViewMonth,
  type TimeOffEntry,
} from '../../data/teamTimeOffData';
import {
  buildMonthGrid,
  monthLabel,
  SHADES,
  type DayData,
} from './heatmap';
import { DayCell } from './DayCell';
import { DayDetailPopover } from './DayDetailPopover';
import { IncomingRequestBanner } from './IncomingRequestBanner';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function LegendSwatch({ color, dashed, ring, label }: { color?: string; dashed?: boolean; ring?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-block w-4 h-4 rounded-[4px] ${dashed ? 'border-2 border-dashed border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)]' : ''} ${ring ? 'ring-2 ring-inset ring-red-500 bg-[var(--surface-neutral-white)]' : ''} ${!dashed && !ring ? 'border border-[var(--border-neutral-x-weak)]' : ''}`}
        style={!dashed && !ring ? { backgroundColor: color } : undefined}
      />
      <span className="text-[11px] text-[var(--text-neutral-medium)]">{label}</span>
    </div>
  );
}

export function TeamTimeOffCalendar() {
  const teamSize = team.length;
  const [entries, setEntries] = useState<TimeOffEntry[]>(timeOffEntries);
  const [threshold, setThreshold] = useState(0.25);
  const [viewDate, setViewDate] = useState(new Date(defaultViewYear, defaultViewMonth, 1));
  const [selected, setSelected] = useState<{ dateKey: string; anchor: DOMRect } | null>(null);

  const weeks = useMemo(
    () => buildMonthGrid(viewDate, entries, teamSize, threshold),
    [viewDate, entries, teamSize, threshold],
  );

  // Re-derive the open day's data from the live grid so the popover reflects
  // threshold changes made while it's open (rather than a click-time snapshot).
  const selectedData: DayData | null = selected
    ? weeks.flat().find((c) => c && c.dateKey === selected.dateKey) ?? null
    : null;

  const incoming = entries.find((e) => e.id === incomingRequestId);
  const incomingPending = incoming && incoming.status === 'pending' ? incoming : null;
  const spotlightKey = incomingPending?.date ?? null;

  // approved count on the incoming request's day, excluding the request itself
  const currentApprovedOnDay = incomingPending
    ? entries.filter((e) => e.date === incomingPending.date && e.status === 'approved' && e.id !== incomingRequestId).length
    : 0;

  const resolveSelected = () => setSelected(null);

  const approveIncoming = () => {
    setEntries((prev) => prev.map((e) => (e.id === incomingRequestId ? { ...e, status: 'approved' } : e)));
    resolveSelected();
  };
  const denyIncoming = () => {
    setEntries((prev) => prev.filter((e) => e.id !== incomingRequestId));
    resolveSelected();
  };
  const goToIncomingDay = () => {
    if (!incomingPending) return;
    const [y, m] = incomingPending.date.split('-').map(Number);
    setViewDate(new Date(y, m - 1, 1));
    resolveSelected();
  };

  const changeMonth = (delta: number) => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
    resolveSelected();
  };

  const resetDemo = () => {
    setEntries(timeOffEntries);
    setThreshold(0.25);
    setViewDate(new Date(defaultViewYear, defaultViewMonth, 1));
    resolveSelected();
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-neutral-strong)] flex items-center gap-2">
            <Icon name="calendar" size={20} className="text-[var(--color-primary-strong)]" />
            Team time off
          </h2>
          <p className="text-[13px] text-[var(--text-neutral-medium)] mt-0.5">
            Coverage across your {teamSize} direct reports — shade shows the share of the team out each day.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetDemo} className="h-9 px-3 rounded-[var(--radius-full)] text-[12px] font-semibold text-[var(--text-neutral-medium)] hover:text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-1.5">
            <Icon name="rotate-left" size={13} /> Reset demo
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] hover:bg-[var(--surface-neutral-xx-weak)]">
              <Icon name="chevron-left" size={15} className="text-[var(--icon-neutral-x-strong)]" />
            </button>
            <span className="text-[15px] font-bold text-[var(--text-neutral-strong)] min-w-[130px] text-center">{monthLabel(viewDate)}</span>
            <button onClick={() => changeMonth(1)} aria-label="Next month" className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] hover:bg-[var(--surface-neutral-xx-weak)]">
              <Icon name="chevron-right" size={15} className="text-[var(--icon-neutral-x-strong)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Incoming request (the approval moment) */}
      {incomingPending && (
        <IncomingRequestBanner
          request={incomingPending}
          currentApproved={currentApprovedOnDay}
          teamSize={teamSize}
          threshold={threshold}
          onApprove={approveIncoming}
          onDeny={denyIncoming}
          onView={goToIncomingDay}
        />
      )}

      {/* Controls: threshold + legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3 p-3 rounded-[var(--radius-small)] bg-[var(--surface-neutral-xx-weak)]">
        <div className="flex items-center gap-3">
          <label className="text-[12px] font-semibold text-[var(--text-neutral-strong)] whitespace-nowrap">
            Coverage threshold
          </label>
          <input
            type="range"
            min={0.05}
            max={0.6}
            step={0.05}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-40 accent-[var(--color-primary-strong)]"
          />
          <span className="inline-flex items-center justify-center min-w-[44px] h-6 px-2 rounded-full bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] text-[12px] font-bold text-[var(--text-neutral-strong)]">
            {Math.round(threshold * 100)}%
          </span>
          <span className="text-[11px] text-[var(--text-neutral-weak)] hidden lg:inline">
            Flag days with more of the team out
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[var(--text-neutral-weak)] mr-0.5">Fewer out</span>
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className="inline-block w-4 h-4 rounded-[4px] border border-[var(--border-neutral-x-weak)]" style={{ backgroundColor: SHADES[s].bg }} />
            ))}
            <span className="text-[11px] text-[var(--text-neutral-weak)] ml-0.5">More out</span>
          </div>
          <span className="w-px h-4 bg-[var(--border-neutral-weak)]" />
          <LegendSwatch dashed label="Pending" />
          <LegendSwatch ring label="Over threshold" />
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] p-3">
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-[11px] font-semibold uppercase tracking-wide ${i === 0 || i === 6 ? 'text-[var(--text-neutral-weak)]' : 'text-[var(--text-neutral-medium)]'}`}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1.5">
              {week.map((cell, ci) => (
                <DayCell
                  key={cell ? cell.dateKey : `pad-${wi}-${ci}`}
                  data={cell}
                  isSpotlight={!!cell && cell.dateKey === spotlightKey}
                  isSelected={!!selected && !!cell && selected.dateKey === cell.dateKey}
                  onSelect={(data, anchor) => setSelected({ dateKey: data.dateKey, anchor })}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {selected && selectedData && (
        <DayDetailPopover
          data={selectedData}
          anchor={selected.anchor}
          teamSize={teamSize}
          threshold={threshold}
          onClose={resolveSelected}
        />
      )}
    </div>
  );
}
