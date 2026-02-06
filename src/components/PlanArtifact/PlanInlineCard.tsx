import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../Icon';
import { Button } from '../Button';
import { useArtifact } from '../../contexts/ArtifactContext';
import type { Artifact, PlanSettings, PlanStatus, ActionItem, PlanSection, ReviewStep } from '../../data/artifactData';

// Map section titles to icons based on keywords
function getSectionIcon(title: string): IconName {
  const lower = title.toLowerCase();
  if (lower.includes('immediate') || lower.includes('urgent') || lower.includes('critical')) return 'bolt';
  if (lower.includes('hiring') || lower.includes('recruit') || lower.includes('candidate')) return 'user-plus';
  if (lower.includes('retention') || lower.includes('health') || lower.includes('morale') || lower.includes('wellness')) return 'shield-heart';
  if (lower.includes('timeline') || lower.includes('schedule') || lower.includes('milestone')) return 'calendar';
  if (lower.includes('budget') || lower.includes('cost') || lower.includes('compensation') || lower.includes('salary')) return 'circle-dollar';
  if (lower.includes('training') || lower.includes('development') || lower.includes('learning')) return 'graduation-cap';
  if (lower.includes('communication') || lower.includes('announce') || lower.includes('notify')) return 'bullhorn';
  if (lower.includes('compliance') || lower.includes('legal') || lower.includes('policy')) return 'shield';
  if (lower.includes('onboard') || lower.includes('welcome')) return 'door-open';
  if (lower.includes('review') || lower.includes('assess') || lower.includes('evaluat')) return 'clipboard';
  if (lower.includes('strateg') || lower.includes('plan')) return 'compass';
  if (lower.includes('team') || lower.includes('people') || lower.includes('staff')) return 'users';
  if (lower.includes('report') || lower.includes('analys') || lower.includes('data')) return 'chart-simple';
  if (lower.includes('document') || lower.includes('knowledge') || lower.includes('transfer')) return 'file-lines';
  return 'list-check'; // fallback
}

interface PlanInlineCardProps {
  artifact: Artifact;
  compact?: boolean;
}

// Helper to calculate relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

// Action item status icon component (16x16 circles)
function ActionItemIcon({ status }: { status: 'planned' | 'queued' | 'working' | 'done' }) {
  if (status === 'done') {
    return (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#D1FAE5',
          color: '#059669',
        }}
      >
        <Icon name="check" size={8} />
      </div>
    );
  }

  if (status === 'working') {
    return (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#DBEAFE',
        }}
      >
        <div
          className="animate-spin"
          style={{
            width: '8px',
            height: '8px',
            border: '1.5px solid #2563EB',
            borderTopColor: 'transparent',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  if (status === 'queued') {
    // Solid dot for queued — avoids checkbox affordance
    return (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '16px',
          height: '16px',
        }}
      >
        <div
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#A8A29E',
          }}
        />
      </div>
    );
  }

  // planned (proposal state) — solid dot, not an empty circle (avoids checkbox affordance)
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: '16px',
        height: '16px',
      }}
    >
      <div
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: '#D6D3D1',
        }}
      />
    </div>
  );
}

// Single action item row
function InlineActionItem({
  item,
  displayStatus,
}: {
  item: ActionItem;
  displayStatus: 'planned' | 'queued' | 'working' | 'done';
}) {
  return (
    <div
      className="flex items-center gap-1.5 py-1"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <ActionItemIcon status={displayStatus} />
      <span
        className={displayStatus === 'done' ? 'line-through' : ''}
        style={{
          fontSize: '14px',
          lineHeight: '20px',
          color: displayStatus === 'done' ? 'var(--text-neutral-weak)' : 'var(--text-neutral-strong)',
        }}
      >
        {item.description}
      </span>
    </div>
  );
}

// Review step row (rounded square icon with hand)
function ReviewStepRow({
  step,
  onReview,
  isProposal,
}: {
  step: ReviewStep;
  onReview: () => void;
  isProposal?: boolean;
}) {
  const isReady = step.status === 'ready' && !isProposal;

  return (
    <div
      className={`flex items-center gap-1.5 transition-colors ${isReady ? 'review-ready' : ''}`}
      style={{
        padding: '5px 16px 16px 42px',
        borderBottom: '1px solid var(--border-neutral-weak)',
        background: isReady ? 'rgba(46, 121, 24, 0.05)' : 'transparent',
      }}
    >
      <div
        className={`flex items-center justify-center flex-shrink-0 ${isReady ? 'review-pulse' : ''}`}
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          backgroundColor: '#E8F5E3',
          color: '#2e7918',
          position: 'relative',
          opacity: step.status === 'planned' ? 0.7 : step.status === 'future' ? 0.45 : 1,
          border: isReady ? '1.5px solid #2e7918' : 'none',
        }}
      >
        <Icon name="eye" size={9} />
        {step.status === 'passed' && (
          <div
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: '#059669',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="check" size={5} />
          </div>
        )}
      </div>
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          lineHeight: '20px',
          color:
            step.status === 'ready'
              ? '#256314'
              : step.status === 'passed'
              ? 'var(--text-neutral-medium)'
              : step.status === 'future'
              ? 'var(--text-neutral-weak)'
              : 'var(--text-neutral-strong)',
          fontWeight: step.status === 'ready' ? 500 : 400,
        }}
      >
        {step.description}
      </span>
      {isReady && (
        <button
          onClick={onReview}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#2e7918',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Icon name="eye" size={9} />
          Needs review
        </button>
      )}
    </div>
  );
}

// Collapsed section row (execution state, all items done)
function CollapsedSectionRow({
  section,
  onExpand,
}: {
  section: PlanSection;
  onExpand: () => void;
}) {
  const items = section.actionItems || [];
  const completedCount = items.filter(item => item.status === 'done').length;
  const totalCount = items.length;

  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
      onClick={onExpand}
      style={{
        padding: '8px 16px',
        borderBottom: '1px solid var(--border-neutral-weak)',
      }}
    >
      <Icon name="chevron-right" size={10} style={{ color: 'var(--text-neutral-weak)' }} />
      <Icon name={getSectionIcon(section.title)} size={15} style={{ color: '#059669' }} />
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          color: 'var(--text-neutral-weak)',
        }}
      >
        {section.title}
      </span>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Icon name="check" size={9} />
        {completedCount}/{totalCount}
      </span>
    </div>
  );
}

// Section row (expanded)
function InlineSectionRow({
  section,
  isProposal,
  isCompleted,
  isExpanded,
  isWorking,
  isBlocked,
  blockedByReviewer,
  onToggleExpand,
}: {
  section: PlanSection;
  isProposal: boolean;
  isCompleted: boolean;
  isExpanded: boolean;
  isWorking: boolean;
  isBlocked: boolean;
  blockedByReviewer?: string;
  onToggleExpand: () => void;
}) {
  const items = section.actionItems || [];

  const iconName = getSectionIcon(section.title);

  // Icon color based on state
  const iconColor = isProposal
    ? 'var(--text-neutral-medium)'
    : isCompleted
    ? '#059669'
    : isWorking
    ? '#2563EB'
    : '#A8A29E';

  return (
    <div style={{ padding: '10px 16px 4px' }}>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-1.5">
        <Icon name={iconName} size={15} style={{ color: iconColor, width: '20px', textAlign: 'center' }} />
        <span
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-neutral-xx-strong)',
            flex: 1,
          }}
        >
          {section.title}
        </span>
        {/* Working badge */}
        {isWorking && !isProposal && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: '99px',
              backgroundColor: '#DBEAFE',
              color: '#2563EB',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <div
              className="animate-spin"
              style={{
                width: '7px',
                height: '7px',
                border: '1px solid #2563EB',
                borderTopColor: 'transparent',
                borderRadius: '50%',
              }}
            />
            Working
          </span>
        )}
        {/* Blocked badge */}
        {isBlocked && !isProposal && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: '99px',
              backgroundColor: 'var(--color-queued-light)',
              color: 'var(--text-neutral-weak)',
            }}
          >
            Pending {blockedByReviewer}'s review
          </span>
        )}
      </div>

      {/* Items container */}
      <div style={{ paddingLeft: '26px' }}>
        {items.map(item => {
          // Determine display status
          let displayStatus: 'planned' | 'queued' | 'working' | 'done' = 'planned';
          if (!isProposal) {
            if (item.status === 'done') displayStatus = 'done';
            else if (item.status === 'working') displayStatus = 'working';
            else displayStatus = 'queued';
          }

          return (
            <InlineActionItem
              key={item.id}
              item={item}
              displayStatus={displayStatus}
            />
          );
        })}
      </div>
    </div>
  );
}

export function PlanInlineCard({ artifact }: PlanInlineCardProps) {
  const navigate = useNavigate();
  const { updateArtifactSettings } = useArtifact();
  const settings = artifact.settings as PlanSettings;

  // Track which sections are collapsed (in execution, completed sections collapse by default)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const isProposal = settings.status === 'proposed' || settings.status === 'draft' || settings.status === 'pending_approval';
    if (!isProposal) {
      settings.sections.forEach(section => {
        const allCompleted = section.actionItems?.every(item => item.status === 'done') ?? false;
        initial[section.id] = allCompleted;
      });
    }
    return initial;
  });

  const isProposal = settings.status === 'proposed' || settings.status === 'draft' || settings.status === 'pending_approval';

  // Auto-collapse sections when all items become completed
  useEffect(() => {
    if (!isProposal) {
      const updates: Record<string, boolean> = {};
      settings.sections.forEach(section => {
        const allCompleted = section.actionItems?.every(item => item.status === 'done') ?? false;
        if (allCompleted && !collapsedSections[section.id]) {
          updates[section.id] = true;
        }
      });
      if (Object.keys(updates).length > 0) {
        setCollapsedSections(prev => ({ ...prev, ...updates }));
      }
    }
  }, [settings.sections, isProposal, collapsedSections]);

  // Calculate progress (only sections with action items)
  const sectionsWithItems = settings.sections.filter(s => s.actionItems && s.actionItems.length > 0);
  const allActionItems = sectionsWithItems.flatMap(s => s.actionItems || []);
  const completedCount = allActionItems.filter(ai => ai.status === 'done').length;
  const totalCount = allActionItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Determine card badge
  const reviewSteps = settings.reviewSteps || [];
  const hasReadyReview = reviewSteps.some(rs => rs.status === 'ready');

  let badgeLabel = 'Proposed';
  let badgeIcon = 'file-pen';
  let badgeBg = '#EDE9FE';
  let badgeColor = '#7C3AED';
  let showSpinner = false;

  if (!isProposal) {
    if (settings.status === 'completed' || settings.status === 'done') {
      badgeLabel = 'Completed';
      badgeIcon = 'check';
      badgeBg = '#D1FAE5';
      badgeColor = '#065F46';
    } else if (hasReadyReview) {
      badgeLabel = 'Needs Your Review';
      badgeIcon = 'hand';
      badgeBg = '#FEF3C7';
      badgeColor = '#D97706';
    } else {
      badgeLabel = 'Working';
      badgeIcon = '';
      badgeBg = '#DBEAFE';
      badgeColor = '#1E40AF';
      showSpinner = true;
    }
  }

  const handleToggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleReviewStep = (stepId: string) => {
    const updatedReviewSteps = reviewSteps.map(rs =>
      rs.id === stepId ? { ...rs, status: 'passed' as const } : rs
    );
    updateArtifactSettings(artifact.id, { reviewSteps: updatedReviewSteps });
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateArtifactSettings(artifact.id, {
      status: 'running' as PlanStatus,
      approvedBy: 'Current User',
      approvedAt: new Date().toISOString(),
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/artifact/plan/${artifact.id}`);
  };

  return (
    <>
      <style>{`
        @keyframes review-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46, 121, 24, 0.3); }
          50% { box-shadow: 0 0 0 3px rgba(46, 121, 24, 0.08); }
        }
        .review-pulse {
          animation: review-pulse 2.5s ease-in-out infinite;
        }
      `}</style>
      <div
        className="rounded-xl my-3 overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          border: '1px solid var(--border-neutral-weak)',
        }}
      >
        {/* Header — matches other artifact cards */}
        <div className="flex items-start justify-between gap-3 p-6 pb-0">
          <h3
            className="font-bold"
            style={{
              fontSize: '20px',
              lineHeight: '28px',
              fontFamily: 'Fields, system-ui, sans-serif',
              color: 'var(--color-primary-strong)',
              flex: 1,
            }}
          >
            {artifact.title}
          </h3>

          {/* Three-dot menu */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--border-neutral-medium)',
              color: 'var(--text-neutral-strong)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-neutral-xx-weak)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-neutral-white)';
            }}
            aria-label="Actions"
          >
            <Icon name="ellipsis" size={16} />
          </button>
        </div>

        {/* Status bar: badge + progress/timestamp */}
        <div className="px-6 pt-3 pb-4">
          <div className="flex items-center gap-2.5">
            {/* Status badge */}
            <span
              style={{
                fontSize: '12px',
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: '99px',
                backgroundColor: badgeBg,
                color: badgeColor,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {showSpinner ? (
                <div
                  className="animate-spin"
                  style={{
                    width: '9px',
                    height: '9px',
                    border: '1.5px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <Icon name={badgeIcon} size={9} />
              )}
              {badgeLabel}
            </span>

            {/* Timestamp (execution only) */}
            {!isProposal && (
              <span
                className="flex items-center gap-1"
                style={{
                  fontSize: '12px',
                  color: 'var(--text-neutral-weak)',
                }}
              >
                <Icon name="clock" size={11} variant="regular" />
                Started {getRelativeTime(artifact.createdAt)}
              </span>
            )}
          </div>

          {/* Progress bar (execution only) */}
          {!isProposal && (
            <div className="mt-3">
              <div
                style={{
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#E7E5E4',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercentage}%`,
                    borderRadius: '2px',
                    backgroundColor: '#059669',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Divider before sections */}
        <div style={{ borderTop: '1px solid var(--border-neutral-weak)' }} />

        {/* Sections with interleaved review steps (skip sections with no action items) */}
        {settings.sections
          .map((section, idx) => ({ section, originalIndex: idx }))
          .filter(({ section }) => section.actionItems && section.actionItems.length > 0)
          .map(({ section, originalIndex: idx }) => {
          const allCompleted = section.actionItems?.every(item => item.status === 'done') ?? false;
          const isCollapsed = collapsedSections[section.id] ?? false;

          // Determine if section is working or blocked
          const hasInProgress = section.actionItems?.some(item => item.status === 'working') ?? false;

          // Check if this section is blocked by a review step
          const reviewStep = reviewSteps[idx];
          const isBlocked = !isProposal && reviewStep && reviewStep.status !== 'passed' && reviewStep.status !== 'planned';

          return (
            <div key={section.id}>
              {/* Collapsed section row OR expanded section */}
              {isCollapsed && allCompleted && !isProposal ? (
                <CollapsedSectionRow
                  section={section}
                  onExpand={() => handleToggleSection(section.id)}
                />
              ) : (
                <InlineSectionRow
                  section={section}
                  isProposal={isProposal}
                  isCompleted={allCompleted}
                  isExpanded={!isCollapsed}
                  isWorking={hasInProgress}
                  isBlocked={isBlocked}
                  blockedByReviewer={reviewStep?.reviewer}
                  onToggleExpand={() => handleToggleSection(section.id)}
                />
              )}

              {/* Review step after this section */}
              {reviewStep && (
                <ReviewStepRow
                  step={reviewStep}
                  onReview={() => handleReviewStep(reviewStep.id)}
                  isProposal={isProposal}
                />
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border-neutral-weak)',
            padding: '10px 16px',
          }}
        >
          {isProposal ? (
              <div className="flex gap-2">
                <Button
                  variant="standard"
                  size="small"
                  icon="pen-to-square"
                  onClick={handleEdit}
                  className="flex-1"
                >
                  Edit Plan
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  icon="play"
                  onClick={handleApprove}
                  className="flex-1"
                >
                  Approve & Start
                </Button>
              </div>
          ) : (
            <div className="flex items-center">
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--text-neutral-medium)',
                }}
              >
                {completedCount} of {totalCount} complete
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PlanInlineCard;
