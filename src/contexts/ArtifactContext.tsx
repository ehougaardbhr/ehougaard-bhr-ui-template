import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { mockArtifacts, type Artifact, type ChartSettings } from '../data/artifactData';

const SELECTED_ARTIFACT_KEY = 'bhr-selected-artifact';

interface ArtifactContextType {
  // State
  artifacts: Artifact[];
  selectedArtifactId: string | null;
  selectedArtifact: Artifact | null;
  isDrawerOpen: boolean;

  // Actions
  selectArtifact: (id: string) => void;
  updateArtifactSettings: (id: string, settings: Partial<ChartSettings>) => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  createArtifact: (type: Artifact['type'], conversationId: string, title: string) => Artifact;
  getArtifactsByConversation: (conversationId: string) => Artifact[];
}

const ArtifactContext = createContext<ArtifactContextType | undefined>(undefined);

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [artifacts, setArtifacts] = useState<Artifact[]>(mockArtifacts);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(() => {
    const stored = localStorage.getItem(SELECTED_ARTIFACT_KEY);
    return stored || null;
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Get the currently selected artifact object
  const selectedArtifact = artifacts.find(a => a.id === selectedArtifactId) || null;

  const selectArtifact = useCallback((id: string) => {
    setSelectedArtifactId(id);
    localStorage.setItem(SELECTED_ARTIFACT_KEY, id);
  }, []);

  const updateArtifactSettings = useCallback((id: string, settings: Partial<ChartSettings>) => {
    setArtifacts(prev => prev.map(artifact => {
      if (artifact.id === id && artifact.type === 'chart') {
        return {
          ...artifact,
          settings: {
            ...artifact.settings,
            ...settings,
          } as ChartSettings,
        };
      }
      return artifact;
    }));
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  const setDrawerOpen = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
  }, []);

  const createArtifact = useCallback((type: Artifact['type'], conversationId: string, title: string): Artifact => {
    const newId = String(Date.now());

    // Default settings for chart artifacts
    const defaultChartSettings: ChartSettings = {
      chartType: 'bar',
      measure: 'headcount',
      category: 'department',
      color: 'green',
      filter: 'all',
      benchmark: 'none',
    };

    const newArtifact: Artifact = {
      id: newId,
      type,
      title,
      conversationId,
      createdAt: new Date(),
      settings: type === 'chart' ? defaultChartSettings : {},
    };

    setArtifacts(prev => [newArtifact, ...prev]);
    setSelectedArtifactId(newId);
    localStorage.setItem(SELECTED_ARTIFACT_KEY, newId);

    return newArtifact;
  }, []);

  const getArtifactsByConversation = useCallback((conversationId: string): Artifact[] => {
    return artifacts.filter(a => a.conversationId === conversationId);
  }, [artifacts]);

  return (
    <ArtifactContext.Provider
      value={{
        artifacts,
        selectedArtifactId,
        selectedArtifact,
        isDrawerOpen,
        selectArtifact,
        updateArtifactSettings,
        toggleDrawer,
        setDrawerOpen,
        createArtifact,
        getArtifactsByConversation,
      }}
    >
      {children}
    </ArtifactContext.Provider>
  );
}

export function useArtifact() {
  const context = useContext(ArtifactContext);
  if (context === undefined) {
    throw new Error('useArtifact must be used within an ArtifactProvider');
  }
  return context;
}
