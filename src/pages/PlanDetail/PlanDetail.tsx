import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { useArtifact } from '../../contexts/ArtifactContext';
import type { PlanSettings } from '../../data/artifactData';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../components/Icon/Icon';
import { FindingCard } from '../../components/PlanDetail/FindingCard';
import { ArtifactPanel, ArtifactInlinePanel } from '../../components/PlanDetail/ArtifactPanel';
import { planDetailDataMap } from '../../data/planDetailData';
import type { PlanDetailData, PlanDetailFinding, StandaloneReviewGate, PlanActionItem, PlanReviewGate, PlanDeliverable, ReviewGateStatus } from '../../data/planDetailData';

// ============================================================================
// Section icon mapping (ported from PlanInlineCard)
// ============================================================================

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
  if (lower.includes('research')) return 'magnifying-glass';
  if (lower.includes('monitor')) return 'radar';
  if (lower.includes('orient') || lower.includes('follow')) return 'clipboard-check';
  if (lower.includes('pre-arrival') || lower.includes('preparation')) return 'box-open';
  if (lower.includes('screen')) return 'filter';
  if (lower.includes('risk')) return 'triangle-exclamation';
  if (lower.includes('employee') || lower.includes('communi')) return 'envelope';
  return 'list-check';
}

// ============================================================================
// Configs
// ============================================================================

const statusConfig = {
  running: {
    badgeBg: '#DBEAFE',
    badgeColor: '#2563EB',
    badgeIcon: 'spinner' as const,
  },
  paused: {
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    badgeIcon: 'hand' as const,
  },
  completed: {
    badgeBg: '#D1FAE5',
    badgeColor: '#059669',
    badgeIcon: 'check' as const,
  },
};

const itemStatusConfig = {
  done: { icon: 'check' as const, bg: '#D1FAE5', color: '#059669' },
  working: { icon: 'spinner' as const, bg: '#DBEAFE', color: '#2563EB' },
  awaiting: { icon: 'clock' as const, bg: '#FEF3C7', color: '#D97706' },
  queued: { icon: 'circle' as const, bg: '#F5F3F2', color: '#A8A29E' },
  planned: { icon: 'circle' as const, bg: '#F5F3F2', color: '#D6D3D1' },
};

const gateStatusConfig = {
  passed: { icon: 'check' as const, bg: '#D1FAE5', color: '#059669' },
  ready: { icon: 'clock' as const, bg: '#FEF3C7', color: '#D97706' },
  waiting: { icon: 'clock' as const, bg: '#FEF3C7', color: '#D97706' },
  future: { icon: 'eye' as const, bg: '#F5F3F2', color: '#A8A29E' },
};

const deliverableTypeStyles = {
  chart: { bg: '#DBEAFE', color: '#2563EB' },
  report: { bg: '#E8F5E3', color: '#2e7918' },
  text: { bg: '#EDE9FE', color: '#7C3AED' },
  job: { bg: '#FEF3C7', color: '#D97706' },
};

// ============================================================================
// Main Component
// ============================================================================

// Map tool calls to deliverable IDs on the plan detail page
const toolToDeliverableId: Record<string, string> = {
  analyze_org_impact: 'org',
  analyze_compensation: 'comp',
  create_job_posting: 'jobreq',
  identify_flight_risks: 'risk-report',
  screen_talent_pool: 'screening',
  assess_promotion_readiness: 'readiness',
  generate_report: 'report',
  analyze_time_off_patterns: 'pto-report',
};

export function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectConversation } = useChat();
  const { artifacts } = useArtifact();
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const deliverablesRef = useRef<HTMLDivElement>(null);

  // Check for a live artifact first, then fall back to hardcoded data
  const plan: PlanDetailData | null = useMemo(() => {
    // Look for a live plan artifact that routes here
    const liveArtifact = artifacts.find(
      a => a.type === 'plan' && (a.settings as PlanSettings).status !== 'proposed'
    );

    // If the route is plan-backfill-mid and we have a live plan, use it
    if (id === 'plan-backfill-mid' && liveArtifact) {
      const settings = liveArtifact.settings as PlanSettings;
      const allItems = settings.sections.flatMap(s => s.actionItems || []);
      const doneItems = allItems.filter(i => i.status === 'done');
      const hasPendingApproval = (settings.reviewSteps || []).some(r => r.status === 'ready');

      // Determine display status — pending approval trumps completed
      let status: 'running' | 'paused' | 'completed' = settings.status === 'proposed' ? 'running' : settings.status;
      let statusLabel = settings.status === 'running' ? 'Running'
        : settings.status === 'completed' ? 'Completed'
        : 'Waiting for approval';
      if (hasPendingApproval) {
        status = 'paused';
        statusLabel = 'Waiting for approval';
      }

      // Convert live action items to PlanDetailData format
      const actionItems: PlanActionItem[] = allItems.map((item, idx) => ({
        id: item.id || `live-item-${idx}`,
        label: item.description,
        status: item.status === 'planned' ? 'planned'
          : item.status === 'queued' ? 'queued'
          : item.status === 'working' ? 'working'
          : item.status === 'done' ? 'done'
          : 'planned' as const,
        timestamp: item.status === 'done' ? 'Just now' : undefined,
        section: settings.sections.find(s => (s.actionItems || []).some(ai => ai.id === item.id))?.title || 'Tasks',
      }));

      // Convert review steps to review gates
      const reviewGates: PlanReviewGate[] = (settings.reviewSteps || []).map((rs, idx) => ({
        id: rs.id || `live-gate-${idx}`,
        afterItemId: rs.afterItem || allItems[allItems.length - 1]?.id || '',
        status: rs.status === 'passed' ? 'passed'
          : rs.status === 'ready' ? 'waiting'
          : 'future' as ReviewGateStatus,
        reviewer: rs.reviewer,
        description: rs.description,
      }));

      // Use hardcoded deliverables/artifacts as fallback
      const hardcoded = planDetailDataMap[id];

      return {
        id: liveArtifact.id,
        title: liveArtifact.title,
        subtitle: hardcoded?.subtitle || 'Tony Ramirez',
        status,
        statusLabel,
        startedAt: 'Started just now',
        totalItems: allItems.length,
        completedItems: doneItems.length,
        totalReviews: (settings.reviewSteps || []).length,
        totalArtifacts: hardcoded?.totalArtifacts || 0,
        conversationId: liveArtifact.conversationId || '',
        actionItems,
        reviewGates,
        deliverables: hardcoded?.deliverables || [],
        artifactContents: hardcoded?.artifactContents || {},
      };
    }

    // Fall back to hardcoded data
    return id ? planDetailDataMap[id] || null : null;
  }, [id, artifacts]);

  // Auto-open deliverable from query param (e.g., ?deliverable=analyze_compensation)
  useEffect(() => {
    const toolCall = searchParams.get('deliverable');
    if (!toolCall || !plan) return;

    // Map tool call to deliverable ID
    const deliverableId = toolToDeliverableId[toolCall];
    if (!deliverableId) return;

    // Check the deliverable exists on this plan
    const exists = plan.deliverables?.some(d => d.id === deliverableId);
    if (!exists) return;

    // Open the deliverable
    setActiveArtifactId(deliverableId);

    // Clear the query param so it doesn't re-trigger
    setSearchParams({}, { replace: true });

    // Scroll to deliverables section after a short delay for render
    setTimeout(() => {
      deliverablesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [plan, searchParams, setSearchParams]);

  if (!plan) {
    return (
      <div className="p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-[var(--text-neutral-x-strong)]">Plan not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-[var(--color-primary-strong)] hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleOpenInChat = () => {
    if (plan.conversationId) {
      selectConversation(plan.conversationId);
      localStorage.setItem('bhr-chat-panel-open', 'true');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const activeArtifact = activeArtifactId ? plan.artifactContents[activeArtifactId] : null;
  const config = statusConfig[plan.status];
  const hasActionItems = plan.actionItems && plan.actionItems.length > 0;
  const progressPct = plan.totalItems > 0 ? (plan.completedItems / plan.totalItems) * 100 : 0;

  return (
    <div className="p-10 h-full overflow-y-auto">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[var(--text-neutral-medium)] hover:text-[var(--text-neutral-strong)] mb-4 transition-colors"
      >
        <Icon name="chevron-left" size={14} />
        Back
      </button>

      {/* Page title — BHR Fields font style */}
      <div className="flex items-baseline gap-3 mb-3">
        <h1
          style={{
            fontFamily: 'Fields, system-ui, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
            color: '#2e7918',
          }}
        >
          {plan.title}
        </h1>
        {plan.subtitle && (
          <span
            style={{
              fontFamily: 'Fields, system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: '32px',
              color: 'var(--text-neutral-medium)',
            }}
          >
            {plan.subtitle}
          </span>
        )}
      </div>

      {/* Status pills row */}
      <div className="flex items-center gap-4 flex-wrap mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: config.badgeBg, color: config.badgeColor }}
        >
          <Icon name={config.badgeIcon} size={11} />
          {plan.statusLabel}
        </span>

        <span className="flex items-center gap-1.5 text-sm text-[var(--text-neutral-medium)]">
          <Icon name="clock" size={12} variant="regular" />
          {plan.completedAt || plan.startedAt}
        </span>

        <span className="text-sm text-[var(--text-neutral-medium)]">
          {plan.completedItems} of {plan.totalItems} steps complete
        </span>

        <button
          onClick={handleOpenInChat}
          className="flex items-center gap-1.5 text-sm text-[var(--color-primary-strong)] hover:underline"
        >
          <Icon name="comment" size={12} variant="regular" />
          {plan.status === 'completed' ? 'View conversation' : 'Open in chat'}
        </button>
      </div>

      {/* Progress bar */}
      {plan.totalItems > 0 && (
        <div className="mb-8">
          <div className="h-1 bg-[var(--surface-neutral-x-weak)] rounded-full overflow-hidden" style={{ maxWidth: 400 }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                backgroundColor: plan.status === 'completed' ? '#059669' : '#2563EB',
              }}
            />
          </div>
        </div>
      )}

      {/* Main content area */}
      {hasActionItems ? (
        <div style={{ maxWidth: 860 }}>
          <ActionItemsView
            plan={plan}
            activeArtifactId={activeArtifactId}
            onArtifactClick={setActiveArtifactId}
            deliverablesRef={deliverablesRef}
          />

          {/* Artifact content below the card */}
          <ArtifactInlinePanel
            artifact={activeArtifact}
            onClose={() => setActiveArtifactId(null)}
          />

          {/* Completion banner */}
          {plan.status === 'completed' && <CompletionBanner plan={plan} />}
        </div>
      ) : (
        <div className="flex gap-0 min-h-0">
          <div
            className="flex-1 transition-all duration-300 ease-in-out"
            style={{ maxWidth: activeArtifactId ? 640 : 860 }}
          >
            <FindingsView
              plan={plan}
              activeArtifactId={activeArtifactId}
              onArtifactClick={setActiveArtifactId}
              onOpenInChat={handleOpenInChat}
            />
            {plan.status === 'completed' && <CompletionBanner plan={plan} />}
          </div>
          <ArtifactPanel artifact={activeArtifact} onClose={() => setActiveArtifactId(null)} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Section grouping helpers
// ============================================================================

interface SectionGroup {
  title: string;
  items: PlanActionItem[];
  isCompleted: boolean;
  isWorking: boolean;
  isBlocked: boolean;
  blockedByReviewer?: string;
}

function groupItemsIntoSections(
  actionItems: PlanActionItem[],
  reviewGates: PlanReviewGate[],
  localGateStatuses: Record<string, ReviewGateStatus>,
): SectionGroup[] {
  // Group consecutive items by section
  const sections: { title: string; items: PlanActionItem[] }[] = [];
  let current: { title: string; items: PlanActionItem[] } | null = null;

  for (const item of actionItems) {
    const sectionTitle = item.section || 'Steps';
    if (!current || current.title !== sectionTitle) {
      current = { title: sectionTitle, items: [] };
      sections.push(current);
    }
    current.items.push(item);
  }

  // Map each item ID to its section index
  const itemToSectionIdx = new Map<string, number>();
  sections.forEach((section, idx) => {
    section.items.forEach(item => itemToSectionIdx.set(item.id, idx));
  });

  // Compute state for each section
  return sections.map((section, idx) => {
    const isCompleted = section.items.every(i => i.status === 'done');
    const isWorking = section.items.some(i => i.status === 'working');

    // Check if blocked: no done/working items AND an unresolved gate exists before this section
    const hasStarted = section.items.some(i => i.status === 'done' || i.status === 'working');
    let isBlocked = false;
    let blockedByReviewer: string | undefined;

    if (!hasStarted && idx > 0) {
      for (const gate of reviewGates) {
        const effectiveStatus = localGateStatuses[gate.id] || gate.status;
        if (effectiveStatus !== 'ready' && effectiveStatus !== 'waiting') continue;
        const gateSectionIdx = itemToSectionIdx.get(gate.afterItemId);
        if (gateSectionIdx !== undefined && gateSectionIdx < idx) {
          isBlocked = true;
          blockedByReviewer = gate.reviewer;
          break;
        }
      }
    }

    return { ...section, isCompleted, isWorking, isBlocked, blockedByReviewer };
  });
}

// ============================================================================
// Action Items View (with sections)
// ============================================================================

function ActionItemsView({
  plan,
  activeArtifactId,
  onArtifactClick,
  deliverablesRef,
}: {
  plan: PlanDetailData;
  activeArtifactId: string | null;
  onArtifactClick: (id: string | null) => void;
  deliverablesRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const actionItems = plan.actionItems || [];
  const reviewGates = plan.reviewGates || [];
  const deliverables = plan.deliverables || [];

  // Local state for interactive approval
  const [localGateStatuses, setLocalGateStatuses] = useState<Record<string, ReviewGateStatus>>({});

  const handleApproveGate = (gate: PlanReviewGate) => {
    setLocalGateStatuses(prev => ({ ...prev, [gate.id]: 'passed' }));
  };

  const getEffectiveStatus = (gate: PlanReviewGate): ReviewGateStatus => {
    return localGateStatuses[gate.id] || gate.status;
  };

  // Group into sections
  const sections = groupItemsIntoSections(actionItems, reviewGates, localGateStatuses);

  // Build gate map by afterItemId
  const gatesByItemId = new Map<string, PlanReviewGate>();
  for (const gate of reviewGates) {
    gatesByItemId.set(gate.afterItemId, gate);
  }

  // Check if items have sections defined
  const hasSections = actionItems.some(i => i.section);

  return (
    <div
      className="bg-[var(--surface-neutral-white)] rounded-2xl border border-[var(--border-neutral-weak)] overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {/* Sections with action items */}
      <div className="p-6">
        {sections.map((section, sIdx) => (
          <div key={section.title} className={sIdx > 0 ? 'mt-5' : ''}>
            {/* Section header — only show if items have section labels */}
            {hasSections && (
              <SectionHeader
                title={section.title}
                isCompleted={section.isCompleted}
                isWorking={section.isWorking}
                isBlocked={section.isBlocked}
                blockedByReviewer={section.blockedByReviewer}
              />
            )}

            {/* Items in this section */}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const gate = gatesByItemId.get(item.id);
                return (
                  <div key={item.id}>
                    <ActionItemRow item={item} />
                    {gate && (
                      <ReviewGateRow
                        gate={gate}
                        effectiveStatus={getEffectiveStatus(gate)}
                        onApprove={() => handleApproveGate(gate)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Deliverables section */}
      {deliverables.length > 0 && (
        <div ref={deliverablesRef} className="px-6 pt-2 pb-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-neutral-weak)]">
              Deliverables
            </span>
            <div className="flex-1 h-px bg-[var(--border-neutral-weak)]" />
          </div>
          <div className="flex flex-wrap gap-3">
            {deliverables.map((deliverable) => (
              <DeliverableCard
                key={deliverable.id}
                deliverable={deliverable}
                isActive={activeArtifactId === deliverable.id}
                onClick={() => onArtifactClick(activeArtifactId === deliverable.id ? null : deliverable.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Section Header
// ============================================================================

function SectionHeader({
  title,
  isCompleted,
  isWorking,
  isBlocked,
  blockedByReviewer,
}: {
  title: string;
  isCompleted: boolean;
  isWorking: boolean;
  isBlocked: boolean;
  blockedByReviewer?: string;
}) {
  const iconName = getSectionIcon(title);

  // Icon circle color
  const iconBg = isCompleted ? '#059669' : isWorking ? '#2563EB' : 'var(--color-primary-strong)';
  const innerIcon: IconName = isCompleted ? 'check' : 'sparkles';
  const innerIconSize = isCompleted ? 11 : 10;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {/* Section icon circle */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon name={innerIcon} size={innerIconSize} style={{ color: '#fff' }} />
      </div>

      {/* Section title */}
      <span
        className="text-sm font-semibold text-[var(--text-neutral-xx-strong)]"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {title}
      </span>

      {/* Working badge */}
      {isWorking && !isCompleted && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}
        >
          <span
            className="inline-block w-[7px] h-[7px] rounded-full"
            style={{
              border: '1px solid #2563EB',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          Working
        </span>
      )}

      {/* Blocked badge */}
      {isBlocked && !isCompleted && !isWorking && blockedByReviewer && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ color: '#A8A29E' }}
        >
          {blockedByReviewer === 'You' ? 'Pending your approval' : `Pending ${blockedByReviewer}'s approval`}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Action Item Row
// ============================================================================

function ActionItemRow({ item }: { item: PlanActionItem }) {
  const config = itemStatusConfig[item.status];

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {item.status === 'queued' || item.status === 'planned' ? (
          <div
            className="w-[5px] h-[5px] rounded-full"
            style={{ backgroundColor: config.color }}
          />
        ) : (
          <Icon name={config.icon} size={12} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium ${
            item.status === 'done'
              ? 'text-[var(--text-neutral-strong)]'
              : item.status === 'planned' || item.status === 'queued'
                ? 'text-[var(--text-neutral-medium)]'
                : 'text-[var(--text-neutral-x-strong)]'
          }`}
        >
          {item.label}
        </div>
      </div>
      {item.timestamp && (
        <span className="text-[11px] text-[var(--text-neutral-weak)] flex-shrink-0">
          {item.timestamp}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Review Gate Row (with reviewer info + interactive approval)
// ============================================================================

function ReviewGateRow({
  gate,
  effectiveStatus,
  onApprove,
}: {
  gate: PlanReviewGate;
  effectiveStatus: ReviewGateStatus;
  onApprove: () => void;
}) {
  const isClickable = effectiveStatus === 'ready' || effectiveStatus === 'waiting';
  const wasJustApproved = effectiveStatus === 'passed' && gate.status !== 'passed';
  const isPassed = effectiveStatus === 'passed';
  const isFuture = effectiveStatus === 'future';

  // Match chat pill styling — amber for waiting, green for passed, grey for future
  const pillStyle = isPassed || wasJustApproved
    ? { bg: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0', iconName: 'check-circle' as const }
    : isFuture
    ? { bg: 'var(--surface-neutral-xx-weak)', color: 'var(--text-neutral-weak)', border: '1px solid var(--border-neutral-weak)', iconName: 'clipboard-check' as const }
    : { bg: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', iconName: 'clipboard-check' as const };

  return (
    <div
      className={`inline-flex items-center gap-2.5 ml-10 mb-1 ${
        isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      style={{
        padding: '8px 14px',
        borderRadius: '8px',
        backgroundColor: pillStyle.bg,
        color: pillStyle.color,
        border: pillStyle.border,
      }}
      onClick={isClickable ? onApprove : undefined}
    >
      <Icon name={pillStyle.iconName} size={14} style={{ flexShrink: 0 }} />
      <div className="min-w-0">
        <div className="text-sm font-medium">
          {wasJustApproved ? (
            'Approved by you'
          ) : isClickable && gate.reviewer === 'You' ? (
            gate.description || gate.label || 'Requires your approval'
          ) : isPassed ? (
            'Approved' + (gate.reviewer === 'You' ? ' by you' : ` by ${gate.reviewer}`)
          ) : (
            gate.label || gate.description || 'Pending review'
          )}
        </div>
        {isClickable && gate.reviewer === 'You' && (
          <div className="text-xs mt-0.5 opacity-75">
            Click to approve
          </div>
        )}
        {!isClickable && !wasJustApproved && gate.reviewer && gate.reviewer !== 'You' && (
          <div className="text-xs mt-0.5 opacity-75">
            {gate.reviewer}{gate.reviewerTitle ? `, ${gate.reviewerTitle}` : ''}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Deliverable Card
// ============================================================================

const approvalStyles = {
  approved: { bg: '#D1FAE5', color: '#059669', icon: 'check' as const, label: 'Approved' },
  waiting: { bg: '#FEF3C7', color: '#D97706', icon: 'clock' as const, label: 'Awaiting approval' },
  not_required: { bg: '#F5F3F2', color: '#A8A29E', icon: 'minus' as const, label: 'N/A' },
};

function DeliverableCard({
  deliverable,
  isActive,
  onClick,
}: {
  deliverable: PlanDeliverable;
  isActive: boolean;
  onClick: () => void;
}) {
  const typeStyle = deliverableTypeStyles[deliverable.type];
  const approvals = deliverable.approvals || [];
  const hasApprovals = approvals.length > 0;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
        isActive
          ? 'border-[var(--color-primary-strong)] bg-[var(--surface-primary-x-weak)] shadow-sm'
          : 'border-[var(--border-neutral-weak)] bg-[var(--surface-neutral-white)] hover:border-[var(--border-neutral-medium)] hover:shadow-md cursor-pointer'
      }`}
      style={{ minWidth: 180 }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: typeStyle.bg, color: typeStyle.color }}
      >
        <Icon name={deliverable.icon} size={14} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-[var(--text-neutral-x-strong)] truncate">
          {deliverable.title}
        </div>
        {hasApprovals ? (
          <div className="flex items-center gap-1.5 mt-1">
            {approvals.map((a, idx) => {
              const style = approvalStyles[a.status];
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  style={{ backgroundColor: style.bg, color: style.color }}
                >
                  <Icon name={style.icon} size={8} />
                  {a.status === 'approved' ? `Approved by ${a.reviewer}` : a.reviewer}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="text-[11px] text-[var(--text-neutral-weak)] mt-0.5">View</div>
        )}
      </div>
    </button>
  );
}

// ============================================================================
// Findings View (legacy — used by pipeline review)
// ============================================================================

function FindingsView({
  plan,
  activeArtifactId,
  onArtifactClick,
  onOpenInChat,
}: {
  plan: PlanDetailData;
  activeArtifactId: string | null;
  onArtifactClick: (id: string | null) => void;
  onOpenInChat: () => void;
}) {
  const findings = plan.findings || [];
  const standaloneGates = plan.standaloneGates || [];
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < findings.length) {
    const finding = findings[i];

    if (finding.parallelGroupId) {
      const groupId = finding.parallelGroupId;
      const groupFindings: PlanDetailFinding[] = [];
      while (i < findings.length && findings[i].parallelGroupId === groupId) {
        groupFindings.push(findings[i]);
        i++;
      }

      elements.push(
        <div key={`parallel-${groupId}`}>
          <div className="flex items-center gap-2 mb-2.5 pl-1">
            <span className="text-[11px] text-[var(--text-neutral-weak)] flex items-center gap-1.5 whitespace-nowrap">
              <Icon name="code-branch" size={10} /> Ran in parallel
            </span>
            <div className="flex-1 h-px bg-[var(--border-neutral-weak)]" />
          </div>
          <div className="flex gap-3.5 mb-3.5">
            {groupFindings.map((f) => (
              <div key={f.id} className="flex-1 min-w-0">
                <FindingCard
                  finding={f}
                  activeArtifactId={activeArtifactId}
                  onArtifactClick={(id) => onArtifactClick(activeArtifactId === id ? null : id)}
                  onOpenInChat={onOpenInChat}
                />
              </div>
            ))}
          </div>
        </div>
      );

      const gate = standaloneGates.find((g) => g.afterParallelGroupId === groupId);
      if (gate) {
        elements.push(<LegacyStandaloneGateRow key={gate.id} gate={gate} />);
      }
    } else {
      elements.push(
        <div key={finding.id} className="mb-3.5">
          <FindingCard
            finding={finding}
            activeArtifactId={activeArtifactId}
            onArtifactClick={(id) => onArtifactClick(activeArtifactId === id ? null : id)}
            onOpenInChat={onOpenInChat}
          />
        </div>
      );
      i++;
    }
  }

  return <>{elements}</>;
}

function LegacyStandaloneGateRow({ gate }: { gate: StandaloneReviewGate }) {
  return (
    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-[10px] mb-3.5 py-3 px-[22px] flex items-center gap-2.5">
      <div
        className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[9px] flex-shrink-0"
        style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
      >
        <Icon name="check" size={9} />
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium text-[var(--text-neutral-strong)]">{gate.label}</div>
        <div className="text-[11px] text-[var(--text-neutral-weak)] mt-px">{gate.sublabel}</div>
      </div>
    </div>
  );
}

// ============================================================================
// Completion Banner
// ============================================================================

function CompletionBanner({ plan }: { plan: PlanDetailData }) {
  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-xl mt-4"
      style={{ backgroundColor: '#D1FAE5' }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
        style={{ backgroundColor: '#059669' }}
      >
        <Icon name="check" size={12} />
      </div>
      <div>
        <div className="text-[13px] font-semibold" style={{ color: '#059669' }}>
          Plan completed
        </div>
        <div className="text-xs text-[var(--text-neutral-strong)]">
          {plan.totalReviews} review gate{plan.totalReviews !== 1 ? 's' : ''} passed · {plan.totalArtifacts} artifact{plan.totalArtifacts !== 1 ? 's' : ''} created
          {plan.completedAt && ` · ${plan.completedAt}`}
        </div>
      </div>
    </div>
  );
}
