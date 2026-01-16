import { useMemo } from 'react';
import {
  type ChartSettings,
  getChartData,
  formatValue,
  measureLabels,
  categoryLabels,
} from '../../data/artifactData';

interface TableChartProps {
  settings: ChartSettings;
}

export function TableChart({ settings }: TableChartProps) {
  const data = useMemo(() => getChartData(settings), [settings]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--surface-neutral-x-weak)',
              borderBottom: '2px solid var(--border-neutral-medium)',
            }}
          >
            <th
              className="text-left px-4 py-3 text-[13px] font-semibold text-[var(--text-neutral-strong)]"
              style={{ borderRight: '1px solid var(--border-neutral-weak)' }}
            >
              {categoryLabels[settings.category]}
            </th>
            <th className="text-right px-4 py-3 text-[13px] font-semibold text-[var(--text-neutral-strong)]">
              {measureLabels[settings.measure]}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.label}
              className="transition-colors hover:bg-[var(--surface-neutral-xx-weak)]"
              style={{
                borderBottom: index < data.length - 1 ? '1px solid var(--border-neutral-x-weak)' : 'none',
              }}
            >
              <td
                className="px-4 py-3 text-[14px] text-[var(--text-neutral-strong)]"
                style={{ borderRight: '1px solid var(--border-neutral-x-weak)' }}
              >
                {row.label}
              </td>
              <td className="px-4 py-3 text-[14px] text-right font-medium text-[var(--text-neutral-xx-strong)]">
                {formatValue(row.value, settings.measure)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr
            style={{
              backgroundColor: 'var(--surface-neutral-x-weak)',
              borderTop: '2px solid var(--border-neutral-medium)',
            }}
          >
            <td className="px-4 py-3 text-[13px] font-semibold text-[var(--text-neutral-strong)]">
              Total
            </td>
            <td className="px-4 py-3 text-[14px] text-right font-semibold text-[var(--text-neutral-xx-strong)]">
              {settings.measure === 'headcount' || settings.measure === 'turnover'
                ? formatValue(
                    data.reduce((sum, d) => sum + d.value, 0),
                    settings.measure
                  )
                : '—'}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TableChart;
