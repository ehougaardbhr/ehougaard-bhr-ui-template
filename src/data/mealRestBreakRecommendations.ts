// ── Core types ───────────────────────────────────────────────────────────────

export type BreakType = 'paid' | 'unpaid';
export type AvailabilityType = 'anytime' | 'time_of_day' | 'hours_worked';

export interface BreakDraft {
  id: string;
  name: string;
  type: BreakType;
  durationMinutes: number;
  availabilityType: AvailabilityType;
  availableAfterHours?: number;
  startWithinHours?: number;
  startTime?: string;
  endTime?: string;
}

export interface PolicyDraft {
  id: string;
  policyName: string;
  policyDescription: string;
  recommendationReason?: string;
  breaks: BreakDraft[];
  source: 'default_recommendation' | 'generated_recommendation';
}

// ── Display helpers ───────────────────────────────────────────────────────────

export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes === 60) return '1 hr';
  if (minutes === 90) return '1.5 hrs';
  if (minutes === 120) return '2 hrs';
  return `${minutes} min`;
}

export function availabilityLabel(b: BreakDraft): string {
  if (b.availabilityType === 'anytime') return 'Anytime';
  if (b.availabilityType === 'hours_worked' && b.availableAfterHours != null) {
    const h = b.availableAfterHours;
    return `After ${h} hr${h !== 1 ? 's' : ''}`;
  }
  if (b.availabilityType === 'time_of_day' && b.startTime) {
    return `${b.startTime}–${b.endTime ?? '?'}`;
  }
  return 'Anytime';
}

// ── Default recommendation archetypes ────────────────────────────────────────

export const DEFAULT_RECOMMENDATIONS: PolicyDraft[] = [
  {
    id: 'rec-california',
    policyName: 'California Meal & Rest',
    policyDescription:
      'Complies with California labor law: one 30-minute unpaid meal break after 5 hours and two 10-minute paid rest breaks.',
    recommendationReason: 'Required for employees working in California.',
    source: 'default_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 5 },
      { id: 'b2', name: 'Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 2 },
      { id: 'b3', name: 'Second Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 6 },
    ],
  },
  {
    id: 'rec-washington',
    policyName: 'Washington Meal & Rest',
    policyDescription:
      'Follows Washington state requirements: a 30-minute unpaid meal break after 5 hours and a 10-minute paid rest break.',
    recommendationReason: 'Covers Washington state employees.',
    source: 'default_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 5 },
      { id: 'b2', name: 'Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'anytime' },
    ],
  },
  {
    id: 'rec-oregon',
    policyName: 'Oregon Meal & Rest',
    policyDescription:
      'Meets Oregon requirements: a 30-minute unpaid meal break after 6 hours and a 10-minute paid rest break after 4 hours.',
    recommendationReason: 'Covers Oregon state employees.',
    source: 'default_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 6 },
      { id: 'b2', name: 'Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 4 },
    ],
  },
  {
    id: 'rec-simple-meal',
    policyName: 'Simple Meal Break',
    policyDescription:
      'A single 30-minute unpaid meal break with flexible timing. Good for teams with straightforward scheduling needs.',
    recommendationReason: 'Good starting point for most teams.',
    source: 'default_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'anytime' },
    ],
  },
  {
    id: 'rec-standard',
    policyName: 'Standard Meal & Rest',
    policyDescription:
      'A balanced policy for full-time hourly employees: a 30-minute unpaid meal break after 5 hours and a 15-minute paid rest break.',
    recommendationReason: 'Works well for most full-time hourly employees.',
    source: 'default_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 5 },
      { id: 'b2', name: 'Rest Break', type: 'paid', durationMinutes: 15, availabilityType: 'anytime' },
    ],
  },
  {
    id: 'rec-long-shift',
    policyName: 'Long-Shift Meal & Rest',
    policyDescription:
      'Designed for shifts over 10 hours: two unpaid meal breaks and one paid rest break to keep employees refreshed throughout extended workdays.',
    recommendationReason: 'Good starting point for longer shifts.',
    source: 'default_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 5 },
      { id: 'b2', name: 'Second Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 10 },
      { id: 'b3', name: 'Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 2 },
    ],
  },
];

// ── Generated variants (returned by "Generate more options") ──────────────────

export const GENERATED_RECOMMENDATIONS: PolicyDraft[] = [
  {
    id: 'gen-california-strict',
    policyName: 'California Strict Timing',
    policyDescription:
      'A stricter California-compliant variant that enforces breaks within tighter scheduling windows for high-compliance environments.',
    recommendationReason: 'More conservative timing for high-compliance environments.',
    source: 'generated_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 4 },
      { id: 'b2', name: 'First Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 2 },
      { id: 'b3', name: 'Second Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 6 },
    ],
  },
  {
    id: 'gen-flexible',
    policyName: 'Flexible Meal & Rest',
    policyDescription:
      'Gives employees full flexibility on when to take breaks. One 30-minute unpaid meal and a 10-minute paid rest, both schedulable anytime.',
    recommendationReason: 'Flexible scheduling for knowledge workers and salaried staff.',
    source: 'generated_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'anytime' },
      { id: 'b2', name: 'Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'anytime' },
    ],
  },
  {
    id: 'gen-retail',
    policyName: 'Retail Standard',
    policyDescription:
      'Tailored for retail environments with variable shift lengths. A 30-minute unpaid meal break and a 15-minute paid rest break staggered through the shift.',
    recommendationReason: 'Common pattern for retail and service industry teams.',
    source: 'generated_recommendation',
    breaks: [
      { id: 'b1', name: 'Lunch Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 4 },
      { id: 'b2', name: 'Rest Break', type: 'paid', durationMinutes: 15, availabilityType: 'hours_worked', availableAfterHours: 2 },
    ],
  },
  {
    id: 'gen-healthcare',
    policyName: 'Healthcare Extended Shift',
    policyDescription:
      'Designed for 12-hour healthcare shifts. Two meal breaks and two paid rest periods to maintain performance and safety throughout extended workdays.',
    recommendationReason: 'For healthcare workers and others on extended 12-hour shifts.',
    source: 'generated_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 30, availabilityType: 'hours_worked', availableAfterHours: 4 },
      { id: 'b2', name: 'Second Meal Break', type: 'unpaid', durationMinutes: 20, availabilityType: 'hours_worked', availableAfterHours: 8 },
      { id: 'b3', name: 'Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 2 },
      { id: 'b4', name: 'Second Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 6 },
    ],
  },
  {
    id: 'gen-quick-service',
    policyName: 'Quick-Service Restaurant',
    policyDescription:
      'Short, frequent breaks for fast-paced food service environments. A 20-minute meal and two 10-minute paid rest breaks to keep staff energized.',
    recommendationReason: 'Common for food service and hospitality teams.',
    source: 'generated_recommendation',
    breaks: [
      { id: 'b1', name: 'Meal Break', type: 'unpaid', durationMinutes: 20, availabilityType: 'hours_worked', availableAfterHours: 4 },
      { id: 'b2', name: 'Rest Break', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 2 },
      { id: 'b3', name: 'Rest Break 2', type: 'paid', durationMinutes: 10, availabilityType: 'hours_worked', availableAfterHours: 6 },
    ],
  },
];
