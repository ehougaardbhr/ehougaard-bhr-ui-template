import { useMemo, useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

export const demoData = {
  inOvertime: 2,
  approachingOvertime: 3,
  projectedOvertimeCost: 1240,
  lateRateDeltaPercent: 4,
  complianceFlag: '1 missed break risk',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function buildRows(data) {
  const baseRows = [
    { id: 'in-ot', icon: 'clock', text: `${data.inOvertime} in OT` },
    { id: 'approaching-ot', icon: 'temperature-half', text: `${data.approachingOvertime} at 38+ hrs` },
    { id: 'projected-cost', icon: 'piggy-bank', text: `Projected OT: ${formatCurrency(data.projectedOvertimeCost)}` },
    { id: 'attendance-trend', icon: 'chart-line', text: `Late rate ↑ ${data.lateRateDeltaPercent}% vs avg` },
  ];

  if (data.complianceFlag) {
    baseRows.push({ id: 'compliance', icon: 'shield', text: data.complianceFlag });
  }

  return baseRows.slice(0, 5);
}

export default function LaborRiskSnapshotCard({ data = demoData, onViewLaborDetails, track }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rows = buildRows(data);
  const detailRows = useMemo(() => ([
    {
      id: 'in-ot',
      title: `${data.inOvertime} employees already in overtime`,
      detail: 'Top contributor: Albert Flores at 41h 24m this week.',
      actions: 'Reassign one late-week shift to under-40-hour staff.',
    },
    {
      id: 'approaching-ot',
      title: `${data.approachingOvertime} employees approaching overtime`,
      detail: '3 employees are at or above 38 hours before Friday close.',
      actions: 'Cap new assignments and prioritize flex staff for open slots.',
    },
    {
      id: 'projected-cost',
      title: `Projected overtime cost: ${formatCurrency(data.projectedOvertimeCost)}`,
      detail: 'Projected OT spend is above the normal weekly target.',
      actions: 'Move non-critical tasks to next week and rebalance hours by role.',
    },
    {
      id: 'attendance-trend',
      title: `Late rate is up ${data.lateRateDeltaPercent}% vs average`,
      detail: 'Late arrivals are concentrated in first-hour opening shifts.',
      actions: 'Adjust opening coverage buffer and coach repeated late arrivals.',
    },
    ...(data.complianceFlag ? [{
      id: 'compliance',
      title: data.complianceFlag,
      detail: 'One shift pattern risks a missed legally-required break window.',
      actions: 'Insert break reminders and shift one task block to preserve compliance timing.',
    }] : []),
  ]), [data]);

  const handleViewDetails = () => {
    setIsModalOpen(true);

    if (typeof onViewLaborDetails === 'function') {
      onViewLaborDetails();
    } else {
      // Intentional no-op fallback for demo environments.
      // eslint-disable-next-line no-console
      console.info('[LaborRiskSnapshotCard] View Details clicked: no callback provided.');
    }

    if (typeof track === 'function') {
      track('labor_risk_view_details_clicked', { rows: rows.length });
    }
  };

  return (
    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4">
      <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)] mb-3" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
        Labor &amp; Risk Snapshot
      </h2>

      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2 flex items-center gap-2">
            <Icon name={row.icon} size={13} className="text-[var(--icon-neutral-strong)]" />
            <p className="text-[13px] text-[var(--text-neutral-strong)]">{row.text}</p>
          </div>
        ))}
      </div>

      <button
        className="mt-3 text-[13px] font-semibold text-[var(--color-link)] hover:underline"
        onClick={handleViewDetails}
      >
        View Details
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/35 flex items-center justify-center p-6">
          <div className="w-full max-w-[760px] bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] shadow-xl">
            <div className="px-5 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-center justify-between">
              <h3 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
                Labor &amp; Risk Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--icon-neutral-strong)] hover:text-[var(--text-neutral-strong)]">
                <Icon name="xmark" size={16} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-2 max-h-[65vh] overflow-y-auto">
              {detailRows.map((item) => (
                <div key={item.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-3">
                  <p className="text-[13px] font-semibold text-[var(--text-neutral-strong)]">{item.title}</p>
                  <p className="mt-1 text-[12px] text-[var(--text-neutral-medium)]">{item.detail}</p>
                  <p className="mt-1 text-[12px] text-[var(--text-neutral-strong)]">Action: {item.actions}</p>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-[var(--border-neutral-x-weak)] flex items-center justify-end">
              <Button variant="primary" size="small" className="!h-9 !px-4" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
