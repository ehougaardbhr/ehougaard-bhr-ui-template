import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components';
import { AlertCard } from '../../components/Automations/AlertCard';
import { QuietRow } from '../../components/Automations/QuietRow';
import { Icon } from '../../components/Icon';
import {
  alertsData,
  runningRowsWithAlerts,
  historyData,
} from '../../data/automationsData';

export function Automations() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const hasAlerts = true;
  const runningRows = runningRowsWithAlerts;

  const handleNavigate = (planId: string) => {
    navigate(`/plans/${planId}`);
  };

  const tabs: { label: string; value: 'active' | 'history'; icon: string }[] = [
    { label: 'Active', value: 'active', icon: 'list-check' },
    { label: 'History', value: 'history', icon: 'clock-rotate-left' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1100px] mx-auto">

        {/* Page header — matches People/Org Chart */}
        <div className="flex items-center justify-between mb-6">
          <h1
            style={{
              fontFamily: 'Fields, system-ui, sans-serif',
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: '56px',
              color: '#2e7918',
            }}
          >
            Agents
          </h1>
        </div>

        {/* Actions bar with tabs */}
        <div className="flex items-end justify-between border-b border-[var(--border-neutral-x-weak)] mb-6">
          <div className="pb-4">
            <Button icon="circle-plus-lined" variant="outlined">
              New Agent
            </Button>
          </div>

          {/* View tabs */}
          <div className="flex items-center" style={{ gap: '24px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="flex items-center gap-2 pb-3 text-[15px] transition-colors relative border-none bg-transparent cursor-pointer"
                style={{
                  fontWeight: activeTab === tab.value ? 700 : 500,
                  color: activeTab === tab.value ? 'var(--color-primary-strong)' : 'var(--text-neutral-medium)',
                }}
              >
                <Icon name={tab.icon} size={18} />
                {tab.label}
                {activeTab === tab.value && (
                  <span
                    className="absolute left-0 right-0 h-[2px] bg-[var(--color-primary-strong)]"
                    style={{ bottom: '-1px' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'active' ? (
          <>
            {/* Alert section */}
            {hasAlerts && (
              <div className="mb-7">
                <h2
                  className="font-semibold text-[#215C10]"
                  style={{ fontSize: 21, lineHeight: '26px', fontFamily: 'Fields, Inter, system-ui, sans-serif', marginBottom: 12 }}
                >
                  {alertsData.length} need your attention
                </h2>

                {/* Alert cards */}
                {alertsData.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onNavigate={handleNavigate} />
                ))}
              </div>
            )}

            {/* All-clear banner */}
            {!hasAlerts && (
              <div className="flex items-center gap-3 px-5 py-4 mb-7 bg-[#D1FAE5] dark:bg-[#064E3B] border border-[#A7F3D0] dark:border-[#065F46] rounded-[var(--radius-x-small)] text-sm text-[#065F46] dark:text-[#A7F3D0]">
                <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white text-sm shrink-0">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <div>
                  <strong>Nothing needs your attention.</strong>{' '}
                  All {runningRows.length} agents are running smoothly.
                </div>
              </div>
            )}

            {/* Running section */}
            <h2
              className="font-semibold text-[#215C10]"
              style={{ fontSize: 21, lineHeight: '26px', fontFamily: 'Fields, Inter, system-ui, sans-serif', marginBottom: 12 }}
            >
              {hasAlerts ? 'Running smoothly' : 'All agents'}
            </h2>

            <div
              className="
                bg-[var(--surface-neutral-white)]
                border border-[var(--border-neutral-x-weak)]
                rounded-[var(--radius-small)]
                overflow-hidden
              "
              style={{ boxShadow: 'var(--shadow-300)' }}
            >
              {runningRows.map((row, i) => (
                <QuietRow
                  key={row.id}
                  automation={row}
                  onNavigate={handleNavigate}
                  isLast={i === runningRows.length - 1}
                />
              ))}
            </div>
          </>
        ) : (
          /* ── History tab ── */
          <>
            <h2
              className="font-semibold text-[#215C10]"
              style={{ fontSize: 21, lineHeight: '26px', fontFamily: 'Fields, Inter, system-ui, sans-serif', marginBottom: 12 }}
            >
              {historyData.length} completed agent runs
            </h2>

            <div
              className="
                bg-[var(--surface-neutral-white)]
                border border-[var(--border-neutral-x-weak)]
                rounded-[var(--radius-small)]
                overflow-hidden
              "
              style={{ boxShadow: 'var(--shadow-300)' }}
            >
              {historyData.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item.planId)}
                  className={`
                    flex items-center gap-3.5
                    px-5 py-4
                    hover:bg-[var(--surface-neutral-xx-weak)]
                    transition-colors cursor-pointer
                    ${i < historyData.length - 1 ? 'border-b border-[var(--border-neutral-x-weak)]' : ''}
                  `}
                >
                  {/* Completed checkmark */}
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#059669' }}
                  >
                    <Icon name="check" size={10} className="text-white" />
                  </div>

                  {/* Name + summary */}
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-[var(--text-neutral-strong)]">
                      {item.name}
                    </div>
                    <div className="text-sm text-[var(--text-neutral-weak)] mt-0.5 truncate">
                      {item.summary}
                    </div>
                  </div>

                  {/* Deliverables count */}
                  <span className="text-sm text-[var(--text-neutral-weak)] whitespace-nowrap shrink-0">
                    {item.deliverables} deliverable{item.deliverables !== 1 ? 's' : ''}
                  </span>

                  {/* Date + duration */}
                  <div className="text-right shrink-0">
                    <div className="text-sm text-[var(--text-neutral-medium)] whitespace-nowrap">
                      {item.completedAt}
                    </div>
                    <div className="text-sm text-[var(--text-neutral-weak)] whitespace-nowrap mt-0.5">
                      {item.duration}
                    </div>
                  </div>

                  {/* Arrow */}
                  <Icon
                    name="chevron-right"
                    size={14}
                    className="text-[var(--text-neutral-weak)] shrink-0"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
