import { Icon } from '../Icon';
import type {
  PlanDetailFinding,
  SeverityLevel,
  ReviewGateStatus,
} from '../../data/planDetailData';

interface FindingCardProps {
  finding: PlanDetailFinding;
  activeArtifactId: string | null;
  onArtifactClick: (artifactId: string) => void;
  onOpenInChat?: () => void;
}

const statusColors = {
  done: '#059669',
  awaiting: '#D97706',
  working: '#2563EB',
  upcoming: '#A8A29E',
};

const statusBgColors = {
  done: '#D1FAE5',
  awaiting: '#FEF3C7',
  working: '#DBEAFE',
  upcoming: '#F5F3F2',
};

const severityColors: Record<SeverityLevel, string> = {
  high: '#DC2626',
  med: '#D97706',
  low: '#059669',
  info: '#2563EB',
  neutral: '#A8A29E',
};

const gateIconColors: Record<ReviewGateStatus, { bg: string; color: string }> = {
  passed: { bg: '#D1FAE5', color: '#059669' },
  waiting: { bg: '#FEF3C7', color: '#D97706' },
  future: { bg: '#F5F3F2', color: '#A8A29E' },
};

const gateBgColors: Record<ReviewGateStatus, string> = {
  passed: '#FAFFF8',
  waiting: '#F5F3F2',
  future: '#F5F3F2',
};

export function FindingCard({
  finding,
  activeArtifactId,
  onArtifactClick,
  onOpenInChat,
}: FindingCardProps) {
  const borderColor = statusColors[finding.status];
  const iconBg = statusBgColors[finding.status];
  const iconColor = statusColors[finding.status];
  const isUpcoming = finding.status === 'upcoming';

  return (
    <div
      className="bg-white border border-[#E5E5E5] rounded-[14px] overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
    >
      {/* Main content */}
      <div
        className={isUpcoming ? 'p-4' : 'py-5 px-[22px]'}
        style={{ borderLeft: `3px solid ${borderColor}` }}
      >
        {/* Header */}
        <div
          className={`flex items-start gap-2.5 ${isUpcoming ? 'mb-1' : 'mb-3'}`}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-px"
            style={{ backgroundColor: iconBg, color: iconColor, fontSize: '12px' }}
          >
            <Icon name={finding.icon} size={12} />
          </div>
          <div className="flex-1">
            <div
              className={`text-sm font-semibold ${isUpcoming ? 'text-[#78716C] flex items-center gap-2' : ''}`}
            >
              {finding.sectionTitle}
              {isUpcoming && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#F5F3F2', color: '#A8A29E' }}
                >
                  UPCOMING
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#A8A29E] mt-0.5">{finding.timestamp}</div>
          </div>
        </div>

        {/* Lead finding (for non-upcoming cards) */}
        {!isUpcoming && finding.leadFinding && (
          <div
            className="text-sm leading-[1.65] text-[#44403C] mb-3.5 pb-3.5 border-b border-[#E5E5E5]"
            dangerouslySetInnerHTML={{ __html: finding.leadFinding }}
          />
        )}

        {/* Secondary findings */}
        {!isUpcoming && finding.secondaryFindings && finding.secondaryFindings.length > 0 && (
          <div className="flex flex-col gap-2 mb-3.5">
            {finding.secondaryFindings.map((secondary, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[13px] leading-[1.55] text-[#44403C]">
                <div
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0 mt-1.5"
                  style={{ backgroundColor: severityColors[secondary.severity] }}
                />
                <div
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: secondary.text }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Upcoming items */}
        {isUpcoming && finding.upcomingItems && finding.upcomingItems.length > 0 && (
          <div className="mt-2.5 flex flex-col gap-1.5">
            {finding.upcomingItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#78716C]">
                <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-[#D6D3D1] flex-shrink-0" />
                <div>{item.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Artifact chips */}
        {!isUpcoming && finding.artifacts && finding.artifacts.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3.5 border-t border-[#E5E5E5]">
            {finding.artifacts.map((artifact) => (
              <button
                key={artifact.id}
                onClick={() => onArtifactClick(artifact.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-xs font-medium transition-all ${
                  activeArtifactId === artifact.id
                    ? 'bg-[#E8F5E3] border-[#2e7918] text-[#2e7918]'
                    : 'bg-[#F5F3F2] border-[#E5E5E5] text-[#44403C] hover:bg-[#E8F5E3] hover:border-[#2e7918] hover:text-[#2e7918]'
                } border`}
              >
                <Icon name={artifact.icon} size={11} />
                {artifact.label}
                <Icon
                  name="arrow-right"
                  size={9}
                  className={`transition-opacity ${activeArtifactId === artifact.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Review gate footer */}
      {finding.reviewGate && (
        <div
          className="py-3 px-[22px] border-t border-[#E5E5E5] flex items-center gap-2.5"
          style={{ backgroundColor: gateBgColors[finding.reviewGate.status] }}
        >
          <div
            className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[9px] flex-shrink-0"
            style={{
              backgroundColor: gateIconColors[finding.reviewGate.status].bg,
              color: gateIconColors[finding.reviewGate.status].color,
            }}
          >
            {finding.reviewGate.status === 'passed' && <Icon name="check" size={9} />}
            {finding.reviewGate.status === 'waiting' && <Icon name="clock" size={9} />}
            {finding.reviewGate.status === 'future' && <Icon name="eye" size={9} />}
          </div>
          <div className="flex-1">
            <div
              className="text-xs font-medium"
              style={{
                color: finding.reviewGate.status === 'waiting' ? '#D97706' : undefined,
              }}
            >
              {finding.reviewGate.label}
            </div>
            {finding.reviewGate.sublabel && (
              <div className="text-[11px] text-[#A8A29E] mt-px">
                {finding.reviewGate.sublabel}
              </div>
            )}
          </div>
          {finding.reviewGate.chatLink && onOpenInChat && (
            <button
              onClick={onOpenInChat}
              className="text-[11px] text-[#2e7918] hover:underline flex items-center gap-1"
            >
              <Icon name="comment" size={9} />
              Open in chat
            </button>
          )}
        </div>
      )}
    </div>
  );
}
