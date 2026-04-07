import type { PolicyDraft } from '../data/mealRestBreakRecommendations';

// ── Collected inputs ──────────────────────────────────────────────────────────

export type BreakTypeChoice = 'meal_only' | 'meal_rest';
export type ShiftTypeChoice = 'standard' | 'long' | 'overnight' | 'varied';
export type StateChoice = 'CA' | 'WA' | 'OR' | 'standard';

export interface CollectedInputs {
  breakType?: BreakTypeChoice;
  shiftType?: ShiftTypeChoice;
  stateRequirement?: StateChoice;
}

// ── Conversation state ────────────────────────────────────────────────────────

export type ConversationStatus =
  | 'welcome'
  | 'asking_break_type'
  | 'asking_shift_type'
  | 'asking_state'
  | 'generating'
  | 'draft_review'
  | 'confirm_create'
  | 'created';

export interface AskConversationState {
  status: ConversationStatus;
  collectedInputs: CollectedInputs;
  currentDrafts: PolicyDraft[];
  pendingConfirmDraft: PolicyDraft | null;
}

// ── Chat message types ────────────────────────────────────────────────────────

export interface TextMessage {
  id: string;
  role: 'user' | 'assistant';
  type: 'text';
  content: string;
  quickReplies?: string[];
  timestamp: Date;
}

export interface DraftsMessage {
  id: string;
  role: 'assistant';
  type: 'drafts';
  drafts: PolicyDraft[];
  timestamp: Date;
}

export interface ConfirmationMessage {
  id: string;
  role: 'assistant';
  type: 'confirmation';
  draft: PolicyDraft;
  timestamp: Date;
}

export interface CreatedMessage {
  id: string;
  role: 'assistant';
  type: 'created';
  policyName: string;
  timestamp: Date;
}

export type ChatMessage = TextMessage | DraftsMessage | ConfirmationMessage | CreatedMessage;

// ── Agent response types (from the orchestration layer) ───────────────────────

export interface AgentTextResponse {
  type: 'text';
  content: string;
  quickReplies?: string[];
}

export interface AgentDraftsResponse {
  type: 'drafts';
  drafts: PolicyDraft[];
}

export interface AgentConfirmationResponse {
  type: 'confirmation';
  draft: PolicyDraft;
}

export interface AgentCreatedResponse {
  type: 'created';
  policyName: string;
}

export type AgentResponse =
  | AgentTextResponse
  | AgentDraftsResponse
  | AgentConfirmationResponse
  | AgentCreatedResponse;

export interface ProcessResult {
  newState: AskConversationState;
  responses: AgentResponse[];
}
