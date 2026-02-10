import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { useArtifact } from '../../contexts/ArtifactContext';
import { useChat } from '../../contexts/ChatContext';
import type { PlanSettings, ActionItem } from '../../data/artifactData';

interface MockAutomation {
  id: string;
  name: string;
  stat: string;
  type: 'mock';
  detail: string;
}

interface RealPlanAutomation {
  id: string;
  name: string;
  stat: string;
  type: 'plan';
  artifact: any;
}

interface HardcodedPlanAutomation {
  id: string;
  name: string;
  stat: string;
  type: 'hardcoded-plan';
  navPath: string;
  progress: number;
  statusIndicator: 'active' | 'waiting';
}

type AutomationItem = MockAutomation | RealPlanAutomation | HardcodedPlanAutomation;

const mockAutomations: MockAutomation[] = [
  {
    id: 'auto-1',
    name: 'Timesheet reminders',
    stat: '4 sent this week, 2 pending',
    type: 'mock',
    detail: 'Automated weekly reminder sent to employees with missing timesheets.',
  },
  {
    id: 'auto-3',
    name: 'Document collection',
    stat: '1 follow-up sent',
    type: 'mock',
    detail: 'Tracks and follows up on missing employee documents (I-9, tax forms, etc.).',
  },
];

const hardcodedPlanAutomation: HardcodedPlanAutomation = {
  id: 'plan-pipeline',
  name: 'Q1 Hiring Pipeline Review',
  stat: '4/7 complete · Waiting for review',
  type: 'hardcoded-plan',
  navPath: '/plans/plan-pipeline-review',
  progress: 57, // 4/7 = 57%
  statusIndicator: 'waiting',
};

export function AutomationsCard() {
  const { artifacts } = useArtifact();
  const { selectConversation } = useChat();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Get real running plans
  const runningPlans: RealPlanAutomation[] = artifacts
    .filter(a => a.type === 'plan' && (a.settings as PlanSettings).status === 'running')
    .map(artifact => {
      const settings = artifact.settings as PlanSettings;
      const allItems = settings.sections.flatMap(s => s.actionItems || []);
      const doneItems = allItems.filter(i => i.status === 'done');
      const totalItems = allItems.length;

      return {
        id: artifact.id,
        name: artifact.title,
        stat: `${doneItems.length}/${totalItems} complete`,
        type: 'plan' as const,
        artifact,
      };
    });

  // Combine mock + hardcoded + real
  const allAutomations: AutomationItem[] = [...mockAutomations, hardcodedPlanAutomation, ...runningPlans];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenInChat = (automation: RealPlanAutomation) => {
    if (automation.artifact.conversationId) {
      selectConversation(automation.artifact.conversationId);
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
              name="sparkles"
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
              Agents Running
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

        {/* Divider */}
        <div className="h-px bg-[var(--border-neutral-x-weak)]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {allAutomations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="sparkles" size={32} className="text-[var(--text-neutral-weak)] mb-3" />
            <p className="text-sm text-[var(--text-neutral-medium)]">No agents running</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {allAutomations.map((automation) => {
              const isExpanded = expandedId === automation.id;

              return (
                <div key={automation.id} className="border-b border-[var(--border-neutral-x-weak)] last:border-b-0">
                  {/* Row */}
                  <div
                    className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer"
                    onClick={() => toggleExpand(automation.id)}
                  >
                    {/* Status indicator dot */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          automation.type === 'hardcoded-plan' && automation.statusIndicator === 'waiting'
                            ? '#D97706' // amber for waiting
                            : 'var(--color-primary-strong)', // green otherwise
                      }}
                    />

                    {/* Name + stat */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--text-neutral-x-strong)]">
                        {automation.name}
                      </div>
                      <div className="text-xs text-[var(--text-neutral-weak)] mt-0.5">
                        {automation.stat}
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
                      {automation.type === 'mock' ? (
                        // Mock automation detail
                        <div className="text-sm text-[var(--text-neutral-medium)] bg-[var(--surface-neutral-xx-weak)] rounded-lg p-4">
                          {automation.detail}
                        </div>
                      ) : automation.type === 'hardcoded-plan' ? (
                        // Hardcoded plan progress (simple version)
                        <HardcodedPlanProgress
                          automation={automation}
                          onViewDetails={() => navigate(automation.navPath)}
                        />
                      ) : (
                        // Real plan progress
                        <PlanProgress
                          artifact={automation.artifact}
                          onOpenInChat={() => handleOpenInChat(automation)}
                          onViewDetails={() => navigate('/plans/plan-backfill-mid')}
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

// Mini plan progress component for expansion
function PlanProgress({
  artifact,
  onOpenInChat,
  onViewDetails,
}: {
  artifact: any;
  onOpenInChat: () => void;
  onViewDetails: () => void;
}) {
  const settings = artifact.settings as PlanSettings;
  const allItems = settings.sections.flatMap(s => s.actionItems || []);
  const doneItems = allItems.filter(i => i.status === 'done');
  const workingItem = allItems.find(i => i.status === 'working');
  const totalItems = allItems.length;
  const progress = totalItems > 0 ? (doneItems.length / totalItems) * 100 : 0;

  return (
    <div className="bg-[var(--surface-neutral-xx-weak)] rounded-lg p-4 space-y-3">
      {/* Sections summary */}
      <div className="space-y-1.5">
        {settings.sections.map((section) => {
          const sectionItems = section.actionItems || [];
          const sectionDone = sectionItems.filter(i => i.status === 'done').length;
          const sectionTotal = sectionItems.length;

          return (
            <div key={section.id} className="flex items-center gap-2 text-xs">
              <Icon
                name={sectionDone === sectionTotal ? 'circle-check' : 'circle'}
                size={12}
                className={sectionDone === sectionTotal ? 'text-[var(--color-primary-strong)]' : 'text-[var(--text-neutral-weak)]'}
              />
              <span className="text-[var(--text-neutral-medium)]">
                {section.title}
              </span>
              <span className="text-[var(--text-neutral-weak)]">
                {sectionDone}/{sectionTotal}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current working item */}
      {workingItem && (
        <div className="flex items-center gap-2 py-2 px-3 bg-[var(--surface-neutral-white)] rounded border border-[var(--border-neutral-x-weak)]">
          <div
            className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin shrink-0"
            style={{ borderColor: '#2563EB', borderTopColor: 'transparent' }}
          />
          <span className="text-xs text-[var(--text-neutral-medium)] flex-1">
            {workingItem.description}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-[var(--surface-neutral-x-weak)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary-strong)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action links */}
      <div className="flex items-center gap-4 mt-1">
        <button
          onClick={onOpenInChat}
          className="text-xs font-medium text-[var(--color-primary-strong)] hover:underline"
        >
          Open in chat
        </button>
        <button
          onClick={onViewDetails}
          className="text-xs font-medium text-[var(--color-primary-strong)] hover:underline"
        >
          View details
        </button>
      </div>
    </div>
  );
}

// Hardcoded plan progress component for expansion (simpler version)
function HardcodedPlanProgress({
  automation,
  onViewDetails,
}: {
  automation: HardcodedPlanAutomation;
  onViewDetails: () => void;
}) {
  return (
    <div className="bg-[var(--surface-neutral-xx-weak)] rounded-lg p-4 space-y-3">
      {/* Status message */}
      <div className="flex items-center gap-2 py-2 px-3 bg-[var(--surface-neutral-white)] rounded border border-[var(--border-neutral-x-weak)]">
        <Icon
          name="clock"
          size={14}
          className="text-[#D97706] shrink-0"
        />
        <span className="text-xs text-[var(--text-neutral-medium)] flex-1">
          Waiting for your review — approve outreach to matched candidates
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-[var(--text-neutral-medium)] mb-1">
          <span>Progress</span>
          <span>4 of 7 complete</span>
        </div>
        <div className="h-1.5 bg-[var(--surface-neutral-x-weak)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary-strong)] transition-all duration-300"
            style={{ width: `${automation.progress}%` }}
          />
        </div>
      </div>

      {/* Action link */}
      <div className="flex items-center gap-4 mt-1">
        <button
          onClick={onViewDetails}
          className="text-xs font-medium text-[var(--color-primary-strong)] hover:underline"
        >
          View details
        </button>
      </div>
    </div>
  );
}

export default AutomationsCard;
