import { useState } from 'react';
import { Icon } from '../Icon';
import { useArtifact } from '../../contexts/ArtifactContext';
import { useChat } from '../../contexts/ChatContext';
import type { PlanSettings, ReviewStep } from '../../data/artifactData';

interface MockAttentionItem {
  id: string;
  text: string;
  severity: 'info' | 'urgent';
  type: 'mock';
  detail: string;
}

interface RealReviewItem {
  id: string;
  text: string;
  severity: 'attention';
  type: 'review';
  artifact: any;
  reviewStep: ReviewStep;
}

type AttentionItem = MockAttentionItem | RealReviewItem;

const mockAttentionItems: MockAttentionItem[] = [
  {
    id: 'attn-1',
    text: "3 employees haven't taken PTO in 6+ months",
    severity: 'info',
    type: 'mock',
    detail: 'Employees without recent PTO: Sarah Chen (8 months), Michael Torres (7 months), Jennifer Wu (6 months). Consider reaching out to encourage work-life balance.',
  },
  {
    id: 'attn-2',
    text: 'I-9 reverification due in 8 days for David Kim',
    severity: 'urgent',
    type: 'mock',
    detail: 'Work authorization document expires Feb 14, 2026. Employee must provide updated documentation before expiration to maintain work eligibility.',
  },
  {
    id: 'attn-3',
    text: '4 approvals pending more than 5 days',
    severity: 'info',
    type: 'mock',
    detail: 'Pending approvals: 2 time-off requests (Emily Rodriguez, James Patterson), 1 expense report (Rachel Green), 1 equipment request (Daniel Kim).',
  },
  {
    id: 'attn-4',
    text: '2 timesheets missing before payroll deadline',
    severity: 'urgent',
    type: 'mock',
    detail: 'Missing timesheets from Tony Ramirez and Lisa Anderson. Payroll processes in 2 days. Follow up required to avoid payment delays.',
  },
];

const severityConfig = {
  info: {
    icon: 'circle-info' as const,
    color: '#D97706', // amber
  },
  urgent: {
    icon: 'circle-x' as const,
    color: '#DC2626', // red
  },
  attention: {
    icon: 'hand' as const,
    color: '#2e7918', // green (for review steps)
  },
};

export function AttentionCard() {
  const { artifacts } = useArtifact();
  const { selectConversation } = useChat();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Get real review steps that are ready
  const readyReviews: RealReviewItem[] = artifacts
    .filter(a => a.type === 'plan' && (a.settings as PlanSettings).status === 'running')
    .flatMap(artifact => {
      const settings = artifact.settings as PlanSettings;
      return (settings.reviewSteps || [])
        .filter(rs => rs.status === 'ready')
        .map(rs => ({
          id: `${artifact.id}-${rs.id}`,
          text: `Review needed: ${artifact.title} — ${rs.reviewer}`,
          severity: 'attention' as const,
          type: 'review' as const,
          artifact,
          reviewStep: rs,
        }));
    });

  // Combine mock + real (reviews first since they're higher priority)
  const allAttentionItems: AttentionItem[] = [...readyReviews, ...mockAttentionItems];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleGoToReview = (item: RealReviewItem) => {
    if (item.artifact.conversationId) {
      selectConversation(item.artifact.conversationId);
      localStorage.setItem('bhr-chat-panel-open', 'true');
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div
      className="
        flex flex-col
        bg-[var(--surface-neutral-white)]
        border border-[var(--border-neutral-x-weak)]
        rounded-[var(--radius-small)]
        overflow-hidden
      "
      style={{
        boxShadow: 'var(--shadow-300)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col">
        {/* Title Row */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Icon
              name="bell"
              size={20}
              className="text-[var(--color-primary-strong)]"
            />
            <h3
              className="
                font-bold text-base leading-6
                text-[var(--color-primary-strong)]
              "
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Needs Your Attention
            </h3>
          </div>
          <a
            href="#"
            className="text-sm text-[var(--color-primary-strong)] hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            View All Insights
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-neutral-x-weak)]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {allAttentionItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="check-circle" size={32} className="text-[var(--color-primary-strong)] mb-3" />
            <p className="text-sm text-[var(--text-neutral-medium)]">All caught up!</p>
            <p className="text-xs text-[var(--text-neutral-weak)] mt-1">
              No items need your attention right now
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {allAttentionItems.map((item) => {
              const isExpanded = expandedId === item.id;
              const config = severityConfig[item.severity];

              return (
                <div key={item.id} className="border-b border-[var(--border-neutral-x-weak)] last:border-b-0">
                  {/* Row */}
                  <div
                    className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Severity icon */}
                    <Icon
                      name={config.icon}
                      size={18}
                      className="shrink-0"
                      style={{ color: config.color }}
                    />

                    {/* Description */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--text-neutral-x-strong)]">
                        {item.text}
                      </div>
                    </div>

                    {/* Chevron */}
                    <Icon
                      name="chevron-down"
                      size={16}
                      className="text-[var(--text-neutral-medium)] shrink-0 transition-transform"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </div>

                  {/* Expansion content */}
                  {isExpanded && (
                    <div className="px-6 pb-4 pt-0">
                      {item.type === 'mock' ? (
                        // Mock attention detail
                        <div className="text-sm text-[var(--text-neutral-medium)] bg-[var(--surface-neutral-xx-weak)] rounded-lg p-4">
                          {item.detail}
                        </div>
                      ) : (
                        // Real review step detail
                        <ReviewDetail
                          item={item}
                          onGoToReview={() => handleGoToReview(item)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Review detail component for expansion
function ReviewDetail({ item, onGoToReview }: { item: RealReviewItem; onGoToReview: () => void }) {
  const settings = item.artifact.settings as PlanSettings;
  const allItems = settings.sections.flatMap(s => s.actionItems || []);
  const doneItems = allItems.filter(i => i.status === 'done');

  return (
    <div className="bg-[var(--surface-neutral-xx-weak)] rounded-lg p-4 space-y-3">
      {/* Plan context */}
      <div className="text-sm text-[var(--text-neutral-medium)]">
        <div className="font-medium text-[var(--text-neutral-x-strong)] mb-1">
          {item.artifact.title}
        </div>
        <div className="text-xs text-[var(--text-neutral-weak)]">
          {doneItems.length} of {allItems.length} items complete
        </div>
      </div>

      {/* Review step description */}
      <div className="text-sm text-[var(--text-neutral-medium)] py-2 px-3 bg-[var(--surface-neutral-white)] rounded border border-[var(--border-neutral-x-weak)]">
        {item.reviewStep.description}
      </div>

      {/* Go to review button */}
      <button
        onClick={onGoToReview}
        className="
          px-4 py-2
          text-sm font-medium
          text-[var(--surface-neutral-white)]
          rounded-lg
          transition-colors
        "
        style={{
          backgroundColor: 'var(--color-primary-strong)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        Go to review
      </button>
    </div>
  );
}

export default AttentionCard;
