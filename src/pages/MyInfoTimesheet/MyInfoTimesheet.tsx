import { useState } from 'react';
import { ClockWidgetCard, TimesheetCard, TimesheetToolbar } from '../../components';
import { initialClockWidgetData, timesheetPageData, type ClockWidgetData } from '../../data/timesheetData';

export function MyInfoTimesheet() {
  const [clockData, setClockData] = useState<ClockWidgetData>(initialClockWidgetData);

  const handleToggleClock = () => {
    setClockData((prev) => {
      if (prev.status === 'clocked-in') {
        return {
          ...prev,
          status: 'clocked-out',
          todayTotalLabel: '7h 12m Today',
          clockMetaLabel: 'Clocked Out: 5:14 PM',
        };
      }

      return {
        ...prev,
        status: 'clocked-in',
        todayTotalLabel: '0h 00m Today',
        clockMetaLabel: 'Clocked In: 8:03 AM',
      };
    });
  };

  return (
    <div className="min-h-full bg-[var(--surface-neutral-x-weak)] pb-8">
      <div className="px-8 pt-4">
        <section className="rounded-[var(--radius-large)] bg-[var(--color-primary-strong)] pt-6">
          <div className="px-5 pb-5 grid grid-cols-[194px_minmax(0,1fr)_auto] gap-8 items-start">
            <div className="h-[232px] w-[194px] rounded-[var(--radius-medium)] bg-[var(--text-neutral-medium)] border border-[var(--border-neutral-medium)] flex items-center justify-center">
              <div className="h-28 w-28 rounded-full bg-[var(--surface-neutral-white)]/90" />
            </div>

            <div className="pt-1">
              <h1 className="text-[70px] leading-[76px] text-[var(--surface-neutral-white)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
                {timesheetPageData.employeeName}
              </h1>
              <p className="text-[34px] leading-[40px] text-[var(--surface-neutral-white)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
                {timesheetPageData.employeeTitle}
              </p>
            </div>

            <div className="pt-4 flex items-center gap-2">
              <button className="h-12 px-6 rounded-full bg-[var(--surface-neutral-white)] text-[26px] leading-[26px] font-semibold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
                Request a Change
              </button>
              <button className="h-12 w-12 rounded-full bg-[var(--surface-neutral-white)] text-[26px] leading-[26px] font-semibold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
                ...
              </button>
            </div>
          </div>

          <div className="pl-[220px] pr-4 flex items-end gap-1">
            {timesheetPageData.tabs.map((tab) => {
              const isActive = tab === timesheetPageData.activeTab;
              return (
                <button
                  key={tab}
                  className={`h-[52px] px-6 rounded-t-[var(--radius-xx-small)] text-[26px] leading-[26px] font-semibold ${
                    isActive
                      ? 'bg-[var(--surface-neutral-x-weak)] text-[var(--color-primary-strong)]'
                      : 'text-[var(--surface-neutral-white)]'
                  }`}
                  style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="px-8 pt-4 grid grid-cols-[230px_minmax(0,1fr)] gap-6 items-start">
        <aside className="pt-3">
          {timesheetPageData.vitalsSections.map((section) => (
            <div key={section.id} className="mb-6 pb-4 border-b border-[var(--border-neutral-x-weak)] last:border-b-0">
              <h3 className="text-[30px] leading-[30px] text-[var(--text-neutral-medium)] mb-3" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.rows.map((row) => (
                  <p key={row} className="text-[24px] leading-[24px] text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
                    {row}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section>
          <TimesheetToolbar
            title={timesheetPageData.timesheetTitle}
            payPeriodLabel={timesheetPageData.payPeriodLabel}
          />

          <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
            <TimesheetCard periodLabel={timesheetPageData.periodLabel} days={timesheetPageData.days} />
            <ClockWidgetCard clockData={clockData} onToggleClock={handleToggleClock} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyInfoTimesheet;
