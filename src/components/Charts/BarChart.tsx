import { useMemo } from 'react';
import {
  type ChartSettings,
  type ChartDataPoint,
  getChartData,
  formatValue,
  colorPalettes,
} from '../../data/artifactData';

interface BarChartProps {
  settings: ChartSettings;
  width?: number;
  height?: number;
}

export function BarChart({ settings, width = 500, height = 320 }: BarChartProps) {
  const data = useMemo(() => getChartData(settings), [settings]);
  const palette = colorPalettes[settings.color];

  // Chart dimensions - smaller padding for smaller charts
  const isCompact = width < 400;
  const padding = isCompact
    ? { top: 15, right: 15, bottom: 50, left: 40 }
    : { top: 20, right: 30, bottom: 60, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = chartWidth / data.length - 12; // Gap between bars
  const barGap = 12;

  // Get bar color based on settings
  const getBarColor = (index: number) => {
    if (settings.color === 'multi') {
      return palette.multi[index % palette.multi.length];
    }
    return palette.solid;
  };

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = maxValue / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => Math.round(step * i));
  }, [maxValue]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Y-axis grid lines and labels */}
      {yTicks.map((tick, i) => {
        const y = padding.top + chartHeight - (tick / maxValue) * chartHeight;
        return (
          <g key={tick}>
            {/* Grid line */}
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--border-neutral-x-weak)"
              strokeDasharray={i === 0 ? 'none' : '4,4'}
            />
            {/* Y-axis label */}
            <text
              x={padding.left - 12}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-[11px] fill-[var(--text-neutral-weak)]"
            >
              {formatValue(tick, settings.measure)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = padding.left + i * (barWidth + barGap) + barGap / 2;
        const y = padding.top + chartHeight - barHeight;

        return (
          <g key={d.label}>
            {/* Bar with rounded top */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={getBarColor(i)}
              className="transition-all duration-300 hover:opacity-80"
            />
            {/* Value label above bar */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              className="text-[11px] font-medium fill-[var(--text-neutral-strong)]"
            >
              {formatValue(d.value, settings.measure)}
            </text>
            {/* X-axis label */}
            <text
              x={x + barWidth / 2}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-[12px] fill-[var(--text-neutral-medium)]"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* X-axis line */}
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right}
        y2={padding.top + chartHeight}
        stroke="var(--border-neutral-weak)"
        strokeWidth={1}
      />
    </svg>
  );
}

export default BarChart;
