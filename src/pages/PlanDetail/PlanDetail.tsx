import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { Icon } from '../../components/Icon';
import { FindingCard } from '../../components/PlanDetail/FindingCard';
import { ArtifactPanel } from '../../components/PlanDetail/ArtifactPanel';
import { PlanDetailHeader } from '../../components/PlanDetail/PlanDetailHeader';
import { planDetailDataMap } from '../../data/planDetailData';
import type { PlanDetailData, PlanDetailFinding, StandaloneReviewGate } from '../../data/planDetailData';

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
          <h1 className="text-2xl font-bold mb-2">Plan not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-[#2e7918] hover:underline"
          >
            ← Back to Home
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

  return (
    <div className="p-6">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-[#78716C] hover:text-[#44403C] mb-4 transition-colors"
      >
        <Icon name="chevron-left" size={16} />
        Home
      </button>

      {/* Shell: flex row for findings + artifact panel */}
      <div className="flex min-h-0">
        {/* Findings pane */}
        <div
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{
            maxWidth: activeArtifactId ? 520 : 740,
            margin: activeArtifactId ? '0' : '0 auto',
          }}
        >
          <PlanDetailHeader plan={plan} onOpenInChat={handleOpenInChat} />

          {/* Render findings with parallel group handling */}
          {renderFindings(plan, activeArtifactId, setActiveArtifactId, handleOpenInChat)}

          {/* Completion banner */}
          {plan.status === 'completed' && <CompletionBanner plan={plan} />}
        </div>

        {/* Artifact slide-out panel */}
        <ArtifactPanel artifact={activeArtifact} onClose={() => setActiveArtifactId(null)} />
      </div>
    </div>
  );
}

// Render findings with parallel group handling
function renderFindings(
  plan: PlanDetailData,
  activeArtifactId: string | null,
  setActiveArtifactId: (id: string | null) => void,
  handleOpenInChat: () => void
) {
  const elements: JSX.Element[] = [];
  const findings = plan.findings;
  const standaloneGates = plan.standaloneGates || [];
  let i = 0;

  while (i < findings.length) {
    const finding = findings[i];

    if (finding.parallelGroupId) {
      // Collect all findings in this parallel group
      const groupId = finding.parallelGroupId;
      const groupFindings: PlanDetailFinding[] = [];
      while (i < findings.length && findings[i].parallelGroupId === groupId) {
        groupFindings.push(findings[i]);
        i++;
      }

      // Render parallel label + flex row
      elements.push(
        <div key={`parallel-${groupId}`}>
          <div className="flex items-center gap-2 mb-2.5 pl-1">
            <span className="text-[11px] text-[#A8A29E] flex items-center gap-1.5 whitespace-nowrap">
              <Icon name="code-branch" size={10} /> Ran in parallel
            </span>
            <div className="flex-1 h-px bg-[#E5E5E5]" />
          </div>
          <div className="flex gap-3.5 mb-3.5">
            {groupFindings.map((f) => (
              <div key={f.id} className="flex-1 min-w-0">
                <FindingCard
                  finding={f}
                  activeArtifactId={activeArtifactId}
                  onArtifactClick={setActiveArtifactId}
                  onOpenInChat={handleOpenInChat}
                />
              </div>
            ))}
          </div>
        </div>
      );

      // Check for standalone gate after this group
      const gate = standaloneGates.find((g) => g.afterParallelGroupId === groupId);
      if (gate) {
        elements.push(<StandaloneGateRow key={gate.id} gate={gate} />);
      }
    } else {
      elements.push(
        <div key={finding.id} className="mb-3.5">
          <FindingCard
            finding={finding}
            activeArtifactId={activeArtifactId}
            onArtifactClick={setActiveArtifactId}
            onOpenInChat={handleOpenInChat}
          />
        </div>
      );
      i++;
    }
  }

  return elements;
}

// Standalone review gate row
function StandaloneGateRow({ gate }: { gate: StandaloneReviewGate }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[10px] mb-3.5 py-3 px-[22px] flex items-center gap-2.5">
      <div
        className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[9px] flex-shrink-0"
        style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
      >
        <Icon name="check" size={9} />
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium">{gate.label}</div>
        <div className="text-[11px] text-[#A8A29E] mt-px">{gate.sublabel}</div>
      </div>
    </div>
  );
}

// Completion banner
function CompletionBanner({ plan }: { plan: PlanDetailData }) {
  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-xl mt-2"
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
        <div className="text-xs text-[#44403C]">
          {plan.totalReviews} review gates passed · {plan.totalArtifacts} artifacts created ·
          Completed over 2 days
        </div>
      </div>
    </div>
  );
}
