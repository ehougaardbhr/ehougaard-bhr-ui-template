import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../Icon';
import { AskDraftCard } from './AskDraftCard';
import type { PolicyDraft } from '../../../data/mealRestBreakRecommendations';
import { durationLabel } from '../../../data/mealRestBreakRecommendations';
import {
  processAskMessage,
  generateDraftPolicies,
  INITIAL_ASK_STATE,
} from '../../../services/askAgentService';
import type {
  ChatMessage,
  TextMessage,
  DraftsMessage,
  ConfirmationMessage,
  CreatedMessage,
  AskConversationState,
  AgentResponse,
} from '../../../types/askAgent';

interface Props {
  onOpenInEditor: (draft: PolicyDraft) => void;
  onDirectCreate?: (draft: PolicyDraft) => void;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

let _msgId = 0;
function genId() { return `msg-${++_msgId}-${Date.now()}`; }

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function responseToMessage(r: AgentResponse): ChatMessage {
  const id = genId();
  const ts = new Date();
  if (r.type === 'text') {
    return { id, role: 'assistant', type: 'text', content: r.content, quickReplies: r.quickReplies, timestamp: ts };
  }
  if (r.type === 'drafts') {
    return { id, role: 'assistant', type: 'drafts', drafts: r.drafts, timestamp: ts };
  }
  if (r.type === 'confirmation') {
    return { id, role: 'assistant', type: 'confirmation', draft: r.draft, timestamp: ts };
  }
  return { id, role: 'assistant', type: 'created', policyName: r.policyName, timestamp: ts };
}

const WELCOME_STARTERS = [
  { label: 'Help me create a break policy', text: 'Help me create a break policy' },
  { label: 'California meal & rest breaks', text: 'California meal and rest breaks' },
  { label: 'Standard meal + rest breaks', text: 'Standard meal + rest breaks' },
  { label: 'Simple meal break only', text: 'Simple meal break only' },
];

// ── Main component ────────────────────────────────────────────────────────────

export function AskAgentPanel({ onOpenInEditor, onDirectCreate }: Props) {
  const [convState, setConvState] = useState<AskConversationState>(INITIAL_ASK_STATE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const convStateRef = useRef(convState);
  convStateRef.current = convState;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle the async "generating" phase
  useEffect(() => {
    if (convState.status !== 'generating') return;

    setIsTyping(true);
    const timer = setTimeout(() => {
      const { collectedInputs } = convStateRef.current;
      const drafts = generateDraftPolicies(collectedInputs);
      const newConvState: AskConversationState = {
        ...convStateRef.current,
        status: 'draft_review',
        currentDrafts: drafts,
      };
      setConvState(newConvState);
      setMessages(prev => [...prev, {
        id: genId(),
        role: 'assistant',
        type: 'drafts',
        drafts,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1900);

    return () => clearTimeout(timer);
  }, [convState.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || convStateRef.current.status === 'generating') return;

    setInputValue('');

    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      type: 'text',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    const current = convStateRef.current;
    const { newState, responses } = processAskMessage(current, trimmed);

    // If user confirmed creation via text, trigger the direct create callback
    if (current.status === 'confirm_create' && newState.status === 'created' && current.pendingConfirmDraft) {
      onDirectCreate?.(current.pendingConfirmDraft);
      if (current.pendingConfirmDraft) {
        setConfirmedIds(prev => new Set([...prev, current.pendingConfirmDraft!.id]));
      }
    }

    setConvState(newState);

    if (responses.length === 0) return;

    // Generating phase: add acknowledgment text immediately (no delay)
    if (newState.status === 'generating') {
      setMessages(prev => [...prev, ...responses.map(r => responseToMessage(r))]);
      return;
    }

    // Normal: show typing indicator then add responses
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, ...responses.map(r => responseToMessage(r))]);
    }, 650);
  }, [onDirectCreate]);

  // "Create directly" on a draft card → skip to confirmation
  function handleRequestCreate(draft: PolicyDraft) {
    setConvState(prev => ({
      ...prev,
      status: 'confirm_create',
      pendingConfirmDraft: draft,
      currentDrafts: [draft, ...prev.currentDrafts.filter(d => d.id !== draft.id)],
    }));
    setMessages(prev => [...prev, {
      id: genId(),
      role: 'assistant',
      type: 'confirmation',
      draft,
      timestamp: new Date(),
    }]);
  }

  // Confirmation card → Confirm button
  function handleConfirmCreate(draft: PolicyDraft) {
    setConfirmedIds(prev => new Set([...prev, draft.id]));
    onDirectCreate?.(draft);
    const newConvState: AskConversationState = {
      ...convStateRef.current,
      status: 'created',
      pendingConfirmDraft: null,
    };
    setConvState(newConvState);
    setMessages(prev => [...prev, {
      id: genId(),
      role: 'assistant',
      type: 'created',
      policyName: draft.policyName,
      timestamp: new Date(),
    }]);
  }

  // Confirmation card → Go back button
  function handleCancelConfirm() {
    setConvState(prev => ({ ...prev, status: 'draft_review', pendingConfirmDraft: null }));
    setMessages(prev => [...prev, {
      id: genId(),
      role: 'assistant',
      type: 'text',
      content: "No problem — creation cancelled. The draft is still available whenever you're ready.",
      quickReplies: ['Make changes', 'Create it', 'Open in editor'],
      timestamp: new Date(),
    }]);
  }

  function handleReset() {
    setMessages([]);
    setConvState(INITIAL_ASK_STATE);
    setIsTyping(false);
    setConfirmedIds(new Set());
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  }

  // Determine active quick replies (only from last assistant text message)
  const lastMsg = messages[messages.length - 1];
  const quickReplies =
    !isTyping &&
    lastMsg?.role === 'assistant' &&
    lastMsg.type === 'text' &&
    convState.status !== 'created'
      ? ((lastMsg as TextMessage).quickReplies ?? [])
      : [];

  const inputDisabled = convState.status === 'generating';
  const inputPlaceholder =
    convState.status === 'generating' ? 'Generating your draft…' :
    convState.status === 'created'     ? 'Create another policy, or type a question…' :
                                         'Type a message or choose a suggestion…';

  // ── Render ──────────────────────────────────────────────────────────────────

  // Welcome screen (no messages yet)
  if (messages.length === 0) {
    return (
      <div className="flex flex-col rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] overflow-hidden bg-[var(--surface-neutral-xx-weak)]" style={{ height: 620 }}>

        {/* Welcome content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary-strong)] flex items-center justify-center mb-5 shadow-md">
            <Icon name="sparkles" size={24} className="text-white" />
          </div>
          <h3
            className="text-[22px] font-bold text-[var(--text-neutral-x-strong)] mb-2"
            style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
          >
            Policy Drafting Assistant
          </h3>
          <p className="text-[14px] text-[var(--text-neutral-medium)] mb-8 max-w-[360px] leading-[21px]">
            I'll ask a few questions, then draft a meal & rest break policy you can review, edit, and save.
          </p>
          <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
            {WELCOME_STARTERS.map(({ label, text }) => (
              <button
                key={label}
                onClick={() => handleSend(text)}
                className="px-3 py-2.5 rounded-[var(--radius-x-small)] border border-[var(--border-neutral-weak)] bg-[var(--surface-neutral-white)] text-[13px] font-medium text-[var(--text-neutral-strong)] hover:border-[var(--color-primary-strong)] hover:text-[var(--color-primary-strong)] hover:bg-[var(--color-primary-weak)] transition-all text-left leading-[18px]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Or describe what you need…"
              className="flex-1 h-10 px-3 border border-[var(--border-neutral-weak)] rounded-[var(--radius-full)] text-[14px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-x-weak)] focus:outline-none focus:border-[var(--color-primary-strong)] bg-[var(--surface-neutral-white)]"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-[var(--color-primary-strong)] flex items-center justify-center text-white hover:bg-[var(--color-primary-medium)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <Icon name="paper-plane" size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversation view
  return (
    <div className="flex flex-col rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] overflow-hidden bg-[var(--surface-neutral-xx-weak)]" style={{ height: 620 }}>

      {/* Conversation header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] shrink-0">
        <AgentAvatar size="sm" />
        <div>
          <p className="text-[14px] font-semibold text-[var(--text-neutral-x-strong)]">
            Policy Drafting Assistant
          </p>
          <p className="text-[11px] text-[var(--text-neutral-weak)]">Meal &amp; Rest Break Agent</p>
        </div>
        <button
          onClick={handleReset}
          className="ml-auto text-[12px] text-[var(--text-neutral-weak)] hover:text-[var(--text-neutral-strong)] px-2.5 py-1 rounded-[var(--radius-x-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
        >
          Start over
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-0">
        {messages.map(msg => (
          <MessageRow
            key={msg.id}
            message={msg}
            convState={convState}
            confirmedIds={confirmedIds}
            onOpenInEditor={onOpenInEditor}
            onRequestCreate={handleRequestCreate}
            onConfirmCreate={handleConfirmCreate}
            onCancelConfirm={handleCancelConfirm}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <AgentAvatar size="sm" />
            <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] rounded-bl-[var(--radius-xx-small)] px-4 py-3 shadow-sm">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && (
        <div className="px-4 pb-2.5 flex flex-wrap gap-1.5 shrink-0">
          {quickReplies.map(reply => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              disabled={inputDisabled}
              className="px-3 py-1.5 rounded-[var(--radius-full)] border border-[var(--color-primary-strong)] text-[12px] font-medium text-[var(--color-primary-strong)] bg-[var(--color-primary-weak)] hover:bg-[var(--color-primary-strong)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder}
            disabled={inputDisabled}
            className="flex-1 h-10 px-3 border border-[var(--border-neutral-weak)] rounded-[var(--radius-full)] text-[14px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-x-weak)] focus:outline-none focus:border-[var(--color-primary-strong)] bg-[var(--surface-neutral-white)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || inputDisabled}
            className="w-10 h-10 rounded-full bg-[var(--color-primary-strong)] flex items-center justify-center text-white hover:bg-[var(--color-primary-medium)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Icon name="paper-plane" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MessageRow ────────────────────────────────────────────────────────────────

interface MessageRowProps {
  message: ChatMessage;
  convState: AskConversationState;
  confirmedIds: Set<string>;
  onOpenInEditor: (draft: PolicyDraft) => void;
  onRequestCreate: (draft: PolicyDraft) => void;
  onConfirmCreate: (draft: PolicyDraft) => void;
  onCancelConfirm: () => void;
}

function MessageRow({
  message,
  convState,
  confirmedIds,
  onOpenInEditor,
  onRequestCreate,
  onConfirmCreate,
  onCancelConfirm,
}: MessageRowProps) {
  if (message.type === 'drafts') {
    const msg = message as DraftsMessage;
    return (
      <div className="w-full max-w-[520px] space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <AgentAvatar size="sm" />
          <span className="text-[12px] text-[var(--text-neutral-weak)]">
            {msg.drafts.length === 1 ? 'Here\'s your draft:' : `Here are ${msg.drafts.length} options:`}
          </span>
        </div>
        {msg.drafts.map(draft => (
          <AskDraftCard
            key={draft.id}
            draft={draft}
            onOpenInEditor={onOpenInEditor}
            onRequestCreate={onRequestCreate}
            disabled={convState.status === 'created'}
          />
        ))}
      </div>
    );
  }

  if (message.type === 'confirmation') {
    const msg = message as ConfirmationMessage;
    const actedOn = confirmedIds.has(msg.draft.id) || convState.status === 'created';
    return (
      <div className="w-full max-w-[520px]">
        <div className="flex items-center gap-2 mb-2">
          <AgentAvatar size="sm" />
        </div>
        <ConfirmationCard
          draft={msg.draft}
          onConfirm={() => onConfirmCreate(msg.draft)}
          onCancel={onCancelConfirm}
          actedOn={actedOn}
        />
      </div>
    );
  }

  if (message.type === 'created') {
    const msg = message as CreatedMessage;
    return (
      <div className="w-full max-w-[520px]">
        <div className="flex items-center gap-2 mb-2">
          <AgentAvatar size="sm" />
        </div>
        <CreatedCard policyName={msg.policyName} />
      </div>
    );
  }

  // Text message
  const msg = message as TextMessage;
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="bg-[var(--color-primary-strong)] rounded-[var(--radius-medium)] rounded-br-[var(--radius-xx-small)] px-4 py-2.5">
            <p className="text-[14px] text-white leading-[20px]">{msg.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <AgentAvatar size="sm" />
      <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] rounded-bl-[var(--radius-xx-small)] px-4 py-2.5 shadow-sm">
        <p className="text-[14px] text-[var(--text-neutral-strong)] leading-[20px]">
          {renderInline(msg.content)}
        </p>
      </div>
    </div>
  );
}

// ── Inline sub-components ─────────────────────────────────────────────────────

function AgentAvatar({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const px = size === 'sm' ? 'w-7 h-7' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 12 : 18;
  return (
    <div className={`${px} rounded-full bg-[var(--color-primary-strong)] flex items-center justify-center shrink-0`}>
      <Icon name="sparkles" size={iconSize} className="text-white" />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 h-4">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--border-neutral-medium)] animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '900ms' }}
        />
      ))}
    </div>
  );
}

function ConfirmationCard({
  draft,
  onConfirm,
  onCancel,
  actedOn,
}: {
  draft: PolicyDraft;
  onConfirm: () => void;
  onCancel: () => void;
  actedOn: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-medium)] border-2 border-amber-300 bg-[var(--surface-neutral-white)] overflow-hidden">
      <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
        <Icon name="circle-info" size={14} className="text-amber-600" />
        <span className="text-[13px] font-semibold text-amber-800">
          Ready to create this policy?
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="text-[12px] text-[var(--text-neutral-medium)] mb-3 leading-[16px]">
          Please verify the details below before saving. You can still open this in the editor to make changes first.
        </p>

        <h4
          className="text-[16px] font-bold text-[var(--text-neutral-x-strong)] mb-2"
          style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
        >
          {draft.policyName}
        </h4>

        <div className="space-y-1.5 mb-4">
          {draft.breaks.map(b => (
            <div key={b.id} className="flex items-center gap-2 text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-neutral-medium)] shrink-0" />
              <span className="font-medium text-[var(--text-neutral-strong)] flex-1 truncate">{b.name}</span>
              <span className="text-[var(--text-neutral-medium)]">{durationLabel(b.durationMinutes)}</span>
              <span
                className={`px-1.5 rounded text-[10px] font-semibold ${
                  b.type === 'paid'
                    ? 'bg-[var(--color-primary-weak)] text-[var(--color-primary-strong)]'
                    : 'bg-[var(--surface-neutral-xx-weak)] text-[var(--text-neutral-medium)]'
                }`}
              >
                {b.type === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          ))}
        </div>

        {!actedOn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onConfirm}
              className="flex-1 h-8 rounded-[var(--radius-full)] bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Icon name="check" size={12} />
              Confirm &amp; Create
            </button>
            <button
              onClick={onCancel}
              className="h-8 px-4 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] text-[13px] text-[var(--text-neutral-medium)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
            >
              Go back
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[13px] text-green-700 font-medium">
            <Icon name="check-circle" size={14} className="text-green-600" />
            Policy created
          </div>
        )}
      </div>
    </div>
  );
}

function CreatedCard({ policyName }: { policyName: string }) {
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-[var(--radius-medium)] px-4 py-3.5">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon name="check-circle" size={16} className="text-green-600" />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-green-800 mb-0.5">Policy created!</p>
        <p className="text-[13px] text-green-700">
          <span className="font-medium">"{policyName}"</span> has been added to your Break Policies.
        </p>
        <p className="text-[12px] text-green-600 mt-1">
          You can assign employees to it from the Break Policies list above.
        </p>
      </div>
    </div>
  );
}
