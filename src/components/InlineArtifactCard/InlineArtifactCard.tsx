import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { TextHeadline } from '../TextHeadline';
import { BarChart, LineChart, PieChart, TableChart } from '../Charts';
import type { Artifact, ChartSettings } from '../../data/artifactData';
import { generateArtifactTitle } from '../../data/artifactData';

interface InlineArtifactCardProps {
  artifact: Artifact;
}

export function InlineArtifactCard({ artifact }: InlineArtifactCardProps) {
  const navigate = useNavigate();
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const publishRef = useRef<HTMLDivElement>(null);

  // Close publish dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (publishRef.current && !publishRef.current.contains(event.target as Node)) {
        setIsPublishOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    // TODO: Implement copy to clipboard
    console.log('Copy artifact:', artifact.id);
  };

  const handleEdit = () => {
    // Navigate to full artifact workspace
    navigate(`/artifact/${artifact.type}/${artifact.id}`);
  };

  const handlePublish = (action: 'dashboard' | 'report' | 'share' | 'download') => {
    // TODO: Implement publish actions
    console.log('Publish action:', action);
    setIsPublishOpen(false);
  };

  const title = artifact.title ||
    (artifact.type === 'chart' ? generateArtifactTitle(artifact.settings as ChartSettings) : 'Untitled');

  // Render chart based on type
  const renderChart = () => {
    if (artifact.type !== 'chart') return null;

    const chartSettings = artifact.settings as ChartSettings;
    // Smaller sizes for inline display
    const width = 500;
    const height = 340;

    switch (chartSettings.chartType) {
      case 'bar':
        return <BarChart settings={chartSettings} width={width} height={height} />;
      case 'line':
        return <LineChart settings={chartSettings} width={width} height={height} />;
      case 'pie':
        return <PieChart settings={chartSettings} width={height} height={height} />;
      case 'table':
        return <TableChart settings={chartSettings} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="rounded-xl p-6 my-3"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
        border: '1px solid var(--border-neutral-weak)',
      }}
    >
      {/* Header with title and actions */}
      <div className="flex items-center justify-between mb-6">
        <TextHeadline size="small" style={{ color: 'var(--color-primary-strong)' }}>
          {title}
        </TextHeadline>

        <div className="flex items-center gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
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
          >
            <Icon name="copy" size={16} />
            Copy
          </button>

          {/* Edit button */}
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
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
          >
            <Icon name="pen-to-square" size={16} />
            Edit
          </button>

          {/* Publish dropdown */}
          <div className="relative" ref={publishRef}>
            <button
              onClick={() => setIsPublishOpen(!isPublishOpen)}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
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
            >
              <Icon name="arrow-up-from-bracket" size={16} />
              Publish
              <Icon name="caret-down" size={10} />
            </button>

            {/* Dropdown menu */}
            {isPublishOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg py-1 z-50"
                style={{
                  backgroundColor: 'var(--surface-neutral-white)',
                  border: '1px solid var(--border-neutral-weak)',
                }}
              >
                <button
                  onClick={() => handlePublish('dashboard')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="table-cells" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div>
                    <div className="font-medium text-[var(--text-neutral-strong)]">Add to Dashboard</div>
                    <div className="text-xs text-[var(--text-neutral-weak)]">Pin to your home dashboard</div>
                  </div>
                </button>
                <button
                  onClick={() => handlePublish('report')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="file-lines" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div>
                    <div className="font-medium text-[var(--text-neutral-strong)]">Save as Report</div>
                    <div className="text-xs text-[var(--text-neutral-weak)]">Create a reusable report</div>
                  </div>
                </button>
                <div className="my-1 border-t" style={{ borderColor: 'var(--border-neutral-x-weak)' }} />
                <button
                  onClick={() => handlePublish('share')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="arrow-up-from-bracket" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div>
                    <div className="font-medium text-[var(--text-neutral-strong)]">Share</div>
                    <div className="text-xs text-[var(--text-neutral-weak)]">Share with team members</div>
                  </div>
                </button>
                <button
                  onClick={() => handlePublish('download')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="arrow-down-to-line" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div>
                    <div className="font-medium text-[var(--text-neutral-strong)]">Download</div>
                    <div className="text-xs text-[var(--text-neutral-weak)]">Export as PNG or CSV</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart display */}
      <div className="flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  );
}

export default InlineArtifactCard;
