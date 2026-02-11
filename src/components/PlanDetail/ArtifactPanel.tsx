import { Icon } from '../Icon';
import type { ArtifactContent, CompChartContent, OrgReportContent, DevPlanContent, JobReqContent } from '../../data/planDetailData';

interface ArtifactPanelProps {
  artifact: ArtifactContent | null;
  onClose: () => void;
}

const typeStyles = {
  chart: { bg: '#DBEAFE', color: '#2563EB' },
  report: { bg: '#E8F5E3', color: '#2e7918' },
  text: { bg: '#EDE9FE', color: '#7C3AED' },
  job: { bg: '#FEF3C7', color: '#D97706' },
};

export function ArtifactPanel({ artifact, onClose }: ArtifactPanelProps) {
  const isOpen = artifact !== null;

  return (
    <div
      className={`flex flex-col h-full bg-[var(--surface-neutral-white)] border-l border-[var(--border-neutral-weak)] sticky top-0 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'w-[440px]' : 'w-0'
      }`}
      style={{
        boxShadow: isOpen ? '-4px 0 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {artifact && (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 p-5 pb-4 border-b border-[var(--border-neutral-weak)] flex-shrink-0">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm flex-shrink-0"
              style={{
                backgroundColor: typeStyles[artifact.type].bg,
                color: typeStyles[artifact.type].color,
              }}
            >
              {artifact.type === 'chart' && <Icon name="chart-bar" size={14} />}
              {artifact.type === 'report' && <Icon name="sitemap" size={14} />}
              {artifact.type === 'text' && <Icon name="file-lines" size={14} />}
              {artifact.type === 'job' && <Icon name="briefcase" size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold truncate text-[var(--text-neutral-x-strong)]">{artifact.title}</div>
              <div className="text-[11px] text-[var(--text-neutral-weak)] mt-0.5">{artifact.meta}</div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-neutral-medium)] hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
            >
              <Icon name="xmark" size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {artifact.type === 'chart' && (
              <CompChartRenderer content={artifact.content as CompChartContent} />
            )}
            {artifact.type === 'report' && (
              <OrgReportRenderer content={artifact.content as OrgReportContent} />
            )}
            {artifact.type === 'text' && (
              <DevPlanRenderer content={artifact.content as DevPlanContent} />
            )}
            {artifact.type === 'job' && (
              <JobReqRenderer content={artifact.content as JobReqContent} />
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 p-4 border-t border-[var(--border-neutral-weak)] flex-shrink-0">
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-[7px] rounded-lg text-xs font-medium text-[var(--text-neutral-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] hover:bg-[var(--surface-neutral-x-weak)] transition-colors">
              <Icon name="file-export" size={11} />
              Open full view
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-[7px] rounded-lg text-xs font-medium text-[var(--text-neutral-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] hover:bg-[var(--surface-neutral-x-weak)] transition-colors">
              <Icon name="download" size={11} />
              Export
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Compensation Chart Renderer
function CompChartRenderer({ content }: { content: CompChartContent }) {
  return (
    <>
      {/* Chart */}
      <div className="bg-[var(--surface-neutral-x-weak)] border border-[var(--border-neutral-weak)] rounded-xl p-5 mb-5">
        <div className="text-[13px] font-semibold text-[var(--text-neutral-x-strong)] mb-4">
          {content.chartTitle || 'Pay Band Position — Uma Patel\'s Team'}
        </div>
        {content.bars.map((bar, idx) => (
          <div key={idx} className="mb-3 last:mb-0">
            <div className="flex justify-between text-[11px] text-[var(--text-neutral-medium)] mb-1">
              <span>{bar.name}</span>
              <span style={{ color: bar.color, fontWeight: 600 }}>{bar.salary}</span>
            </div>
            <div className="h-5 bg-[var(--surface-neutral-weak)] rounded overflow-hidden relative">
              <div
                className="h-full rounded"
                style={{
                  width: `${bar.fillPct}%`,
                  backgroundColor: bar.color,
                  opacity: 0.7,
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[var(--text-neutral-x-strong)]"
                style={{ left: `${bar.markerPct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="text-left font-semibold text-[var(--text-neutral-medium)] px-2.5 py-2 border-b-2 border-[var(--border-neutral-weak)] text-[11px] uppercase tracking-wide">
              {content.columnHeaders?.name || 'Employee'}
            </th>
            <th className="text-left font-semibold text-[var(--text-neutral-medium)] px-2.5 py-2 border-b-2 border-[var(--border-neutral-weak)] text-[11px] uppercase tracking-wide">
              {content.columnHeaders?.col1 || 'Salary'}
            </th>
            <th className="text-left font-semibold text-[var(--text-neutral-medium)] px-2.5 py-2 border-b-2 border-[var(--border-neutral-weak)] text-[11px] uppercase tracking-wide">
              {content.columnHeaders?.col2 || 'Midpoint'}
            </th>
            <th className="text-left font-semibold text-[var(--text-neutral-medium)] px-2.5 py-2 border-b-2 border-[var(--border-neutral-weak)] text-[11px] uppercase tracking-wide">
              {content.columnHeaders?.col3 || 'Compa'}
            </th>
            <th className="text-left font-semibold text-[var(--text-neutral-medium)] px-2.5 py-2 border-b-2 border-[var(--border-neutral-weak)] text-[11px] uppercase tracking-wide">
              {content.columnHeaders?.col4 || 'Risk'}
            </th>
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row, idx) => (
            <tr key={idx}>
              <td className="px-2.5 py-2.5 border-b border-[var(--border-neutral-weak)] text-[var(--text-neutral-strong)]">
                <strong>{row.name}</strong>
              </td>
              <td className="px-2.5 py-2.5 border-b border-[var(--border-neutral-weak)] text-[var(--text-neutral-strong)]">
                {row.salary}
              </td>
              <td className="px-2.5 py-2.5 border-b border-[var(--border-neutral-weak)] text-[var(--text-neutral-strong)]">
                {row.midpoint}
              </td>
              <td
                className="px-2.5 py-2.5 border-b border-[var(--border-neutral-weak)] font-semibold"
                style={{ color: row.compaColor }}
              >
                {row.compa}
              </td>
              <td className="px-2.5 py-2.5 border-b border-[var(--border-neutral-weak)]">
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    backgroundColor: row.riskBg,
                    color: row.riskColor,
                  }}
                >
                  {row.risk}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// Org Report Renderer
function OrgReportRenderer({ content }: { content: OrgReportContent }) {
  return (
    <div
      className="text-[13px] leading-[1.7] text-[var(--text-neutral-strong)]"
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
}

// Development Plan Renderer
function DevPlanRenderer({ content }: { content: DevPlanContent }) {
  return (
    <>
      {/* Readiness */}
      <div className="mb-4">
        <div className="text-[13px] font-semibold text-[var(--text-neutral-x-strong)] mb-1">Readiness: {content.readiness}/100</div>
        <div className="h-2 bg-[var(--surface-neutral-weak)] rounded overflow-hidden">
          <div
            className="h-full bg-[#059669] rounded"
            style={{ width: `${content.readiness}%` }}
          />
        </div>
        <div className="text-xs text-[var(--text-neutral-medium)] mt-1.5">
          Exceeds 75 threshold. Primary gap: mentorship experience.
        </div>
      </div>

      {/* Milestones */}
      <div className="text-[13px] font-semibold text-[var(--text-neutral-x-strong)] mb-2">90-Day Milestones</div>
      <div className="flex flex-col gap-2 mb-4">
        {content.milestones.map((milestone, idx) => (
          <div
            key={idx}
            className="py-2.5 px-3.5 bg-[var(--surface-neutral-x-weak)] rounded-lg text-xs leading-[1.5] text-[var(--text-neutral-strong)]"
          >
            <strong>{milestone.period}:</strong> {milestone.description}
          </div>
        ))}
      </div>

      {/* Comp adjustment */}
      {content.compAdjustment && (
        <div>
          <div className="text-[13px] font-semibold text-[var(--text-neutral-x-strong)] mb-1">Compensation Adjustment</div>
          <div className="text-xs text-[var(--text-neutral-strong)] leading-[1.5]">
            {content.compAdjustment}
          </div>
        </div>
      )}
    </>
  );
}

// Job Requisition Renderer
function JobReqRenderer({ content }: { content: JobReqContent }) {
  return (
    <div
      className="text-[13px] leading-[1.7] text-[var(--text-neutral-strong)]"
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
}
