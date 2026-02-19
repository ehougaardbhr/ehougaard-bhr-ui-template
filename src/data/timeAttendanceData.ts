export interface ScheduleColumn {
  id: string;
  label: string;
}

export interface ScheduleRow {
  id: string;
  name: string;
  summary: string;
  isOpenShift?: boolean;
}

export interface ShiftBlock {
  id: string;
  rowId: string;
  dayId: string;
  title: string;
  subtitle?: string;
  variant?: 'standard' | 'vacation';
  isAddShift?: boolean;
  hours?: number;
}

export const scheduleColumns: ScheduleColumn[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

export const scheduleRows: ScheduleRow[] = [
  { id: 'open-shifts', name: 'Open Shifts', summary: '0h 0m  $0.00', isOpenShift: true },
  { id: 'ben-procter', name: 'Ben Procter', summary: '0h 0m  $0.00' },
  { id: 'albert-flores', name: 'Albert Flores', summary: '16h 0m  $0.00' },
  { id: 'janet-caldwell', name: 'Janet Caldwell', summary: '0h 0m  $0.00' },
  { id: 'devon-lane', name: 'Devon Lane', summary: '0h 0m  $0.00' },
  { id: 'ronald-richards', name: 'Ronald Richards', summary: '24h 0m  $0.00' },
  { id: 'wade-warren', name: 'Wade Warren', summary: '0h 0m  $0.00' },
  { id: 'brooklyn-simmons', name: 'Brooklyn Simmons', summary: '0h 0m  $0.00' },
  { id: 'darrell-steward', name: 'Darrell Steward', summary: '0h 0m  $0.00' },
  { id: 'esther-howard', name: 'Esther Howard', summary: '0h 0m  $0.00' },
  { id: 'jenny-wilson', name: 'Jenny Wilson', summary: '0h 0m  $0.00' },
  { id: 'kristin-watson', name: 'Kristin Watson', summary: '0h 0m  $0.00' },
];

export const employeeOptions = scheduleRows.map((row) => ({ value: row.id, label: row.name }));

export const dayOptions = scheduleColumns.map((day) => ({ value: day.id, label: day.label }));

export const populatedShiftBlocks: ShiftBlock[] = [
  { id: 'add-open-mon', rowId: 'open-shifts', dayId: 'mon', title: 'Add Shift', isAddShift: true },

  { id: 'ben-mon', rowId: 'ben-procter', dayId: 'mon', title: '8:00AM-5:00PM (8h)', subtitle: 'Cashier', hours: 8 },
  { id: 'ben-wed', rowId: 'ben-procter', dayId: 'wed', title: '8:00AM-5:00PM (8h)', subtitle: 'Cashier', hours: 8 },
  { id: 'ben-fri', rowId: 'ben-procter', dayId: 'fri', title: '8:00AM-5:00PM (8h)', subtitle: 'Cashier', hours: 8 },

  { id: 'albert-mon', rowId: 'albert-flores', dayId: 'mon', title: '8:00AM-5:00PM (8h)', subtitle: 'Lead', hours: 8 },
  { id: 'albert-tue', rowId: 'albert-flores', dayId: 'tue', title: '8:00AM-5:00PM (8h)', subtitle: 'Lead', hours: 8 },
  { id: 'albert-thu', rowId: 'albert-flores', dayId: 'thu', title: '8:00AM-5:00PM (8h)', subtitle: 'Lead', hours: 8 },
  { id: 'albert-sat', rowId: 'albert-flores', dayId: 'sat', title: '8:00AM-5:00PM (8h)', subtitle: 'Lead', hours: 8 },

  { id: 'janet-tue', rowId: 'janet-caldwell', dayId: 'tue', title: '8:00AM-5:00PM (8h)', subtitle: 'Opening', hours: 8 },
  { id: 'janet-thu', rowId: 'janet-caldwell', dayId: 'thu', title: '8:00AM-5:00PM (8h)', subtitle: 'Opening', hours: 8 },
  { id: 'janet-sun', rowId: 'janet-caldwell', dayId: 'sun', title: '8:00AM-5:00PM (8h)', subtitle: 'Opening', hours: 8 },

  { id: 'devon-mon', rowId: 'devon-lane', dayId: 'mon', title: '9:00AM-6:00PM (8h)', subtitle: 'Stock', hours: 8 },
  { id: 'devon-wed', rowId: 'devon-lane', dayId: 'wed', title: '9:00AM-6:00PM (8h)', subtitle: 'Stock', hours: 8 },
  { id: 'devon-sat', rowId: 'devon-lane', dayId: 'sat', title: '9:00AM-6:00PM (8h)', subtitle: 'Stock', hours: 8 },

  { id: 'ron-mon', rowId: 'ronald-richards', dayId: 'mon', title: '8:00AM-5:00PM (8h)', subtitle: 'Manager', hours: 8 },
  { id: 'ron-tue', rowId: 'ronald-richards', dayId: 'tue', title: '8:00AM-5:00PM (8h)', subtitle: 'Manager', hours: 8 },
  { id: 'ron-wed', rowId: 'ronald-richards', dayId: 'wed', title: '8:00AM-5:00PM (8h)', subtitle: 'Manager', hours: 8 },
  { id: 'ron-thu', rowId: 'ronald-richards', dayId: 'thu', title: '8:00AM-5:00PM (8h)', subtitle: 'Manager', hours: 8 },

  { id: 'wade-vac-mon', rowId: 'wade-warren', dayId: 'mon', title: 'Vacation', variant: 'vacation' },
  { id: 'wade-vac-tue', rowId: 'wade-warren', dayId: 'tue', title: 'Vacation', variant: 'vacation' },
  { id: 'wade-vac-wed', rowId: 'wade-warren', dayId: 'wed', title: 'Vacation', variant: 'vacation' },
  { id: 'wade-fri', rowId: 'wade-warren', dayId: 'fri', title: '8:00AM-5:00PM (8h)', subtitle: 'Cashier', hours: 8 },

  { id: 'brook-tue', rowId: 'brooklyn-simmons', dayId: 'tue', title: '8:00AM-5:00PM (8h)', subtitle: 'Support', hours: 8 },
  { id: 'brook-thu', rowId: 'brooklyn-simmons', dayId: 'thu', title: '8:00AM-5:00PM (8h)', subtitle: 'Support', hours: 8 },
  { id: 'brook-sat', rowId: 'brooklyn-simmons', dayId: 'sat', title: '8:00AM-5:00PM (8h)', subtitle: 'Support', hours: 8 },

  { id: 'darrell-mon', rowId: 'darrell-steward', dayId: 'mon', title: '6:00AM-2:00PM (8h)', subtitle: 'Prep', hours: 8 },
  { id: 'darrell-wed', rowId: 'darrell-steward', dayId: 'wed', title: '6:00AM-2:00PM (8h)', subtitle: 'Prep', hours: 8 },
  { id: 'darrell-fri', rowId: 'darrell-steward', dayId: 'fri', title: '6:00AM-2:00PM (8h)', subtitle: 'Prep', hours: 8 },

  { id: 'esther-tue', rowId: 'esther-howard', dayId: 'tue', title: '10:00AM-6:00PM (7.5h)', subtitle: 'Front Desk', hours: 7.5 },
  { id: 'esther-thu', rowId: 'esther-howard', dayId: 'thu', title: '10:00AM-6:00PM (7.5h)', subtitle: 'Front Desk', hours: 7.5 },

  { id: 'jenny-mon', rowId: 'jenny-wilson', dayId: 'mon', title: '8:00AM-1:00PM (5h)', subtitle: 'Part Time', hours: 5 },
  { id: 'jenny-fri', rowId: 'jenny-wilson', dayId: 'fri', title: '8:00AM-1:00PM (5h)', subtitle: 'Part Time', hours: 5 },
  { id: 'jenny-sun', rowId: 'jenny-wilson', dayId: 'sun', title: '8:00AM-1:00PM (5h)', subtitle: 'Part Time', hours: 5 },

  { id: 'kristin-tue', rowId: 'kristin-watson', dayId: 'tue', title: '12:00PM-8:00PM (8h)', subtitle: 'Closing', hours: 8 },
  { id: 'kristin-wed', rowId: 'kristin-watson', dayId: 'wed', title: '12:00PM-8:00PM (8h)', subtitle: 'Closing', hours: 8 },
  { id: 'kristin-sat', rowId: 'kristin-watson', dayId: 'sat', title: '12:00PM-8:00PM (8h)', subtitle: 'Closing', hours: 8 },
];
