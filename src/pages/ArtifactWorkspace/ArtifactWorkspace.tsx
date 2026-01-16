import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArtifact } from '../../contexts/ArtifactContext';
import { Icon } from '../../components/Icon';
import { TextHeadline } from '../../components/TextHeadline';
import { ArtifactTopBar } from '../../components/ArtifactTopBar';
import { ArtifactChatPanel } from '../../components/ArtifactChatPanel';
import type { ChartSettings } from '../../data/artifactData';
import { generateArtifactTitle } from '../../data/artifactData';
import { BarChart, LineChart, PieChart, TableChart, ChartSettingsDrawer, ChartSettingsPills } from '../../components/Charts';

export function ArtifactWorkspace() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const {
    selectArtifact,
    selectedArtifact,
    artifacts,
    isDrawerOpen,
    setDrawerOpen,
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
    // Navigate back to chat with the conversation this artifact belongs to
    if (selectedArtifact?.conversationId) {
      navigate(`/chat/${selectedArtifact.conversationId}`);
    } else {
      navigate(-1);
    }
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
            Unsupported artifact type: {type}
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
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--surface-neutral-white)]">
      {/* TOP BAR */}
      <ArtifactTopBar
        title={artifactTitle}
        onBack={handleBack}
        onPublish={handlePublish}
      />

      {/* ============================================
          WORKSPACE CONTAINER
          ============================================ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ============================================
            ARTIFACT AREA (Chart + Settings Drawer)
            ============================================ */}
        <div className="flex-1 flex relative bg-[var(--surface-neutral-white)]">
          {/* Chart Area */}
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
            <div
              className="w-full h-full rounded-xl p-10 flex flex-col"
              style={{
                backgroundColor: 'var(--surface-neutral-xx-weak)',
                border: '1px solid var(--border-neutral-x-weak)',
              }}
            >
              {/* Chart rendering */}
              <div className="flex-1 flex items-center justify-center">
                {selectedArtifact ? (
                  (() => {
                    const chartSettings = selectedArtifact.settings as ChartSettings;
                    switch (chartSettings.chartType) {
                      case 'bar':
                        return <BarChart settings={chartSettings} width={520} height={360} />;
                      case 'line':
                        return <LineChart settings={chartSettings} width={520} height={360} />;
                      case 'pie':
                        return <PieChart settings={chartSettings} width={400} height={400} />;
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

          {/* Settings Drawer */}
          {isDrawerOpen && selectedArtifact && (
            <ChartSettingsDrawer
              settings={selectedArtifact.settings as ChartSettings}
              onSettingsChange={(newSettings) => {
                updateArtifactSettings(selectedArtifact.id, newSettings);
              }}
              onClose={() => setDrawerOpen(false)}
            />
          )}

          {/* Settings Pills (when drawer is closed) */}
          {!isDrawerOpen && selectedArtifact && (
            <ChartSettingsPills
              settings={selectedArtifact.settings as ChartSettings}
              onOpenDrawer={() => setDrawerOpen(true)}
              onSettingsChange={(newSettings) => {
                updateArtifactSettings(selectedArtifact.id, newSettings);
              }}
            />
          )}
        </div>

        {/* CHAT PANEL */}
        <ArtifactChatPanel conversationId={selectedArtifact?.conversationId || null} />
      </div>
    </div>
  );
}

export default ArtifactWorkspace;
