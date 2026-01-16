import { useMemo } from 'react';
import {
  type ChartSettings,
  type ChartDataPoint,
  getChartData,
  formatValue,
  colorPalettes,
} from '../../data/artifactData';

interface LineChartProps {
  settings: ChartSettings;
  width?: number;
  height?: number;
}

export function LineChart({ settings, width = 500, height = 320 }: LineChartProps) {
  const data = useMemo(() => getChartData(settings), [settings]);
  const palette = colorPalettes[settings.color];

  // Chart dimensions
  const padding = { top: 20, right: 30, bottom: 60, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const maxValue = Math.max(...data.map(d => d.value));
  const xStep = chartWidth / (data.length - 1);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = maxValue / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => Math.round(step * i));
  }, [maxValue]);

  // Generate line path
  const linePath = useMemo(() => {
    const points = data.map((d, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  }, [data, xStep, chartHeight, maxValue, padding]);

  // Get line color
  const lineColor = palette.solid;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
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

      {/* Line path */}
      <path
        d={linePath}
        fill="none"
        stroke={lineColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const x = padding.left + i * xStep;
        const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;

        return (
          <g key={d.label}>
            {/* Point circle */}
            <circle
              cx={x}
              cy={y}
              r={4}
              fill="var(--surface-neutral-white)"
              stroke={lineColor}
              strokeWidth={2.5}
              className="transition-all duration-300 hover:r-6"
            />

            {/* Value label above point */}
            <text
              x={x}
              y={y - 12}
              textAnchor="middle"
              className="text-[11px] font-medium fill-[var(--text-neutral-strong)]"
            >
              {formatValue(d.value, settings.measure)}
            </text>

            {/* X-axis label */}
            <text
              x={x}
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

export default LineChart;
