// Mock data for the manager-facing Team Time-Off heatmap calendar.
// Front-end prototype only — no fetching. Shape mirrors other data modules
// (exported interfaces + const arrays).

export type LeaveType = 'Vacation' | 'Sick' | 'Personal';
export type TimeOffStatus = 'approved' | 'pending';

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface TimeOffEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarUrl: string;
  leaveType: LeaveType;
  /** ISO date, YYYY-MM-DD (all-day absence for the prototype) */
  date: string;
  status: TimeOffStatus;
}

// ~10 direct reports. Names + pravatar avatars match the roster used elsewhere
// in the prototype (People directory / inline PTO data).
export const team: TeamMember[] = [
  { id: 'devon-lane', name: 'Devon Lane', avatarUrl: 'https://i.pravatar.cc/150?img=12' },
  { id: 'wade-warren', name: 'Wade Warren', avatarUrl: 'https://i.pravatar.cc/150?img=13' },
  { id: 'jenny-wilson', name: 'Jenny Wilson', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: 'brooklyn-simmons', name: 'Brooklyn Simmons', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
  { id: 'albert-flores', name: 'Albert Flores', avatarUrl: 'https://i.pravatar.cc/150?img=33' },
  { id: 'darrell-steward', name: 'Darrell Steward', avatarUrl: 'https://i.pravatar.cc/150?img=52' },
  { id: 'esther-howard', name: 'Esther Howard', avatarUrl: 'https://i.pravatar.cc/150?img=45' },
  { id: 'janet-caldwell', name: 'Janet Caldwell', avatarUrl: 'https://i.pravatar.cc/150?img=25' },
  { id: 'kristin-watson', name: 'Kristin Watson', avatarUrl: 'https://i.pravatar.cc/150?img=48' },
  { id: 'marcus-bell', name: 'Marcus Bell', avatarUrl: 'https://i.pravatar.cc/150?img=68' },
];

const byId = Object.fromEntries(team.map((m) => [m.id, m])) as Record<string, TeamMember>;

// Small helper so entries stay terse and always carry the right name/avatar.
function entry(
  id: string,
  employeeId: string,
  leaveType: LeaveType,
  date: string,
  status: TimeOffStatus,
): TimeOffEntry {
  const member = byId[employeeId];
  return { id, employeeId, employeeName: member.name, avatarUrl: member.avatarUrl, leaveType, date, status };
}

// Time off across Feb–Apr 2026. March is deliberately dense with several
// overlapping days, days over the 25% threshold, and a mix of approved/pending.
// The "incoming request" (below) lands on Mar 12, which is already at 20%.
export const timeOffEntries: TimeOffEntry[] = [
  // ── February 2026 ──
  entry('tto-1', 'devon-lane', 'Vacation', '2026-02-24', 'approved'),
  entry('tto-2', 'wade-warren', 'Personal', '2026-02-24', 'approved'),
  entry('tto-3', 'jenny-wilson', 'Vacation', '2026-02-25', 'approved'),
  entry('tto-4', 'brooklyn-simmons', 'Sick', '2026-02-25', 'approved'),
  entry('tto-5', 'albert-flores', 'Vacation', '2026-02-25', 'approved'), // 30% — over threshold
  entry('tto-6', 'kristin-watson', 'Personal', '2026-02-26', 'pending'),

  // ── March 2026 ──
  entry('tto-7', 'darrell-steward', 'Vacation', '2026-03-03', 'approved'), // 10%
  entry('tto-8', 'esther-howard', 'Vacation', '2026-03-04', 'approved'),
  entry('tto-9', 'janet-caldwell', 'Personal', '2026-03-04', 'approved'), // 20%
  entry('tto-10', 'wade-warren', 'Sick', '2026-03-05', 'pending'),

  entry('tto-11', 'devon-lane', 'Vacation', '2026-03-10', 'approved'),
  entry('tto-12', 'jenny-wilson', 'Vacation', '2026-03-10', 'approved'),
  entry('tto-13', 'kristin-watson', 'Personal', '2026-03-10', 'approved'), // 30% — over threshold

  entry('tto-14', 'brooklyn-simmons', 'Sick', '2026-03-11', 'approved'),
  entry('tto-15', 'albert-flores', 'Vacation', '2026-03-11', 'approved'), // 20% approved
  entry('tto-16', 'darrell-steward', 'Vacation', '2026-03-11', 'pending'),
  entry('tto-17', 'wade-warren', 'Personal', '2026-03-11', 'pending'), // potential 40%

  // Spotlight day — Mar 12: 20% approved already; incoming pending pushes it over.
  entry('tto-18', 'esther-howard', 'Vacation', '2026-03-12', 'approved'),
  entry('tto-19', 'janet-caldwell', 'Vacation', '2026-03-12', 'approved'), // 20% approved
  entry('tto-incoming', 'marcus-bell', 'Vacation', '2026-03-12', 'pending'), // → 30% if approved

  entry('tto-20', 'devon-lane', 'Vacation', '2026-03-17', 'approved'),
  entry('tto-21', 'wade-warren', 'Vacation', '2026-03-17', 'approved'),
  entry('tto-22', 'jenny-wilson', 'Personal', '2026-03-17', 'approved'),
  entry('tto-23', 'brooklyn-simmons', 'Vacation', '2026-03-17', 'approved'), // 40% — over threshold

  entry('tto-24', 'albert-flores', 'Sick', '2026-03-18', 'approved'),
  entry('tto-25', 'kristin-watson', 'Vacation', '2026-03-18', 'pending'),

  entry('tto-26', 'darrell-steward', 'Personal', '2026-03-24', 'approved'),
  entry('tto-27', 'esther-howard', 'Vacation', '2026-03-24', 'approved'), // 20%

  // Peak day — 50% out.
  entry('tto-28', 'devon-lane', 'Vacation', '2026-03-25', 'approved'),
  entry('tto-29', 'jenny-wilson', 'Vacation', '2026-03-25', 'approved'),
  entry('tto-30', 'brooklyn-simmons', 'Personal', '2026-03-25', 'approved'),
  entry('tto-31', 'janet-caldwell', 'Vacation', '2026-03-25', 'approved'),
  entry('tto-32', 'marcus-bell', 'Vacation', '2026-03-25', 'approved'), // 50% — well over threshold

  entry('tto-33', 'wade-warren', 'Personal', '2026-03-26', 'pending'),

  // ── April 2026 ──
  entry('tto-34', 'kristin-watson', 'Vacation', '2026-04-01', 'approved'),
  entry('tto-35', 'albert-flores', 'Personal', '2026-04-01', 'approved'), // 20%
  entry('tto-36', 'devon-lane', 'Sick', '2026-04-02', 'pending'),
  entry('tto-37', 'jenny-wilson', 'Vacation', '2026-04-07', 'approved'),
  entry('tto-38', 'brooklyn-simmons', 'Vacation', '2026-04-07', 'approved'),
  entry('tto-39', 'darrell-steward', 'Vacation', '2026-04-07', 'approved'), // 30% — over threshold
  entry('tto-40', 'esther-howard', 'Personal', '2026-04-08', 'pending'),
  entry('tto-41', 'janet-caldwell', 'Vacation', '2026-04-08', 'pending'),
];

// The single simulated incoming request the manager reviews (the "approval moment").
// It already exists in timeOffEntries as pending on Mar 12.
export const incomingRequestId = 'tto-incoming';

// The month the calendar opens on (March 2026 has the richest data).
export const defaultViewYear = 2026;
export const defaultViewMonth = 2; // 0-indexed: March
