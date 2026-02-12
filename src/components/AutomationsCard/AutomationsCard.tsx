import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../Icon';
import { useArtifact } from '../../contexts/ArtifactContext';
import { useChat } from '../../contexts/ChatContext';
import type { PlanSettings } from '../../data/artifactData';
import { planDetailDataMap } from '../../data/planDetailData';

type ActionType = 'approval' | 'review' | 'paused' | 'completed' | null;

interface AgentActivityItem {
  id: string;
  name: string;
  progress: { done: number; total: number };
  action: ActionType;
  actionLabel: string;
  navPath: string;
  isLive?: boolean;
}

const actionConfig: Record<string, { bg: string; text: string; label: string }> = {
  approval: { bg: '#FEF3C7', text: '#92400E', label: 'Needs approval' },
  review:   { bg: '#ECFEFF', text: '#155E75', label: 'Ready for review' },
  paused:   { bg: '#FEF3C7', text: '#92400E', label: 'Paused' },
  completed: { bg: '#D1FAE5', text: '#065F46', label: 'Completed' },
};

function deriveAction(statusLabel: string): { action: ActionType; actionLabel: string } {
  const lower = statusLabel.toLowerCase();
  if (lower.includes('paused'))
    return { action: 'paused', actionLabel: 'Paused' };
  if (lower.includes('approval') || lower.includes('proposed'))
    return { action: 'approval', actionLabel: 'Needs approval' };
  if (lower.includes('review'))
    return { action: 'review', actionLabel: 'Needs review' };
  return { action: null, actionLabel: '' };
}

// Static recent activity items pulled from plan detail data
const recentActivity: AgentActivityItem[] = [
  'plan-onboarding',
  'plan-pipeline-review',
  'plan-pto-audit',
  'plan-flight-risk',
  'plan-benefits-enrollment',
  'plan-succession',
].map(id => {
  const plan = planDetailDataMap[id];
  const { action, actionLabel } = deriveAction(plan.statusLabel);
  return {
    id,
    name: plan.title,
    progress: { done: plan.completedItems, total: plan.totalItems },
    action,
    actionLabel,
    navPath: `/plans/${id}`,
  };
});

export function AutomationsCard() {
  const { artifacts } = useArtifact();
  const { selectConversation } = useChat();
  const navigate = useNavigate();

  // Get live plans from artifact context (all non-proposed statuses)
  const livePlans: AgentActivityItem[] = artifacts
    .filter(a => a.type === 'plan' && (a.settings as PlanSettings).status !== 'proposed')
    .map(artifact => {
      const settings = artifact.settings as PlanSettings;
      const allItems = settings.sections.flatMap(s => s.actionItems || []);
      const doneItems = allItems.filter(i => i.status === 'done');

      // Check for pending review gates — approval trumps all other statuses
      const hasPendingApproval = (settings.reviewSteps || []).some(r => r.status === 'ready');

      let action: ActionType = null;
      let actionLabel = '';
      if (hasPendingApproval || settings.status === 'paused') {
        action = 'approval';
        actionLabel = 'Needs approval';
      } else if (settings.status === 'completed') {
        action = 'completed';
        actionLabel = 'Completed';
      }

      return {
        id: artifact.id,
        name: artifact.title,
        progress: { done: doneItems.length, total: allItems.length },
        action,
        actionLabel,
        navPath: '/plans/plan-backfill-mid',
        isLive: true,
      };
    });

  // Merge live plans on top, then static activity (dedup by name)
  const liveNames = new Set(livePlans.map(p => p.name));
  const staticItems = recentActivity.filter(a => !liveNames.has(a.name)).map(a => ({ ...a, isLive: false }));
  const merged = [...livePlans, ...staticItems];

  // Sort: live plans first (most recent), then by action priority — cap at 5 rows
  const actionPriority = (action: ActionType) =>
    action === 'approval' || action === 'review' || action === 'paused' ? 0
    : action === 'completed' ? 1
    : 2;
  const allItems = merged.sort((a, b) => {
    // Live plans always first
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    // Then by action priority
    return actionPriority(a.action) - actionPriority(b.action);
  }).slice(0, 5);

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
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Icon
              name="bolt"
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
              Agents
            </h3>
          </div>
          <a
            href="/automations"
            className="text-sm text-[var(--color-primary-strong)] hover:underline"
            onClick={(e) => { e.preventDefault(); navigate('/automations'); }}
          >
            View All Activity
          </a>
        </div>
        <div className="h-px bg-[var(--border-neutral-x-weak)]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="sparkles" size={32} className="text-[var(--text-neutral-weak)] mb-3" />
            <p className="text-sm text-[var(--text-neutral-medium)]">No recent activity</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {allItems.map((item) => {
              const pct = item.progress.total > 0
                ? (item.progress.done / item.progress.total) * 100
                : 0;
              const config = item.action ? actionConfig[item.action] : null;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer border-b border-[var(--border-neutral-x-weak)] last:border-b-0"
                  onClick={() => navigate(item.navPath)}
                >
                  {/* Left: name + action pill OR progress bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium truncate ${config ? 'text-[var(--text-neutral-x-strong)]' : 'text-[var(--text-neutral-medium)]'}`}>
                        {item.name}
                      </span>
                      {config && (
                        <span
                          className="text-xs font-semibold leading-none px-2 py-1 rounded-full whitespace-nowrap shrink-0"
                          style={{ backgroundColor: config.bg, color: config.text }}
                        >
                          {config.label}
                        </span>
                      )}
                    </div>

                    {/* Progress bar — always shown, quieter for running items */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-1 bg-[var(--surface-neutral-x-weak)] rounded-full overflow-hidden flex-1 max-w-[120px]">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: item.action === 'completed' ? '#059669' : config ? (item.action === 'review' ? '#0891B2' : '#D97706') : 'var(--color-primary-strong)',
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-neutral-weak)] whitespace-nowrap">
                        {item.progress.done}/{item.progress.total}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <Icon
                    name="chevron-right"
                    size={14}
                    className="text-[var(--text-neutral-weak)] shrink-0"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AutomationsCard;
