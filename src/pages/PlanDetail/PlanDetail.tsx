import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { Icon } from '../../components/Icon';
import { FindingCard } from '../../components/PlanDetail/FindingCard';
import { ArtifactPanel, ArtifactInlinePanel } from '../../components/PlanDetail/ArtifactPanel';
import { planDetailDataMap } from '../../data/planDetailData';
import type { PlanDetailData, PlanDetailFinding, StandaloneReviewGate, PlanActionItem, PlanReviewGate, PlanDeliverable } from '../../data/planDetailData';

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
  planned: { icon: 'circle' as const, bg: '#F5F3F2', color: '#A8A29E' },
};

const gateStatusConfig = {
  passed: { icon: 'check' as const, bg: '#D1FAE5', color: '#059669' },
  waiting: { icon: 'clock' as const, bg: '#FEF3C7', color: '#D97706' },
  future: { icon: 'eye' as const, bg: '#F5F3F2', color: '#A8A29E' },
};

const deliverableTypeStyles = {
  chart: { bg: '#DBEAFE', color: '#2563EB' },
  report: { bg: '#E8F5E3', color: '#2e7918' },
  text: { bg: '#EDE9FE', color: '#7C3AED' },
  job: { bg: '#FEF3C7', color: '#D97706' },
};

export function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectConversation } = useChat();
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);

  const plan = id ? planDetailDataMap[id] : null;

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
      <div className="flex items-baseline gap-4 mb-3">
        <h1
          style={{
            fontFamily: 'Fields, system-ui, sans-serif',
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: '56px',
            color: '#2e7918',
          }}
        >
          {plan.title}
        </h1>
        {plan.subtitle && (
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: 400,
              color: 'var(--text-neutral-medium)',
            }}
          >
            {plan.subtitle}
          </span>
        )}
      </div>

      {/* Status pills row */}
      <div className="flex items-center gap-4 flex-wrap mb-8">
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

      {/* Main content area */}
      {hasActionItems ? (
        <div style={{ maxWidth: 860 }}>
          <ActionItemsView
            plan={plan}
            activeArtifactId={activeArtifactId}
            onArtifactClick={setActiveArtifactId}
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
// Action Items View (new simplified plan layout)
// ============================================================================

function ActionItemsView({
  plan,
  activeArtifactId,
  onArtifactClick,
}: {
  plan: PlanDetailData;
  activeArtifactId: string | null;
  onArtifactClick: (id: string | null) => void;
}) {
  const actionItems = plan.actionItems || [];
  const reviewGates = plan.reviewGates || [];
  const deliverables = plan.deliverables || [];

  // Build a map of gates by afterItemId for inline rendering
  const gatesByItemId = new Map<string, PlanReviewGate>();
  for (const gate of reviewGates) {
    gatesByItemId.set(gate.afterItemId, gate);
  }

  return (
    <div
      className="bg-[var(--surface-neutral-white)] rounded-2xl border border-[var(--border-neutral-weak)] overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {/* Action items */}
      <div className="p-6">
        <div className="flex flex-col gap-0.5">
          {actionItems.map((item) => {
            const gate = gatesByItemId.get(item.id);
            return (
              <div key={item.id}>
                <ActionItemRow item={item} />
                {gate && <ReviewGateRow gate={gate} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverables section */}
      {deliverables.length > 0 && (
        <div className="border-t border-[var(--border-neutral-weak)] p-6">
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

function ActionItemRow({ item }: { item: PlanActionItem }) {
  const config = itemStatusConfig[item.status];

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        <Icon name={config.icon} size={12} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium ${
            item.status === 'done'
              ? 'text-[var(--text-neutral-strong)]'
              : item.status === 'planned'
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

function ReviewGateRow({ gate }: { gate: PlanReviewGate }) {
  const config = gateStatusConfig[gate.status];

  return (
    <div
      className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg ml-10 mb-1"
      style={{ backgroundColor: config.bg + '40' }}
    >
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        <Icon name={config.icon} size={9} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-medium ${
            gate.status === 'waiting'
              ? 'text-[#D97706]'
              : 'text-[var(--text-neutral-strong)]'
          }`}
        >
          {gate.label}
        </div>
        {gate.sublabel && (
          <div className="text-[11px] text-[var(--text-neutral-weak)] mt-0.5">
            {gate.sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

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
          : 'border-[var(--border-neutral-weak)] bg-[var(--surface-neutral-x-weak)] hover:border-[var(--color-primary-strong)] hover:bg-[var(--surface-primary-x-weak)] cursor-pointer'
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
