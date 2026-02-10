import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components';
import { AlertCard } from '../../components/Automations/AlertCard';
import { QuietRow } from '../../components/Automations/QuietRow';
import {
  alertsData,
  runningRowsWithAlerts,
} from '../../data/automationsData';

export function Automations() {
  const navigate = useNavigate();
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
          <h1>Automations</h1>
          <Button variant="primary" size="small">
            + New
          </Button>
        </div>

        {/* Alert section */}
        {hasAlerts && (
          <div className="mb-7">
            {/* Count row */}
            <div className="flex items-center justify-between mb-3.5 text-sm font-medium text-[var(--text-neutral-medium)]">
              <div className="flex items-center gap-2">
                <span className="bg-[var(--text-neutral-strong)] text-white rounded-full px-2.5 py-px text-xs font-bold">
                  {alertsData.length}
                </span>
                automations need your attention
              </div>
              <TabSwitch />
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
              All {runningRows.length} automations are running smoothly.
            </div>
          </div>
        )}

        {/* Running section — unified card container */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[var(--text-neutral-weak)] uppercase tracking-wide">
            {hasAlerts ? 'Running smoothly' : 'All automations'}
          </span>
          {!hasAlerts && <TabSwitch />}
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
      </div>
    </div>
  );
}

/** Visual-only Active/History tab switch */
function TabSwitch() {
  return (
    <div className="flex bg-[var(--surface-neutral-x-weak)] rounded-lg p-0.5">
      {['Active', 'History'].map((label, i) => (
        <button
          key={label}
          className={`
            px-4 py-1.5 rounded-md text-sm font-semibold
            border-none cursor-pointer transition-all duration-150
            ${i === 0
              ? 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-xx-strong)] shadow-sm'
              : 'bg-transparent text-[var(--text-neutral-medium)]'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
