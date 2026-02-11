import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../Icon';
import { useArtifact } from '../../contexts/ArtifactContext';
import { useChat } from '../../contexts/ChatContext';
import type { PlanSettings } from '../../data/artifactData';
import { planDetailDataMap } from '../../data/planDetailData';

interface AgentActivityItem {
  id: string;
  name: string;
  stat: string;
  status: 'running' | 'paused' | 'completed';
  navPath: string;
}

const statusIndicator: Record<AgentActivityItem['status'], { color: string; icon?: IconName }> = {
  running: { color: 'var(--color-primary-strong)' },
  paused: { color: '#D97706' },
  completed: { color: '#059669', icon: 'check' },
};

// Static recent activity items pulled from plan detail data
const recentActivity: AgentActivityItem[] = [
  'plan-backfill-mid',
  'plan-pto-audit',
  'plan-pipeline-review',
  'plan-comp-review',
  'plan-flight-risk',
  'plan-backfill-done',
].map(id => {
  const plan = planDetailDataMap[id];
  return {
    id,
    name: plan.title,
    stat: plan.status === 'completed'
      ? `Completed · ${plan.totalArtifacts} deliverable${plan.totalArtifacts !== 1 ? 's' : ''}`
      : `${plan.completedItems}/${plan.totalItems} complete · ${plan.statusLabel}`,
    status: plan.status === 'completed' ? 'completed' : plan.status === 'paused' ? 'paused' : 'running',
    navPath: `/plans/${id}`,
  };
});

export function AutomationsCard() {
  const { artifacts } = useArtifact();
  const { selectConversation } = useChat();
  const navigate = useNavigate();

  // Get real running plans from artifact context (live demo flow)
  const livePlans: AgentActivityItem[] = artifacts
    .filter(a => a.type === 'plan' && (a.settings as PlanSettings).status === 'running')
    .map(artifact => {
      const settings = artifact.settings as PlanSettings;
      const allItems = settings.sections.flatMap(s => s.actionItems || []);
      const doneItems = allItems.filter(i => i.status === 'done');
      return {
        id: artifact.id,
        name: artifact.title,
        stat: `${doneItems.length}/${allItems.length} complete`,
        status: 'running' as const,
        navPath: '/plans/plan-backfill-mid',
      };
    });

  // Merge live plans on top, then static activity (dedup by name)
  const liveNames = new Set(livePlans.map(p => p.name));
  const allItems = [...livePlans, ...recentActivity.filter(a => !liveNames.has(a.name))];

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
              const indicator = statusIndicator[item.status];
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer border-b border-[var(--border-neutral-x-weak)] last:border-b-0"
                  onClick={() => navigate(item.navPath)}
                >
                  {/* Status indicator */}
                  {indicator.icon ? (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: indicator.color }}
                    >
                      <Icon name={indicator.icon} size={8} className="text-white" />
                    </div>
                  ) : (
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: indicator.color }}
                    />
                  )}

                  {/* Name + stat */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-neutral-x-strong)]">
                      {item.name}
                    </div>
                    <div className="text-xs text-[var(--text-neutral-weak)] mt-0.5">
                      {item.stat}
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
