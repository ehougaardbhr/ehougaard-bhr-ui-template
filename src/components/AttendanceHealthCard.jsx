import { Button } from './Button';

export const attendanceDemoData = {
  clockedInNow: 6,
  notClockedInYet: 3,
  lateToday: 2,
  earlyClockOuts: 1,
  exceptions: 1,
};

function buildRows(data) {
  return [
    { id: 'clocked-in', text: `Clocked in now: ${data.clockedInNow}` },
    { id: 'not-clocked-in', text: `Not clocked in yet: ${data.notClockedInYet}` },
    { id: 'late-today', text: `Late today: ${data.lateToday}` },
    { id: 'early-outs', text: `Early clock-outs: ${data.earlyClockOuts}` },
    { id: 'exceptions', text: `Missed punches / exceptions: ${data.exceptions}` },
  ];
}

export default function AttendanceHealthCard({
  data = attendanceDemoData,
  onViewDay,
  showSecondaryAction = false,
  secondaryActionLabel = 'Fill Open Shift',
  onSecondaryAction,
  track,
}) {
  const rows = buildRows(data);

  const handleViewDay = () => {
    if (typeof onViewDay === 'function') {
      onViewDay();
    } else {
      // eslint-disable-next-line no-console
      console.info('[AttendanceHealthCard] View Day clicked: no callback provided.');
    }

    if (typeof track === 'function') {
      track('attendance_health_view_day_clicked', { rows: rows.length });
    }
  };

  const handleSecondaryAction = () => {
    if (typeof onSecondaryAction === 'function') {
      onSecondaryAction();
    }
    if (typeof track === 'function') {
      track('attendance_health_secondary_action_clicked', { action: secondaryActionLabel });
    }
  };

  return (
    <div className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-small)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[24px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '28px' }}>
          Attendance Health
        </h2>
        <p className="text-[11px] uppercase tracking-wide text-[var(--text-neutral-medium)]">Mode: No Schedule</p>
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-xx-weak)] bg-[var(--surface-neutral-xx-weak)] px-3 py-2">
            <p className="text-[13px] text-[var(--text-neutral-strong)]">{row.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          size="small"
          variant="standard"
          className="!h-7 !px-3 !text-[12px]"
          onClick={handleViewDay}
        >
          View Day
        </Button>
        {showSecondaryAction && (
          <Button
            size="small"
            variant="outlined"
            className="!h-7 !px-3 !text-[12px]"
            onClick={handleSecondaryAction}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
