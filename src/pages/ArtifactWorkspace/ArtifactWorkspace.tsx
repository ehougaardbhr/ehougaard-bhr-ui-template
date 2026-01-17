import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArtifact } from '../../contexts/ArtifactContext';
import { Icon } from '../../components/Icon';
import { TextHeadline } from '../../components/TextHeadline';
import { ArtifactTopBar } from '../../components/ArtifactTopBar';
import { ArtifactToolBar } from '../../components/ArtifactToolBar';
import { ArtifactChatPanel } from '../../components/ArtifactChatPanel';
import type { ChartSettings } from '../../data/artifactData';
import { generateArtifactTitle } from '../../data/artifactData';
import { BarChart, LineChart, PieChart, TableChart, ChartSettingsToolbar } from '../../components/Charts';

export function ArtifactWorkspace() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const {
    selectArtifact,
    selectedArtifact,
    artifacts,
    updateArtifactSettings,
  } = useArtifact();

  // Select artifact from URL param on mount
  useEffect(() => {
    if (id) {
      const exists = artifacts.some(a => a.id === id);
      if (exists) {
        selectArtifact(id);
      }
    }
  }, [id, artifacts, selectArtifact]);

  // Get title - either from artifact or generate from settings
  const artifactTitle = selectedArtifact?.title ||
    (selectedArtifact?.type === 'chart'
      ? generateArtifactTitle(selectedArtifact.settings as ChartSettings)
      : 'Untitled Artifact');

  const handleBack = () => {
    // TODO: Fix reverse transition animation - currently disabled
    // Open the chat panel in expanded mode and navigate home
    localStorage.setItem('bhr-chat-panel-open', 'true');
    localStorage.setItem('bhr-chat-expanded', 'true');
    navigate('/');
  };

  const handleCopy = () => {
    // TODO: Implement copy functionality
    console.log('Copy artifact:', selectedArtifact?.id);
  };

  // Handle publish actions
  const handlePublish = (action: 'dashboard' | 'report' | 'share' | 'download') => {
    // TODO: Implement publish actions
    console.log('Publish action:', action);
  };

  // For now, only handle chart artifacts
  if (type !== 'chart') {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--surface-neutral-xx-weak)]">
        <div className="text-center">
          <TextHeadline size="large" color="neutral-strong">
            {`Unsupported artifact type: ${type || 'unknown'}`}
          </TextHeadline>
          <p className="mt-2 text-[var(--text-neutral-medium)]">
            Only chart artifacts are currently supported.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-primary-strong)] text-white text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--surface-neutral-xx-weak)' }}>
      {/* Left Toolbar */}
      <ArtifactToolBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chart area with card containing header, toolbar, and chart */}
        <div className="flex-1 p-8 overflow-auto">
          <div
            className="flex flex-col h-full rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              boxShadow: '2px 2px 0px 2px rgba(56, 49, 47, 0.05)',
            }}
          >
            {/* Header inside card */}
            <ArtifactTopBar
              title={artifactTitle}
              onBack={handleBack}
              onCopy={handleCopy}
              onPublish={handlePublish}
            />

            {/* Settings Toolbar inside card */}
            {selectedArtifact && (
              <ChartSettingsToolbar
                settings={selectedArtifact.settings as ChartSettings}
                onSettingsChange={(newSettings) => {
                  updateArtifactSettings(selectedArtifact.id, newSettings);
                }}
              />
            )}

            {/* Chart content */}
            <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
              {selectedArtifact ? (
                (() => {
                  const chartSettings = selectedArtifact.settings as ChartSettings;
                  const width = 900;
                  const height = 600;

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
                })()
              ) : (
                <div className="text-center">
                  <Icon name="chart-simple" size={48} className="text-[var(--text-neutral-weak)] mx-auto mb-4" />
                  <TextHeadline size="medium" color="neutral-medium">
                    No artifact selected
                  </TextHeadline>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat panel */}
        <div className="py-8 pr-8 flex">
          <ArtifactChatPanel conversationId={selectedArtifact?.conversationId || null} />
        </div>
      </div>
    </div>
  );
}

export default ArtifactWorkspace;
