import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import {
  type ChartSettings,
  type ChartType,
  type MeasureType,
  type CategoryType,
  type ColorType,
  chartTypeLabels,
  chartTypeIcons,
  measureLabels,
  categoryLabels,
  colorLabels,
  colorPalettes,
} from '../../data/artifactData';

interface ChartSettingsToolbarProps {
  settings: ChartSettings;
  onSettingsChange: (settings: Partial<ChartSettings>) => void;
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

function ColorDot({ color }: { color: ChartSettings['color'] }) {
  const palette = colorPalettes[color];

  if (color === 'multi') {
    return (
      <div className="flex gap-0.5">
        {palette.multi.slice(0, 3).map((c, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: palette.solid }}
    />
  );
}

export function ChartSettingsToolbar({ settings, onSettingsChange }: ChartSettingsToolbarProps) {
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

  const handleSelect = (setting: Partial<ChartSettings>) => {
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
        {/* Chart type dropdown */}
        <ToolbarDropdown
          icon={<Icon name={chartTypeIcons[settings.chartType] as any} size={14} />}
          label={chartTypeLabels[settings.chartType]}
          isOpen={openDropdown === 'chartType'}
          onClick={() => toggleDropdown('chartType')}
        >
          {(Object.keys(chartTypeLabels) as ChartType[]).map(type => (
            <button
              key={type}
              onClick={() => {
                if (type === 'pie') {
                  handleSelect({ chartType: type, color: 'multi' });
                } else if (type === 'line' && settings.color === 'multi') {
                  handleSelect({ chartType: type, color: 'green' });
                } else {
                  handleSelect({ chartType: type });
                }
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-2 ${
                settings.chartType === type ? 'bg-[var(--surface-neutral-x-weak)]' : ''
              }`}
            >
              <Icon name={chartTypeIcons[type] as any} size={14} />
              <span>{chartTypeLabels[type]}</span>
            </button>
          ))}
        </ToolbarDropdown>

        {/* Measure dropdown */}
        <ToolbarDropdown
          icon={<Icon name="user-group" size={14} />}
          label={measureLabels[settings.measure]}
          isOpen={openDropdown === 'measure'}
          onClick={() => toggleDropdown('measure')}
        >
          {(Object.keys(measureLabels) as MeasureType[]).map(measure => (
            <button
              key={measure}
              onClick={() => handleSelect({ measure })}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] ${
                settings.measure === measure ? 'bg-[var(--surface-neutral-x-weak)]' : ''
              }`}
            >
              {measureLabels[measure]}
            </button>
          ))}
        </ToolbarDropdown>

        {/* Category dropdown */}
        <ToolbarDropdown
          icon={<Icon name="building" size={14} />}
          label={`by ${categoryLabels[settings.category]}`}
          isOpen={openDropdown === 'category'}
          onClick={() => toggleDropdown('category')}
        >
          {(Object.keys(categoryLabels) as CategoryType[]).map(category => (
            <button
              key={category}
              onClick={() => handleSelect({ category })}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] ${
                settings.category === category ? 'bg-[var(--surface-neutral-x-weak)]' : ''
              }`}
            >
              by {categoryLabels[category]}
            </button>
          ))}
        </ToolbarDropdown>

        {/* Color dropdown */}
        <ToolbarDropdown
          icon={<ColorDot color={settings.color} />}
          label={colorLabels[settings.color]}
          isOpen={openDropdown === 'color'}
          onClick={() => toggleDropdown('color')}
        >
          {(Object.keys(colorLabels) as ColorType[])
            .filter(color => settings.chartType === 'line' ? color !== 'multi' : true)
            .map(color => (
              <button
                key={color}
                onClick={() => handleSelect({ color })}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-2 ${
                  settings.color === color ? 'bg-[var(--surface-neutral-x-weak)]' : ''
                }`}
              >
                <ColorDot color={color} />
                <span>{colorLabels[color]}</span>
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

export default ChartSettingsToolbar;
