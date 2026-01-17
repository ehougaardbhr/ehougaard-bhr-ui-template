import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtifactTransition, ANIMATION_TIMING, type TransitionRect } from '../../contexts/ArtifactTransitionContext';
import { BarChart, LineChart, PieChart, TableChart } from '../Charts';
import { Icon } from '../Icon';
import type { ChartSettings } from '../../data/artifactData';
import { generateArtifactTitle } from '../../data/artifactData';

// Workspace destination dimensions (approximate, will be refined)
const WORKSPACE_CARD_RECT: TransitionRect = {
  top: 32, // p-8
  left: 88, // toolbar (56) + p-8 (32)
  width: window.innerWidth - 88 - 367 - 64, // minus toolbar, chat, padding
  height: window.innerHeight - 64, // minus padding
};

const WORKSPACE_CHAT_RECT: TransitionRect = {
  top: 32,
  left: window.innerWidth - 367 - 32,
  width: 367,
  height: window.innerHeight - 64,
};

export function ArtifactTransitionOverlay() {
  const navigate = useNavigate();
  const {
    transitionState,
    transitionArtifact,
    sourceCardRect,
    sourceChatRect,
    completeTransition,
  } = useArtifactTransition();

  const [showChrome, setShowChrome] = useState(false);
  const hasNavigated = useRef(false);

  // Calculate destination rects dynamically
  const [destCardRect, setDestCardRect] = useState(WORKSPACE_CARD_RECT);
  const [destChatRect, setDestChatRect] = useState(WORKSPACE_CHAT_RECT);

  // Update destination rects on resize
  useEffect(() => {
    const updateRects = () => {
      // Workspace layout:
      // - Left toolbar: 88px (56px + 2*16px padding)
      // - Card area: p-8 (32px all around)
      // - Chat area: w-367, py-8 pr-8 (32px top/bottom, 32px right)

      const toolbarWidth = 88;
      const cardPadding = 32;
      const chatWidth = 367;
      const chatPaddingRight = 32;

      setDestCardRect({
        top: cardPadding,
        left: toolbarWidth + cardPadding,
        width: window.innerWidth - toolbarWidth - chatWidth - cardPadding * 2 - chatPaddingRight,
        height: window.innerHeight - cardPadding * 2,
      });
      setDestChatRect({
        top: cardPadding,
        left: window.innerWidth - chatWidth - chatPaddingRight,
        width: chatWidth,
        height: window.innerHeight - cardPadding * 2,
      });
    };

    updateRects();
    window.addEventListener('resize', updateRects);
    return () => window.removeEventListener('resize', updateRects);
  }, []);

  // Handle animation sequence for to-workspace
  useEffect(() => {
    if (transitionState === 'animating-to-workspace') {
      hasNavigated.current = false;
      setShowChrome(false); // Start with chrome hidden

      // Show chrome after delay (70% through card morph)
      const chromeTimer = setTimeout(() => {
        setShowChrome(true);
      }, ANIMATION_TIMING.chromeFadeInDelay);

      // Navigate and complete after total animation
      const completeTimer = setTimeout(() => {
        if (transitionArtifact && !hasNavigated.current) {
          hasNavigated.current = true;
          navigate(`/artifact/${transitionArtifact.type}/${transitionArtifact.id}`);

          // Complete transition after navigation settles
          setTimeout(() => {
            setShowChrome(false);
            completeTransition();
          }, 50);
        }
      }, ANIMATION_TIMING.total);

      return () => {
        clearTimeout(chromeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [transitionState, transitionArtifact, navigate, completeTransition]);

  // Handle reverse animation (workspace -> chat)
  useEffect(() => {
    if (transitionState === 'animating-to-chat') {
      hasNavigated.current = false;
      setShowChrome(true); // Start with chrome visible (we're coming from workspace)

      // Fade out chrome early in the animation
      const chromeTimer = setTimeout(() => {
        setShowChrome(false);
      }, 100);

      const completeTimer = setTimeout(() => {
        if (!hasNavigated.current) {
          hasNavigated.current = true;

          // Open chat panel in expanded mode
          localStorage.setItem('bhr-chat-panel-open', 'true');
          localStorage.setItem('bhr-chat-expanded', 'true');
          navigate('/');

          setTimeout(() => {
            completeTransition();
          }, 50);
        }
      }, ANIMATION_TIMING.total);

      return () => {
        clearTimeout(chromeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [transitionState, navigate, completeTransition]);

  const isAnimating = transitionState === 'animating-to-workspace' || transitionState === 'animating-to-chat';
  const isToWorkspace = transitionState === 'animating-to-workspace' || transitionState === 'preparing-to-workspace';

  if (!isAnimating || !transitionArtifact || !sourceCardRect) {
    return null;
  }

  const artifact = transitionArtifact;
  const chartSettings = artifact.settings as ChartSettings;
  const title = artifact.title || generateArtifactTitle(chartSettings);

  // Render chart for the morphing card
  const renderChart = (width: number, height: number) => {
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

  // Default chat panel position (AIChatPanel in expanded mode)
  const defaultChatPanelRect = {
    top: 106,
    left: window.innerWidth - 383 - 16,
    width: 383,
    height: window.innerHeight - 106 - 48,
  };

  // Source and destination depend on direction
  // For to-workspace: start from inline card, end at workspace
  // For to-chat: start from workspace, end at inline card position (expanded chat)
  let cardStart, cardEnd, chatStart, chatEnd;

  if (isToWorkspace) {
    cardStart = sourceCardRect;
    cardEnd = destCardRect;
    chatStart = sourceChatRect || defaultChatPanelRect;
    chatEnd = destChatRect;

    console.log('To Workspace animation:');
    console.log('  Card:', cardStart, '->', cardEnd);
    console.log('  Chat:', chatStart, '->', chatEnd);
  } else {
    // Reverse: start at workspace positions, end at chat positions
    cardStart = sourceCardRect; // Workspace card position
    cardEnd = {
      // Target: approximately where the inline card would be in expanded chat
      top: 200,
      left: 320,
      width: 700,
      height: 500,
    };
    chatStart = sourceChatRect || destChatRect;
    chatEnd = defaultChatPanelRect;

    console.log('To Chat animation:');
    console.log('  Card:', cardStart, '->', cardEnd);
    console.log('  Chat:', chatStart, '->', chatEnd);
  }

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999]"
        style={{ backgroundColor: 'var(--surface-neutral-xx-weak)' }}
      >
        {/* Background - solid to hide underlying content */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'var(--surface-neutral-xx-weak)' }}
        />

        {/* Left Toolbar (chrome) */}
        <motion.div
          className="fixed flex flex-col items-start px-6 py-6"
          style={{
            top: 0,
            left: 0,
            bottom: 0,
            width: 88,
            backgroundColor: 'var(--surface-neutral-white)',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={showChrome ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: ANIMATION_TIMING.chromeFadeIn / 1000, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--surface-neutral-x-weak)]">
              <Icon name="sparkles" size={20} className="text-[var(--color-primary-strong)]" />
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[var(--surface-neutral-x-weak)]">
              <Icon name="pen-to-square" size={20} className="text-[var(--icon-neutral-strong)]" />
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[var(--surface-neutral-x-weak)]">
              <Icon name="magnifying-glass" size={20} className="text-[var(--icon-neutral-strong)]" />
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[var(--surface-neutral-x-weak)]">
              <Icon name="image" size={20} className="text-[var(--icon-neutral-strong)]" />
            </div>
          </div>
        </motion.div>

        {/* Morphing Card */}
        <motion.div
          className="fixed rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--surface-neutral-white)',
            boxShadow: '2px 2px 0px 2px rgba(56, 49, 47, 0.05)',
          }}
          initial={{
            top: cardStart.top,
            left: cardStart.left,
            width: cardStart.width,
            height: cardStart.height,
          }}
          animate={{
            top: cardEnd.top,
            left: cardEnd.left,
            width: cardEnd.width,
            height: cardEnd.height,
          }}
          transition={{
            duration: ANIMATION_TIMING.cardMorph / 1000,
            ease: [0.25, 0.8, 0.25, 1],
          }}
        >
          {/* Card Header */}
          <motion.div
            className="flex items-center justify-between px-8 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: showChrome ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1
              className="font-semibold"
              style={{
                fontFamily: 'Fields, system-ui, sans-serif',
                color: 'var(--color-primary-strong)',
                fontSize: '32px',
                lineHeight: '40px',
              }}
            >
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-8 px-3 rounded-[1000px] flex items-center gap-2 bg-white border border-[var(--border-neutral-medium)]">
                <Icon name="copy" size={16} className="text-[#48413f]" />
                <span className="text-sm text-[#48413f]">Copy</span>
              </div>
            </div>
          </motion.div>

          {/* Settings Toolbar placeholder */}
          <motion.div
            className="h-12 px-8 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: showChrome ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <div className="h-8 px-3 rounded-lg flex items-center gap-2 bg-[var(--surface-neutral-xx-weak)]">
                <Icon name="chart-simple" size={14} className="text-[var(--icon-neutral-strong)]" />
                <span className="text-sm">Bar</span>
              </div>
            </div>
          </motion.div>

          {/* Chart content - scale to fit */}
          <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="origin-center"
            >
              {renderChart(
                Math.min(900, destCardRect.width - 64),
                Math.min(600, destCardRect.height - 200)
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Morphing Chat Panel */}
        <motion.div
          className="fixed rounded-[20px] overflow-hidden p-1"
          style={{
            backgroundColor: 'var(--surface-neutral-xx-weak)',
          }}
          initial={{
            top: chatStart.top,
            left: chatStart.left,
            width: chatStart.width,
            height: chatStart.height,
          }}
          animate={{
            top: chatEnd.top,
            left: chatEnd.left,
            width: chatEnd.width,
            height: chatEnd.height,
          }}
          transition={{
            duration: ANIMATION_TIMING.chatSlide / 1000,
            delay: ANIMATION_TIMING.chatSlideDelay / 1000,
            ease: [0.25, 0.8, 0.25, 1],
          }}
        >
          {/* Chat Header */}
          <div
            className="px-5 py-4 rounded-t-[12px]"
            style={{ backgroundColor: 'var(--surface-neutral-white)' }}
          >
            <div className="flex items-center gap-2.5">
              <Icon name="sparkles" size={20} className="text-[var(--color-primary-strong)]" />
              <span className="text-[16px] font-medium text-[var(--text-neutral-x-strong)]">
                BambooHR Assistant
              </span>
            </div>
          </div>

          {/* Chat content placeholder */}
          <div
            className="flex-1 px-5 py-5"
            style={{ backgroundColor: 'var(--surface-neutral-white)' }}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.3 }}
              className="text-[15px] text-[var(--text-neutral-medium)]"
            >
              Ask questions about this chart...
            </motion.div>
          </div>

          {/* Input area */}
          <div
            className="p-4 rounded-b-[16px]"
            style={{ backgroundColor: 'var(--surface-neutral-white)' }}
          >
            <div
              className="relative rounded-lg p-[2px] min-h-[86px]"
              style={{
                background: 'linear-gradient(93deg, #87C276 0%, #7AB8EE 33.65%, #C198D4 66.83%, #F2A766 96.15%)',
              }}
            >
              <div className="bg-[var(--surface-neutral-white)] rounded-[6px] px-5 pt-4 pb-3">
                <div className="text-[15px] text-[var(--text-neutral-medium)]">Reply...</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

export default ArtifactTransitionOverlay;
