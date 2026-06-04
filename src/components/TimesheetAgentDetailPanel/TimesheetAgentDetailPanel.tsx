import { useState } from 'react';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { TimesheetFlagBadge } from '../TimesheetFlagBadge';
import type { ManagerTimesheetRow, TimesheetFlag } from '../../data/timesheetAgentData';

interface TimesheetAgentDetailPanelProps {
  row: ManagerTimesheetRow | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onRequestChanges: (id: string) => void;
}

function flagRowBorderClass(flagType: TimesheetFlag['type']) {
  if (flagType === 'break-violation') return 'border-l-4 border-l-red-400';
  if (flagType === 'unapproved-ot') return 'border-l-4 border-l-amber-400';
  return 'border-l-4 border-l-blue-400';
}

function flagRowBgClass(flagType: TimesheetFlag['type']) {
  if (flagType === 'break-violation') return 'bg-red-50/60';
  if (flagType === 'unapproved-ot') return 'bg-amber-50/60';
  return 'bg-blue-50/40';
}

export function TimesheetAgentDetailPanel({
  row,
  onClose,
  onApprove,
  onRequestChanges,
}: TimesheetAgentDetailPanelProps) {
  const [resolvedFlagIds, setResolvedFlagIds] = useState<Set<string>>(new Set());

  if (!row) return null;

  const flagMap = Object.fromEntries(row.flags.map((f) => [f.id, f]));
  const unresolvedFlags = row.flags.filter((f) => !resolvedFlagIds.has(f.id));
  const allResolved = unresolvedFlags.length === 0;

  function acceptFix(flagId: string) {
    setResolvedFlagIds((prev) => new Set([...prev, flagId]));
  }

  function agentSummary() {
    if (unresolvedFlags.length === 0) return 'All issues have been resolved. This timesheet is ready to approve.';
    const parts = unresolvedFlags.map((f) => {
      if (f.type === 'break-violation') return 'a break violation';
      if (f.type === 'unapproved-ot') return 'unapproved overtime';
      return 'a missed punch';
    });
    const joined = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
    return `${unresolvedFlags.length} issue${unresolvedFlags.length > 1 ? 's' : ''} found: ${joined}.`;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[68] bg-black/20"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-[480px] max-w-full z-[69] bg-[var(--surface-neutral-white)] border-l border-[var(--border-neutral-x-weak)] shadow-xl flex flex-col">
        <div className="px-5 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar src={row.avatarUrl} alt={row.employeeName} size="small" />
            <div>
              <p className="text-[15px] font-semibold text-[var(--text-neutral-strong)]">{row.employeeName}</p>
              <p className="text-[12px] text-[var(--text-neutral-medium)]">{row.payPeriod}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--icon-neutral-strong)] hover:text-[var(--text-neutral-strong)]">
            <Icon name="xmark" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-5 py-4 space-y-4">
            <div className={`rounded-[var(--radius-small)] border px-4 py-3 flex items-start gap-3 ${allResolved ? 'border-[var(--color-primary-medium)]/30 bg-[var(--surface-selected-weak)]' : 'border-amber-200 bg-amber-50/50'}`}>
              <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${allResolved ? 'bg-[var(--color-primary-strong)]' : 'bg-amber-500'}`}>
                <Icon name={allResolved ? 'check' : 'sparkles'} size={10} className="text-white" />
              </div>
              <p className={`text-[13px] leading-[1.45] ${allResolved ? 'text-[var(--color-primary-strong)] font-semibold' : 'text-[var(--text-neutral-strong)]'}`}>
                {agentSummary()}
              </p>
            </div>

            {unresolvedFlags.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)] font-semibold">Issues to Resolve</p>
                {unresolvedFlags.map((flag) => (
                  <div key={flag.id} className={`rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] overflow-hidden`}>
                    <div className={`px-4 py-3 flex items-start justify-between gap-3 ${flagRowBgClass(flag.type)} ${flagRowBorderClass(flag.type)}`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <TimesheetFlagBadge type={flag.type} />
                          <span className="text-[12px] text-[var(--text-neutral-medium)]">{flag.day}</span>
                        </div>
                        <p className="text-[13px] text-[var(--text-neutral-strong)]">{flag.description}</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-[var(--surface-neutral-white)] border-t border-[var(--border-neutral-xx-weak)]">
                      <p className="text-[12px] text-[var(--text-neutral-medium)] mb-2">
                        <span className="font-semibold">Suggested fix:</span> {flag.suggestedFix}
                      </p>
                      <Button
                        variant="standard"
                        size="small"
                        className="!h-7 !px-3 !text-[12px]"
                        onClick={() => acceptFix(flag.id)}
                      >
                        Accept fix
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {resolvedFlagIds.size > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)] font-semibold">Resolved</p>
                {row.flags.filter((f) => resolvedFlagIds.has(f.id)).map((flag) => (
                  <div key={flag.id} className="rounded-[var(--radius-small)] border border-[var(--border-neutral-xx-weak)] px-4 py-2.5 flex items-center gap-3 opacity-60">
                    <div className="h-4 w-4 rounded-full bg-[var(--color-primary-strong)] flex items-center justify-center shrink-0">
                      <Icon name="check" size={8} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[12px] font-semibold text-[var(--text-neutral-medium)] line-through">{flag.day}</span>
                      <span className="text-[12px] text-[var(--text-neutral-medium)] ml-2">Fix accepted</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)] font-semibold">Timesheet Entries</p>
              <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-[var(--surface-neutral-xx-weak)] border-b border-[var(--border-neutral-x-weak)]">
                      <th className="text-left px-3 py-2 font-semibold text-[var(--text-neutral-medium)]">Day</th>
                      <th className="text-left px-3 py-2 font-semibold text-[var(--text-neutral-medium)]">In</th>
                      <th className="text-left px-3 py-2 font-semibold text-[var(--text-neutral-medium)]">Out</th>
                      <th className="text-right px-3 py-2 font-semibold text-[var(--text-neutral-medium)]">Hrs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-neutral-xx-weak)]">
                    {row.entries.map((entry) => {
                      const flag = entry.flagId ? flagMap[entry.flagId] : null;
                      const isResolved = flag ? resolvedFlagIds.has(flag.id) : false;
                      const rowClass = flag && !isResolved
                        ? `${flagRowBgClass(flag.type)} ${flagRowBorderClass(flag.type)}`
                        : '';
                      return (
                        <tr key={entry.day} className={rowClass}>
                          <td className="px-3 py-2 font-semibold text-[var(--text-neutral-strong)]">{entry.day}</td>
                          <td className={`px-3 py-2 ${entry.clockIn === '—' ? 'text-[var(--text-neutral-weak)]' : 'text-[var(--text-neutral-strong)]'}`}>{entry.clockIn}</td>
                          <td className={`px-3 py-2 ${entry.clockOut === '—' ? 'text-[var(--text-neutral-weak)]' : 'text-[var(--text-neutral-strong)]'}`}>{entry.clockOut}</td>
                          <td className="px-3 py-2 text-right text-[var(--text-neutral-strong)]">
                            {entry.regularHours > 0 ? `${entry.regularHours}h` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[var(--text-neutral-medium)]">
              <span className="font-semibold text-[var(--text-neutral-strong)]">
                {(row.regularHours + row.overtimeHours).toFixed(1)}h total
              </span>
              {row.overtimeHours > 0 && (
                <span className="text-amber-700">· {row.overtimeHours}h OT</span>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[var(--border-neutral-x-weak)] flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="small"
            className="!h-9 !px-4"
            onClick={() => { onApprove(row.id); onClose(); }}
          >
            Approve Timesheet
          </Button>
          <Button
            variant="standard"
            size="small"
            className="!h-9 !px-4"
            onClick={() => { onRequestChanges(row.id); onClose(); }}
          >
            Request Changes
          </Button>
          <Button variant="ghost" size="small" className="!h-9 !px-4 ml-auto" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

export default TimesheetAgentDetailPanel;
