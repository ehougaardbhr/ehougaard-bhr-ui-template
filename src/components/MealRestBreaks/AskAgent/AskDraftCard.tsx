import { Icon } from '../../Icon';
import { Button } from '../../Button';
import type { PolicyDraft } from '../../../data/mealRestBreakRecommendations';
import { durationLabel, availabilityLabel } from '../../../data/mealRestBreakRecommendations';

interface Props {
  draft: PolicyDraft;
  onOpenInEditor: (draft: PolicyDraft) => void;
  onRequestCreate: (draft: PolicyDraft) => void;
  disabled?: boolean;
}

export function AskDraftCard({ draft, onOpenInEditor, onRequestCreate, disabled }: Props) {
  return (
    <div className="rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] overflow-hidden shadow-sm">

      {/* Card header */}
      <div className="px-4 py-2.5 bg-[var(--color-primary-weak)] border-b border-[var(--color-primary-weak)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="sparkles" size={12} className="text-[var(--color-primary-strong)]" />
          <span className="text-[11px] font-semibold text-[var(--color-primary-strong)] uppercase tracking-wide">
            Draft Policy
          </span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 text-[11px] font-semibold text-[var(--color-primary-strong)]">
          <Icon name="clock" size={10} />
          {draft.breaks.length} Break{draft.breaks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Card body */}
      <div className="px-4 py-4">
        <h4
          className="text-[17px] font-bold text-[var(--text-neutral-x-strong)] mb-1 leading-[22px]"
          style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
        >
          {draft.policyName}
        </h4>
        <p className="text-[13px] text-[var(--text-neutral-medium)] mb-4 leading-[18px]">
          {draft.policyDescription}
        </p>

        {/* Break list */}
        <div className="space-y-2 mb-4">
          {draft.breaks.map((b, idx) => (
            <div
              key={b.id}
              className="flex items-start gap-2.5 px-3 py-2.5 rounded-[var(--radius-x-small)] bg-[var(--surface-neutral-xx-weak)]"
            >
              <div className="w-5 h-5 rounded-full bg-[var(--color-primary-weak)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[var(--color-primary-strong)]">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[13px] font-semibold text-[var(--text-neutral-x-strong)]">
                    {b.name}
                  </span>
                  <span
                    className={`px-1.5 rounded text-[10px] font-semibold ${
                      b.type === 'paid'
                        ? 'bg-[var(--color-primary-weak)] text-[var(--color-primary-strong)]'
                        : 'bg-[var(--surface-neutral-xx-weak)] border border-[var(--border-neutral-weak)] text-[var(--text-neutral-medium)]'
                    }`}
                  >
                    {b.type === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[12px] text-[var(--text-neutral-medium)]">
                    {durationLabel(b.durationMinutes)}
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-[var(--border-neutral-medium)]" />
                  <span className="text-[12px] text-[var(--text-neutral-weak)]">
                    {availabilityLabel(b)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div className="flex items-start gap-1.5 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-[var(--radius-x-small)]">
          <Icon name="circle-info" size={12} className="mt-0.5 shrink-0 text-amber-600" />
          <span className="text-[11px] text-amber-700 leading-[16px]">
            This is a draft you can review and edit. Please verify all details before saving.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="small"
            className="!h-8 !px-3 !text-[13px] flex-1"
            onClick={() => onOpenInEditor(draft)}
            disabled={disabled}
          >
            Open in editor
          </Button>
          <button
            onClick={() => onRequestCreate(draft)}
            disabled={disabled}
            className="h-8 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] text-[13px] text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create directly
          </button>
        </div>
      </div>
    </div>
  );
}
