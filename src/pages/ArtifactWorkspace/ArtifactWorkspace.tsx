import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArtifact } from '../../contexts/ArtifactContext';
import { useChat } from '../../contexts/ChatContext';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { TextHeadline } from '../../components/TextHeadline';
import type { ChartSettings } from '../../data/artifactData';
import {
  measureLabels,
  categoryLabels,
  chartTypeLabels,
  generateArtifactTitle,
} from '../../data/artifactData';
import { BarChart, ChartSettingsDrawer, ChartSettingsPills } from '../../components/Charts';

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
  const { selectedConversation } = useChat();

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
  const handlePublish = (action: string) => {
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
          <Button variant="primary" className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--surface-neutral-white)]">
      {/* ============================================
          TOP BAR
          ============================================ */}
      <div
        className="h-14 flex items-center justify-between px-6 border-b shrink-0"
        style={{
          borderColor: 'var(--border-neutral-weak)',
          backgroundColor: 'var(--surface-neutral-white)',
        }}
      >
        {/* Left side: Back button + Title */}
        <div className="flex items-center gap-4">
          <Button variant="standard" onClick={handleBack}>
            <Icon name="arrow-left" size={16} />
            <span className="ml-2">Back to chat</span>
          </Button>
          <TextHeadline size="medium" color="neutral-strong">
            {artifactTitle}
          </TextHeadline>
        </div>

        {/* Right side: Saved indicator + Publish button */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--text-neutral-medium)] flex items-center gap-1.5">
            <Icon name="check" size={14} className="text-[var(--color-primary-strong)]" />
            Saved
          </span>

          {/* Publish dropdown - simplified for now */}
          <div className="relative">
            <Button variant="primary">
              <span>Publish</span>
              <Icon name="caret-down" size={10} className="ml-2" />
            </Button>
            {/* TODO: Add dropdown menu */}
          </div>
        </div>
      </div>

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
                  (selectedArtifact.settings as ChartSettings).chartType === 'bar' ? (
                    <BarChart
                      settings={selectedArtifact.settings as ChartSettings}
                      width={520}
                      height={360}
                    />
                  ) : (
                    <div className="text-center">
                      <Icon
                        name={(selectedArtifact.settings as ChartSettings).chartType === 'line' ? 'chart-line' :
                              (selectedArtifact.settings as ChartSettings).chartType === 'pie' ? 'chart-pie-simple' : 'table'}
                        size={48}
                        className="text-[var(--text-neutral-weak)] mx-auto mb-4"
                      />
                      <TextHeadline size="medium" color="neutral-medium">
                        {chartTypeLabels[(selectedArtifact.settings as ChartSettings).chartType]} chart
                      </TextHeadline>
                      <p className="text-sm text-[var(--text-neutral-weak)] mt-2">
                        {measureLabels[(selectedArtifact.settings as ChartSettings).measure]} by{' '}
                        {categoryLabels[(selectedArtifact.settings as ChartSettings).category]}
                      </p>
                      <p className="text-xs text-[var(--text-neutral-weak)] mt-4">
                        Coming soon
                      </p>
                    </div>
                  )
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
            />
          )}
        </div>

        {/* ============================================
            CHAT PANEL
            ============================================ */}
        <div
          className="w-[400px] flex flex-col shrink-0"
          style={{
            backgroundColor: 'var(--surface-neutral-xx-weak)',
            borderLeft: '1px solid var(--border-neutral-weak)',
          }}
        >
          {/* Chat Header */}
          <div
            className="px-5 py-4"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              borderBottom: '1px solid var(--border-neutral-x-weak)',
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-neutral-xx-strong)]">
              <Icon name="sparkles" size={14} className="text-[var(--color-primary-strong)]" />
              BambooHR Assistant
            </div>
          </div>

          {/* Messages Area - Placeholder */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-4">
              {/* Sample user message */}
              <div className="flex justify-end">
                <div
                  className="max-w-[90%] px-4 py-3 rounded-xl rounded-br-sm text-sm"
                  style={{ backgroundColor: 'var(--surface-neutral-white)' }}
                >
                  Show me headcount by department
                </div>
              </div>

              {/* Sample AI message */}
              <div className="flex justify-start">
                <div className="max-w-[90%]">
                  <div className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary-strong)] mb-1">
                    <Icon name="sparkles" size={12} />
                    BambooHR Assistant
                  </div>
                  <div
                    className="px-4 py-3 rounded-xl rounded-bl-sm text-sm"
                    style={{ backgroundColor: 'var(--surface-neutral-white)' }}
                  >
                    Here's a bar chart showing headcount by department. Engineering leads with 45 employees.
                    Use the controls to explore different views!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div
            className="px-5 py-4"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              borderTop: '1px solid var(--border-neutral-x-weak)',
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'var(--surface-neutral-xx-weak)',
                border: '1px solid var(--border-neutral-weak)',
              }}
            >
              <input
                type="text"
                placeholder="Ask about this chart..."
                className="flex-1 bg-transparent text-sm outline-none text-[var(--text-neutral-xx-strong)] placeholder:text-[var(--text-neutral-weak)]"
              />
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--color-primary-strong)' }}
              >
                <Icon name="arrow-up" size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtifactWorkspace;
