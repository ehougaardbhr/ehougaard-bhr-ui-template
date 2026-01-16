import { Icon } from '../Icon';
import {
  type ChartSettings,
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
}

function Pill({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-full flex items-center gap-2 text-[13px] font-medium transition-all duration-150 hover:scale-[1.02]"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid var(--border-neutral-weak)',
        color: 'var(--text-neutral-medium)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {children}
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

export function ChartSettingsPills({ settings, onOpenDrawer }: ChartSettingsPillsProps) {
  return (
    <div className="absolute top-5 right-5 flex flex-wrap gap-2 z-10 max-w-[280px] justify-end">
      {/* Main settings button */}
      <Pill onClick={onOpenDrawer}>
        <Icon name="sliders" size={12} />
        <span>Settings</span>
      </Pill>

      {/* Chart type pill */}
      <Pill onClick={onOpenDrawer}>
        <Icon name={chartTypeIcons[settings.chartType] as any} size={12} />
        <span>{chartTypeLabels[settings.chartType]}</span>
      </Pill>

      {/* Measure pill */}
      <Pill onClick={onOpenDrawer}>
        <span>{measureLabels[settings.measure]}</span>
      </Pill>

      {/* Category pill */}
      <Pill onClick={onOpenDrawer}>
        <span>by {categoryLabels[settings.category]}</span>
      </Pill>

      {/* Color pill */}
      <Pill onClick={onOpenDrawer}>
        <ColorDot color={settings.color} />
        <span>{colorLabels[settings.color]}</span>
      </Pill>
    </div>
  );
}

export default ChartSettingsPills;
