export interface TimesheetEntry {
  id: string;
  label: string;
  sublabel?: string;
  type?: 'regular' | 'pto' | 'sick';
}

export interface TimesheetDay {
  id: string;
  dayLabel: string;
  dateLabel: string;
  durationLabel: string;
  timeRangeLabel?: string;
  entries: TimesheetEntry[];
  isEditable: boolean;
}

export interface VitalsSection {
  id: string;
  title: string;
  rows: string[];
}

export interface TimesheetPageData {
  employeeName: string;
  employeeTitle: string;
  periodLabel: string;
  payPeriodLabel: string;
  timesheetTitle: string;
  tabs: string[];
  activeTab: string;
  vitalsSections: VitalsSection[];
  days: TimesheetDay[];
}

export interface ClockWidgetData {
  status: 'clocked-in' | 'clocked-out';
  todayTotalLabel: string;
  clockMetaLabel: string;
  weekTotalLabel: string;
  weekRangeLabel: string;
  payPeriodHoursLabel: string;
  payPeriodRangeLabel: string;
  paidHoursLabel: string;
  mealBreaksLabel: string;
  approvalLabel: string;
}

export const timesheetPageData: TimesheetPageData = {
  employeeName: 'Ethan Hougaard',
  employeeTitle: 'Sr. HR Administrator',
  periodLabel: 'Feb 1-15',
  payPeriodLabel: 'This Pay Period',
  timesheetTitle: 'Timesheet',
  tabs: ['Personal', 'Job', 'Time Off', 'Documents', 'Timesheet', 'Benefits', 'Performance', 'Training', 'Assets', 'Notes', 'More'],
  activeTab: 'Timesheet',
  vitalsSections: [
    {
      id: 'vitals',
      title: 'Vitals',
      rows: [
        '801-724-6600 x 123',
        '801-724-6600',
        'ehougaard+demo@bamboohr.com',
        '11:11 AM local time',
        'Salt Lake City, Utah',
        'Sr. HR Administrator',
        'Full-Time',
        'Operations',
        'North America',
        '# 5',
      ],
    },
    {
      id: 'hire-date',
      title: 'Hire Date',
      rows: ['Oct 13, 2022', '3y - 4m'],
    },
    {
      id: 'direct-reports',
      title: 'Direct Reports',
      rows: ['Maja Andev', 'Eric Asture', 'Cheryl Barnet', 'Jake Bryan', 'Jennifer Caldwell', '5 More...', 'View in org chart'],
    },
  ],
  days: [
    {
      id: 'mon',
      dayLabel: 'Mon',
      dateLabel: 'Jan 26',
      durationLabel: '0h 59m',
      timeRangeLabel: '2:57 PM - 3:56 PM',
      entries: [
        { id: 'mon-1', label: 'Payroll adjustment review', sublabel: 'Regular time', type: 'regular' },
        { id: 'mon-2', label: 'Case follow-up', sublabel: 'Regular time', type: 'regular' },
      ],
      isEditable: true,
    },
    {
      id: 'tue',
      dayLabel: 'Tue',
      dateLabel: 'Jan 27',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'wed',
      dayLabel: 'Wed',
      dateLabel: 'Jan 28',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: false,
    },
    {
      id: 'thu',
      dayLabel: 'Thu',
      dateLabel: 'Jan 29',
      durationLabel: '0h 09m',
      timeRangeLabel: '2:54 PM - 3:03 PM',
      entries: [
        { id: 'thu-1', label: '8 hours Vacation', type: 'pto' },
      ],
      isEditable: false,
    },
    {
      id: 'fri',
      dayLabel: 'Fri',
      dateLabel: 'Jan 30',
      durationLabel: '0h 00m',
      entries: [
        { id: 'fri-1', label: '16 hours Sick', type: 'sick' },
        { id: 'fri-2', label: '8 hours Sick', type: 'sick' },
      ],
      isEditable: true,
    },
    {
      id: 'sat',
      dayLabel: 'Sat',
      dateLabel: 'Jan 31',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: false,
    },
    {
      id: 'sun-feb-1',
      dayLabel: 'Sun',
      dateLabel: 'Feb 1',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: false,
    },
    {
      id: 'mon-feb-2',
      dayLabel: 'Mon',
      dateLabel: 'Feb 2',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'tue-feb-3',
      dayLabel: 'Tue',
      dateLabel: 'Feb 3',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'wed-feb-4',
      dayLabel: 'Wed',
      dateLabel: 'Feb 4',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'thu-feb-5',
      dayLabel: 'Thu',
      dateLabel: 'Feb 5',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'fri-feb-6',
      dayLabel: 'Fri',
      dateLabel: 'Feb 6',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'sat-feb-7',
      dayLabel: 'Sat',
      dateLabel: 'Feb 7',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: false,
    },
    {
      id: 'sun-feb-8',
      dayLabel: 'Sun',
      dateLabel: 'Feb 8',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: false,
    },
    {
      id: 'mon-feb-9',
      dayLabel: 'Mon',
      dateLabel: 'Feb 9',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'tue-feb-10',
      dayLabel: 'Tue',
      dateLabel: 'Feb 10',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'wed-feb-11',
      dayLabel: 'Wed',
      dateLabel: 'Feb 11',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'thu-feb-12',
      dayLabel: 'Thu',
      dateLabel: 'Feb 12',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'fri-feb-13',
      dayLabel: 'Fri',
      dateLabel: 'Feb 13',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: true,
    },
    {
      id: 'sat-feb-14',
      dayLabel: 'Sat',
      dateLabel: 'Feb 14',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: false,
    },
    {
      id: 'sun-feb-15',
      dayLabel: 'Sun',
      dateLabel: 'Feb 15',
      durationLabel: '0h 00m',
      entries: [],
      isEditable: false,
    },
  ],
};

export const initialClockWidgetData: ClockWidgetData = {
  status: 'clocked-out',
  todayTotalLabel: '0h 00m Today',
  clockMetaLabel: 'Clocked Out: Yesterday at 1:18 PM',
  weekTotalLabel: '0h 00m',
  weekRangeLabel: 'Feb 9 - 15 (2 days left)',
  payPeriodHoursLabel: '71h 07m',
  payPeriodRangeLabel: 'Feb 1 - 15 (2 days left)',
  paidHoursLabel: '71h 07m REG',
  mealBreaksLabel: '68h Paid',
  approvalLabel: 'Will be sent for approval on Feb 16',
};

interface EmployeeTimesheetProfile {
  id: string;
  name: string;
  title: string;
}

const employeeTimesheetProfiles: EmployeeTimesheetProfile[] = [
  { id: 'ben-procter', name: 'Ben Procter', title: 'Shift Supervisor' },
  { id: 'albert-flores', name: 'Albert Flores', title: 'Warehouse Associate' },
  { id: 'janet-caldwell', name: 'Janet Caldwell', title: 'Store Manager' },
  { id: 'devon-lane', name: 'Devon Lane', title: 'Operations Coordinator' },
  { id: 'ronald-richards', name: 'Ronald Richards', title: 'Regional Manager' },
  { id: 'wade-warren', name: 'Wade Warren', title: 'Sales Associate' },
  { id: 'brooklyn-simmons', name: 'Brooklyn Simmons', title: 'Customer Support Rep' },
  { id: 'darrell-steward', name: 'Darrell Steward', title: 'Inventory Specialist' },
  { id: 'esther-howard', name: 'Esther Howard', title: 'Front Desk Coordinator' },
  { id: 'jenny-wilson', name: 'Jenny Wilson', title: 'Part-Time Cashier' },
  { id: 'kristin-watson', name: 'Kristin Watson', title: 'Closing Lead' },
];

const dayTemplate = [
  { id: 'mon-mar-2', dayLabel: 'Mon', dateLabel: 'Mar 2' },
  { id: 'tue-mar-3', dayLabel: 'Tue', dateLabel: 'Mar 3' },
  { id: 'wed-mar-4', dayLabel: 'Wed', dateLabel: 'Mar 4' },
  { id: 'thu-mar-5', dayLabel: 'Thu', dateLabel: 'Mar 5' },
  { id: 'fri-mar-6', dayLabel: 'Fri', dateLabel: 'Mar 6' },
  { id: 'sat-mar-7', dayLabel: 'Sat', dateLabel: 'Mar 7' },
  { id: 'sun-mar-8', dayLabel: 'Sun', dateLabel: 'Mar 8' },
  { id: 'mon-mar-9', dayLabel: 'Mon', dateLabel: 'Mar 9' },
  { id: 'tue-mar-10', dayLabel: 'Tue', dateLabel: 'Mar 10' },
  { id: 'wed-mar-11', dayLabel: 'Wed', dateLabel: 'Mar 11' },
  { id: 'thu-mar-12', dayLabel: 'Thu', dateLabel: 'Mar 12' },
  { id: 'fri-mar-13', dayLabel: 'Fri', dateLabel: 'Mar 13' },
  { id: 'sat-mar-14', dayLabel: 'Sat', dateLabel: 'Mar 14' },
  { id: 'sun-mar-15', dayLabel: 'Sun', dateLabel: 'Mar 15' },
];

const taskPool = [
  'Front desk coverage',
  'Order reconciliation',
  'Inventory cycle count',
  'Payroll adjustments',
  'Customer escalation support',
  'Closing handoff prep',
  'Team standup + planning',
  'Schedule cleanup',
];

function formatDuration(hours: number) {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return `${whole}h ${String(minutes).padStart(2, '0')}m`;
}

function createDaysForEmployee(seed: number): TimesheetDay[] {
  return dayTemplate.map((day, index) => {
    const isWeekend = day.dayLabel === 'Sat' || day.dayLabel === 'Sun';
    const baseHours = isWeekend ? 0 : [8, 8, 7.5, 8, 6.5][(seed + index) % 5];
    const shouldUsePto = !isWeekend && ((seed + index) % 11 === 0);
    const shouldUseSick = !isWeekend && ((seed + index) % 13 === 0);

    let entries: TimesheetEntry[] = [];
    let timeRangeLabel: string | undefined;

    if (baseHours > 0) {
      if (shouldUsePto) {
        entries = [{ id: `${day.id}-pto`, label: '8 hours Vacation', type: 'pto' }];
      } else if (shouldUseSick) {
        entries = [{ id: `${day.id}-sick`, label: '8 hours Sick', type: 'sick' }];
      } else {
        const taskA = taskPool[(seed + index) % taskPool.length];
        const taskB = taskPool[(seed + index + 2) % taskPool.length];
        entries = [
          { id: `${day.id}-a`, label: taskA, sublabel: 'Regular time', type: 'regular' },
          { id: `${day.id}-b`, label: taskB, sublabel: 'Regular time', type: 'regular' },
        ];
      }
      const startHour = 8 + ((seed + index) % 2);
      timeRangeLabel = `${startHour}:00 AM - ${startHour + 8}:00 PM`;
    }

    return {
      id: day.id,
      dayLabel: day.dayLabel,
      dateLabel: day.dateLabel,
      durationLabel: formatDuration(baseHours),
      timeRangeLabel,
      entries,
      isEditable: !isWeekend,
    };
  });
}

function createClockDataForEmployee(seed: number): ClockWidgetData {
  const isClockedIn = seed % 3 !== 0;
  return {
    ...initialClockWidgetData,
    status: isClockedIn ? 'clocked-in' : 'clocked-out',
    todayTotalLabel: isClockedIn ? `${4 + (seed % 4)}h 2${seed % 6}m Today` : `${seed % 2}h 3${seed % 6}m Today`,
    clockMetaLabel: isClockedIn ? `Clocked In: ${8 + (seed % 3)}:${seed % 6}5 AM` : `Clocked Out: ${4 + (seed % 3)}:${seed % 6}1 PM`,
    weekTotalLabel: `${34 + seed}h ${seed % 6}0m`,
    payPeriodHoursLabel: `${68 + seed}h ${seed % 6}5m`,
    paidHoursLabel: `${68 + seed}h ${seed % 6}5m REG`,
  };
}

export const employeeTimesheetDataById: Record<string, { pageData: TimesheetPageData; clockData: ClockWidgetData }> =
  employeeTimesheetProfiles.reduce((acc, profile, index) => {
    acc[profile.id] = {
      pageData: {
        ...timesheetPageData,
        employeeName: profile.name,
        employeeTitle: profile.title,
        timesheetTitle: `${profile.name.split(' ')[0]}'s Timesheet`,
        days: createDaysForEmployee(index),
      },
      clockData: createClockDataForEmployee(index),
    };
    return acc;
  }, {} as Record<string, { pageData: TimesheetPageData; clockData: ClockWidgetData }>);

export function getEmployeeTimesheetDataset(employeeId?: string) {
  if (employeeId && employeeTimesheetDataById[employeeId]) {
    return {
      employeeId,
      ...employeeTimesheetDataById[employeeId],
    };
  }

  return {
    employeeId: 'default',
    pageData: timesheetPageData,
    clockData: initialClockWidgetData,
  };
}
