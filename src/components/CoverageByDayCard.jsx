import { useMemo, useState } from 'react';
import CoverageByDayRow from './CoverageByDayRow';

function seededIndex(seed, length) {
  const value = seed.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return value % length;
}

export const demoDays = [
  { id: 'mon', label: 'Mon', subLabel: 'Feb 23' },
  { id: 'tue', label: 'Tue', subLabel: 'Feb 24' },
  { id: 'wed', label: 'Wed', subLabel: 'Feb 25' },
  { id: 'thu', label: 'Thu', subLabel: 'Feb 26' },
  { id: 'fri', label: 'Fri', subLabel: 'Feb 27' },
  { id: 'sat', label: 'Sat', subLabel: 'Feb 28' },
  { id: 'sun', label: 'Sun', subLabel: 'Mar 1' },
];

const statusRank = {
  understaffed: 0,
  'at-risk': 1,
  'fully-covered': 2,
  overstaffed: 3,
};
const sundayToSaturdayOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getCoverageStatus(assigned, required) {
  if (assigned === required) {
    return {
      status: 'fully-covered',
      text: 'Fully covered',
      dotClass: 'bg-[var(--color-primary-strong)]',
      tooltip: `Required ${required}, assigned ${assigned}`,
      urgency: statusRank['fully-covered'],
    };
  }

  if (assigned === required - 1) {
    return {
      status: 'at-risk',
      text: 'At risk',
      dotClass: 'bg-amber-500',
      tooltip: `Required ${required}, assigned ${assigned}`,
      urgency: statusRank['at-risk'],
    };
  }

  if (assigned < required) {
    return {
      status: 'understaffed',
      text: 'Understaffed',
      dotClass: 'bg-red-500',
      tooltip: `Required ${required}, assigned ${assigned}`,
      urgency: statusRank.understaffed,
    };
  }

  return {
    status: 'overstaffed',
    text: 'Overstaffed',
    dotClass: 'bg-amber-500',
    tooltip: `Required ${required}, assigned ${assigned}`,
    urgency: statusRank.overstaffed,
  };
}

function getCoverageDetails(dayId, assigned, required, vacationCount) {
  const openShiftCount = Math.max(required - assigned, 0);
  const delta = assigned - required;
  const callOutCount = dayId === 'fri' ? 1 : dayId === 'sun' ? 1 : 0;
  const ptoCount = Math.max(vacationCount, dayId === 'mon' ? 1 : 0);
  const approachingOtCount = dayId === 'sat' || dayId === 'sun' ? 1 : 2;
  const coverageDelta = delta > 0
    ? `${delta} extra`
    : delta < 0
      ? `${Math.abs(delta)} gap${Math.abs(delta) === 1 ? '' : 's'}`
      : 'Balanced';

  return {
    openShifts: `${openShiftCount} open`,
    ptoCallouts: `${ptoCount} PTO; ${callOutCount} call-outs`,
    approachingOt: `${approachingOtCount} employees`,
    coverageDelta,
    coverageDrivers: openShiftCount > 0
      ? 'PTO and start-time gaps are driving risk.'
      : 'Coverage is stable vs projected demand.',
  };
}

export default function CoverageByDayCard({
  days = demoDays,
  shifts = [],
  employees = [],
  requiredByDay = {},
  onViewDay,
  onFillOpenShift,
  track,
}) {
  const [expandedDayId, setExpandedDayId] = useState(null);

  const emitTrack = (eventName, payload) => {
    if (typeof track === 'function') {
      track(eventName, payload);
    }
  };

  const rows = useMemo(() => {
    const derivedRows = days.map((day) => {
      const assigned = shifts.filter((shift) => shift.dayId === day.id && !shift.isAddShift && shift.variant !== 'vacation').length;
      const defaultRequired = day.id === 'sat' || day.id === 'sun' ? 4 : 10;
      const required = typeof requiredByDay[day.id] === 'number' ? requiredByDay[day.id] : defaultRequired;
      const vacationCount = shifts.filter((shift) => shift.dayId === day.id && shift.variant === 'vacation').length;
      const status = getCoverageStatus(assigned, required);
      const details = getCoverageDetails(day.id, assigned, required, vacationCount, employees);

      return { day, status, details };
    });
    return derivedRows.sort((a, b) => (
      sundayToSaturdayOrder.indexOf(a.day.id) - sundayToSaturdayOrder.indexOf(b.day.id)
    ));
  }, [days, shifts, employees, requiredByDay]);

  const toggleDay = (dayId) => {
    setExpandedDayId((previous) => (previous === dayId ? null : dayId));
    emitTrack('coverage_day_row_toggled', { dayId });
  };

  const withFallback = (callback, eventName, dayId) => {
    if (typeof callback === 'function') {
      callback(dayId);
    } else {
      // Intentional no-op fallback for demo environments.
      // eslint-disable-next-line no-console
      console.info(`[CoverageByDayCard] ${eventName}: no callback provided for ${dayId}`);
    }
    emitTrack(eventName, { dayId });
  };

  return (
    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4">
      <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)] mb-3" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
        Coverage by Day
      </h2>
      <div className="space-y-2">
        {rows.map((row) => (
          <CoverageByDayRow
            key={row.day.id}
            day={row.day}
            status={row.status}
            details={row.details}
            isExpanded={expandedDayId === row.day.id}
            onToggle={() => toggleDay(row.day.id)}
            onViewDay={(dayId) => withFallback(onViewDay, 'coverage_view_day_clicked', dayId)}
            onFillOpenShift={(dayId) => withFallback(onFillOpenShift, 'coverage_fill_open_shift_clicked', dayId)}
          />
        ))}
      </div>
    </div>
  );
}
