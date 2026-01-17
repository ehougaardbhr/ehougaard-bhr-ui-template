import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Artifact } from '../data/artifactData';

export interface TransitionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type TransitionState =
  | 'none'
  | 'preparing-to-workspace'
  | 'animating-to-workspace'
  | 'preparing-to-chat'
  | 'animating-to-chat';

interface ArtifactTransitionContextType {
  // State
  transitionState: TransitionState;
  transitionArtifact: Artifact | null;
  sourceCardRect: TransitionRect | null;
  sourceChatRect: TransitionRect | null;

  // Actions
  startTransitionToWorkspace: (
    artifact: Artifact,
    cardRect: TransitionRect,
    chatRect: TransitionRect | null
  ) => void;
  startTransitionToChat: (
    artifact: Artifact,
    cardRect: TransitionRect,
    chatRect: TransitionRect
  ) => void;
  completeTransition: () => void;
  cancelTransition: () => void;

  // Refs for measuring destination positions
  registerDestinationCard: (ref: HTMLElement | null) => void;
  registerDestinationChat: (ref: HTMLElement | null) => void;
  getDestinationCardRect: () => TransitionRect | null;
  getDestinationChatRect: () => TransitionRect | null;
}

const ArtifactTransitionContext = createContext<ArtifactTransitionContextType | undefined>(undefined);

// Animation timing constants (in ms)
export const ANIMATION_TIMING = {
  fadeOutChat: 300,
  cardMorph: 600,
  chatSlide: 500,
  chatSlideDelay: 100,
  chromeFadeIn: 400,
  chromeFadeInDelay: 420, // 70% through card morph
  total: 800,
};

export function ArtifactTransitionProvider({ children }: { children: ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState>('none');
  const [transitionArtifact, setTransitionArtifact] = useState<Artifact | null>(null);
  const [sourceCardRect, setSourceCardRect] = useState<TransitionRect | null>(null);
  const [sourceChatRect, setSourceChatRect] = useState<TransitionRect | null>(null);

  // Refs for measuring destination elements
  const destinationCardRef = useRef<HTMLElement | null>(null);
  const destinationChatRef = useRef<HTMLElement | null>(null);

  const startTransitionToWorkspace = useCallback((
    artifact: Artifact,
    cardRect: TransitionRect,
    chatRect: TransitionRect | null
  ) => {
    setTransitionArtifact(artifact);
    setSourceCardRect(cardRect);
    setSourceChatRect(chatRect);
    setTransitionState('preparing-to-workspace');

    // Move to animating state after a frame to allow overlay to render
    requestAnimationFrame(() => {
      setTransitionState('animating-to-workspace');
    });
  }, []);

  const startTransitionToChat = useCallback((
    artifact: Artifact,
    cardRect: TransitionRect,
    chatRect: TransitionRect
  ) => {
    setTransitionArtifact(artifact);
    setSourceCardRect(cardRect);
    setSourceChatRect(chatRect);
    setTransitionState('preparing-to-chat');

    requestAnimationFrame(() => {
      setTransitionState('animating-to-chat');
    });
  }, []);

  const completeTransition = useCallback(() => {
    setTransitionState('none');
    setTransitionArtifact(null);
    setSourceCardRect(null);
    setSourceChatRect(null);
  }, []);

  const cancelTransition = useCallback(() => {
    setTransitionState('none');
    setTransitionArtifact(null);
    setSourceCardRect(null);
    setSourceChatRect(null);
  }, []);

  const registerDestinationCard = useCallback((ref: HTMLElement | null) => {
    destinationCardRef.current = ref;
  }, []);

  const registerDestinationChat = useCallback((ref: HTMLElement | null) => {
    destinationChatRef.current = ref;
  }, []);

  const getDestinationCardRect = useCallback((): TransitionRect | null => {
    if (!destinationCardRef.current) return null;
    const rect = destinationCardRef.current.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const getDestinationChatRect = useCallback((): TransitionRect | null => {
    if (!destinationChatRef.current) return null;
    const rect = destinationChatRef.current.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  return (
    <ArtifactTransitionContext.Provider
      value={{
        transitionState,
        transitionArtifact,
        sourceCardRect,
        sourceChatRect,
        startTransitionToWorkspace,
        startTransitionToChat,
        completeTransition,
        cancelTransition,
        registerDestinationCard,
        registerDestinationChat,
        getDestinationCardRect,
        getDestinationChatRect,
      }}
    >
      {children}
    </ArtifactTransitionContext.Provider>
  );
}

export function useArtifactTransition() {
  const context = useContext(ArtifactTransitionContext);
  if (context === undefined) {
    throw new Error('useArtifactTransition must be used within an ArtifactTransitionProvider');
  }
  return context;
}
