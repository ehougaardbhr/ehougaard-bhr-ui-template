import { useState, useCallback } from 'react';
import { Icon } from '../Icon';
import { PolicyRecommendationCard } from './PolicyRecommendationCard';
import type { PolicyDraft } from '../../data/mealRestBreakRecommendations';
import {
  getDefaultRecommendations,
  generateMoreRecommendations,
} from '../../services/recommendationService';

interface Props {
  onSelectPolicy: (policy: PolicyDraft) => void;
  onPreviewPolicy: (policy: PolicyDraft) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-24 bg-[var(--surface-neutral-xx-weak)] rounded-full" />
        <div className="h-5 w-16 bg-[var(--surface-neutral-xx-weak)] rounded-full" />
      </div>
      <div className="h-5 w-40 bg-[var(--surface-neutral-xx-weak)] rounded mb-2" />
      <div className="space-y-1.5 mb-4">
        <div className="h-3 w-full bg-[var(--surface-neutral-xx-weak)] rounded" />
        <div className="h-3 w-5/6 bg-[var(--surface-neutral-xx-weak)] rounded" />
        <div className="h-3 w-4/6 bg-[var(--surface-neutral-xx-weak)] rounded" />
      </div>
      <div className="border-t border-[var(--border-neutral-xx-weak)] pt-3 space-y-2 mb-4">
        <div className="h-3 w-full bg-[var(--surface-neutral-xx-weak)] rounded" />
        <div className="h-3 w-4/5 bg-[var(--surface-neutral-xx-weak)] rounded" />
      </div>
      <div className="flex gap-2 mt-auto">
        <div className="h-8 flex-1 bg-[var(--surface-neutral-xx-weak)] rounded-full" />
        <div className="h-8 w-20 bg-[var(--surface-neutral-xx-weak)] rounded-full" />
      </div>
    </div>
  );
}

export function MealRestBreakRecommendationsPanel({ onSelectPolicy, onPreviewPolicy }: Props) {
  const [recommendations, setRecommendations] = useState<PolicyDraft[]>(getDefaultRecommendations);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMore = useCallback(async () => {
    setIsGenerating(true);
    const newRecs = await generateMoreRecommendations(recommendations);
    setRecommendations(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const unique = newRecs.filter(r => !existingIds.has(r.id));
      return [...prev, ...unique];
    });
    setIsGenerating(false);
  }, [recommendations]);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-1">
        <Icon name="sparkles" size={14} className="text-[var(--color-primary-strong)]" />
        <h4 className="text-[15px] font-semibold text-[var(--text-neutral-x-strong)]">
          Suggested Policies
        </h4>
      </div>
      <p className="text-[13px] text-[var(--text-neutral-medium)] mb-5">
        Pick a starting point and customize it, or start from scratch using the button above.
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
        {recommendations.map(policy => (
          <PolicyRecommendationCard
            key={policy.id}
            policy={policy}
            onUse={onSelectPolicy}
            onPreview={onPreviewPolicy}
          />
        ))}
        {isGenerating && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>

      {/* Generate more */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateMore}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-full)] border border-[var(--border-neutral-weak)] text-[13px] font-medium text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="arrows-rotate" size={13} className={isGenerating ? 'animate-spin' : ''} />
          {isGenerating ? 'Generating…' : 'Generate more options'}
        </button>
      </div>
    </div>
  );
}
