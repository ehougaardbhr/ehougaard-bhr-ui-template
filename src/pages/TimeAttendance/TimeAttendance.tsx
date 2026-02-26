import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FormDropdown, Icon, Tabs, TextInput } from '../../components';
import AttendanceHealthCard from '../../components/AttendanceHealthCard';
import CoverageByDayCard from '../../components/CoverageByDayCard';
import LaborRiskSnapshotCard from '../../components/LaborRiskSnapshotCard';
import {
  dayOptions,
  employeeOptions,
  populatedShiftBlocks,
  scheduleColumns,
  scheduleRows,
  type ShiftBlock,
} from '../../data/timeAttendanceData';

const employeeColWidth = 170;
const dayColWidth = 160;

interface NewShiftDraft {
  rowId: string;
  dayId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  unpaidBreakMinutes: string;
  publishNow: boolean;
}

type TimeAttendanceTab = 'schedules' | 'live-view';
type LiveViewMode = 'schedule' | 'no-schedule';
type InsightId = 'late-pattern' | 'coverage-gap' | 'open-shift-risk';
type LiveStatus = 'Off' | 'PTO' | 'Clocked In' | 'Clocked In (Late)' | 'On a Break' | 'Absent';
type LocationFilter = 'all' | 'office' | 'remote';
type WorkLocation = 'Office' | 'Remote';

const liveShiftNames = ['Cashier', 'Bakery', 'Cleaning', 'Stocking'] as const;
const liveShiftOverrides: Record<string, (typeof liveShiftNames)[number]> = {
  'devon-lane': 'Cashier',
  'ronald-richards': 'Stocking',
  'darrell-steward': 'Cleaning',
};
const liveStatusByEmployee: Record<string, LiveStatus> = {
  'ben-procter': 'Clocked In',
  'albert-flores': 'On a Break',
  'janet-caldwell': 'Absent',
  'devon-lane': 'Clocked In',
  'ronald-richards': 'Absent',
  'wade-warren': 'PTO',
  'brooklyn-simmons': 'Off',
  'darrell-steward': 'Clocked In (Late)',
  'esther-howard': 'Clocked In (Late)',
  'jenny-wilson': 'PTO',
  'kristin-watson': 'Off',
};
const liveBreakStartedAtByEmployee: Partial<Record<string, string>> = {
  'albert-flores': new Date(Date.now() - 26 * 60 * 1000).toISOString(),
};
const liveLocationByEmployee: Record<string, WorkLocation> = {
  'ben-procter': 'Office',
  'albert-flores': 'Office',
  'janet-caldwell': 'Office',
  'devon-lane': 'Office',
  'ronald-richards': 'Office',
  'wade-warren': 'Office',
  'brooklyn-simmons': 'Remote',
  'darrell-steward': 'Office',
  'esther-howard': 'Remote',
  'jenny-wilson': 'Office',
  'kristin-watson': 'Remote',
};
const liveHoursByEmployee: Record<string, { todayHours: number; weekHours: number }> = {
  'ben-procter': { todayHours: 6.1, weekHours: 39.3 },
  'albert-flores': { todayHours: 7.5, weekHours: 41.4 },
  'janet-caldwell': { todayHours: 2.3, weekHours: 16.2 },
  'devon-lane': { todayHours: 6.2, weekHours: 38.65 },
  'ronald-richards': { todayHours: 1.8, weekHours: 44.25 },
  'wade-warren': { todayHours: 0, weekHours: 24 },
  'brooklyn-simmons': { todayHours: 1.25, weekHours: 29.2 },
  'darrell-steward': { todayHours: 5.9, weekHours: 40.5 },
  'esther-howard': { todayHours: 5.4, weekHours: 39.5 },
  'jenny-wilson': { todayHours: 0, weekHours: 20 },
  'kristin-watson': { todayHours: 0, weekHours: 30 },
};
const lateClockInEvents = [
  { day: 'Mon', time: '8:14 AM' },
  { day: 'Wed', time: '8:19 AM' },
  { day: 'Fri', time: '8:11 AM' },
];
const overtimeThresholdMinutes = 40 * 60;

function startOfWeekMonday(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function getWeekKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatRange(startDate: Date) {
  const endDate = addDays(startDate, 6);
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const startFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(startDate);
  const endFmt = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(endDate);
  const fullEndFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(endDate);

  return sameMonth ? `${startFmt} - ${endFmt}` : `${startFmt} - ${fullEndFmt}`;
}

function formatDaySubLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function parseTimeToMinutes(time: string) {
  const [hh, mm] = time.split(':').map((v) => Number(v));
  return hh * 60 + mm;
}

function formatTime12(time: string) {
  const [hRaw, mRaw] = time.split(':').map((v) => Number(v));
  const suffix = hRaw >= 12 ? 'PM' : 'AM';
  const h12 = hRaw % 12 === 0 ? 12 : hRaw % 12;
  const mm = String(mRaw).padStart(2, '0');
  return `${h12}:${mm}${suffix}`;
}

function formatHoursLabel(hours: number) {
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

function formatHoursToHoursAndMinutes(totalHours: number) {
  const totalMinutes = Math.max(Math.round(totalHours * 60), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatMinutesAsHoursAndMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatMinutesAsOvertimeInsight(totalMinutes: number) {
  const safeMinutes = Math.max(totalMinutes, 0);
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  if (hours === 0) return `${String(minutes).padStart(2, '0')}m`;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatTimeWithSeconds(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatElapsedBreakTime(startedAtIso: string) {
  const startedAt = new Date(startedAtIso);
  const startedAtMs = startedAt.getTime();
  if (Number.isNaN(startedAtMs)) return '0m';
  const elapsedMinutes = Math.max(Math.floor((Date.now() - startedAtMs) / 60000), 0);
  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function cloneWeekShifts(weekKey: string): ShiftBlock[] {
  return populatedShiftBlocks.map((shift) => ({ ...shift, id: `${weekKey}-${shift.id}` }));
}

function createDefaultDraft(rowId = employeeOptions[0]?.value ?? 'open-shifts', dayId = dayOptions[0]?.value ?? 'mon'): NewShiftDraft {
  return {
    rowId,
    dayId,
    shiftName: '',
    startTime: '08:00',
    endTime: '17:00',
    unpaidBreakMinutes: '60',
    publishNow: true,
  };
}

function getDayIdFromDate(date: Date) {
  const index = date.getDay() === 0 ? 6 : date.getDay() - 1;
  return scheduleColumns[index]?.id ?? 'mon';
}

function getAssignedLiveShiftName(employeeId: string) {
  if (liveShiftOverrides[employeeId]) return liveShiftOverrides[employeeId];
  const hash = employeeId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return liveShiftNames[hash % liveShiftNames.length];
}

function formatLiveShiftLabel(shiftTitle: string, assignedShiftName: string) {
  const withoutHourSuffix = shiftTitle.replace(/\s*\([^)]*\)\s*$/, '');
  return `${withoutHourSuffix} (${assignedShiftName})`;
}

function getSeededIndex(seed: string, size: number) {
  const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % size;
}

function getStatusBadgeClasses(status: LiveStatus) {
  if (status === 'Clocked In') {
    return 'bg-[var(--surface-selected-weak)] text-[var(--color-primary-strong)]';
  }
  if (status === 'Clocked In (Late)') {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }
  if (status === 'On a Break') {
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  }
  if (status === 'Absent') {
    return 'bg-red-50 text-red-700 border border-red-200';
  }
  return 'bg-[var(--surface-neutral-xx-weak)] text-[var(--text-neutral-medium)]';
}

export function TimeAttendance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TimeAttendanceTab>('schedules');
  const [liveViewMode, setLiveViewMode] = useState<LiveViewMode>('schedule');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [liveStatusTimestamp, setLiveStatusTimestamp] = useState(() => new Date());
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true);
  const [activeInsightId, setActiveInsightId] = useState<InsightId | null>(null);
  const [weekStartDate, setWeekStartDate] = useState(() => startOfWeekMonday(new Date()));
  const initialKey = getWeekKey(startOfWeekMonday(new Date()));

  const [shiftsByWeek, setShiftsByWeek] = useState<Record<string, ShiftBlock[]>>(() => ({
    [initialKey]: cloneWeekShifts(initialKey),
  }));

  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false);
  const [draft, setDraft] = useState<NewShiftDraft>(() => createDefaultDraft());

  const weekKey = getWeekKey(weekStartDate);
  const todayDayId = getDayIdFromDate(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveStatusTimestamp(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleShifts = useMemo(
    () => shiftsByWeek[weekKey] ?? cloneWeekShifts(weekKey),
    [shiftsByWeek, weekKey],
  );

  const scheduleColumnsWithDates = useMemo(
    () => scheduleColumns.map((column, index) => ({ ...column, subLabel: formatDaySubLabel(addDays(weekStartDate, index)) })),
    [weekStartDate],
  );
  const coverageDaysWithDates = useMemo(
    () => scheduleColumns.map((column) => {
      const offsetByDay: Record<string, number> = {
        sun: -1,
        mon: 0,
        tue: 1,
        wed: 2,
        thu: 3,
        fri: 4,
        sat: 5,
      };
      const offset = offsetByDay[column.id] ?? 0;
      return { ...column, subLabel: formatDaySubLabel(addDays(weekStartDate, offset)) };
    }),
    [weekStartDate],
  );

  const totalScheduledHours = useMemo(
    () => visibleShifts.reduce((sum, shift) => (shift.hours ? sum + shift.hours : sum), 0),
    [visibleShifts],
  );

  const liveNowRows = useMemo(
    () => scheduleRows
      .filter((row) => !row.isOpenShift)
      .map((row) => {
        const todayShift = visibleShifts.find((shift) => shift.rowId === row.id && shift.dayId === todayDayId && !shift.isAddShift && shift.variant !== 'vacation');
        const status = liveStatusByEmployee[row.id] ?? 'Off';
        const breakStartedAt = status === 'On a Break' ? liveBreakStartedAtByEmployee[row.id] : undefined;
        const breakDuration = breakStartedAt ? formatElapsedBreakTime(breakStartedAt) : null;
        const hours = liveHoursByEmployee[row.id] ?? { todayHours: 0, weekHours: 0 };
        const location = liveLocationByEmployee[row.id] ?? 'Office';
        const assignedShiftName = getAssignedLiveShiftName(row.id);
        const overtimeHours = Math.max(hours.weekHours - 40, 0);
        return { row, todayShift, status, breakDuration, assignedShiftName, hours, overtimeHours, location };
      }),
    [visibleShifts, todayDayId],
  );

  const filteredLiveNowRows = useMemo(() => (
    liveNowRows.filter((entry) => {
      if (locationFilter === 'all') return true;
      return locationFilter === 'office' ? entry.location === 'Office' : entry.location === 'Remote';
    })
  ), [liveNowRows, locationFilter]);

  const clockedInCount = useMemo(
    () => filteredLiveNowRows.filter((r) => r.status === 'Clocked In' || r.status === 'Clocked In (Late)' || r.status === 'On a Break').length,
    [filteredLiveNowRows],
  );
  const attendanceHealthData = useMemo(() => {
    const baseRows = liveNowRows;
    const lateToday = baseRows.filter((row) => row.status === 'Clocked In (Late)' || row.status === 'Absent').length;
    const notClockedInYet = baseRows.filter((row) => row.status === 'Off' || row.status === 'Absent').length;
    const earlyClockOuts = baseRows.filter((row) => row.status === 'Off' && row.hours.todayHours > 0 && row.hours.todayHours < 7).length;
    const exceptions = baseRows.filter((row) => row.status === 'Absent').length;

    return {
      clockedInNow: baseRows.filter((row) => row.status === 'Clocked In' || row.status === 'Clocked In (Late)' || row.status === 'On a Break').length,
      notClockedInYet,
      lateToday,
      earlyClockOuts,
      exceptions,
    };
  }, [liveNowRows]);

  const overtimeRiskEmployee = useMemo(() => {
    const riskCandidates = scheduleRows
      .filter((row) => !row.isOpenShift)
      .map((row) => {
        const hours = liveHoursByEmployee[row.id];
        if (!hours) return null;
        const weekMinutesWorked = Math.round(hours.weekHours * 60);
        const todayMinutesWorked = Math.round(hours.todayHours * 60);
        const minutesAway = overtimeThresholdMinutes - weekMinutesWorked;
        return { rowId: row.id, name: row.name, weekMinutesWorked, todayMinutesWorked, minutesAway };
      })
      .filter((candidate): candidate is { rowId: string; name: string; weekMinutesWorked: number; todayMinutesWorked: number; minutesAway: number } => (
        !!candidate && candidate.minutesAway > 0 && candidate.minutesAway <= 60
      ));

    if (riskCandidates.length === 0) return null;
    return riskCandidates[getSeededIndex(weekKey, riskCandidates.length)];
  }, [weekKey]);

  const aiInsights = useMemo(() => {
    return [
      {
        id: 'late-pattern' as const,
        text: 'Ben Procter has clocked in late 3 times over the last 2 weeks.',
      },
      {
        id: 'coverage-gap' as const,
        text: 'Current coverage is understaffed by 2 people compared to this time last week.',
      },
      {
        id: 'open-shift-risk' as const,
        text: overtimeRiskEmployee
          ? `${overtimeRiskEmployee.name} is ${formatMinutesAsOvertimeInsight(overtimeRiskEmployee.minutesAway)} away from hitting overtime.`
          : 'No employees are currently within one hour of hitting overtime.',
      },
    ];
  }, [overtimeRiskEmployee]);

  const gridTemplateColumns = `${employeeColWidth}px repeat(${scheduleColumns.length}, ${dayColWidth}px)`;
  const todayDayIndex = scheduleColumns.findIndex((column) => column.id === todayDayId);

  const emitCoverageTelemetry = (dayId: string, action: string) => {
    if (typeof window === 'undefined') return;
    const tracker = (window as Window & { track?: (eventName: string, payload: Record<string, unknown>) => void }).track;
    if (typeof tracker === 'function') {
      tracker('coverage_by_day_action', { dayId, action, weekKey });
    }
  };

  const openNewShiftModal = (rowId?: string, dayId?: string) => {
    setDraft(createDefaultDraft(rowId, dayId));
    setIsNewShiftModalOpen(true);
  };

  const updateDraft = <K extends keyof NewShiftDraft>(field: K, value: NewShiftDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const createShift = () => {
    const start = parseTimeToMinutes(draft.startTime);
    const end = parseTimeToMinutes(draft.endTime);
    const breakMinutes = Number(draft.unpaidBreakMinutes) || 0;

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return;

    const duration = Math.max((end - start - breakMinutes) / 60, 0.5);
    const title = `${formatTime12(draft.startTime)}-${formatTime12(draft.endTime)} (${formatHoursLabel(duration)}h)`;

    const newShift: ShiftBlock = {
      id: `${weekKey}-user-${Date.now()}`,
      rowId: draft.rowId,
      dayId: draft.dayId,
      title,
      subtitle: draft.shiftName.trim() || undefined,
      hours: duration,
    };

    setShiftsByWeek((prev) => {
      const currentWeek = prev[weekKey] ?? cloneWeekShifts(weekKey);
      return {
        ...prev,
        [weekKey]: [...currentWeek, newShift],
      };
    });

    setIsNewShiftModalOpen(false);
    setActiveTab('schedules');
  };

  const handleRemoveRiskEmployeeRemainingShifts = () => {
    if (!overtimeRiskEmployee) return;
    setShiftsByWeek((prev) => {
      const currentWeek = prev[weekKey] ?? cloneWeekShifts(weekKey);
      return {
        ...prev,
        [weekKey]: currentWeek.filter((shift) => {
          if (shift.rowId !== overtimeRiskEmployee.rowId) return true;
          const shiftDayIndex = scheduleColumns.findIndex((column) => column.id === shift.dayId);
          return shiftDayIndex < todayDayIndex;
        }),
      };
    });
    setActiveInsightId(null);
  };

  return (
    <div className="min-h-full px-8 pt-8 pb-10 relative">
      <div className="flex items-center justify-between mb-3">
        <h1
          className="text-[40px] font-bold text-[var(--color-primary-strong)]"
          style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '46px' }}
        >
          Time &amp; Attendance
        </h1>

        {activeTab === 'schedules' ? (
          <Button
            variant="primary"
            size="small"
            icon="circle-plus-lined"
            className="!h-9 !px-4 !text-[14px]"
            onClick={() => openNewShiftModal()}
          >
            New Shift
          </Button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] p-1">
            <span className="text-[11px] font-semibold text-[var(--text-neutral-medium)] px-2">Mode</span>
            <button
              data-testid="mode-toggle-schedule"
              className={`h-7 px-3 rounded-[var(--radius-full)] text-[12px] font-semibold ${liveViewMode === 'schedule' ? 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-x-weak)]' : 'text-[var(--text-neutral-medium)]'}`}
              onClick={() => setLiveViewMode('schedule')}
            >
              Schedule
            </button>
            <button
              data-testid="mode-toggle-no-schedule"
              className={`h-7 px-3 rounded-[var(--radius-full)] text-[12px] font-semibold ${liveViewMode === 'no-schedule' ? 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-x-weak)]' : 'text-[var(--text-neutral-medium)]'}`}
              onClick={() => setLiveViewMode('no-schedule')}
            >
              No Schedule
            </button>
          </div>
        )}
      </div>

      <Tabs
        tabs={[
          { id: 'live-view', label: 'Live View', icon: 'chart-line' },
          { id: 'schedules', label: 'Schedules', icon: 'calendar' },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TimeAttendanceTab)}
        className="mb-4"
      />

      {activeTab === 'schedules' ? (
        <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] p-4 border border-[var(--border-neutral-x-weak)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] overflow-hidden">
                <button
                  className="h-10 w-10 grid place-items-center text-[var(--icon-neutral-strong)] border-r border-[var(--border-neutral-x-weak)]"
                  onClick={() => setWeekStartDate((prev) => addDays(prev, -7))}
                >
                  <Icon name="chevron-left" size={12} />
                </button>
                <button className="h-10 px-4 text-[14px] font-semibold text-[var(--text-neutral-strong)]">
                  {formatRange(weekStartDate)}
                </button>
                <button
                  className="h-10 w-10 grid place-items-center text-[var(--icon-neutral-strong)] border-l border-[var(--border-neutral-x-weak)]"
                  onClick={() => setWeekStartDate((prev) => addDays(prev, 7))}
                >
                  <Icon name="chevron-right" size={12} />
                </button>
              </div>
              <Button
                variant="standard"
                size="small"
                className="!h-10 !px-4 !text-[14px]"
                onClick={() => setWeekStartDate(startOfWeekMonday(new Date()))}
              >
                Today
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <button className="h-10 min-w-[220px] px-4 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] text-left text-[14px] text-[var(--text-neutral-strong)] bg-[var(--surface-neutral-white)] flex items-center justify-between">
                <span>All Employees</span>
                <Icon name="caret-down" size={10} />
              </button>
              <Button variant="standard" size="small" className="!h-10 !px-4 !text-[14px]">Filters</Button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)]">
            <div className="min-w-[1290px]">
              <div
                className="grid border-b border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)]"
                style={{ gridTemplateColumns }}
              >
                <div className="px-3 py-3 text-[13px] font-semibold text-[var(--text-neutral-medium)]">Employees</div>
                {scheduleColumnsWithDates.map((col) => (
                  <div key={col.id} className="px-3 py-2 border-l border-[var(--border-neutral-x-weak)]">
                    <p className="text-[13px] font-semibold text-[var(--text-neutral-medium)]">{col.label}</p>
                    <p className="text-[12px] text-[var(--text-neutral-medium)]">{col.subLabel}</p>
                  </div>
                ))}
              </div>

              {scheduleRows.map((row) => {
                const rowHours = visibleShifts
                  .filter((shift) => shift.rowId === row.id)
                  .reduce((sum, shift) => (shift.hours ? sum + shift.hours : sum), 0);

                return (
                  <div
                    key={row.id}
                    className="grid min-h-[64px] border-b border-[var(--border-neutral-xx-weak)]"
                    style={{ gridTemplateColumns }}
                  >
                    <div className="px-3 py-2 border-r border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)]">
                      <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)] leading-[18px]">{row.name}</p>
                      <p className="text-[12px] text-[var(--text-neutral-medium)]">{`${formatHoursLabel(rowHours)}h 0m  $0.00`}</p>
                    </div>

                    {scheduleColumnsWithDates.map((col) => {
                      const rowShifts = visibleShifts.filter((shift) => shift.rowId === row.id && shift.dayId === col.id);

                      return (
                        <div key={`${row.id}-${col.id}`} className="px-2 py-2 border-l border-[var(--border-neutral-xx-weak)] bg-[var(--surface-neutral-white)]">
                          <div className="space-y-1">
                            {rowShifts.map((shift) => {
                              if (shift.isAddShift) {
                                return (
                                  <button
                                    key={shift.id}
                                    className="w-full h-9 rounded-[var(--radius-x-small)] border border-dashed border-[var(--border-neutral-medium)] text-[13px] font-semibold text-[var(--color-primary-strong)] flex items-center justify-center gap-2 bg-[var(--surface-neutral-xx-weak)]"
                                    onClick={() => openNewShiftModal(row.id, col.id)}
                                  >
                                    <Icon name="circle-plus-lined" size={14} />
                                    {shift.title}
                                  </button>
                                );
                              }

                              if (shift.variant === 'vacation') {
                                return (
                                  <div
                                    key={shift.id}
                                    className="h-6 rounded-[var(--radius-full)] bg-[var(--surface-selected-weak)] border border-[var(--border-neutral-x-weak)] px-2 text-[12px] font-medium text-[var(--color-primary-strong)] flex items-center gap-1"
                                  >
                                    <Icon name="calendar" size={10} />
                                    <span>{shift.title}</span>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={shift.id}
                                  className="rounded-[var(--radius-x-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-2 py-1"
                                >
                                  <p className="text-[11px] font-semibold text-[var(--text-neutral-strong)] leading-[14px]">{shift.title}</p>
                                  {shift.subtitle && (
                                    <p className="text-[11px] text-[var(--text-neutral-medium)] leading-[14px]">{shift.subtitle}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-4 py-3 flex items-center justify-between">
            <p className="text-[13px] text-[var(--text-neutral-medium)]">Schedule includes published and draft shifts. Vacation tags indicate approved time off.</p>
            <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">Scheduled: {formatHoursLabel(totalScheduledHours)}h</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setIsInsightsExpanded((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <Icon name="sparkles" size={18} className="text-[var(--color-primary-strong)]" />
              <h2 className="text-[34px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '36px' }}>
                Insights
              </h2>
              <Icon
                name="caret-down"
                size={12}
                className={`text-[var(--icon-neutral-strong)] mt-1 transition-transform ${isInsightsExpanded ? '' : '-rotate-90'}`}
              />
            </button>

            {isInsightsExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="rounded-[var(--radius-small)] p-[1px] bg-gradient-to-r from-[var(--surface-selected-weak)] via-[var(--border-neutral-xx-weak)] to-[var(--surface-neutral-x-weak)]"
                  >
                    <div className="h-full bg-[var(--surface-neutral-white)] rounded-[calc(var(--radius-small)-1px)] px-4 py-4 flex flex-col gap-4">
                      <p className="text-[17px] font-semibold text-[var(--text-neutral-strong)] leading-[24px]">{insight.text}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <button
                          className="h-9 px-4 rounded-[var(--radius-full)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] text-[15px] font-semibold text-[var(--text-neutral-strong)]"
                          onClick={() => setActiveInsightId(insight.id)}
                        >
                          View Details
                        </button>
                        <div className="flex items-center gap-3 text-[var(--icon-neutral-strong)]">
                          <button className="hover:text-[var(--color-primary-strong)]">
                            <Icon name="thumbs-up" size={14} />
                          </button>
                          <button className="hover:text-[var(--color-primary-strong)]">
                            <Icon name="xmark" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4 xl:h-[680px]">
            <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4 h-full flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                      Live Team Status
                    </h2>
                    <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-red-200 bg-red-50 px-3 py-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-red-700">Live</span>
                    </div>
                    <p className="text-[12px] text-[var(--text-neutral-medium)]">
                      Last updated: {formatTimeWithSeconds(liveStatusTimestamp)}
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-3 rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
                    <div className="h-8 w-8 rounded-[var(--radius-full)] bg-[var(--surface-selected-weak)] text-[var(--color-primary-strong)] flex items-center justify-center">
                      <Icon name="users" size={14} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Currently Clocked In</p>
                      <p className="text-[20px] font-bold text-[var(--color-primary-strong)]">{clockedInCount}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <p className="text-[12px] text-[var(--text-neutral-medium)]">Filter by work location</p>
                  <div className="w-[130px]">
                    <FormDropdown
                      label=""
                      options={[
                        { value: 'all', label: 'All' },
                        { value: 'office', label: 'Office' },
                        { value: 'remote', label: 'Remote' },
                      ]}
                      value={locationFilter}
                      onChange={(value) => setLocationFilter(value as LocationFilter)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                {filteredLiveNowRows.map(({ row, todayShift, status, breakDuration, assignedShiftName, hours, overtimeHours }) => (
                  <div key={row.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] px-3 py-2 flex items-center justify-between">
                    <div>
                      <button
                        onClick={() => navigate(`/my-info?tab=timesheets&employee=${row.id}`)}
                        className="text-[14px] font-semibold text-[var(--color-link)] hover:underline"
                      >
                        {row.name}
                      </button>
                      {liveViewMode === 'schedule' && (
                        <p className="text-[12px] text-[var(--text-neutral-medium)]">
                          {todayShift ? formatLiveShiftLabel(todayShift.title, assignedShiftName) : 'No shift assigned today'}
                        </p>
                      )}
                      <p className="text-[12px] text-[var(--text-neutral-medium)] mt-1">
                        Today: {formatHoursToHoursAndMinutes(hours.todayHours)} | Week: {formatHoursToHoursAndMinutes(hours.weekHours)} | OT: {formatHoursToHoursAndMinutes(overtimeHours)}
                      </p>
                      {status === 'On a Break' && (
                        <p className="text-[12px] text-amber-700 mt-1">
                          On break for {breakDuration ?? '0m'}
                        </p>
                      )}
                    </div>
                    <span className={`h-7 px-3 rounded-[var(--radius-full)] text-[12px] font-semibold inline-flex items-center ${getStatusBadgeClasses(status)}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 h-full">
              {liveViewMode === 'schedule' ? (
                <CoverageByDayCard
                  days={coverageDaysWithDates}
                  shifts={visibleShifts}
                  employees={scheduleRows.filter((row) => !row.isOpenShift)}
                  requiredByDay={{ mon: 4, tue: 3 }}
                  onViewDay={(dayId) => {
                    setActiveTab('schedules');
                    emitCoverageTelemetry(dayId, 'view-day');
                  }}
                  onFillOpenShift={(dayId) => {
                    setActiveTab('schedules');
                    openNewShiftModal('open-shifts', dayId);
                    emitCoverageTelemetry(dayId, 'fill-open-shift');
                  }}
                />
              ) : (
                <AttendanceHealthCard
                  data={attendanceHealthData}
                  onViewDay={() => {
                    navigate('/my-info?tab=timesheets');
                    emitCoverageTelemetry('live-view', 'attendance-view-day');
                  }}
                  showSecondaryAction={false}
                />
              )}

              <LaborRiskSnapshotCard
                onViewLaborDetails={() => emitCoverageTelemetry('live-view', 'view-labor-details')}
              />
            </div>
          </div>
        </div>
      )}

      {isNewShiftModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/35 flex items-center justify-center p-6">
          <div className="w-full max-w-[760px] bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] shadow-xl">
            <div className="px-6 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-center justify-between">
              <h2 className="text-[28px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '32px' }}>
                New Shift
              </h2>
              <button onClick={() => setIsNewShiftModalOpen(false)} className="text-[var(--icon-neutral-strong)] hover:text-[var(--text-neutral-strong)]">
                <Icon name="xmark" size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-5">
              <div className="space-y-4">
                <TextInput
                  label="Shift Name"
                  value={draft.shiftName}
                  onChange={(value) => updateDraft('shiftName', value)}
                  placeholder="Shift Name"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormDropdown
                    label="Employee"
                    options={employeeOptions}
                    value={draft.rowId}
                    onChange={(value) => updateDraft('rowId', value)}
                  />
                  <FormDropdown
                    label="Day"
                    options={dayOptions}
                    value={draft.dayId}
                    onChange={(value) => updateDraft('dayId', value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TextInput
                    label="Start"
                    value={draft.startTime}
                    onChange={(value) => updateDraft('startTime', value)}
                    placeholder="08:00"
                  />
                  <TextInput
                    label="End"
                    value={draft.endTime}
                    onChange={(value) => updateDraft('endTime', value)}
                    placeholder="17:00"
                  />
                  <TextInput
                    label="Unpaid Break (min)"
                    value={draft.unpaidBreakMinutes}
                    onChange={(value) => updateDraft('unpaidBreakMinutes', value)}
                    placeholder="60"
                  />
                </div>

                <Checkbox
                  label="Publish immediately"
                  checked={draft.publishNow}
                  onChange={(checked) => updateDraft('publishNow', checked)}
                />
              </div>

              <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] p-4">
                <p className="text-[12px] font-semibold text-[var(--text-neutral-medium)] uppercase tracking-wide mb-2">Preview</p>
                <div className="rounded-[var(--radius-x-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-3 py-2">
                  <p className="text-[12px] font-semibold text-[var(--text-neutral-strong)]">
                    {formatTime12(draft.startTime)}-{formatTime12(draft.endTime)}
                  </p>
                  <p className="text-[12px] text-[var(--text-neutral-medium)]">{draft.shiftName || 'Shift Name'}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-neutral-x-weak)] flex items-center justify-end gap-2">
              <Button variant="ghost" size="small" className="!h-9 !px-4" onClick={() => setIsNewShiftModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" className="!h-9 !px-4" onClick={createShift}>
                Create Shift
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeInsightId && (
        <div className="fixed inset-0 z-[75] bg-black/35 flex items-center justify-center p-6">
          <div className="w-full max-w-[680px] bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] shadow-xl">
            <div className="px-6 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-center justify-between">
              <h2 className="text-[28px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '32px' }}>
                Insight Details
              </h2>
              <button onClick={() => setActiveInsightId(null)} className="text-[var(--icon-neutral-strong)] hover:text-[var(--text-neutral-strong)]">
                <Icon name="xmark" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {activeInsightId === 'late-pattern' && (
                <>
                  <p className="text-[18px] font-semibold text-[var(--text-neutral-strong)]">Ben Procter late clock-ins (last 2 weeks)</p>
                  <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] p-4 space-y-2">
                    {lateClockInEvents.map((event) => (
                      <div key={`${event.day}-${event.time}`} className="text-[14px] text-[var(--text-neutral-strong)] flex items-center justify-between">
                        <span>{event.day}</span>
                        <span>{event.time}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[13px] text-[var(--text-neutral-medium)]">Recommended action: schedule a meeting with Ben to discuss repeated late clock-ins.</p>
                </>
              )}

              {activeInsightId === 'coverage-gap' && (
                <>
                  <p className="text-[18px] font-semibold text-[var(--text-neutral-strong)]">Coverage gap details</p>
                  <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] p-4 space-y-2">
                    <p className="text-[14px] text-[var(--text-neutral-strong)]">Current staffed at this time: <span className="font-semibold">7 employees</span></p>
                    <p className="text-[14px] text-[var(--text-neutral-strong)]">Same time last week: <span className="font-semibold">9 employees</span></p>
                    <p className="text-[14px] text-[var(--text-neutral-strong)]">Difference: <span className="font-semibold text-red-700">-2 employees</span></p>
                  </div>
                </>
              )}

              {activeInsightId === 'open-shift-risk' && (
                <>
                  <p className="text-[18px] font-semibold text-[var(--text-neutral-strong)]">{overtimeRiskEmployee?.name ?? 'Overtime'} warning</p>
                  <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] p-4 space-y-2">
                    <p className="text-[14px] text-[var(--text-neutral-strong)]">Week worked: <span className="font-semibold">{formatMinutesAsHoursAndMinutes(overtimeRiskEmployee?.weekMinutesWorked ?? 0)}</span></p>
                    <p className="text-[14px] text-[var(--text-neutral-strong)]">Today worked: <span className="font-semibold">{formatMinutesAsHoursAndMinutes(overtimeRiskEmployee?.todayMinutesWorked ?? 0)}</span></p>
                    <p className="text-[14px] text-[var(--text-neutral-strong)]">Away from overtime: <span className="font-semibold">{formatMinutesAsOvertimeInsight(overtimeRiskEmployee?.minutesAway ?? 0)}</span></p>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-neutral-x-weak)] flex items-center justify-end gap-2">
              <Button variant="ghost" size="small" className="!h-9 !px-4" onClick={() => setActiveInsightId(null)}>
                Close
              </Button>
              {activeInsightId === 'late-pattern' && (
                <Button variant="primary" size="small" className="!h-9 !px-4">
                  Schedule meeting with Ben
                </Button>
              )}
              {activeInsightId === 'coverage-gap' && (
                <Button
                  variant="primary"
                  size="small"
                  className="!h-9 !px-4"
                  onClick={() => {
                    setActiveTab('schedules');
                    setActiveInsightId(null);
                  }}
                >
                  Staff Open Shift(s)
                </Button>
              )}
              {activeInsightId === 'open-shift-risk' && (
                <Button
                  variant="primary"
                  size="small"
                  className="!h-9 !px-4"
                  onClick={handleRemoveRiskEmployeeRemainingShifts}
                  disabled={!overtimeRiskEmployee}
                >
                  Remove from remaining shifts this week
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeAttendance;
