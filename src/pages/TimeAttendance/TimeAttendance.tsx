import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FormDropdown, Icon, Tabs, TextInput } from '../../components';
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
const liveShiftNames = ['Cashier', 'Bakery', 'Cleaning', 'Stocking'] as const;
const liveShiftOverrides: Record<string, (typeof liveShiftNames)[number]> = {
  'devon-lane': 'Cashier',
  'ronald-richards': 'Stocking',
  'darrell-steward': 'Cleaning',
};

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

export function TimeAttendance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TimeAttendanceTab>('schedules');
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true);
  const [weekStartDate, setWeekStartDate] = useState(() => startOfWeekMonday(new Date()));
  const initialKey = getWeekKey(startOfWeekMonday(new Date()));

  const [shiftsByWeek, setShiftsByWeek] = useState<Record<string, ShiftBlock[]>>(() => ({
    [initialKey]: cloneWeekShifts(initialKey),
  }));

  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false);
  const [draft, setDraft] = useState<NewShiftDraft>(() => createDefaultDraft());

  const weekKey = getWeekKey(weekStartDate);
  const todayDayId = getDayIdFromDate(new Date());

  const visibleShifts = useMemo(
    () => shiftsByWeek[weekKey] ?? cloneWeekShifts(weekKey),
    [shiftsByWeek, weekKey],
  );

  const scheduleColumnsWithDates = useMemo(
    () => scheduleColumns.map((column, index) => ({ ...column, subLabel: formatDaySubLabel(addDays(weekStartDate, index)) })),
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
        const status = row.id === 'ronald-richards' ? 'Late' : (todayShift ? 'On Shift' : 'Off');
        const assignedShiftName = getAssignedLiveShiftName(row.id);
        return { row, todayShift, status, assignedShiftName };
      }),
    [visibleShifts, todayDayId],
  );

  const clockedInCount = useMemo(
    () => liveNowRows.filter((r) => r.status === 'On Shift').length,
    [liveNowRows],
  );

  const aiInsights = useMemo(() => {
    const latePatternEmployee = liveNowRows.find((entry) => entry.status === 'Off')?.row.name ?? 'Ben Procter';

    return [
      {
        id: 'late-pattern',
        text: `${latePatternEmployee} has clocked in late 3 times over the last 2 weeks.`,
      },
      {
        id: 'coverage-gap',
        text: 'Current coverage is understaffed by 2 people compared to this time last week.',
      },
      {
        id: 'open-shift-risk',
        text: 'Devon Lane is 1h 21m away from hitting OT.',
      },
    ];
  }, [liveNowRows]);

  const coverageSuggestions = useMemo(() => {
    return liveNowRows
      .filter((entry) => entry.status === 'Off')
      .slice(0, 4)
      .map((entry, index) => ({
        id: entry.row.id,
        name: entry.row.name,
        reason: index % 2 === 0
          ? 'Available now and under weekly hour target.'
          : 'Cross-trained for open roles and nearby.',
      }));
  }, [liveNowRows]);

  const gridTemplateColumns = `${employeeColWidth}px repeat(${scheduleColumns.length}, ${dayColWidth}px)`;

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
          <Button variant="standard" size="small" className="!h-9 !px-4 !text-[14px]" icon="arrows-rotate">
            Refresh
          </Button>
        )}
      </div>

      <Tabs
        tabs={[
          { id: 'schedules', label: 'Schedules', icon: 'calendar' },
          { id: 'live-view', label: 'Live View', icon: 'chart-line' },
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
                        <button className="h-9 px-4 rounded-[var(--radius-full)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] text-[15px] font-semibold text-[var(--text-neutral-strong)]">
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

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
            <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4 h-full flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                  Live Team Status
                </h2>
                <p className="text-[13px] text-[var(--text-neutral-medium)]">Updates every minute</p>
              </div>

              <div className="mb-3 rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2 flex items-center justify-between">
                <p className="text-[13px] text-[var(--text-neutral-medium)]">Currently Clocked In</p>
                <p className="text-[16px] font-semibold text-[var(--color-primary-strong)]">{clockedInCount}</p>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                {liveNowRows.map(({ row, todayShift, status, assignedShiftName }) => (
                  <div key={row.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] px-3 py-2 flex items-center justify-between">
                    <div>
                      <button
                        onClick={() => navigate(`/my-info?tab=timesheets&employee=${row.id}`)}
                        className="text-[14px] font-semibold text-[var(--color-link)] hover:underline"
                      >
                        {row.name}
                      </button>
                      <p className="text-[12px] text-[var(--text-neutral-medium)]">
                        {todayShift ? formatLiveShiftLabel(todayShift.title, assignedShiftName) : 'No shift assigned today'}
                      </p>
                    </div>
                    <span className={`h-7 px-3 rounded-[var(--radius-full)] text-[12px] font-semibold inline-flex items-center ${status === 'On Shift' ? 'bg-[var(--surface-selected-weak)] text-[var(--color-primary-strong)]' : status === 'Late' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[var(--surface-neutral-xx-weak)] text-[var(--text-neutral-medium)]'}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4">
                <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)] mb-3" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                  Coverage by Day
                </h2>
                <div className="space-y-2">
                  {scheduleColumnsWithDates.map((day) => {
                    const dayCount = visibleShifts.filter((shift) => shift.dayId === day.id && !shift.isAddShift && shift.variant !== 'vacation').length;
                    const target = day.id === 'sat' || day.id === 'sun' ? 4 : 10;
                    const pct = Math.min(Math.round((dayCount / target) * 100), 100);
                    return (
                      <div key={day.id}>
                        <div className="flex items-center justify-between text-[12px] text-[var(--text-neutral-medium)] mb-1">
                          <span>{day.label}</span>
                          <span>{dayCount}/{target} assigned</span>
                        </div>
                        <div className="h-2 rounded-[var(--radius-full)] bg-[var(--surface-neutral-xx-weak)] overflow-hidden">
                          <div className="h-full bg-[var(--color-primary-strong)]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="sparkles" size={16} className="text-[var(--color-primary-strong)]" />
                  <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                    Coverage Suggestions
                  </h2>
                </div>
                <div className="space-y-2">
                  {coverageSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-3">
                      <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">{suggestion.name}</p>
                      <p className="text-[12px] text-[var(--text-neutral-medium)] mb-2">{suggestion.reason}</p>
                      <button className="h-8 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] text-[12px] font-semibold text-[var(--text-neutral-strong)]">
                        Assign to open Shift
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
    </div>
  );
}

export default TimeAttendance;
