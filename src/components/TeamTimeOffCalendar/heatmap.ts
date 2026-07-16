// Pure helpers + shared types for the Team Time-Off heatmap.
// Kept separate from the components so both the cell and the orchestrator can
// import them without a circular dependency.

import type { TimeOffEntry } from '../../data/teamTimeOffData';

export interface DayData {
  /** YYYY-MM-DD */
  dateKey: string;
  day: number;
  /** day of week, 0 = Sunday */
  dow: number;
  isWeekend: boolean;
  isToday: boolean;
  approved: TimeOffEntry[];
  pending: TimeOffEntry[];
  /** fraction of the team out with APPROVED time off (drives the fill) */
  approvedPct: number;
  /** fraction out if all pending were also approved */
  potentialPct: number;
  /** 0–4 shade step, based on approvedPct */
  step: number;
  /** approved density already over the threshold */
  overThreshold: boolean;
  /** approved is under, but approving the pending would cross the threshold */
  becomesOverThreshold: boolean;
}

// Monochrome BambooHR green ramp, 5 steps.
// step 0 = nobody out (rendered as a plain surface, no fill).
// steps 1–4 interpolate --color-primary-weak (#f0f9ed) → --color-primary-strong (#2e7918).
export const SHADES: { bg: string; dark: boolean }[] = [
  { bg: 'transparent', dark: false }, // 0 — no one out
  { bg: '#e2f1da', dark: false },     // 1 — light
  { bg: '#b7dda6', dark: false },     // 2 — moderate
  { bg: '#6bb84e', dark: true },      // 3 — high
  { bg: '#2e7918', dark: true },      // 4 — very high
];

/** Map a fraction-out (0–1) to a 0–4 shade step. */
export function stepForPct(pct: number): number {
  if (pct <= 0) return 0;
  if (pct <= 0.1) return 1;
  if (pct <= 0.2) return 2;
  if (pct <= 0.35) return 3;
  return 4;
}

export function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function monthLabel(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** Format a YYYY-MM-DD key as e.g. "Thu, Mar 12". */
export function formatDayLong(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Build the visible month as an array of weeks (each 7 cells), with leading/
 * trailing nulls so the grid aligns to a Sunday start. `null` = padding cell.
 */
export function buildMonthGrid(
  viewDate: Date,
  entries: TimeOffEntry[],
  teamSize: number,
  threshold: number,
): (DayData | null)[][] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  // Group this month's entries by date key.
  const byDate = new Map<string, TimeOffEntry[]>();
  for (const e of entries) {
    if (!byDate.has(e.date)) byDate.set(e.date, []);
    byDate.get(e.date)!.push(e);
  }

  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const cells: (DayData | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(year, month, day);
    const dayEntries = byDate.get(key) ?? [];
    const approved = dayEntries.filter((e) => e.status === 'approved');
    const pending = dayEntries.filter((e) => e.status === 'pending');
    const approvedPct = approved.length / teamSize;
    const potentialPct = (approved.length + pending.length) / teamSize;
    const dow = new Date(year, month, day).getDay();

    cells.push({
      dateKey: key,
      day,
      dow,
      isWeekend: dow === 0 || dow === 6,
      isToday: key === todayKey,
      approved,
      pending,
      approvedPct,
      potentialPct,
      step: stepForPct(approvedPct),
      overThreshold: approvedPct > threshold,
      becomesOverThreshold: approvedPct <= threshold && potentialPct > threshold,
    });
  }

  // Pad the final week to a multiple of 7.
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (DayData | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const LEAVE_CHIP_CLASSES: Record<string, string> = {
  Vacation: 'bg-blue-50 text-blue-700 border-blue-200',
  Sick: 'bg-amber-50 text-amber-700 border-amber-200',
  Personal: 'bg-purple-50 text-purple-700 border-purple-200',
};
