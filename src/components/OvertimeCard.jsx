import { useState } from 'react';
import { Icon } from './Icon';

const WEEKLY_OT_THRESHOLD = 40;
const DAILY_OT_THRESHOLD = 8;
const DOUBLE_TIME_THRESHOLD = 12;

function formatHours(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function OvertimeCard({ employees = [], track }) {
  const [expandedId, setExpandedId] = useState(null);

  const weeklyOtEmployees = employees
    .filter((e) => e.hours.weekHours > WEEKLY_OT_THRESHOLD)
    .map((e) => ({ name: e.row.name, extra: e.hours.weekHours - WEEKLY_OT_THRESHOLD, total: e.hours.weekHours }));

  const dailyOtEmployees = employees
    .filter((e) => e.hours.todayHours > DAILY_OT_THRESHOLD && e.hours.todayHours <= DOUBLE_TIME_THRESHOLD)
    .map((e) => ({ name: e.row.name, extra: e.hours.todayHours - DAILY_OT_THRESHOLD, total: e.hours.todayHours }));

  const doubleTimeEmployees = employees
    .filter((e) => e.hours.todayHours > DOUBLE_TIME_THRESHOLD)
    .map((e) => ({ name: e.row.name, extra: e.hours.todayHours - DOUBLE_TIME_THRESHOLD, total: e.hours.todayHours }));

  const rows = [
    {
      id: 'weekly-ot',
      label: 'Weekly overtime',
      description: `>${WEEKLY_OT_THRESHOLD}h this week`,
      employees: weeklyOtEmployees,
      dotClass: weeklyOtEmployees.length > 0 ? 'bg-amber-500' : 'bg-[var(--color-primary-strong)]',
      countLabel: weeklyOtEmployees.length === 0 ? 'None' : `${weeklyOtEmployees.length} employee${weeklyOtEmployees.length === 1 ? '' : 's'}`,
    },
    {
      id: 'daily-ot',
      label: 'Daily overtime',
      description: `>${DAILY_OT_THRESHOLD}h today`,
      employees: dailyOtEmployees,
      dotClass: dailyOtEmployees.length > 0 ? 'bg-amber-500' : 'bg-[var(--color-primary-strong)]',
      countLabel: dailyOtEmployees.length === 0 ? 'None' : `${dailyOtEmployees.length} employee${dailyOtEmployees.length === 1 ? '' : 's'}`,
    },
    {
      id: 'double-time',
      label: 'Double time',
      description: `>${DOUBLE_TIME_THRESHOLD}h today`,
      employees: doubleTimeEmployees,
      dotClass: doubleTimeEmployees.length > 0 ? 'bg-red-500' : 'bg-[var(--color-primary-strong)]',
      countLabel: doubleTimeEmployees.length === 0 ? 'None' : `${doubleTimeEmployees.length} employee${doubleTimeEmployees.length === 1 ? '' : 's'}`,
    },
  ];

  const toggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (typeof track === 'function') track('overtime_row_toggled', { id });
  };

  return (
    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
          Overtime
        </h2>
        <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">This Week</p>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] bg-[var(--surface-neutral-white)]">
            <div className="px-3 py-2.5 cursor-pointer" onClick={() => toggle(row.id)}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-[130px]">
                  <Icon
                    name="chevron-right"
                    size={12}
                    className={`text-[var(--icon-neutral-strong)] transition-transform ${expandedId === row.id ? 'rotate-90' : ''}`}
                  />
                  <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">{row.label}</p>
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${row.dotClass}`} />
                  <p className="text-[13px] text-[var(--text-neutral-strong)] truncate">{row.countLabel}</p>
                </div>
                <p className="text-[12px] text-[var(--text-neutral-medium)] shrink-0">{row.description}</p>
              </div>

              {expandedId === row.id && (
                <div className="mt-2.5 p-3 rounded-[var(--radius-xx-small)] bg-[var(--surface-neutral-xx-weak)] border border-[var(--border-neutral-xx-weak)]">
                  {row.employees.length === 0 ? (
                    <p className="text-[12px] text-[var(--text-neutral-medium)]">No employees in this category.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {row.employees.map((emp) => (
                        <div key={emp.name} className="flex items-center justify-between text-[12px]">
                          <span className="font-semibold text-[var(--text-neutral-strong)]">{emp.name}</span>
                          <span className="text-[var(--text-neutral-medium)]">
                            {formatHours(emp.total)} total · +{formatHours(emp.extra)} OT
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
