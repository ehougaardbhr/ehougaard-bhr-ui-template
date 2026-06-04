import { useState } from 'react';
import { Icon } from '../Icon';
import type { AgentInsight } from '../../data/timesheetAgentData';

interface AgentInsightBarProps {
  insights: AgentInsight[];
  onAction: (target: AgentInsight['actionTarget']) => void;
}

export function AgentInsightBar({ insights, onAction }: AgentInsightBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] overflow-hidden">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={15} className="text-[var(--color-primary-strong)]" />
          <span className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">
            Agent Summary
          </span>
          <span className="h-5 min-w-[20px] px-1.5 rounded-[var(--radius-full)] bg-[var(--surface-selected-weak)] text-[var(--color-primary-strong)] text-[11px] font-semibold leading-[20px] text-center">
            {insights.length}
          </span>
        </div>
        <Icon
          name="chevron-down"
          size={11}
          className={`text-[var(--icon-neutral-strong)] transition-transform ${isExpanded ? '' : '-rotate-90'}`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-[var(--border-neutral-x-weak)] divide-y divide-[var(--border-neutral-xx-weak)]">
          {insights.map((insight) => (
            <div key={insight.id} className="px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-[var(--surface-selected-weak)] flex items-center justify-center">
                  <Icon name="sparkles" size={10} className="text-[var(--color-primary-strong)]" />
                </div>
                <p className="text-[13px] text-[var(--text-neutral-strong)] leading-[1.4]">{insight.text}</p>
              </div>
              <button
                onClick={() => onAction(insight.actionTarget)}
                className="shrink-0 text-[12px] font-semibold text-[var(--color-primary-strong)] hover:underline whitespace-nowrap"
              >
                {insight.actionLabel} →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentInsightBar;
