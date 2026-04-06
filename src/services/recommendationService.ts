import type { PolicyDraft, BreakDraft } from '../data/mealRestBreakRecommendations';
import { DEFAULT_RECOMMENDATIONS, GENERATED_RECOMMENDATIONS } from '../data/mealRestBreakRecommendations';

// ── Public API ────────────────────────────────────────────────────────────────

export function getDefaultRecommendations(): PolicyDraft[] {
  return DEFAULT_RECOMMENDATIONS;
}

/** Simulates an async AI call. Returns new recommendations not already shown. */
export async function generateMoreRecommendations(
  existing: PolicyDraft[]
): Promise<PolicyDraft[]> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const existingIds = new Set(existing.map(p => p.id));
  const unseen = GENERATED_RECOMMENDATIONS.filter(r => !existingIds.has(r.id));

  if (unseen.length > 0) return unseen;

  // All generated variants have been shown — return remixed defaults
  return DEFAULT_RECOMMENDATIONS.slice(0, 3).map((p, i) => ({
    ...p,
    id: `remix-${p.id}-${Date.now()}-${i}`,
    policyName: `${p.policyName} (Alternate)`,
    source: 'generated_recommendation' as const,
  }));
}

// ── Form state mapper ─────────────────────────────────────────────────────────

export interface FormBreakItem {
  id: string;
  name: string;
  paid: boolean;
  duration: string;
  availability: string;
}

export interface PolicyFormState {
  policyName: string;
  policyDescription: string;
  breaks: FormBreakItem[];
}

/** Maps a PolicyDraft (canonical model) → the string-based form state. */
export function policyDraftToFormState(draft: PolicyDraft): PolicyFormState {
  return {
    policyName: draft.policyName,
    policyDescription: draft.policyDescription,
    breaks: draft.breaks.map((b, i) => ({
      id: `prefill-${i + 1}`,
      name: b.name,
      paid: b.type === 'paid',
      duration: minutesToDurationString(b.durationMinutes),
      availability: breakToAvailabilityString(b),
    })),
  };
}

// ── Options exported for form dropdowns ──────────────────────────────────────

export const DURATION_OPTIONS = [
  '10 min', '15 min', '20 min', '30 min', '45 min', '1 hr', '1.5 hrs', '2 hrs',
];

export const AVAILABILITY_OPTIONS = [
  'Anytime',
  'After 2 hours',
  'After 3 hours',
  'After 4 hours',
  'After 5 hours',
  'After 6 hours',
  'After 8 hours',
  'After 10 hours',
];

// ── Private helpers ───────────────────────────────────────────────────────────

function minutesToDurationString(minutes: number): string {
  const map: Record<number, string> = {
    10: '10 min', 15: '15 min', 20: '20 min', 30: '30 min',
    45: '45 min', 60: '1 hr', 90: '1.5 hrs', 120: '2 hrs',
  };
  return map[minutes] ?? '30 min';
}

function breakToAvailabilityString(b: BreakDraft): string {
  if (b.availabilityType === 'anytime') return 'Anytime';
  if (b.availabilityType === 'hours_worked' && b.availableAfterHours != null) {
    const label = `After ${b.availableAfterHours} hours`;
    return AVAILABILITY_OPTIONS.includes(label) ? label : 'Anytime';
  }
  return 'Anytime';
}
