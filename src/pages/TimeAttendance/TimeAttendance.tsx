import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Checkbox, FormDropdown, Icon, Tabs, TextInput } from '../../components';
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

type TimeAttendanceTab = 'schedules' | 'live-view' | 'time';
type LiveViewMode = 'schedule' | 'no-schedule';
type InsightId = 'late-pattern' | 'coverage-gap' | 'open-shift-risk';
type LiveStatus = 'Off' | 'PTO' | 'Clocked In' | 'Clocked In (Late)' | 'On a Break' | 'Absent';
type LocationFilter = 'all' | 'office' | 'remote';
type JobFilter = 'all' | 'Cashier' | 'Lead' | 'Opening' | 'Stock' | 'Manager' | 'Support' | 'Prep' | 'Front Desk' | 'Part Time' | 'Closing';
type ManagerFilter = 'all' | 'Ronald Richards' | 'Albert Flores' | 'Esther Howard';
type StatusFilter = 'all' | LiveStatus;
type WorkLocation = 'Office' | 'Remote';
type ApprovalStatus = 'pending' | 'approved' | 'denied';

interface PtoRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  policy: string;
  date: string;
  startMinute: number;
  endMinute: number;
  requestedHours: number;
  submittedAt: string;
  reason: string;
  status: ApprovalStatus;
}

interface TimesheetEntry {
  dayLabel: string;
  project: string;
  hours: number;
}

interface TimesheetApproval {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodLabel: string;
  submittedAt: string;
  dueAt: string;
  regularHours: number;
  overtimeHours: number;
  notes?: string;
  status: ApprovalStatus;
  entries: TimesheetEntry[];
}

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
const liveJobByEmployee: Record<string, Exclude<JobFilter, 'all'>> = {
  'ben-procter': 'Cashier',
  'albert-flores': 'Lead',
  'janet-caldwell': 'Opening',
  'devon-lane': 'Stock',
  'ronald-richards': 'Manager',
  'wade-warren': 'Cashier',
  'brooklyn-simmons': 'Support',
  'darrell-steward': 'Prep',
  'esther-howard': 'Front Desk',
  'jenny-wilson': 'Part Time',
  'kristin-watson': 'Closing',
};
const liveManagerByEmployee: Record<string, Exclude<ManagerFilter, 'all'>> = {
  'ben-procter': 'Ronald Richards',
  'albert-flores': 'Ronald Richards',
  'janet-caldwell': 'Albert Flores',
  'devon-lane': 'Albert Flores',
  'ronald-richards': 'Ronald Richards',
  'wade-warren': 'Albert Flores',
  'brooklyn-simmons': 'Esther Howard',
  'darrell-steward': 'Ronald Richards',
  'esther-howard': 'Esther Howard',
  'jenny-wilson': 'Esther Howard',
  'kristin-watson': 'Albert Flores',
};
const liveAvatarByEmployee: Record<string, string> = {
  'ben-procter': 'https://i.pravatar.cc/120?img=12',
  'albert-flores': 'https://i.pravatar.cc/120?img=15',
  'janet-caldwell': 'https://i.pravatar.cc/120?img=32',
  'devon-lane': 'https://i.pravatar.cc/120?img=52',
  'ronald-richards': 'https://i.pravatar.cc/120?img=56',
  'wade-warren': 'https://i.pravatar.cc/120?img=59',
  'brooklyn-simmons': 'https://i.pravatar.cc/120?img=47',
  'darrell-steward': 'https://i.pravatar.cc/120?img=61',
  'esther-howard': 'https://i.pravatar.cc/120?img=45',
  'jenny-wilson': 'https://i.pravatar.cc/120?img=38',
  'kristin-watson': 'https://i.pravatar.cc/120?img=26',
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
const allDayEndMinute = 24 * 60;
const pendingStatuses: ApprovalStatus[] = ['pending', 'approved'];
const liveStatusSortOrder: Record<LiveStatus, number> = {
  'Clocked In': 1,
  'Clocked In (Late)': 2,
  'On a Break': 3,
  'Absent': 4,
  'Off': 5,
  'PTO': 6,
};

const initialPtoRequests: PtoRequest[] = [
  {
    id: 'pto-1',
    employeeId: 'devon-lane',
    employeeName: 'Devon Lane',
    policy: 'Vacation',
    date: '2026-03-11',
    startMinute: 0,
    endMinute: allDayEndMinute,
    requestedHours: 8,
    submittedAt: '2026-03-01T08:40:00.000Z',
    reason: 'Family travel',
    status: 'pending',
  },
  {
    id: 'pto-2',
    employeeId: 'wade-warren',
    employeeName: 'Wade Warren',
    policy: 'Vacation',
    date: '2026-03-11',
    startMinute: 0,
    endMinute: allDayEndMinute,
    requestedHours: 8,
    submittedAt: '2026-03-01T10:18:00.000Z',
    reason: 'Spring break coverage',
    status: 'pending',
  },
  {
    id: 'pto-3',
    employeeId: 'jenny-wilson',
    employeeName: 'Jenny Wilson',
    policy: 'Vacation',
    date: '2026-03-11',
    startMinute: 0,
    endMinute: allDayEndMinute,
    requestedHours: 8,
    submittedAt: '2026-03-01T11:12:00.000Z',
    reason: 'Out of town',
    status: 'approved',
  },
  {
    id: 'pto-4',
    employeeId: 'brooklyn-simmons',
    employeeName: 'Brooklyn Simmons',
    policy: 'Sick Leave',
    date: '2026-03-11',
    startMinute: 780,
    endMinute: 1080,
    requestedHours: 5,
    submittedAt: '2026-03-01T14:26:00.000Z',
    reason: 'Medical appointment',
    status: 'approved',
  },
  {
    id: 'pto-5',
    employeeId: 'albert-flores',
    employeeName: 'Albert Flores',
    policy: 'Personal',
    date: '2026-03-12',
    startMinute: 540,
    endMinute: 780,
    requestedHours: 4,
    submittedAt: '2026-03-02T07:20:00.000Z',
    reason: 'School conference',
    status: 'pending',
  },
  {
    id: 'pto-6',
    employeeId: 'darrell-steward',
    employeeName: 'Darrell Steward',
    policy: 'Vacation',
    date: '2026-03-12',
    startMinute: 600,
    endMinute: 900,
    requestedHours: 5,
    submittedAt: '2026-03-02T09:10:00.000Z',
    reason: 'Travel buffer',
    status: 'pending',
  },
  {
    id: 'pto-7',
    employeeId: 'esther-howard',
    employeeName: 'Esther Howard',
    policy: 'Vacation',
    date: '2026-03-12',
    startMinute: 600,
    endMinute: 900,
    requestedHours: 5,
    submittedAt: '2026-03-02T09:44:00.000Z',
    reason: 'Out of office',
    status: 'approved',
  },
  {
    id: 'pto-8',
    employeeId: 'janet-caldwell',
    employeeName: 'Janet Caldwell',
    policy: 'Vacation',
    date: '2026-03-12',
    startMinute: 600,
    endMinute: 900,
    requestedHours: 5,
    submittedAt: '2026-03-02T10:02:00.000Z',
    reason: 'Family event',
    status: 'approved',
  },
  {
    id: 'pto-9',
    employeeId: 'kristin-watson',
    employeeName: 'Kristin Watson',
    policy: 'Personal',
    date: '2026-03-14',
    startMinute: 480,
    endMinute: 660,
    requestedHours: 3,
    submittedAt: '2026-03-02T12:14:00.000Z',
    reason: 'Appointment',
    status: 'pending',
  },
];

const initialTimesheetApprovals: TimesheetApproval[] = [
  {
    id: 'sheet-1',
    employeeId: 'ben-procter',
    employeeName: 'Ben Procter',
    payPeriodLabel: 'Mar 1 - Mar 7',
    submittedAt: '2026-03-02T17:24:00.000Z',
    dueAt: '2026-03-04T23:00:00.000Z',
    regularHours: 39.5,
    overtimeHours: 2,
    notes: 'Two support escalations on Friday.',
    status: 'pending',
    entries: [
      { dayLabel: 'Mon', project: 'Front Register', hours: 8 },
      { dayLabel: 'Tue', project: 'Front Register', hours: 8 },
      { dayLabel: 'Wed', project: 'Inventory', hours: 8.5 },
      { dayLabel: 'Thu', project: 'Front Register', hours: 7.5 },
      { dayLabel: 'Fri', project: 'Escalations', hours: 9.5 },
      { dayLabel: 'Sat', project: 'Training', hours: 0 },
      { dayLabel: 'Sun', project: 'Training', hours: 0 },
    ],
  },
  {
    id: 'sheet-2',
    employeeId: 'albert-flores',
    employeeName: 'Albert Flores',
    payPeriodLabel: 'Mar 1 - Mar 7',
    submittedAt: '2026-03-02T16:08:00.000Z',
    dueAt: '2026-03-04T23:00:00.000Z',
    regularHours: 40,
    overtimeHours: 0,
    status: 'pending',
    entries: [
      { dayLabel: 'Mon', project: 'Bakery', hours: 8 },
      { dayLabel: 'Tue', project: 'Bakery', hours: 8 },
      { dayLabel: 'Wed', project: 'Bakery', hours: 8 },
      { dayLabel: 'Thu', project: 'Bakery', hours: 8 },
      { dayLabel: 'Fri', project: 'Bakery', hours: 8 },
      { dayLabel: 'Sat', project: 'Off', hours: 0 },
      { dayLabel: 'Sun', project: 'Off', hours: 0 },
    ],
  },
  {
    id: 'sheet-3',
    employeeId: 'darrell-steward',
    employeeName: 'Darrell Steward',
    payPeriodLabel: 'Mar 1 - Mar 7',
    submittedAt: '2026-03-01T20:11:00.000Z',
    dueAt: '2026-03-03T12:00:00.000Z',
    regularHours: 36,
    overtimeHours: 0,
    status: 'pending',
    entries: [
      { dayLabel: 'Mon', project: 'Stocking', hours: 8 },
      { dayLabel: 'Tue', project: 'Stocking', hours: 7 },
      { dayLabel: 'Wed', project: 'Stocking', hours: 7 },
      { dayLabel: 'Thu', project: 'Receiving', hours: 7 },
      { dayLabel: 'Fri', project: 'Receiving', hours: 7 },
      { dayLabel: 'Sat', project: 'Off', hours: 0 },
      { dayLabel: 'Sun', project: 'Off', hours: 0 },
    ],
  },
  {
    id: 'sheet-4',
    employeeId: 'ronald-richards',
    employeeName: 'Ronald Richards',
    payPeriodLabel: 'Mar 1 - Mar 7',
    submittedAt: '2026-03-01T15:32:00.000Z',
    dueAt: '2026-03-03T12:00:00.000Z',
    regularHours: 38.25,
    overtimeHours: 1.5,
    status: 'approved',
    entries: [
      { dayLabel: 'Mon', project: 'Stocking', hours: 8 },
      { dayLabel: 'Tue', project: 'Stocking', hours: 8.25 },
      { dayLabel: 'Wed', project: 'Stocking', hours: 8 },
      { dayLabel: 'Thu', project: 'Backroom', hours: 7.5 },
      { dayLabel: 'Fri', project: 'Backroom', hours: 8 },
      { dayLabel: 'Sat', project: 'Off', hours: 0 },
      { dayLabel: 'Sun', project: 'Off', hours: 0 },
    ],
  },
];

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

function formatDateShort(dateIso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateIso));
}

function formatDateTimeShort(dateIso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateIso));
}

function formatMinuteTime(minute: number) {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function formatPtoWindow(dateIso: string, startMinute: number, endMinute: number) {
  const dateLabel = formatDateShort(dateIso);
  if (startMinute === 0 && endMinute >= allDayEndMinute) return `${dateLabel} (All day)`;
  return `${dateLabel}, ${formatMinuteTime(startMinute)} - ${formatMinuteTime(endMinute)}`;
}

function windowsOverlap(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && startB < endA;
}

function parseClockLabelToMinutes(label: string, meridiem: string) {
  const [hourRaw, minuteRaw] = label.split(':').map((value) => Number(value));
  if (Number.isNaN(hourRaw) || Number.isNaN(minuteRaw)) return null;
  const normalizedHour = hourRaw % 12;
  const hour = meridiem.toUpperCase() === 'PM' ? normalizedHour + 12 : normalizedHour;
  return hour * 60 + minuteRaw;
}

function parseShiftRangeMinutes(shiftTitle: string) {
  const match = shiftTitle.match(/(\d{1,2}:\d{2})(AM|PM)-(\d{1,2}:\d{2})(AM|PM)/i);
  if (!match) return null;

  const start = parseClockLabelToMinutes(match[1], match[2]);
  const end = parseClockLabelToMinutes(match[3], match[4]);
  if (start === null || end === null) return null;
  return { start, end };
}

function getCurrentMinutes(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function deriveLiveStatus(rawStatus: LiveStatus, todayShift: ShiftBlock | undefined, nowMinutes: number): LiveStatus {
  if (todayShift?.variant === 'vacation') return 'PTO';

  // No shift today: treat as off-duty unless explicitly marked PTO.
  if (!todayShift) return rawStatus === 'PTO' ? 'PTO' : 'Off';

  if (rawStatus === 'Clocked In' || rawStatus === 'Clocked In (Late)' || rawStatus === 'On a Break') return rawStatus;
  if (rawStatus === 'PTO') return 'PTO';

  const shiftRange = parseShiftRangeMinutes(todayShift.title);
  if (!shiftRange) return rawStatus === 'Absent' ? 'Absent' : 'Off';

  const graceMinutes = 7;
  if (nowMinutes < shiftRange.start + graceMinutes) return 'Off';
  if (nowMinutes >= shiftRange.end) return 'Off';
  return 'Absent';
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
  const [activeTab, setActiveTab] = useState<TimeAttendanceTab>('live-view');
  const [liveViewMode, setLiveViewMode] = useState<LiveViewMode>('schedule');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [jobFilter, setJobFilter] = useState<JobFilter>('all');
  const [managerFilter, setManagerFilter] = useState<ManagerFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isLiveFilterMenuOpen, setIsLiveFilterMenuOpen] = useState(false);
  const [activeLiveEmployeeId, setActiveLiveEmployeeId] = useState<string | null>(null);
  const [ptoRequests, setPtoRequests] = useState<PtoRequest[]>(initialPtoRequests);
  const [timesheetApprovals, setTimesheetApprovals] = useState<TimesheetApproval[]>(initialTimesheetApprovals);
  const [activeTimesheetId, setActiveTimesheetId] = useState<string | null>(null);
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
        const todayShift = visibleShifts.find((shift) => shift.rowId === row.id && shift.dayId === todayDayId && !shift.isAddShift);
        const nowMinutes = getCurrentMinutes(liveStatusTimestamp);
        const rawStatus = liveStatusByEmployee[row.id] ?? 'Off';
        const status = deriveLiveStatus(rawStatus, todayShift, nowMinutes);
        const breakStartedAt = status === 'On a Break' ? liveBreakStartedAtByEmployee[row.id] : undefined;
        const breakDuration = breakStartedAt ? formatElapsedBreakTime(breakStartedAt) : null;
        const hours = liveHoursByEmployee[row.id] ?? { todayHours: 0, weekHours: 0 };
        const location = liveLocationByEmployee[row.id] ?? 'Office';
        const job = liveJobByEmployee[row.id] ?? 'Cashier';
        const manager = liveManagerByEmployee[row.id] ?? 'Ronald Richards';
        const avatar = liveAvatarByEmployee[row.id];
        const assignedShiftName = getAssignedLiveShiftName(row.id);
        const overtimeHours = Math.max(hours.weekHours - 40, 0);
        return { row, todayShift, status, breakDuration, assignedShiftName, hours, overtimeHours, location, job, manager, avatar };
      }),
    [visibleShifts, todayDayId, liveStatusTimestamp],
  );

  const filteredLiveNowRows = useMemo(() => (
    liveNowRows.filter((entry) => {
      if (locationFilter !== 'all') {
        const locationMatches = locationFilter === 'office' ? entry.location === 'Office' : entry.location === 'Remote';
        if (!locationMatches) return false;
      }
      if (jobFilter !== 'all' && entry.job !== jobFilter) return false;
      if (managerFilter !== 'all' && entry.manager !== managerFilter) return false;
      if (statusFilter !== 'all' && entry.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => {
      const statusDelta = liveStatusSortOrder[a.status] - liveStatusSortOrder[b.status];
      if (statusDelta !== 0) return statusDelta;
      return a.row.name.localeCompare(b.row.name);
    })
  ), [liveNowRows, locationFilter, jobFilter, managerFilter, statusFilter]);
  const selectedLiveEmployee = useMemo(
    () => liveNowRows.find((entry) => entry.row.id === activeLiveEmployeeId) ?? null,
    [liveNowRows, activeLiveEmployeeId],
  );
  const jobFilterOptions = useMemo(() => {
    const uniqueJobs = Array.from(new Set(liveNowRows.map((entry) => entry.job)));
    return [{ value: 'all', label: 'All Jobs' }, ...uniqueJobs.map((job) => ({ value: job, label: job }))];
  }, [liveNowRows]);
  const managerFilterOptions = useMemo(() => {
    const uniqueManagers = Array.from(new Set(liveNowRows.map((entry) => entry.manager)));
    return [{ value: 'all', label: 'All Managers' }, ...uniqueManagers.map((manager) => ({ value: manager, label: manager }))];
  }, [liveNowRows]);
  const statusFilterOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(liveNowRows.map((entry) => entry.status)));
    return [{ value: 'all', label: 'All Statuses' }, ...uniqueStatuses.map((status) => ({ value: status, label: status }))];
  }, [liveNowRows]);
  const activeLiveFilterCount = useMemo(() => (
    [locationFilter, jobFilter, managerFilter, statusFilter].filter((value) => value !== 'all').length
  ), [locationFilter, jobFilter, managerFilter, statusFilter]);

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

  const pendingPtoRequests = useMemo(
    () => ptoRequests.filter((request) => request.status === 'pending'),
    [ptoRequests],
  );
  const pendingTimesheetApprovals = useMemo(
    () => timesheetApprovals.filter((timesheet) => timesheet.status === 'pending'),
    [timesheetApprovals],
  );
  const selectedTimesheet = useMemo(
    () => timesheetApprovals.find((timesheet) => timesheet.id === activeTimesheetId) ?? null,
    [timesheetApprovals, activeTimesheetId],
  );
  const highConflictPtoCount = useMemo(
    () => pendingPtoRequests.filter((request) => {
      const overlappingCount = ptoRequests.filter((otherRequest) => (
        otherRequest.id !== request.id
        && pendingStatuses.includes(otherRequest.status)
        && otherRequest.date === request.date
        && windowsOverlap(otherRequest.startMinute, otherRequest.endMinute, request.startMinute, request.endMinute)
      )).length;
      return overlappingCount > 2;
    }).length,
    [pendingPtoRequests, ptoRequests],
  );
  const totalPendingHours = useMemo(
    () => pendingTimesheetApprovals.reduce((sum, timesheet) => sum + timesheet.regularHours + timesheet.overtimeHours, 0),
    [pendingTimesheetApprovals],
  );
  const averagePendingHours = useMemo(
    () => (pendingTimesheetApprovals.length > 0 ? totalPendingHours / pendingTimesheetApprovals.length : 0),
    [pendingTimesheetApprovals, totalPendingHours],
  );
  const overdueTimesheetCount = useMemo(
    () => pendingTimesheetApprovals.filter((timesheet) => new Date(timesheet.dueAt).getTime() < Date.now()).length,
    [pendingTimesheetApprovals],
  );

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

  const getPtoOverlapCount = (request: PtoRequest) => (
    ptoRequests.filter((otherRequest) => (
      otherRequest.id !== request.id
      && pendingStatuses.includes(otherRequest.status)
      && otherRequest.date === request.date
      && windowsOverlap(otherRequest.startMinute, otherRequest.endMinute, request.startMinute, request.endMinute)
    )).length
  );

  const setPtoRequestStatus = (requestId: string, status: ApprovalStatus) => {
    setPtoRequests((prev) => prev.map((request) => (
      request.id === requestId ? { ...request, status } : request
    )));
  };

  const setTimesheetStatus = (timesheetId: string, status: ApprovalStatus) => {
    setTimesheetApprovals((prev) => prev.map((timesheet) => (
      timesheet.id === timesheetId ? { ...timesheet, status } : timesheet
    )));
    setActiveTimesheetId((prev) => (prev === timesheetId && status !== 'pending' ? null : prev));
  };

  const approveAllTimesheets = () => {
    setTimesheetApprovals((prev) => prev.map((timesheet) => (
      timesheet.status === 'pending' ? { ...timesheet, status: 'approved' } : timesheet
    )));
    setActiveTimesheetId(null);
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
        ) : activeTab === 'live-view' ? (
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
        ) : (
          <Button
            variant="primary"
            size="small"
            className="!h-9 !px-4 !text-[14px]"
            onClick={approveAllTimesheets}
            disabled={pendingTimesheetApprovals.length === 0}
          >
            Approve All Pending Hours ({pendingTimesheetApprovals.length})
          </Button>
        )}
      </div>

      <Tabs
        tabs={[
          { id: 'live-view', label: 'Live View', icon: 'chart-line' },
          { id: 'schedules', label: 'Schedules', icon: 'calendar' },
          { id: 'time', label: 'Time', icon: 'clock' },
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
      ) : activeTab === 'live-view' ? (
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
                <div className="relative">
                  <button
                    className="h-9 px-4 rounded-[var(--radius-full)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] text-[13px] font-semibold text-[var(--text-neutral-strong)] inline-flex items-center gap-2"
                    onClick={() => setIsLiveFilterMenuOpen((prev) => !prev)}
                  >
                    <Icon name="sliders" size={14} />
                    Filters
                    {activeLiveFilterCount > 0 && (
                      <span className="h-5 min-w-[20px] px-1 rounded-[var(--radius-full)] bg-[var(--color-primary-strong)] text-white text-[11px] leading-[20px] text-center">
                        {activeLiveFilterCount}
                      </span>
                    )}
                    <Icon name="caret-down" size={10} className={isLiveFilterMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {isLiveFilterMenuOpen && (
                    <div className="absolute right-0 top-[44px] z-20 w-[320px] rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] shadow-[0_8px_24px_rgba(16,24,40,0.12)] p-3 space-y-3">
                      <FormDropdown
                        label="Work Location"
                        options={[
                          { value: 'all', label: 'All Locations' },
                          { value: 'office', label: 'Office' },
                          { value: 'remote', label: 'Remote' },
                        ]}
                        value={locationFilter}
                        onChange={(value) => setLocationFilter(value as LocationFilter)}
                      />
                      <FormDropdown
                        label="Job"
                        options={jobFilterOptions}
                        value={jobFilter}
                        onChange={(value) => setJobFilter(value as JobFilter)}
                      />
                      <FormDropdown
                        label="Manager"
                        options={managerFilterOptions}
                        value={managerFilter}
                        onChange={(value) => setManagerFilter(value as ManagerFilter)}
                      />
                      <FormDropdown
                        label="Status"
                        options={statusFilterOptions}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value as StatusFilter)}
                      />
                      <div className="pt-1 flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          className="!h-8 !px-3 !text-[13px]"
                          onClick={() => {
                            setLocationFilter('all');
                            setJobFilter('all');
                            setManagerFilter('all');
                            setStatusFilter('all');
                          }}
                        >
                          Clear
                        </Button>
                        <Button
                          variant="primary"
                          size="small"
                          className="!h-8 !px-3 !text-[13px]"
                          onClick={() => setIsLiveFilterMenuOpen(false)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                {filteredLiveNowRows.length === 0 && (
                  <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-4 py-4 text-[13px] text-[var(--text-neutral-medium)]">
                    No employees match the selected filters.
                  </div>
                )}
                {filteredLiveNowRows.map(({ row, todayShift, status, breakDuration, assignedShiftName, hours, overtimeHours, job, manager, location, avatar }) => (
                  <div key={row.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] px-3 py-2 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar src={avatar} alt={row.name} size="small" />
                      <div>
                        <button
                          onClick={() => setActiveLiveEmployeeId(row.id)}
                          className="text-[14px] font-semibold text-[var(--color-link)] hover:underline"
                        >
                          {row.name}
                        </button>
                      {liveViewMode === 'schedule' && (
                        <p className="text-[12px] text-[var(--text-neutral-medium)]">
                          {todayShift
                            ? (todayShift.variant === 'vacation' ? 'Vacation (PTO)' : formatLiveShiftLabel(todayShift.title, assignedShiftName))
                            : 'No shift assigned today'}
                        </p>
                      )}
                        <p className="text-[12px] text-[var(--text-neutral-medium)] mt-1">{job} • {manager} • {location}</p>
                        <p className="text-[12px] text-[var(--text-neutral-medium)] mt-1">
                          Today: {formatHoursToHoursAndMinutes(hours.todayHours)} | Week: {formatHoursToHoursAndMinutes(hours.weekHours)} | OT: {formatHoursToHoursAndMinutes(overtimeHours)}
                        </p>
                        {status === 'On a Break' && (
                          <p className="text-[12px] text-amber-700 mt-1">
                            On break for {breakDuration ?? '0m'}
                          </p>
                        )}
                      </div>
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
                  requiredByDay={{ mon: 4, tue: 3, wed: 5, thu: 5 }}
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
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3">
              <p className="text-[12px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Pending PTO Requests</p>
              <p className="text-[28px] font-bold text-[var(--color-primary-strong)]">{pendingPtoRequests.length}</p>
            </div>
            <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3">
              <p className="text-[12px] uppercase tracking-wide text-[var(--text-neutral-medium)]">High Conflict Requests</p>
              <p className="text-[28px] font-bold text-amber-700">{highConflictPtoCount}</p>
            </div>
            <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3">
              <p className="text-[12px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Pending Timesheets</p>
              <p className="text-[28px] font-bold text-[var(--color-primary-strong)]">{pendingTimesheetApprovals.length}</p>
            </div>
            <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3">
              <p className="text-[12px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Overdue Timesheets</p>
              <p className="text-[28px] font-bold text-red-700">{overdueTimesheetCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.25fr] gap-4">
            <div className="rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)]">
              <div className="px-5 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                    Time Off Requests
                  </h2>
                  <p className="text-[12px] text-[var(--text-neutral-medium)]">Review and approve time off with overlap awareness.</p>
                </div>
                <span className="inline-flex items-center h-7 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] text-[12px] font-semibold text-[var(--text-neutral-strong)]">
                  {pendingPtoRequests.length} pending
                </span>
              </div>

              <div className="px-4 py-3 space-y-2 max-h-[560px] overflow-y-auto">
                {pendingPtoRequests.length === 0 && (
                  <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-4 py-4 text-[13px] text-[var(--text-neutral-medium)]">
                    No PTO requests are waiting for approval.
                  </div>
                )}

                {pendingPtoRequests.map((request) => {
                  const overlapCount = getPtoOverlapCount(request);
                  const hasConflict = overlapCount > 2;
                  return (
                    <div key={request.id} className={`rounded-[var(--radius-small)] border px-4 py-3 ${hasConflict ? 'border-amber-300 bg-amber-50/40' : 'border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)]'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold text-[var(--text-neutral-strong)]">{request.employeeName}</p>
                          <p className="text-[12px] text-[var(--text-neutral-medium)]">{request.policy} • {formatPtoWindow(request.date, request.startMinute, request.endMinute)}</p>
                          <p className="text-[12px] text-[var(--text-neutral-medium)]">Requested {request.requestedHours}h • Submitted {formatDateTimeShort(request.submittedAt)}</p>
                        </div>
                        <span className="inline-flex items-center h-7 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] text-[12px] font-semibold text-[var(--text-neutral-strong)] whitespace-nowrap">
                          {overlapCount} overlapping
                        </span>
                      </div>

                      <p className="text-[12px] text-[var(--text-neutral-medium)] mt-2">Reason: {request.reason}</p>

                      {hasConflict && (
                        <div className="mt-2 rounded-[var(--radius-x-small)] border border-amber-200 bg-amber-100/60 px-3 py-2 text-[12px] text-amber-900 flex items-start gap-2">
                          <Icon name="circle-info" size={14} className="mt-[1px]" />
                          <span>{overlapCount} other people already requested this same day/time. Consider coverage before approving.</span>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="small"
                          className="!h-8 !px-3 !text-[13px]"
                          onClick={() => setPtoRequestStatus(request.id, 'approved')}
                        >
                          Approve PTO
                        </Button>
                        <Button
                          variant="standard"
                          size="small"
                          className="!h-8 !px-3 !text-[13px]"
                          onClick={() => setPtoRequestStatus(request.id, 'denied')}
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)]">
              <div className="px-5 py-4 border-b border-[var(--border-neutral-x-weak)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                    Timesheet Approvals
                  </h2>
                  <p className="text-[12px] text-[var(--text-neutral-medium)]">Moved from Inbox: approve, deny, or drill into any employee timesheet.</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Avg pending hours</p>
                  <p className="text-[20px] font-bold text-[var(--text-neutral-strong)]">{formatHoursToHoursAndMinutes(averagePendingHours)}</p>
                </div>
              </div>

              <div className="px-4 py-3 space-y-2 max-h-[560px] overflow-y-auto">
                {timesheetApprovals.map((timesheet) => {
                  const totalHours = timesheet.regularHours + timesheet.overtimeHours;
                  const isOverdue = timesheet.status === 'pending' && new Date(timesheet.dueAt).getTime() < Date.now();
                  const statusClasses = timesheet.status === 'approved'
                    ? 'bg-[var(--surface-selected-weak)] text-[var(--color-primary-strong)] border-[var(--border-neutral-x-weak)]'
                    : timesheet.status === 'denied'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : isOverdue
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <div key={timesheet.id} className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <button
                            className="text-[15px] font-semibold text-[var(--color-link)] hover:underline"
                            onClick={() => setActiveTimesheetId(timesheet.id)}
                          >
                            {timesheet.employeeName}
                          </button>
                          <p className="text-[12px] text-[var(--text-neutral-medium)]">{timesheet.payPeriodLabel} • Submitted {formatDateTimeShort(timesheet.submittedAt)}</p>
                          <p className="text-[12px] text-[var(--text-neutral-medium)]">Due {formatDateTimeShort(timesheet.dueAt)}</p>
                        </div>
                        <span className={`inline-flex items-center h-7 px-3 rounded-[var(--radius-full)] border text-[12px] font-semibold ${statusClasses}`}>
                          {timesheet.status === 'pending' ? (isOverdue ? 'Overdue' : 'Pending') : timesheet.status === 'approved' ? 'Approved' : 'Denied'}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[13px] text-[var(--text-neutral-strong)]">
                          <span className="font-semibold">{formatHoursToHoursAndMinutes(totalHours)}</span> total
                          {timesheet.overtimeHours > 0 && <span className="text-amber-700"> • {formatHoursToHoursAndMinutes(timesheet.overtimeHours)} OT</span>}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="text"
                            size="small"
                            className="!text-[13px]"
                            onClick={() => navigate(`/my-info?tab=timesheets&employee=${timesheet.employeeId}`)}
                          >
                            Open Full Timesheet
                          </Button>
                          <Button
                            variant="standard"
                            size="small"
                            className="!h-8 !px-3 !text-[13px]"
                            onClick={() => setActiveTimesheetId(timesheet.id)}
                          >
                            View Details
                          </Button>
                          {timesheet.status === 'pending' && (
                            <>
                              <Button
                                variant="primary"
                                size="small"
                                className="!h-8 !px-3 !text-[13px]"
                                onClick={() => setTimesheetStatus(timesheet.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="standard"
                                size="small"
                                className="!h-8 !px-3 !text-[13px]"
                                onClick={() => setTimesheetStatus(timesheet.id, 'denied')}
                              >
                                Deny
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLiveEmployee && (
        <div className="fixed inset-0 z-[72] bg-black/35 flex items-center justify-center p-6">
          <div className="w-full max-w-[680px] bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] shadow-xl">
            <div className="px-6 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Live Status Snapshot</p>
                <h2 className="text-[26px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}>
                  {selectedLiveEmployee.row.name}
                </h2>
                <p className="text-[13px] text-[var(--text-neutral-medium)]">Last updated {formatTimeWithSeconds(liveStatusTimestamp)}</p>
              </div>
              <button onClick={() => setActiveLiveEmployeeId(null)} className="text-[var(--icon-neutral-strong)] hover:text-[var(--text-neutral-strong)]">
                <Icon name="xmark" size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Status</p>
                  <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">{selectedLiveEmployee.status}</p>
                </div>
                <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Location</p>
                  <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">{selectedLiveEmployee.location}</p>
                </div>
                <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Today</p>
                  <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">{formatHoursToHoursAndMinutes(selectedLiveEmployee.hours.todayHours)}</p>
                </div>
                <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Week / OT</p>
                  <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">
                    {formatHoursToHoursAndMinutes(selectedLiveEmployee.hours.weekHours)} / {formatHoursToHoursAndMinutes(selectedLiveEmployee.overtimeHours)}
                  </p>
                </div>
              </div>

              <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3">
                <p className="text-[12px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Shift</p>
                <p className="text-[14px] font-semibold text-[var(--text-neutral-strong)] mt-1">
                  {selectedLiveEmployee.todayShift
                    ? (selectedLiveEmployee.todayShift.variant === 'vacation'
                      ? 'Vacation (PTO)'
                      : formatLiveShiftLabel(selectedLiveEmployee.todayShift.title, selectedLiveEmployee.assignedShiftName))
                    : 'No shift assigned today'}
                </p>
                {selectedLiveEmployee.status === 'On a Break' && (
                  <p className="text-[12px] text-amber-700 mt-1">On break for {selectedLiveEmployee.breakDuration ?? '0m'}</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-neutral-x-weak)] flex items-center justify-between gap-2">
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/my-info?tab=timesheets&employee=${selectedLiveEmployee.row.id}`)}
              >
                Open Full Timesheet
              </Button>
              <Button variant="ghost" size="small" className="!h-9 !px-4" onClick={() => setActiveLiveEmployeeId(null)}>
                Close
              </Button>
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

      {selectedTimesheet && (
        <div className="fixed inset-0 z-[73] bg-black/35 flex items-center justify-center p-6">
          <div className="w-full max-w-[760px] bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] shadow-xl">
            <div className="px-6 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Timesheet Details</p>
                <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                  {selectedTimesheet.employeeName}
                </h2>
                <p className="text-[13px] text-[var(--text-neutral-medium)]">{selectedTimesheet.payPeriodLabel} • Due {formatDateTimeShort(selectedTimesheet.dueAt)}</p>
              </div>
              <button onClick={() => setActiveTimesheetId(null)} className="text-[var(--icon-neutral-strong)] hover:text-[var(--text-neutral-strong)]">
                <Icon name="xmark" size={18} />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] overflow-hidden">
                <div className="grid grid-cols-[90px_1fr_80px] bg-[var(--surface-neutral-xx-weak)] px-3 py-2 border-b border-[var(--border-neutral-x-weak)]">
                  <p className="text-[12px] font-semibold text-[var(--text-neutral-medium)]">Day</p>
                  <p className="text-[12px] font-semibold text-[var(--text-neutral-medium)]">Project</p>
                  <p className="text-[12px] font-semibold text-[var(--text-neutral-medium)] text-right">Hours</p>
                </div>
                <div className="max-h-[280px] overflow-y-auto">
                  {selectedTimesheet.entries.map((entry) => (
                    <div key={`${selectedTimesheet.id}-${entry.dayLabel}-${entry.project}`} className="grid grid-cols-[90px_1fr_80px] px-3 py-2 border-b last:border-b-0 border-[var(--border-neutral-xx-weak)]">
                      <p className="text-[13px] text-[var(--text-neutral-strong)]">{entry.dayLabel}</p>
                      <p className="text-[13px] text-[var(--text-neutral-strong)]">{entry.project}</p>
                      <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)] text-right">{formatHoursToHoursAndMinutes(entry.hours)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTimesheet.notes && (
                <div className="mt-3 rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2">
                  <p className="text-[12px] font-semibold text-[var(--text-neutral-medium)]">Manager Note</p>
                  <p className="text-[13px] text-[var(--text-neutral-strong)]">{selectedTimesheet.notes}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-neutral-x-weak)] flex items-center justify-between gap-2">
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/my-info?tab=timesheets&employee=${selectedTimesheet.employeeId}`)}
              >
                Open Full Timesheet
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="small" className="!h-9 !px-4" onClick={() => setActiveTimesheetId(null)}>
                  Close
                </Button>
                {selectedTimesheet.status === 'pending' && (
                  <>
                    <Button
                      variant="standard"
                      size="small"
                      className="!h-9 !px-4"
                      onClick={() => setTimesheetStatus(selectedTimesheet.id, 'denied')}
                    >
                      Deny Hours
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      className="!h-9 !px-4"
                      onClick={() => setTimesheetStatus(selectedTimesheet.id, 'approved')}
                    >
                      Approve Hours
                    </Button>
                  </>
                )}
              </div>
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
                <>
                  <Button
                    variant="standard"
                    size="small"
                    className="!h-9 !px-4"
                    onClick={handleRemoveRiskEmployeeRemainingShifts}
                    disabled={!overtimeRiskEmployee}
                  >
                    Deny OT
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    className="!h-9 !px-4"
                    onClick={() => setActiveInsightId(null)}
                    disabled={!overtimeRiskEmployee}
                  >
                    Approve OT
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeAttendance;
