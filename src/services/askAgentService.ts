import type { PolicyDraft } from '../data/mealRestBreakRecommendations';
import { DEFAULT_RECOMMENDATIONS, GENERATED_RECOMMENDATIONS } from '../data/mealRestBreakRecommendations';
import type {
  AskConversationState,
  CollectedInputs,
  BreakTypeChoice,
  ShiftTypeChoice,
  StateChoice,
  ProcessResult,
  AgentTextResponse,
} from '../types/askAgent';

// ── Initial state ─────────────────────────────────────────────────────────────

export const INITIAL_ASK_STATE: AskConversationState = {
  status: 'welcome',
  collectedInputs: {},
  currentDrafts: [],
  pendingConfirmDraft: null,
};

// ── Main conversation processor ───────────────────────────────────────────────
// Extension point: swap this function's internals for a real AI call.
// Signature: (state, userText) → { newState, responses[] }

export function processAskMessage(
  state: AskConversationState,
  userText: string
): ProcessResult {
  const lower = userText.toLowerCase().trim();

  // Universal reset
  if (/^(start over|reset|restart|start again|begin again)$/.test(lower)) {
    return {
      newState: { status: 'asking_break_type', collectedInputs: {}, currentDrafts: [], pendingConfirmDraft: null },
      responses: [{
        type: 'text',
        content: "Sure — let's start fresh. Would you like a meal break only, or meal + rest breaks?",
        quickReplies: ['Meal break only', 'Meal + rest breaks'],
      }],
    };
  }

  switch (state.status) {
    case 'welcome':        return handleWelcome(state, lower);
    case 'asking_break_type': return handleBreakType(state, lower);
    case 'asking_shift_type': return handleShiftType(state, lower);
    case 'asking_state':   return handleStateReq(state, lower);
    case 'generating':     return { newState: state, responses: [] };
    case 'draft_review':   return handleDraftReview(state, lower, userText);
    case 'confirm_create': return handleConfirmCreate(state, lower);
    case 'created':        return handleCreated(state, lower);
    default:               return { newState: state, responses: [] };
  }
}

// ── Status handlers ───────────────────────────────────────────────────────────

function handleWelcome(state: AskConversationState, lower: string): ProcessResult {
  const preFilled: CollectedInputs = {};

  if (/california|\bca\b/.test(lower)) preFilled.stateRequirement = 'CA';
  else if (/washington|\bwa\b/.test(lower)) preFilled.stateRequirement = 'WA';
  else if (/oregon|\bor\b/.test(lower)) preFilled.stateRequirement = 'OR';

  if (/meal.?only|simple meal|just meal|no rest/.test(lower)) preFilled.breakType = 'meal_only';
  else if (/meal.*rest|rest.*meal|\bstandard\b|meal \+ rest/.test(lower)) preFilled.breakType = 'meal_rest';

  // Fast-path: enough info to generate immediately
  if (preFilled.breakType && preFilled.stateRequirement) {
    const inputs: CollectedInputs = { ...preFilled, shiftType: 'standard' };
    return {
      newState: { ...state, collectedInputs: inputs, status: 'generating' },
      responses: [{ type: 'text', content: 'Great — let me put that together for you…' }],
    };
  }

  if (preFilled.breakType === 'meal_only') {
    return {
      newState: { ...state, collectedInputs: preFilled, status: 'asking_state' },
      responses: [{
        type: 'text',
        content: 'Got it — meal break only. Do you have any state-specific requirements?',
        quickReplies: ['California (CA)', 'Washington (WA)', 'Oregon (OR)', 'No specific state requirements'],
      }],
    };
  }

  if (preFilled.breakType === 'meal_rest') {
    return {
      newState: { ...state, collectedInputs: preFilled, status: 'asking_shift_type' },
      responses: [{
        type: 'text',
        content: 'Got it — meal + rest breaks. What kind of shifts does this policy cover?',
        quickReplies: ['Standard 8-hour shifts', 'Long shifts (10–12 hours)', 'Overnight shifts', 'Various shift lengths'],
      }],
    };
  }

  if (preFilled.stateRequirement) {
    const stateLabel = { CA: 'California', WA: 'Washington', OR: 'Oregon' }[preFilled.stateRequirement] ?? '';
    return {
      newState: { ...state, collectedInputs: preFilled, status: 'asking_break_type' },
      responses: [{
        type: 'text',
        content: `I'll make sure this covers ${stateLabel} requirements. Should the policy include rest breaks in addition to a meal break?`,
        quickReplies: ['Meal break only', 'Meal + rest breaks'],
      }],
    };
  }

  // Default: begin the guided flow
  return {
    newState: { ...state, status: 'asking_break_type' },
    responses: [{
      type: 'text',
      content: "I'll help you draft a break policy. First — will this policy include **rest breaks** (short paid breaks during the shift) in addition to a meal break?",
      quickReplies: ['Meal break only', 'Meal + rest breaks', 'Not sure — help me decide'],
    }],
  };
}

function handleBreakType(state: AskConversationState, lower: string): ProcessResult {
  let breakType: BreakTypeChoice | undefined;

  if (/meal.?only|just meal|only meal|no rest|meal break only/.test(lower)) breakType = 'meal_only';
  else if (/meal.*rest|rest.*meal|both|meal \+ rest|meal and rest|yes|include/.test(lower)) breakType = 'meal_rest';
  else if (/not sure|help|unsure|don.?t know/.test(lower)) {
    return {
      newState: state,
      responses: [{
        type: 'text',
        content: 'No problem! A **rest break** is a short paid break (typically 10–15 minutes) in addition to the unpaid meal break. Most hourly employees benefit from both. Would you like to include them?',
        quickReplies: ['Yes, include rest breaks', 'No, just a meal break'],
      }],
    };
  }

  if (!breakType) {
    return {
      newState: state,
      responses: [{
        type: 'text',
        content: "Sorry, I didn't quite catch that. Would you like a meal break only, or meal + rest breaks?",
        quickReplies: ['Meal break only', 'Meal + rest breaks'],
      }],
    };
  }

  const newInputs = { ...state.collectedInputs, breakType };

  if (breakType === 'meal_only') {
    return {
      newState: { ...state, collectedInputs: newInputs, status: 'asking_state' },
      responses: [{
        type: 'text',
        content: 'Got it — meal break only. Are there any state-specific requirements for this policy?',
        quickReplies: ['California (CA)', 'Washington (WA)', 'Oregon (OR)', 'No specific state requirements'],
      }],
    };
  }

  return {
    newState: { ...state, collectedInputs: newInputs, status: 'asking_shift_type' },
    responses: [{
      type: 'text',
      content: 'Great. What kind of shifts does this policy cover? This helps me suggest the right break timing.',
      quickReplies: ['Standard 8-hour shifts', 'Long shifts (10–12 hours)', 'Overnight shifts', 'Various shift lengths'],
    }],
  };
}

function handleShiftType(state: AskConversationState, lower: string): ProcessResult {
  let shiftType: ShiftTypeChoice | undefined;

  if (/standard|8.?hour|8 hr|typical|normal/.test(lower)) shiftType = 'standard';
  else if (/long|10.?hour|12.?hour|extended|10 hr|12 hr/.test(lower)) shiftType = 'long';
  else if (/overnight|night shift/.test(lower)) shiftType = 'overnight';
  else if (/various|varied|variable|mix|different/.test(lower)) shiftType = 'varied';

  if (!shiftType) {
    return {
      newState: state,
      responses: [{
        type: 'text',
        content: 'Could you clarify the shift type?',
        quickReplies: ['Standard 8-hour shifts', 'Long shifts (10–12 hours)', 'Overnight shifts', 'Various shift lengths'],
      }],
    };
  }

  const newInputs = { ...state.collectedInputs, shiftType };
  return {
    newState: { ...state, collectedInputs: newInputs, status: 'asking_state' },
    responses: [{
      type: 'text',
      content: 'Almost there. Are there specific state compliance requirements for this policy?',
      quickReplies: ['California (CA)', 'Washington (WA)', 'Oregon (OR)', 'No specific state requirements'],
    }],
  };
}

function handleStateReq(state: AskConversationState, lower: string): ProcessResult {
  let stateReq: StateChoice | undefined;

  if (/california|\bca\b/.test(lower)) stateReq = 'CA';
  else if (/washington|\bwa\b/.test(lower)) stateReq = 'WA';
  else if (/oregon|\bor\b/.test(lower)) stateReq = 'OR';
  else if (/no.*state|general|standard|any|no specific|none|federal|\bus\b/.test(lower)) stateReq = 'standard';

  if (!stateReq) {
    return {
      newState: state,
      responses: [{
        type: 'text',
        content: 'Which state, or no specific state requirements?',
        quickReplies: ['California (CA)', 'Washington (WA)', 'Oregon (OR)', 'No specific state requirements'],
      }],
    };
  }

  const newInputs = { ...state.collectedInputs, stateRequirement: stateReq };
  return {
    newState: { ...state, collectedInputs: newInputs, status: 'generating' },
    responses: [{ type: 'text', content: 'Perfect — let me draft that for you…' }],
  };
}

function handleDraftReview(
  state: AskConversationState,
  lower: string,
  original: string
): ProcessResult {
  const draft = state.currentDrafts[0];
  if (!draft) {
    return {
      newState: { ...state, status: 'asking_break_type', collectedInputs: {}, currentDrafts: [] },
      responses: [{
        type: 'text',
        content: "Hmm, I seem to have lost the draft. Let's start over — meal only or meal + rest?",
        quickReplies: ['Meal break only', 'Meal + rest breaks'],
      }],
    };
  }

  // Create intent
  if (/create it|save it|create this|save this|create the policy|go ahead|create now|let.?s create/.test(lower)) {
    return {
      newState: { ...state, status: 'confirm_create', pendingConfirmDraft: draft },
      responses: [{ type: 'confirmation', draft }],
    };
  }

  // Generate alternate
  if (/another|different|alternate|more option|other option|show me more|new option/.test(lower)) {
    const alt = generateAlternateDraft(draft, state.collectedInputs);
    return {
      newState: { ...state, currentDrafts: [draft, alt] },
      responses: [
        { type: 'text', content: "Here's an alternate option:" },
        { type: 'drafts', drafts: [alt] },
      ],
    };
  }

  // State variant
  const variant = parseStateVariant(lower);
  if (variant) {
    const stateLabel = { CA: 'California', WA: 'Washington', OR: 'Oregon' }[variant] ?? variant;
    const variantDraft = generateDraftPolicies({
      ...state.collectedInputs,
      stateRequirement: variant,
      breakType: state.collectedInputs.breakType ?? 'meal_rest',
    })[0];
    return {
      newState: { ...state, currentDrafts: [draft, variantDraft] },
      responses: [
        { type: 'text', content: `Here's a ${stateLabel}-compliant version:` },
        { type: 'drafts', drafts: [variantDraft] },
      ],
    };
  }

  // Apply revision
  const revision = applyDraftRevision(draft, original);
  if (revision) {
    const updatedDrafts = [revision.draft, ...state.currentDrafts.slice(1)];
    return {
      newState: { ...state, currentDrafts: updatedDrafts },
      responses: [
        { type: 'text', content: `Done — ${revision.description} Here's your updated draft:` },
        { type: 'drafts', drafts: [revision.draft] },
      ],
    };
  }

  // Fallback
  return {
    newState: state,
    responses: [{
      type: 'text',
      content: 'You can ask me to revise the draft, generate another option, or open it in the editor to customize further.',
      quickReplies: ['Make rest break unpaid', 'Show another option', 'Oregon version too', 'Create it'],
    }],
  };
}

function handleConfirmCreate(state: AskConversationState, lower: string): ProcessResult {
  if (/confirm|yes|go ahead|create|save|do it|proceed/.test(lower)) {
    const draft = state.pendingConfirmDraft!;
    return {
      newState: { ...state, status: 'created', pendingConfirmDraft: null },
      responses: [{ type: 'created', policyName: draft.policyName }],
    };
  }
  if (/cancel|no\b|nevermind|back|stop/.test(lower)) {
    return {
      newState: { ...state, status: 'draft_review', pendingConfirmDraft: null },
      responses: [{
        type: 'text',
        content: "No problem. The draft is still here whenever you're ready.",
        quickReplies: ['Make changes', 'Create it', 'Open in editor'],
      }],
    };
  }
  return {
    newState: state,
    responses: [{
      type: 'text',
      content: 'Please use the Confirm or Go back buttons on the card above.',
    }],
  };
}

function handleCreated(state: AskConversationState, lower: string): ProcessResult {
  if (/another|new policy|more|start over|create another/.test(lower)) {
    return {
      newState: { status: 'asking_break_type', collectedInputs: {}, currentDrafts: [], pendingConfirmDraft: null },
      responses: [{
        type: 'text',
        content: "Let's create another! Meal only, or meal + rest breaks?",
        quickReplies: ['Meal break only', 'Meal + rest breaks'],
      }],
    };
  }
  return {
    newState: state,
    responses: [{
      type: 'text',
      content: "Your policy has been created and will appear in the Break Policies list above. Would you like to create another?",
      quickReplies: ['Create another policy'],
    }],
  };
}

// ── Draft generation ──────────────────────────────────────────────────────────
// Extension point: replace the lookup logic here with a real AI generation call.

export function generateDraftPolicies(inputs: CollectedInputs): PolicyDraft[] {
  const { breakType = 'meal_rest', stateRequirement = 'standard', shiftType = 'standard' } = inputs;
  const ts = Date.now();

  const clone = (src: PolicyDraft): PolicyDraft => ({
    ...src,
    id: `ask-draft-${ts}`,
    source: 'generated_recommendation',
    breaks: src.breaks.map((b, i) => ({ ...b, id: `ask-b${i + 1}-${ts}` })),
  });

  if (breakType === 'meal_only') return [clone(pick('rec-simple-meal'))];

  if (stateRequirement === 'CA') return [clone(pick('rec-california'))];
  if (stateRequirement === 'WA') return [clone(pick('rec-washington'))];
  if (stateRequirement === 'OR') return [clone(pick('rec-oregon'))];

  if (shiftType === 'long' || shiftType === 'overnight') return [clone(pick('rec-long-shift'))];
  if (shiftType === 'varied') return [clone(pick('gen-flexible'))];

  return [clone(pick('rec-standard'))];
}

// ── Draft revision ────────────────────────────────────────────────────────────
// Extension point: replace regex parsing with NLU/intent classification.

export function applyDraftRevision(
  draft: PolicyDraft,
  text: string
): { draft: PolicyDraft; description: string } | null {
  const lower = text.toLowerCase();

  // Rest break payment type
  if (/rest.*unpaid|unpaid.*rest/.test(lower)) {
    const breaks = draft.breaks.map(b =>
      b.name.toLowerCase().includes('rest') ? { ...b, type: 'unpaid' as const } : b
    );
    if (breaks.every((b, i) => b.type === draft.breaks[i].type)) return null;
    return { draft: { ...draft, breaks }, description: 'Made rest break(s) unpaid.' };
  }

  if (/rest.*\bpaid\b|\bpaid\b.*rest/.test(lower)) {
    const breaks = draft.breaks.map(b =>
      b.name.toLowerCase().includes('rest') ? { ...b, type: 'paid' as const } : b
    );
    if (breaks.every((b, i) => b.type === draft.breaks[i].type)) return null;
    return { draft: { ...draft, breaks }, description: 'Made rest break(s) paid.' };
  }

  // Meal break payment type
  if (/meal.*\bpaid\b|\bpaid\b.*meal|lunch.*\bpaid\b|\bpaid\b.*lunch/.test(lower)) {
    const breaks = draft.breaks.map(b =>
      isMealBreak(b.name) ? { ...b, type: 'paid' as const } : b
    );
    if (breaks.every((b, i) => b.type === draft.breaks[i].type)) return null;
    return { draft: { ...draft, breaks }, description: 'Made meal break paid.' };
  }

  // Duration change
  const durMatch = text.match(/(\d+)\s*(?:min(?:ute)?s?)/i);
  if (durMatch) {
    const closest = snapToValid(parseInt(durMatch[1]));
    if (/lunch|meal/i.test(lower)) {
      const breaks = draft.breaks.map(b =>
        isMealBreak(b.name) ? { ...b, durationMinutes: closest } : b
      );
      return { draft: { ...draft, breaks }, description: `Updated meal break to ${closest} min.` };
    }
    if (/rest/i.test(lower)) {
      const breaks = draft.breaks.map(b =>
        b.name.toLowerCase().includes('rest') ? { ...b, durationMinutes: closest } : b
      );
      return { draft: { ...draft, breaks }, description: `Updated rest break(s) to ${closest} min.` };
    }
    // Generic: update first break
    const breaks = [...draft.breaks];
    breaks[0] = { ...breaks[0], durationMinutes: closest };
    return { draft: { ...draft, breaks }, description: `Updated first break to ${closest} min.` };
  }

  // Remove rest breaks (meal-only conversion)
  if (/meal.?only|remove.*rest|no.*rest\s*break/.test(lower)) {
    const withoutRest = draft.breaks.filter(b => !b.name.toLowerCase().includes('rest'));
    if (withoutRest.length === draft.breaks.length) return null;
    return {
      draft: { ...draft, breaks: withoutRest },
      description: 'Removed rest break(s). Policy is now meal-only.',
    };
  }

  return null;
}

// ── Private helpers ───────────────────────────────────────────────────────────

function pick(id: string): PolicyDraft {
  const all = [...DEFAULT_RECOMMENDATIONS, ...GENERATED_RECOMMENDATIONS];
  const found = all.find(r => r.id === id);
  if (!found) throw new Error(`Archetype not found: ${id}`);
  return found;
}

function isMealBreak(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.includes('meal') || lower.includes('lunch');
}

function snapToValid(minutes: number): number {
  const valid = [10, 15, 20, 30, 45, 60, 90, 120];
  return valid.reduce((a, b) => Math.abs(b - minutes) < Math.abs(a - minutes) ? b : a);
}

function parseStateVariant(lower: string): StateChoice | null {
  if (/california|\bca\b/.test(lower)) return 'CA';
  if (/washington|\bwa\b/.test(lower)) return 'WA';
  if (/oregon|\bor\b/.test(lower)) return 'OR';
  return null;
}

function generateAlternateDraft(existing: PolicyDraft, inputs: CollectedInputs): PolicyDraft {
  const all = [...DEFAULT_RECOMMENDATIONS, ...GENERATED_RECOMMENDATIONS];
  const others = all.filter(r => r.id !== existing.id);
  const ts = Date.now();

  let src: PolicyDraft;
  if (inputs.breakType === 'meal_only') {
    src = others.find(r => r.id === 'gen-flexible') ?? others[0];
  } else if (inputs.stateRequirement === 'CA') {
    src = others.find(r => r.id === 'gen-california-strict') ?? others.find(r => r.breaks.length >= 3) ?? others[0];
  } else {
    src = others.find(r => r.breaks.length !== existing.breaks.length) ?? others[0];
  }

  return {
    ...src,
    id: `ask-alt-${ts}`,
    source: 'generated_recommendation',
    breaks: src.breaks.map((b, i) => ({ ...b, id: `ask-alt-b${i + 1}-${ts}` })),
  };
}
