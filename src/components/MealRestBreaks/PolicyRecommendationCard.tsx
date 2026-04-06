import { Icon } from '../Icon';
import { Button } from '../Button';
import type { PolicyDraft } from '../../data/mealRestBreakRecommendations';
import { durationLabel, availabilityLabel } from '../../data/mealRestBreakRecommendations';

interface Props {
  policy: PolicyDraft;
  onUse: (policy: PolicyDraft) => void;
  onPreview: (policy: PolicyDraft) => void;
}

export function PolicyRecommendationCard({ policy, onUse, onPreview }: Props) {
  const isGenerated = policy.source === 'generated_recommendation';

  return (
    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] p-5 flex flex-col">

      {/* Top row: source badge + break count */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
            isGenerated
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'bg-[var(--color-primary-weak)] text-[var(--color-primary-strong)] border-[var(--color-primary-weak)]'
          }`}
        >
          {isGenerated ? (
            <>
              <Icon name="sparkles" size={9} />
              Generated
            </>
          ) : (
            <>
              <Icon name="star" size={9} />
              Recommended
            </>
          )}
        </span>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--surface-neutral-xx-weak)] rounded-full text-[12px] font-medium text-[var(--text-neutral-medium)]">
          <Icon name="clock" size={11} />
          {policy.breaks.length} Break{policy.breaks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Policy name */}
      <h4
        className="text-[16px] font-bold text-[var(--text-neutral-x-strong)] mb-1.5 leading-[22px]"
        style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
      >
        {policy.policyName}
      </h4>

      {/* Description */}
      <p className="text-[13px] text-[var(--text-neutral-medium)] mb-4 leading-[18px] flex-shrink-0">
        {policy.policyDescription}
      </p>

      {/* Break preview list */}
      <div className="border-t border-[var(--border-neutral-xx-weak)] pt-3 mb-3 space-y-2">
        {policy.breaks.map(b => (
          <div key={b.id} className="flex items-center gap-2 text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-neutral-medium)] shrink-0" />
            <span className="font-medium text-[var(--text-neutral-strong)] flex-1 truncate">{b.name}</span>
            <span className="text-[var(--text-neutral-medium)] shrink-0">{durationLabel(b.durationMinutes)}</span>
            <span
              className={`px-1.5 py-0 rounded text-[10px] font-semibold shrink-0 ${
                b.type === 'paid'
                  ? 'bg-[var(--color-primary-weak)] text-[var(--color-primary-strong)]'
                  : 'bg-[var(--surface-neutral-xx-weak)] text-[var(--text-neutral-medium)]'
              }`}
            >
              {b.type === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
            <span className="text-[var(--text-neutral-weak)] shrink-0 text-[11px]">{availabilityLabel(b)}</span>
          </div>
        ))}
      </div>

      {/* Reason */}
      {policy.recommendationReason && (
        <div className="flex items-start gap-1.5 mb-4">
          <Icon name="circle-info" size={12} className="mt-0.5 shrink-0 text-[var(--color-primary-strong)]" />
          <span className="text-[12px] text-[var(--text-neutral-medium)] leading-[16px]">
            {policy.recommendationReason}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        <Button
          variant="primary"
          size="small"
          className="!h-8 !px-3 !text-[13px] flex-1"
          onClick={() => onUse(policy)}
        >
          Use this policy
        </Button>
        <button
          onClick={() => onPreview(policy)}
          className="h-8 px-3 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] text-[13px] text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors shrink-0"
        >
          Preview
        </button>
      </div>
    </div>
  );
}
