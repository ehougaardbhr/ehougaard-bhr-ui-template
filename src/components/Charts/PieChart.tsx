import { useMemo } from 'react';
import {
  type ChartSettings,
  type ChartDataPoint,
  getChartData,
  formatValue,
  colorPalettes,
} from '../../data/artifactData';

interface PieChartProps {
  settings: ChartSettings;
  width?: number;
  height?: number;
}

interface PieSlice extends ChartDataPoint {
  startAngle: number;
  endAngle: number;
  percentage: number;
  color: string;
}

export function PieChart({ settings, width = 400, height = 400 }: PieChartProps) {
  const data = useMemo(() => getChartData(settings), [settings]);
  const palette = colorPalettes[settings.color];

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  // Calculate slices
  const slices: PieSlice[] = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90; // Start at top

    return data.map((d, i) => {
      const percentage = (d.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      currentAngle = endAngle;

      const color = settings.color === 'multi'
        ? palette.multi[i % palette.multi.length]
        : palette.solid;

      return {
        ...d,
        startAngle,
        endAngle,
        percentage,
        color,
      };
    });
  }, [data, settings.color, palette]);

  // Helper to create arc path
  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerRadius * Math.cos(startRad);
    const y1 = centerY + outerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(endRad);
    const y2 = centerY + outerRadius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // Helper to get label position
  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const rad = (midAngle * Math.PI) / 180;
    const labelRadius = radius * 0.7;

    return {
      x: centerX + labelRadius * Math.cos(rad),
      y: centerY + labelRadius * Math.sin(rad),
    };
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Pie slices */}
      {slices.map((slice, i) => (
        <g key={slice.label}>
          <path
            d={createArcPath(slice.startAngle, slice.endAngle, radius)}
            fill={slice.color}
            className="transition-all duration-300 hover:opacity-80"
          />
        </g>
      ))}

      {/* Labels */}
      {slices.map((slice) => {
        const labelPos = getLabelPosition(slice.startAngle, slice.endAngle);
        return (
          <g key={`label-${slice.label}`}>
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[12px] font-semibold fill-white pointer-events-none"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              {slice.percentage.toFixed(0)}%
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${width / 2 - 100}, ${height - 30})`}>
        {slices.map((slice, i) => (
          <g key={`legend-${slice.label}`} transform={`translate(${(i * 220) / slices.length}, 0)`}>
            <rect
              x={0}
              y={0}
              width={12}
              height={12}
              rx={2}
              fill={slice.color}
            />
            <text
              x={18}
              y={10}
              className="text-[11px] fill-[var(--text-neutral-medium)]"
            >
              {slice.label}: {formatValue(slice.value, settings.measure)}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default PieChart;
