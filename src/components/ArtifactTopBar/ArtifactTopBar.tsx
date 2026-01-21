import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';

interface ArtifactTopBarProps {
  title: string;
  onBack: () => void;
  onCopy?: () => void;
  onPublish?: (action: 'dashboard' | 'report' | 'share' | 'download') => void;
}

export function ArtifactTopBar({ title, onBack, onCopy, onPublish }: ArtifactTopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuAction = (action: 'dashboard' | 'report' | 'share' | 'download') => {
    setIsMenuOpen(false);
    onPublish?.(action);
  };

  return (
    <div
      className="flex flex-col px-8 pt-5 pb-4 shrink-0 bg-white dark:bg-neutral-900"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Title */}
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

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Copy button */}
          <button
            onClick={onCopy}
            className="h-8 px-3 rounded-[1000px] flex items-center justify-center transition-colors bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
            style={{
              boxShadow: document.documentElement.classList.contains('dark')
                ? 'none'
                : '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
            }}
            aria-label="Copy"
          >
            <Icon name="copy" size={16} className="text-[#48413f] dark:text-neutral-300" />
          </button>

          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 px-3 rounded-[1000px] flex items-center justify-center transition-colors bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
              style={{
                boxShadow: document.documentElement.classList.contains('dark')
                  ? 'none'
                  : '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
              }}
              aria-label="More options"
            >
              <Icon name="ellipsis" size={16} className="text-[#48413f] dark:text-neutral-300" />
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg py-1 z-50 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
              >
                <button
                  onClick={() => handleMenuAction('dashboard')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-3"
                >
                  <Icon name="table-cells" size={16} className="text-gray-600 dark:text-neutral-400" />
                  <span className="font-medium text-gray-900 dark:text-neutral-100">Add to Dashboard</span>
                </button>
                <button
                  onClick={() => handleMenuAction('report')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-3"
                >
                  <Icon name="file-lines" size={16} className="text-gray-600 dark:text-neutral-400" />
                  <span className="font-medium text-gray-900 dark:text-neutral-100">Save as Report</span>
                </button>
                <div className="my-1 border-t border-gray-200 dark:border-neutral-700" />
                <button
                  onClick={() => handleMenuAction('share')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-3"
                >
                  <Icon name="arrow-up-from-bracket" size={16} className="text-gray-600 dark:text-neutral-400" />
                  <span className="font-medium text-gray-900 dark:text-neutral-100">Share</span>
                </button>
                <button
                  onClick={() => handleMenuAction('download')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-3"
                >
                  <Icon name="arrow-down-to-line" size={16} className="text-gray-600 dark:text-neutral-400" />
                  <span className="font-medium text-gray-900 dark:text-neutral-100">Download</span>
                </button>
              </div>
            )}
          </div>

          {/* Back to chat button */}
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-[1000px] flex items-center gap-2 font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--color-primary-strong)',
              boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
              fontSize: '15px',
              lineHeight: '22px',
              color: 'var(--color-primary-strong)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-selected-weak)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-neutral-white)';
            }}
          >
            <Icon name="arrow-left" size={16} style={{ color: 'var(--color-primary-strong)' }} />
            <span>Back to chat</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full bg-gray-200 dark:bg-neutral-700"
      />
    </div>
  );
}

export default ArtifactTopBar;
