import { useNavigate } from 'react-router-dom';
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
    <div style={{ padding: 32, height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: 'Fields, system-ui, sans-serif',
              fontSize: 48,
              fontWeight: 700,
              lineHeight: '56px',
              color: 'var(--color-primary-strong)',
            }}
          >
            Automations
          </h1>
          <button
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              background: 'var(--color-primary-strong)',
              color: 'white',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
          >
            <i className="fa-solid fa-plus" style={{ fontSize: 11 }} /> New
          </button>
        </div>

        {/* Alert section (with-alerts state) */}
        {hasAlerts && (
          <div style={{ marginBottom: 28 }}>
            {/* Count row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-neutral-medium)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    background: 'var(--text-neutral-strong)',
                    color: 'white',
                    borderRadius: 99,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 20px',
              marginBottom: 28,
              background: '#D1FAE5',
              border: '1px solid #A7F3D0',
              borderRadius: 10,
              fontSize: 14,
              color: '#065F46',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              <i className="fa-solid fa-check" />
            </div>
            <div>
              <strong>Nothing needs your attention.</strong>{' '}
              All {runningRows.length} automations are running smoothly.
            </div>
          </div>
        )}

        {/* Running section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-neutral-weak)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {hasAlerts ? 'Running smoothly' : 'All automations'}
          </span>
          {!hasAlerts && <TabSwitch />}
        </div>

        {runningRows.map((row) => (
          <QuietRow key={row.id} automation={row} onNavigate={handleNavigate} />
        ))}
      </div>
    </div>
  );
}

/** Visual-only Active/History tab switch */
function TabSwitch() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        background: 'var(--surface-neutral-x-weak)',
        borderRadius: 8,
        padding: 3,
      }}
    >
      {['Active', 'History'].map((label, i) => (
        <button
          key={label}
          style={{
            padding: '7px 18px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            background: i === 0 ? 'var(--surface-neutral-white)' : 'none',
            cursor: 'pointer',
            color: i === 0 ? 'var(--text-neutral-xx-strong)' : 'var(--text-neutral-medium)',
            boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
