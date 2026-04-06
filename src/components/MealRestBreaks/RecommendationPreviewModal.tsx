import { Icon } from '../Icon';
import { Button } from '../Button';
import type { PolicyDraft } from '../../data/mealRestBreakRecommendations';
import { durationLabel, availabilityLabel } from '../../data/mealRestBreakRecommendations';

interface Props {
  policy: PolicyDraft | null;
  onUse: (policy: PolicyDraft) => void;
  onClose: () => void;
}

export function RecommendationPreviewModal({ policy, onUse, onClose }: Props) {
  if (!policy) return null;

  const isGenerated = policy.source === 'generated_recommendation';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] w-full max-w-[560px] flex flex-col max-h-[90vh]"
           style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[var(--border-neutral-x-weak)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isGenerated
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-[var(--color-primary-weak)] text-[var(--color-primary-strong)] border-[var(--color-primary-weak)]'
                }`}
              >
                {isGenerated ? <><Icon name="sparkles" size={9} /> Generated</> : <><Icon name="star" size={9} /> Recommended</>}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--surface-neutral-xx-weak)] rounded-full text-[12px] text-[var(--text-neutral-medium)]">
                <Icon name="clock" size={11} />
                {policy.breaks.length} Break{policy.breaks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <h2
              className="text-[22px] font-bold text-[var(--text-neutral-x-strong)]"
              style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
            >
              {policy.policyName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-neutral-xx-weak)] transition-colors ml-4 shrink-0"
          >
            <Icon name="xmark" size={14} className="text-[var(--icon-neutral-strong)]" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <p className="text-[14px] text-[var(--text-neutral-medium)] mb-5 leading-[20px]">
            {policy.policyDescription}
          </p>

          {policy.recommendationReason && (
            <div className="flex items-start gap-2 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-x-small)] px-4 py-3 mb-5">
              <Icon name="circle-info" size={14} className="text-[var(--color-primary-strong)] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[var(--text-neutral-medium)]">{policy.recommendationReason}</p>
            </div>
          )}

          <h3 className="text-[13px] font-semibold text-[var(--text-neutral-strong)] uppercase tracking-wide mb-3">
            Breaks in this policy
          </h3>

          <div className="space-y-2">
            {policy.breaks.map(b => (
              <div
                key={b.id}
                className="flex items-center justify-between border border-[var(--border-neutral-xx-weak)] rounded-[var(--radius-x-small)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--border-neutral-medium)] shrink-0" />
                  <span className="text-[14px] font-medium text-[var(--text-neutral-strong)]">{b.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[var(--text-neutral-medium)]">{durationLabel(b.durationMinutes)}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      b.type === 'paid'
                        ? 'bg-[var(--color-primary-weak)] text-[var(--color-primary-strong)]'
                        : 'bg-[var(--surface-neutral-xx-weak)] text-[var(--text-neutral-medium)]'
                    }`}
                  >
                    {b.type === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className="text-[13px] text-[var(--text-neutral-medium)]">{availabilityLabel(b)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--border-neutral-x-weak)]">
          <Button variant="primary" size="medium" onClick={() => onUse(policy)}>
            Use this policy
          </Button>
          <button
            onClick={onClose}
            className="text-[15px] font-medium text-[var(--color-link)] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
