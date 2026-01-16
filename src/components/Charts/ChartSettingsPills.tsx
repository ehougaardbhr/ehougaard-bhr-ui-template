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

interface ChartSettingsPillsProps {
  settings: ChartSettings;
  onOpenDrawer: () => void;
  onSettingsChange: (settings: Partial<ChartSettings>) => void;
}

function SettingsPill({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-4 rounded-full flex items-center gap-2 text-[13px] font-medium transition-all duration-150 hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-primary-strong)',
        border: '1px solid var(--color-primary-strong)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        width: '200px',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}

function DropdownPill({
  children,
  onClick,
  isOpen
}: {
  children: React.ReactNode;
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-4 rounded-full flex items-center justify-between gap-2 text-[13px] font-medium transition-all duration-150 hover:bg-[var(--surface-neutral-x-weak)]"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid var(--border-neutral-weak)',
        color: 'var(--text-neutral-medium)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        width: '200px',
      }}
    >
      <span className="flex items-center gap-2 flex-1">{children}</span>
      <Icon
        name="caret-down"
        size={8}
        className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
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

export function ChartSettingsPills({ settings, onOpenDrawer, onSettingsChange }: ChartSettingsPillsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        ref => ref && !ref.contains(event.target as Node)
      );
      if (clickedOutside) {
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
    <div className="absolute top-5 right-5 flex flex-col gap-2 z-10 items-end">
      {/* Main settings button */}
      <SettingsPill onClick={onOpenDrawer}>
        <Icon name="sliders" size={12} />
        <span>Settings</span>
      </SettingsPill>

      {/* Chart type dropdown */}
      <div className="relative" ref={el => dropdownRefs.current['chartType'] = el}>
        <DropdownPill
          onClick={() => toggleDropdown('chartType')}
          isOpen={openDropdown === 'chartType'}
        >
          <Icon name={chartTypeIcons[settings.chartType] as any} size={12} />
          <span>{chartTypeLabels[settings.chartType]}</span>
        </DropdownPill>
        {openDropdown === 'chartType' && (
          <div
            className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg py-1 z-50"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--border-neutral-weak)',
            }}
          >
            {(Object.keys(chartTypeLabels) as ChartType[]).map(type => (
              <button
                key={type}
                onClick={() => handleSelect({ chartType: type })}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-neutral-xx-weak)] flex items-center gap-2 ${
                  settings.chartType === type ? 'bg-[var(--surface-neutral-x-weak)]' : ''
                }`}
              >
                <Icon name={chartTypeIcons[type] as any} size={14} />
                <span>{chartTypeLabels[type]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Measure dropdown */}
      <div className="relative" ref={el => dropdownRefs.current['measure'] = el}>
        <DropdownPill
          onClick={() => toggleDropdown('measure')}
          isOpen={openDropdown === 'measure'}
        >
          <span>{measureLabels[settings.measure]}</span>
        </DropdownPill>
        {openDropdown === 'measure' && (
          <div
            className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg py-1 z-50"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--border-neutral-weak)',
            }}
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
          </div>
        )}
      </div>

      {/* Category dropdown */}
      <div className="relative" ref={el => dropdownRefs.current['category'] = el}>
        <DropdownPill
          onClick={() => toggleDropdown('category')}
          isOpen={openDropdown === 'category'}
        >
          <span>by {categoryLabels[settings.category]}</span>
        </DropdownPill>
        {openDropdown === 'category' && (
          <div
            className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg py-1 z-50"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--border-neutral-weak)',
            }}
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
          </div>
        )}
      </div>

      {/* Color dropdown */}
      <div className="relative" ref={el => dropdownRefs.current['color'] = el}>
        <DropdownPill
          onClick={() => toggleDropdown('color')}
          isOpen={openDropdown === 'color'}
        >
          <ColorDot color={settings.color} />
          <span>{colorLabels[settings.color]}</span>
        </DropdownPill>
        {openDropdown === 'color' && (
          <div
            className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg py-1 z-50"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--border-neutral-weak)',
            }}
          >
            {(Object.keys(colorLabels) as ColorType[]).map(color => (
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartSettingsPills;
