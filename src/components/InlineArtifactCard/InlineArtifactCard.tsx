import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { BarChart, LineChart, PieChart, TableChart } from '../Charts';
import { TextDisplay } from '../TextDisplay';
import { OrgChartThumbnail } from '../OrgChart';
import type { Artifact, ChartSettings } from '../../data/artifactData';
import { generateArtifactTitle } from '../../data/artifactData';

interface InlineArtifactCardProps {
  artifact: Artifact;
  compact?: boolean;
  onExpand?: () => void;
}

export function InlineArtifactCard({ artifact, compact = false, onExpand }: InlineArtifactCardProps) {
  const navigate = useNavigate();
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showButtonText, setShowButtonText] = useState(true);
  const publishRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (publishRef.current && !publishRef.current.contains(event.target as Node)) {
        setIsPublishOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect card width to show/hide button text in fullscreen mode
  useEffect(() => {
    if (compact) return; // Only applies to fullscreen mode

    const observeWidth = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        // Hide text if card is narrower than 600px
        setShowButtonText(width >= 600);
      }
    };

    const resizeObserver = new ResizeObserver(observeWidth);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
      observeWidth(); // Initial check
    }

    return () => resizeObserver.disconnect();
  }, [compact]);

  const handleCopy = () => {
    // TODO: Implement copy to clipboard
    console.log('Copy artifact:', artifact.id);
  };

  const handleEdit = () => {
    // TODO: Fix transition animation - currently disabled
    // Direct navigation for now
    navigate(`/artifact/${artifact.type}/${artifact.id}`);
  };

  const handlePublish = (action: 'dashboard' | 'report' | 'share' | 'download') => {
    // TODO: Implement publish actions
    console.log('Publish action:', action);
    setIsPublishOpen(false);
    setIsMenuOpen(false);
  };

  const title = artifact.title ||
    (artifact.type === 'chart' ? generateArtifactTitle(artifact.settings as ChartSettings) : 'Untitled');

  // Render content based on artifact type
  const renderContent = () => {
    if (artifact.type === 'chart') {
      const chartSettings = artifact.settings as ChartSettings;
      // Larger sizes for better visibility
      // Sidebar is ~383px wide - 48px card padding = 335px available
      // Use that full width for compact mode
      const width = compact ? 335 : 700;
      const height = compact ? 230 : 480;

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
    }

    if (artifact.type === 'text') {
      // Show truncated preview for compact, full content for expanded
      const maxLength = compact ? 200 : 600;
      return (
        <div className={compact ? '' : 'max-w-3xl'}>
          <TextDisplay
            content={artifact.content || 'No content'}
            maxLength={maxLength}
          />
        </div>
      );
    }

    if (artifact.type === 'org-chart') {
      // Org chart uses integrated thumbnail layout
      return null; // Rendered separately below
    }

    return null;
  };

  const handleCardClick = () => {
    if (compact && onExpand) {
      onExpand();
    }
  };

  // Special layout for org-chart artifacts
  if (artifact.type === 'org-chart') {
    return (
      <div
        ref={cardRef}
        data-artifact-id={artifact.id}
        className="rounded-xl my-3 p-6 cursor-pointer hover:border-[var(--border-neutral-medium)] transition-colors"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          border: '1px solid var(--border-neutral-weak)',
        }}
        onClick={handleEdit}
      >
        {/* Header with title and three-dot menu */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <h3
            className="font-bold"
            style={{
              fontSize: '20px',
              lineHeight: '28px',
              fontFamily: 'Fields, system-ui, sans-serif',
              color: 'var(--color-primary-strong)',
            }}
          >
            {title}
          </h3>

          {/* Three-dot menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
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

            {/* Dropdown menu with publish options */}
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg py-1 z-50"
                style={{
                  backgroundColor: 'var(--surface-neutral-white)',
                  border: '1px solid var(--border-neutral-weak)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePublish('dashboard');
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="table-cells" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div>
                    <div className="font-medium text-[var(--text-neutral-strong)]">Add to Dashboard</div>
                    <div className="text-xs text-[var(--text-neutral-weak)]">Pin to your home dashboard</div>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePublish('report');
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePublish('share');
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="arrow-up-from-bracket" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div>
                    <div className="font-medium text-[var(--text-neutral-strong)]">Share</div>
                    <div className="text-xs text-[var(--text-neutral-weak)]">Share with team members</div>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePublish('download');
                  }}
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

        {/* Thumbnail content */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface-neutral-xx-weak)' }}>
            <Icon name="sitemap" size={20} style={{ color: 'var(--color-primary-strong)' }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2">
              {artifact.content || 'Explore team structure and reporting relationships'}
            </p>

            {/* Timestamp */}
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1.5">
              2h ago
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      data-artifact-id={artifact.id}
      className={`rounded-xl my-3 ${compact ? 'p-4' : 'p-6'} ${compact && onExpand ? 'cursor-pointer hover:border-[var(--border-neutral-medium)] transition-colors' : ''}`}
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
        border: '1px solid var(--border-neutral-weak)',
      }}
      onClick={handleCardClick}
    >
      {/* Header with title and actions */}
      <div className={`flex items-start justify-between gap-3 ${compact ? 'mb-3' : 'mb-6'}`}>
        <h3
          className="font-bold"
          style={{
            fontSize: '20px',
            lineHeight: '28px',
            fontFamily: 'Fields, system-ui, sans-serif',
            color: 'var(--color-primary-strong)',
            flex: compact ? 1 : 'initial',
          }}
        >
          {title}
        </h3>

        {compact ? (
          /* Compact mode: Three-dot menu in top right */
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
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

            {/* Compact menu dropdown */}
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg py-1 z-50"
                style={{
                  backgroundColor: 'var(--surface-neutral-white)',
                  border: '1px solid var(--border-neutral-weak)',
                }}
              >
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="copy" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div className="font-medium text-[var(--text-neutral-strong)]">Copy</div>
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="pen-to-square" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div className="font-medium text-[var(--text-neutral-strong)]">Edit</div>
                </button>
                <div className="my-1 border-t" style={{ borderColor: 'var(--border-neutral-x-weak)' }} />
                <button
                  onClick={() => handlePublish('dashboard')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="table-cells" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div className="font-medium text-[var(--text-neutral-strong)]">Add to Dashboard</div>
                </button>
                <button
                  onClick={() => handlePublish('report')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="file-lines" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div className="font-medium text-[var(--text-neutral-strong)]">Save as Report</div>
                </button>
                <div className="my-1 border-t" style={{ borderColor: 'var(--border-neutral-x-weak)' }} />
                <button
                  onClick={() => handlePublish('share')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="arrow-up-from-bracket" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div className="font-medium text-[var(--text-neutral-strong)]">Share</div>
                </button>
                <button
                  onClick={() => handlePublish('download')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
                >
                  <Icon name="arrow-down-to-line" size={16} className="text-[var(--text-neutral-medium)]" />
                  <div className="font-medium text-[var(--text-neutral-strong)]">Download</div>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Fullscreen mode: Show buttons with responsive fallback */
          <div className="flex items-center gap-2 shrink-0">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`${showButtonText ? 'px-4 py-2' : 'w-8 h-8'} rounded-lg text-sm font-medium flex items-center ${showButtonText ? 'gap-2' : 'justify-center'} transition-colors group`}
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
              aria-label="Copy"
            >
              <Icon name="copy" size={16} />
              {showButtonText && <span>Copy</span>}
            </button>

            {/* Edit button */}
            <button
              onClick={handleEdit}
              className={`${showButtonText ? 'px-4 py-2' : 'w-8 h-8'} rounded-lg text-sm font-medium flex items-center ${showButtonText ? 'gap-2' : 'justify-center'} transition-colors group`}
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
              aria-label="Edit"
            >
              <Icon name="pen-to-square" size={16} />
              {showButtonText && <span>Edit</span>}
            </button>

            {/* Publish dropdown */}
            <div className="relative" ref={publishRef}>
              <button
                onClick={() => setIsPublishOpen(!isPublishOpen)}
                className={`${showButtonText ? 'px-4 py-2' : 'w-8 h-8'} rounded-lg text-sm font-medium flex items-center ${showButtonText ? 'gap-2' : 'justify-center'} transition-colors group`}
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
                aria-label="Publish"
              >
                <Icon name="arrow-up-from-bracket" size={16} />
                {showButtonText && <span>Publish</span>}
                {showButtonText && <Icon name="caret-down" size={10} />}
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
        )}
      </div>

      {/* Content display (chart or text) */}
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
}

export default InlineArtifactCard;
