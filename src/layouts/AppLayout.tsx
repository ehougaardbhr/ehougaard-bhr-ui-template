import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { GlobalNav } from '../components/GlobalNav';
import { GlobalHeader } from '../components/GlobalHeader';

const NAV_STORAGE_KEY = 'bhr-nav-expanded';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(() => {
    const stored = localStorage.getItem(NAV_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
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

  return (
    <div className="min-h-screen bg-white">
      {/* Global Navigation */}
      <GlobalNav />

      {/* Main Content Area */}
      <div
        className="flex flex-col transition-all duration-300 ease-in-out"
        style={{ marginLeft: navWidth }}
      >
        {/* Header */}
        <GlobalHeader />

        {/* Page Content with Capsule Background */}
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
    </div>
  );
}

export { AppLayout };
export default AppLayout;
