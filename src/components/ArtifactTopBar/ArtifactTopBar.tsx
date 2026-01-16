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
      className="flex flex-col px-8 pt-5 pb-4 shrink-0"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Title */}
        <h1
          className="text-[27px] font-semibold"
          style={{
            fontFamily: 'Fields, system-ui, sans-serif',
            color: 'var(--color-primary-strong)',
            lineHeight: '37px',
          }}
        >
          {title}
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
        {/* Copy button */}
        <button
          onClick={onCopy}
          className="h-8 px-3 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--surface-neutral-xx-weak)]"
          style={{
            backgroundColor: 'var(--surface-neutral-white)',
            border: '1px solid var(--border-neutral-medium)',
            boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
          }}
          aria-label="Copy"
        >
          <Icon name="copy" size={16} className="text-[var(--text-neutral-strong)]" />
        </button>

        {/* Three-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-8 px-3 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--surface-neutral-xx-weak)]"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--border-neutral-medium)',
              boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
            }}
            aria-label="More options"
          >
            <Icon name="ellipsis" size={16} className="text-[var(--text-neutral-strong)]" />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: 'var(--surface-neutral-white)',
                border: '1px solid var(--border-neutral-weak)',
              }}
            >
              <button
                onClick={() => handleMenuAction('dashboard')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="table-cells" size={16} className="text-[var(--text-neutral-medium)]" />
                <span className="font-medium text-[var(--text-neutral-strong)]">Add to Dashboard</span>
              </button>
              <button
                onClick={() => handleMenuAction('report')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="file-lines" size={16} className="text-[var(--text-neutral-medium)]" />
                <span className="font-medium text-[var(--text-neutral-strong)]">Save as Report</span>
              </button>
              <div className="my-1 border-t" style={{ borderColor: 'var(--border-neutral-x-weak)' }} />
              <button
                onClick={() => handleMenuAction('share')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="arrow-up-from-bracket" size={16} className="text-[var(--text-neutral-medium)]" />
                <span className="font-medium text-[var(--text-neutral-strong)]">Share</span>
              </button>
              <button
                onClick={() => handleMenuAction('download')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="arrow-down-to-line" size={16} className="text-[var(--text-neutral-medium)]" />
                <span className="font-medium text-[var(--text-neutral-strong)]">Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Back to chat button */}
        <button
          onClick={onBack}
          className="h-8 px-3 rounded-full flex items-center gap-2 text-[16px] font-semibold transition-colors hover:bg-[var(--surface-neutral-xx-weak)]"
          style={{
            backgroundColor: 'var(--surface-neutral-white)',
            border: '1px solid var(--border-neutral-medium)',
            color: 'var(--text-neutral-strong)',
            boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
          }}
        >
          <Icon name="arrow-left" size={16} />
          <span>Back to chat</span>
        </button>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{ backgroundColor: 'var(--border-neutral-x-weak)' }}
      />
    </div>
  );
}

export default ArtifactTopBar;
