import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { TextHeadline } from '../TextHeadline';

interface ArtifactTopBarProps {
  title: string;
  onBack: () => void;
  onPublish?: (action: 'dashboard' | 'report' | 'share' | 'download') => void;
}

export function ArtifactTopBar({ title, onBack, onPublish }: ArtifactTopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePublishAction = (action: 'dashboard' | 'report' | 'share' | 'download') => {
    setIsDropdownOpen(false);
    onPublish?.(action);
  };

  return (
    <div
      className="h-14 flex items-center justify-between px-6 border-b shrink-0"
      style={{
        borderColor: 'var(--border-neutral-weak)',
        backgroundColor: 'var(--surface-neutral-white)',
      }}
    >
      {/* Left side: Back button + Title */}
      <div className="flex items-center gap-4">
        <Button variant="standard" onClick={onBack}>
          <Icon name="arrow-left" size={16} />
          <span className="ml-2">Back to chat</span>
        </Button>
        <TextHeadline size="medium" color="neutral-strong">
          {title}
        </TextHeadline>
      </div>

      {/* Right side: Saved indicator + Publish button */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--text-neutral-medium)] flex items-center gap-1.5">
          <Icon name="check" size={14} className="text-[var(--color-primary-strong)]" />
          Saved
        </span>

        {/* Publish dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="primary"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>Publish</span>
            <Icon name="caret-down" size={10} className="ml-2" />
          </Button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: 'var(--surface-neutral-white)',
                border: '1px solid var(--border-neutral-weak)',
              }}
            >
              <button
                onClick={() => handlePublishAction('dashboard')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="table-cells" size={16} className="text-[var(--text-neutral-medium)]" />
                <div>
                  <div className="font-medium text-[var(--text-neutral-strong)]">Add to Dashboard</div>
                  <div className="text-xs text-[var(--text-neutral-weak)]">Pin to your home dashboard</div>
                </div>
              </button>
              <button
                onClick={() => handlePublishAction('report')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="file-lines" size={16} className="text-[var(--text-neutral-medium)]" />
                <div>
                  <div className="font-medium text-[var(--text-neutral-strong)]">Save as Report</div>
                  <div className="text-xs text-[var(--text-neutral-weak)]">Create a reusable report</div>
                </div>
              </button>
              <div className="my-1 border-t" style={{ borderColor: 'var(--border-neutral-x-weak)' }} />
              <button
                onClick={() => handlePublishAction('share')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="arrow-up-from-bracket" size={16} className="text-[var(--text-neutral-medium)]" />
                <div>
                  <div className="font-medium text-[var(--text-neutral-strong)]">Share</div>
                  <div className="text-xs text-[var(--text-neutral-weak)]">Share with team members</div>
                </div>
              </button>
              <button
                onClick={() => handlePublishAction('download')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-3"
              >
                <Icon name="arrow-down-to-line" size={16} className="text-[var(--text-neutral-medium)]" />
                <div>
                  <div className="font-medium text-[var(--text-neutral-strong)]">Download</div>
                  <div className="text-xs text-[var(--text-neutral-weak)]">Export as PNG or CSV</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtifactTopBar;
