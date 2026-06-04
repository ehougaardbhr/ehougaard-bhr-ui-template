export type FlagType = 'break-violation' | 'unapproved-ot' | 'missed-punch';
export type AgentApprovalStatus = 'pending' | 'approved' | 'overdue' | 'auto-approved';
export type CorrectionStatus = 'pending' | 'approved' | 'denied';

export interface TimesheetFlag {
  id: string;
  type: FlagType;
  severity: 'compliance' | 'cost' | 'data-quality';
  day: string;
  description: string;
  suggestedFix: string;
}

export interface TimesheetDayEntry {
  day: string;
  clockIn: string;
  clockOut: string;
  breakMinutes: number;
  regularHours: number;
  flagId?: string;
}

export interface ManagerTimesheetRow {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl: string;
  payPeriod: string;
  regularHours: number;
  overtimeHours: number;
  flags: TimesheetFlag[];
  status: AgentApprovalStatus;
  entries: TimesheetDayEntry[];
}

export interface AutoApprovedRow {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl: string;
  payPeriod: string;
  totalHours: number;
  approvedAt: string;
}

export interface CorrectionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl: string;
  submittedAt: string;
  day: string;
  issue: string;
  requestedFix: string;
  status: CorrectionStatus;
}

export interface AgentInsight {
  id: string;
  text: string;
  actionLabel: string;
  actionTarget: 'flags' | 'corrections' | 'bulk-approve';
}

export const agentInsights: AgentInsight[] = [
  {
    id: 'insight-ot',
    text: '3 employees are trending toward unapproved overtime this pay period.',
    actionLabel: 'View flagged timesheets',
    actionTarget: 'flags',
  },
  {
    id: 'insight-correction',
    text: 'Janet Caldwell submitted a correction request for a missed punch on Tuesday.',
    actionLabel: 'Review correction',
    actionTarget: 'corrections',
  },
  {
    id: 'insight-bulk',
    text: '5 timesheets were automatically approved — no issues found.',
    actionLabel: 'View auto-approved',
    actionTarget: 'bulk-approve',
  },
];

export const autoApprovedRows: AutoApprovedRow[] = [
  {
    id: 'auto-1',
    employeeId: 'devon-lane',
    employeeName: 'Devon Lane',
    avatarUrl: 'https://i.pravatar.cc/120?img=52',
    payPeriod: 'Jun 1–15',
    totalHours: 40.0,
    approvedAt: '2026-06-03T08:02:00.000Z',
  },
  {
    id: 'auto-2',
    employeeId: 'wade-warren',
    employeeName: 'Wade Warren',
    avatarUrl: 'https://i.pravatar.cc/120?img=59',
    payPeriod: 'Jun 1–15',
    totalHours: 38.5,
    approvedAt: '2026-06-03T08:02:00.000Z',
  },
  {
    id: 'auto-3',
    employeeId: 'brooklyn-simmons',
    employeeName: 'Brooklyn Simmons',
    avatarUrl: 'https://i.pravatar.cc/120?img=47',
    payPeriod: 'Jun 1–15',
    totalHours: 36.0,
    approvedAt: '2026-06-03T08:03:00.000Z',
  },
  {
    id: 'auto-4',
    employeeId: 'jenny-wilson',
    employeeName: 'Jenny Wilson',
    avatarUrl: 'https://i.pravatar.cc/120?img=38',
    payPeriod: 'Jun 1–15',
    totalHours: 32.0,
    approvedAt: '2026-06-03T08:03:00.000Z',
  },
  {
    id: 'auto-5',
    employeeId: 'kristin-watson',
    employeeName: 'Kristin Watson',
    avatarUrl: 'https://i.pravatar.cc/120?img=26',
    payPeriod: 'Jun 1–15',
    totalHours: 39.25,
    approvedAt: '2026-06-03T08:04:00.000Z',
  },
];

export const managerTimesheets: ManagerTimesheetRow[] = [
  {
    id: 'mts-1',
    employeeId: 'ben-procter',
    employeeName: 'Ben Procter',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
    payPeriod: 'Jun 1–15',
    regularHours: 40.0,
    overtimeHours: 3.5,
    status: 'pending',
    flags: [
      {
        id: 'f1',
        type: 'unapproved-ot',
        severity: 'cost',
        day: 'Thursday',
        description: 'Clocked out at 7:32 PM — 3.5 hrs over the 40-hr weekly threshold.',
        suggestedFix: 'Mark 3.5 hrs as approved overtime for this pay period.',
      },
    ],
    entries: [
      { day: 'Mon', clockIn: '8:00 AM', clockOut: '4:30 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Tue', clockIn: '7:55 AM', clockOut: '4:28 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Wed', clockIn: '8:01 AM', clockOut: '4:31 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Thu', clockIn: '8:00 AM', clockOut: '7:32 PM', breakMinutes: 30, regularHours: 8.0, flagId: 'f1' },
      { day: 'Fri', clockIn: '8:02 AM', clockOut: '4:32 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Sat', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
      { day: 'Sun', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
    ],
  },
  {
    id: 'mts-2',
    employeeId: 'albert-flores',
    employeeName: 'Albert Flores',
    avatarUrl: 'https://i.pravatar.cc/120?img=15',
    payPeriod: 'Jun 1–15',
    regularHours: 40.0,
    overtimeHours: 1.4,
    status: 'pending',
    flags: [
      {
        id: 'f2',
        type: 'unapproved-ot',
        severity: 'cost',
        day: 'Tuesday',
        description: '1.4 hrs of overtime logged without prior approval.',
        suggestedFix: 'Approve or trim the Tuesday shift to 8 hrs.',
      },
    ],
    entries: [
      { day: 'Mon', clockIn: '7:45 AM', clockOut: '4:15 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Tue', clockIn: '7:50 AM', clockOut: '5:38 PM', breakMinutes: 30, regularHours: 8.0, flagId: 'f2' },
      { day: 'Wed', clockIn: '8:00 AM', clockOut: '4:30 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Thu', clockIn: '8:00 AM', clockOut: '4:30 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Fri', clockIn: '7:58 AM', clockOut: '4:28 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Sat', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
      { day: 'Sun', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
    ],
  },
  {
    id: 'mts-3',
    employeeId: 'janet-caldwell',
    employeeName: 'Janet Caldwell',
    avatarUrl: 'https://i.pravatar.cc/120?img=32',
    payPeriod: 'Jun 1–15',
    regularHours: 30.0,
    overtimeHours: 0,
    status: 'pending',
    flags: [
      {
        id: 'f3',
        type: 'missed-punch',
        severity: 'data-quality',
        day: 'Tuesday',
        description: 'No clock-out recorded on Tuesday. Hours are estimated.',
        suggestedFix: 'Employee submitted a correction: clock-out was 4:30 PM.',
      },
    ],
    entries: [
      { day: 'Mon', clockIn: '8:00 AM', clockOut: '4:30 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Tue', clockIn: '8:05 AM', clockOut: '—', breakMinutes: 0, regularHours: 0, flagId: 'f3' },
      { day: 'Wed', clockIn: '8:00 AM', clockOut: '4:30 PM', breakMinutes: 30, regularHours: 7.0 },
      { day: 'Thu', clockIn: '8:02 AM', clockOut: '4:32 PM', breakMinutes: 30, regularHours: 7.5 },
      { day: 'Fri', clockIn: '8:01 AM', clockOut: '4:01 PM', breakMinutes: 30, regularHours: 7.5 },
      { day: 'Sat', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
      { day: 'Sun', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
    ],
  },
  {
    id: 'mts-4',
    employeeId: 'ronald-richards',
    employeeName: 'Ronald Richards',
    avatarUrl: 'https://i.pravatar.cc/120?img=56',
    payPeriod: 'Jun 1–15',
    regularHours: 40.0,
    overtimeHours: 0,
    status: 'pending',
    flags: [
      {
        id: 'f4',
        type: 'break-violation',
        severity: 'compliance',
        day: 'Wednesday',
        description: 'Break recorded as 18 minutes — policy requires a minimum of 30 minutes.',
        suggestedFix: 'Log 30-minute break and adjust hours accordingly.',
      },
    ],
    entries: [
      { day: 'Mon', clockIn: '7:30 AM', clockOut: '4:00 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Tue', clockIn: '7:30 AM', clockOut: '4:00 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Wed', clockIn: '7:30 AM', clockOut: '3:48 PM', breakMinutes: 18, regularHours: 8.0, flagId: 'f4' },
      { day: 'Thu', clockIn: '7:28 AM', clockOut: '3:58 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Fri', clockIn: '7:30 AM', clockOut: '4:00 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Sat', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
      { day: 'Sun', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
    ],
  },
  {
    id: 'mts-5',
    employeeId: 'darrell-steward',
    employeeName: 'Darrell Steward',
    avatarUrl: 'https://i.pravatar.cc/120?img=61',
    payPeriod: 'Jun 1–15',
    regularHours: 38.0,
    overtimeHours: 0,
    status: 'overdue',
    flags: [
      {
        id: 'f5',
        type: 'break-violation',
        severity: 'compliance',
        day: 'Monday',
        description: 'No break recorded during a 9-hour shift.',
        suggestedFix: 'Add a 30-minute unpaid break to the Monday entry.',
      },
      {
        id: 'f6',
        type: 'missed-punch',
        severity: 'data-quality',
        day: 'Friday',
        description: 'Clock-in on Friday is missing.',
        suggestedFix: 'Employee reports clock-in was 7:45 AM.',
      },
    ],
    entries: [
      { day: 'Mon', clockIn: '7:00 AM', clockOut: '4:00 PM', breakMinutes: 0, regularHours: 9.0, flagId: 'f5' },
      { day: 'Tue', clockIn: '7:00 AM', clockOut: '3:30 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Wed', clockIn: '7:00 AM', clockOut: '3:30 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Thu', clockIn: '7:00 AM', clockOut: '3:30 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Fri', clockIn: '—', clockOut: '3:45 PM', breakMinutes: 30, regularHours: 5.0, flagId: 'f6' },
      { day: 'Sat', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
      { day: 'Sun', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
    ],
  },
  {
    id: 'mts-6',
    employeeId: 'esther-howard',
    employeeName: 'Esther Howard',
    avatarUrl: 'https://i.pravatar.cc/120?img=45',
    payPeriod: 'Jun 1–15',
    regularHours: 40.0,
    overtimeHours: 2.5,
    status: 'pending',
    flags: [
      {
        id: 'f7',
        type: 'unapproved-ot',
        severity: 'cost',
        day: 'Thursday & Friday',
        description: '2.5 hrs of overtime accumulated across Thursday and Friday without manager approval.',
        suggestedFix: 'Approve or deny overtime hours before closing the pay period.',
      },
    ],
    entries: [
      { day: 'Mon', clockIn: '8:30 AM', clockOut: '5:00 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Tue', clockIn: '8:30 AM', clockOut: '5:00 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Wed', clockIn: '8:30 AM', clockOut: '5:00 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Thu', clockIn: '8:30 AM', clockOut: '6:30 PM', breakMinutes: 30, regularHours: 8.0, flagId: 'f7' },
      { day: 'Fri', clockIn: '8:30 AM', clockOut: '6:00 PM', breakMinutes: 30, regularHours: 8.0 },
      { day: 'Sat', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
      { day: 'Sun', clockIn: '—', clockOut: '—', breakMinutes: 0, regularHours: 0 },
    ],
  },
];

export const correctionRequests: CorrectionRequest[] = [
  {
    id: 'cr-1',
    employeeId: 'janet-caldwell',
    employeeName: 'Janet Caldwell',
    avatarUrl: 'https://i.pravatar.cc/120?img=32',
    submittedAt: '2026-06-03T09:14:00.000Z',
    day: 'Tuesday, Jun 3',
    issue: "I forgot to clock out at the end of my shift. The system shows no clock-out for Tuesday.",
    requestedFix: 'My clock-out was 4:30 PM. Please add it so my hours are correct.',
    status: 'pending',
  },
  {
    id: 'cr-2',
    employeeId: 'darrell-steward',
    employeeName: 'Darrell Steward',
    avatarUrl: 'https://i.pravatar.cc/120?img=61',
    submittedAt: '2026-06-03T11:42:00.000Z',
    day: 'Friday, Jun 7',
    issue: "The kiosk was frozen when I arrived on Friday morning so I couldn't clock in.",
    requestedFix: 'Please add a clock-in of 7:45 AM for Friday, Jun 7.',
    status: 'pending',
  },
  {
    id: 'cr-3',
    employeeId: 'brooklyn-simmons',
    employeeName: 'Brooklyn Simmons',
    avatarUrl: 'https://i.pravatar.cc/120?img=47',
    submittedAt: '2026-06-02T14:22:00.000Z',
    day: 'Wednesday, Jun 4',
    issue: "I was out sick on Wednesday but it was recorded as regular time. It should be a sick day.",
    requestedFix: 'Convert Wednesday, Jun 4 from 8 hrs regular to 8 hrs sick leave.',
    status: 'pending',
  },
];
