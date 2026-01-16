import { Icon } from '../Icon';
import {
  type ChartSettings,
  type ChartType,
  type ColorType,
  chartTypeLabels,
  chartTypeIcons,
  measureLabels,
  categoryLabels,
  colorLabels,
  filterLabels,
  benchmarkLabels,
} from '../../data/artifactData';

interface ChartSettingsDrawerProps {
  settings: ChartSettings;
  onSettingsChange: (settings: Partial<ChartSettings>) => void;
  onClose: () => void;
}

interface SettingSelectProps<T extends string> {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (value: T) => void;
  renderOption?: (key: T, label: string) => React.ReactNode;
}

function SettingSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: SettingSelectProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-medium text-[var(--text-neutral-strong)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] text-[var(--text-neutral-strong)] hover:border-[var(--border-neutral-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-weak)] focus:border-[var(--color-primary-medium)] transition-all duration-150"
      >
        {(Object.keys(options) as T[]).map(key => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ChartTypeButtonsProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
}

function ChartTypeButtons({ value, onChange }: ChartTypeButtonsProps) {
  const types = Object.keys(chartTypeLabels) as ChartType[];

  return (
    <div className="space-y-2">
      <label className="text-[13px] font-medium text-[var(--text-neutral-strong)]">
        Chart Type
      </label>
      <div className="flex relative">
        {types.map((key, index) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              flex-1 flex flex-col items-center justify-center py-3 px-2 gap-1
              border bg-[var(--surface-neutral-white)]
              cursor-pointer transition-all duration-150
              ${index === 0 ? 'rounded-l-lg' : ''}
              ${index === types.length - 1 ? 'rounded-r-lg' : ''}
              ${index > 0 ? '-ml-px' : ''}
              ${value === key
                ? 'bg-[var(--color-primary-x-weak)] border-[var(--color-primary-strong)] relative z-10'
                : 'border-[var(--border-neutral-weak)] hover:bg-[var(--surface-neutral-xx-weak)]'
              }
            `}
          >
            <Icon
              name={chartTypeIcons[key] as any}
              size={18}
              className={value === key ? 'text-[var(--color-primary-strong)]' : 'text-[var(--text-neutral-weak)]'}
            />
            <span className={`text-[10px] ${value === key ? 'text-[var(--color-primary-strong)] font-medium' : 'text-[var(--text-neutral-weak)]'}`}>
              {chartTypeLabels[key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChartSettingsDrawer({
  settings,
  onSettingsChange,
  onClose,
}: ChartSettingsDrawerProps) {
  return (
    <div
      className="w-[280px] flex flex-col shrink-0"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
        borderLeft: '1px solid var(--border-neutral-weak)',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
      }}
    >
      {/* Drawer Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border-neutral-x-weak)' }}
      >
        <span className="text-[15px] font-semibold text-[var(--text-neutral-xx-strong)]">
          Chart Settings
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--surface-neutral-x-weak)] text-[var(--text-neutral-medium)]"
        >
          <Icon name="xmark" size={16} />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* Chart Type */}
        <ChartTypeButtons
          value={settings.chartType}
          onChange={(value) => {
            // When switching to pie chart, default to multi-color for better visual distinction
            if (value === 'pie') {
              onSettingsChange({ chartType: value, color: 'multi' });
            }
            // When switching to line chart, ensure solid color (multi-color doesn't work for lines)
            else if (value === 'line' && settings.color === 'multi') {
              onSettingsChange({ chartType: value, color: 'green' });
            }
            else {
              onSettingsChange({ chartType: value });
            }
          }}
        />

        {/* Measure */}
        <SettingSelect
          label="Measure"
          value={settings.measure}
          options={measureLabels}
          onChange={(value) => onSettingsChange({ measure: value })}
        />

        {/* Category */}
        <SettingSelect
          label="Category"
          value={settings.category}
          options={categoryLabels}
          onChange={(value) => onSettingsChange({ category: value })}
        />

        {/* Color */}
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[var(--text-neutral-strong)]">
            Color
          </label>
          <select
            value={settings.color}
            onChange={(e) => onSettingsChange({ color: e.target.value as ColorType })}
            className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] text-[var(--text-neutral-strong)] hover:border-[var(--border-neutral-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-weak)] focus:border-[var(--color-primary-medium)] transition-all duration-150"
          >
            {(Object.keys(colorLabels) as ColorType[])
              .filter(color => settings.chartType === 'line' ? color !== 'multi' : true)
              .map(color => (
                <option key={color} value={color}>
                  {colorLabels[color]}
                </option>
              ))}
          </select>
        </div>

        {/* Filter */}
        <SettingSelect
          label="Filter"
          value={settings.filter}
          options={filterLabels}
          onChange={(value) => onSettingsChange({ filter: value })}
        />

        {/* Benchmark */}
        <SettingSelect
          label="Benchmark"
          value={settings.benchmark}
          options={benchmarkLabels}
          onChange={(value) => onSettingsChange({ benchmark: value })}
        />
      </div>
    </div>
  );
}

export default ChartSettingsDrawer;
