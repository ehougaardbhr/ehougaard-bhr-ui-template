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

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1100px] mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-7">
          <h1>Agents</h1>
          <Button variant="primary" size="small">
            + New
          </Button>
        </div>

        {activeTab === 'active' ? (
          <>
            {/* Alert section */}
            {hasAlerts && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3.5">
                  <h2
                    className="font-semibold text-[#215C10]"
                    style={{ fontSize: 21, lineHeight: '26px', fontFamily: 'Fields, Inter, system-ui, sans-serif' }}
                  >
                    {alertsData.length} need your attention
                  </h2>
                  <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

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

            {/* Running section — unified card container */}
            <div className="flex items-center justify-between mb-3.5">
              <h2
                className="font-semibold text-[#215C10]"
                style={{ fontSize: 21, lineHeight: '26px', fontFamily: 'Fields, Inter, system-ui, sans-serif' }}
              >
                {hasAlerts ? 'Running smoothly' : 'All agents'}
              </h2>
              {!hasAlerts && <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />}
            </div>

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
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-[var(--text-neutral-medium)]">
                {historyData.length} completed agent runs
              </span>
              <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

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
                    px-5 py-4 text-sm
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
                    <div className="font-semibold text-[var(--text-neutral-strong)]">
                      {item.name}
                    </div>
                    <div className="text-xs text-[var(--text-neutral-weak)] mt-0.5 truncate">
                      {item.summary}
                    </div>
                  </div>

                  {/* Deliverables count */}
                  <span className="text-xs text-[var(--text-neutral-weak)] whitespace-nowrap shrink-0">
                    {item.deliverables} deliverable{item.deliverables !== 1 ? 's' : ''}
                  </span>

                  {/* Date + duration */}
                  <div className="text-right shrink-0">
                    <div className="text-xs text-[var(--text-neutral-medium)] whitespace-nowrap">
                      {item.completedAt}
                    </div>
                    <div className="text-xs text-[var(--text-neutral-weak)] whitespace-nowrap mt-0.5">
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

/** Active/History tab switch */
function TabSwitch({
  activeTab,
  onTabChange,
}: {
  activeTab: 'active' | 'history';
  onTabChange: (tab: 'active' | 'history') => void;
}) {
  const tabs: { label: string; value: 'active' | 'history' }[] = [
    { label: 'Active', value: 'active' },
    { label: 'History', value: 'history' },
  ];

  return (
    <div className="flex bg-[var(--surface-neutral-x-weak)] rounded-lg p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`
            px-4 py-1.5 rounded-md text-sm font-semibold
            border-none cursor-pointer transition-all duration-150
            ${activeTab === tab.value
              ? 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-xx-strong)] shadow-sm'
              : 'bg-transparent text-[var(--text-neutral-medium)]'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
