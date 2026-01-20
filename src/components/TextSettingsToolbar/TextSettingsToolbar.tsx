import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import {
  type TextSettings,
  type ToneType,
  type LengthType,
  type FormatType,
  toneLabels,
  lengthLabels,
  formatLabels,
} from '../../data/artifactData';

interface TextSettingsToolbarProps {
  settings: TextSettings;
  onSettingsChange: (settings: Partial<TextSettings>) => void;
}

function ToolbarDropdown({
  icon,
  label,
  isOpen,
  onClick,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="h-8 px-3 rounded-full flex items-center gap-2 text-[13px] font-medium transition-colors hover:bg-[var(--surface-neutral-x-weak)]"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          border: '1px solid var(--border-neutral-weak)',
          color: 'var(--text-neutral-strong)',
        }}
      >
        {icon}
        <span>{label}</span>
        <Icon
          name="caret-down"
          size={8}
          className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-44 rounded-lg shadow-lg py-1 z-50"
          style={{
            backgroundColor: 'var(--surface-neutral-white)',
            border: '1px solid var(--border-neutral-weak)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function TextSettingsToolbar({ settings, onSettingsChange }: TextSettingsToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelect = (setting: Partial<TextSettings>) => {
    onSettingsChange(setting);
    setOpenDropdown(null);
  };

  return (
    <div
      ref={toolbarRef}
      className="h-12 px-8 flex items-center justify-between shrink-0"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
      }}
    >
      {/* Left: Setting dropdowns */}
      <div className="flex items-center gap-2">
        {/* Tone dropdown */}
        <ToolbarDropdown
          icon={<Icon name="user-tie" size={14} />}
          label={toneLabels[settings.tone]}
          isOpen={openDropdown === 'tone'}
          onClick={() => toggleDropdown('tone')}
        >
          {(Object.keys(toneLabels) as ToneType[]).map(tone => (
            <button
              key={tone}
              onClick={() => handleSelect({ tone })}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] ${
                settings.tone === tone ? 'bg-[var(--surface-neutral-x-weak)]' : ''
              }`}
            >
              {toneLabels[tone]}
            </button>
          ))}
        </ToolbarDropdown>

        {/* Length dropdown */}
        <ToolbarDropdown
          icon={<Icon name="text-size" size={14} />}
          label={lengthLabels[settings.length]}
          isOpen={openDropdown === 'length'}
          onClick={() => toggleDropdown('length')}
        >
          {(Object.keys(lengthLabels) as LengthType[]).map(length => (
            <button
              key={length}
              onClick={() => handleSelect({ length })}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] ${
                settings.length === length ? 'bg-[var(--surface-neutral-x-weak)]' : ''
              }`}
            >
              {lengthLabels[length]}
            </button>
          ))}
        </ToolbarDropdown>

        {/* Format dropdown */}
        <ToolbarDropdown
          icon={<Icon name="list" size={14} />}
          label={formatLabels[settings.format]}
          isOpen={openDropdown === 'format'}
          onClick={() => toggleDropdown('format')}
        >
          {(Object.keys(formatLabels) as FormatType[]).map(format => (
            <button
              key={format}
              onClick={() => handleSelect({ format })}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] ${
                settings.format === format ? 'bg-[var(--surface-neutral-x-weak)]' : ''
              }`}
            >
              {formatLabels[format]}
            </button>
          ))}
        </ToolbarDropdown>
      </div>

      {/* Right: Saved indicator */}
      <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-neutral-medium)]">
        <Icon name="check" size={14} className="text-[var(--color-primary-strong)]" />
        <span>Saved</span>
      </div>
    </div>
  );
}

export default TextSettingsToolbar;
