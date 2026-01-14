import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { GlobalNav } from '../components/GlobalNav';
import { GlobalHeader } from '../components/GlobalHeader';
import { AIChatPanel } from '../components/AIChatPanel';

const NAV_STORAGE_KEY = 'bhr-nav-expanded';
const CHAT_PANEL_STORAGE_KEY = 'bhr-chat-panel-open';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(() => {
    const stored = localStorage.getItem(NAV_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(() => {
    return localStorage.getItem(CHAT_PANEL_STORAGE_KEY) === 'true';
  });
  const [isTablet, setIsTablet] = useState(false);

  // Sync with GlobalNav state via localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(NAV_STORAGE_KEY);
      if (stored) {
        setIsNavExpanded(JSON.parse(stored));
      }
    };

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);

    // Also poll for changes (for same-tab updates)
    const interval = setInterval(() => {
      const stored = localStorage.getItem(NAV_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed !== isNavExpanded) {
          setIsNavExpanded(parsed);
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isNavExpanded]);

  // Sync with chat panel state via localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const isOpen = localStorage.getItem(CHAT_PANEL_STORAGE_KEY) === 'true';
      if (isOpen !== isChatPanelOpen) {
        setIsChatPanelOpen(isOpen);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isChatPanelOpen]);

  const handleCloseChatPanel = () => {
    localStorage.setItem(CHAT_PANEL_STORAGE_KEY, 'false');
    setIsChatPanelOpen(false);
  };

  // Check for tablet viewport
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth < 1024);
    };
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  // Calculate effective nav width
  const effectiveExpanded = isTablet ? false : isNavExpanded;
  const navWidth = effectiveExpanded ? 240 : 120;
  // Chat panel width (399) + 16px gap - main's pr-10 (40px) = 375px
  const chatPanelWidth = isChatPanelOpen ? 375 : 0;

  return (
    <div className="min-h-screen bg-[var(--surface-neutral-white)]">
      {/* Global Navigation */}
      <GlobalNav />

      {/* Header - Full width (only nav margin) */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: navWidth }}
      >
        <GlobalHeader />
      </div>

      {/* Page Content with Capsule Background - Compressed by chat panel */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: navWidth, marginRight: chatPanelWidth }}
      >
        <main className="flex flex-col flex-1 pr-10 pb-10">
          <div
            className="
              flex-1
              bg-[var(--surface-neutral-xx-weak)]
              rounded-[var(--radius-large)]
              overflow-hidden
            "
          >
            {children}
          </div>
        </main>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel isOpen={isChatPanelOpen} onClose={handleCloseChatPanel} />
    </div>
  );
}

export { AppLayout };
export default AppLayout;
