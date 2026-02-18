import { useState } from 'react';
import { TimesheetToolbar } from '../../components/TimesheetToolbar';
import { TimesheetCard } from '../../components/TimesheetCard';
import { ClockWidgetCard } from '../../components/ClockWidgetCard';
import { getEmployeeTimesheetDataset, type ClockWidgetData } from '../../data/timesheetData';

interface TimesheetsTabContentProps {
  employeeId?: string;
}

export function TimesheetsTabContent({ employeeId }: TimesheetsTabContentProps) {
  const dataset = getEmployeeTimesheetDataset(employeeId);
  const [clockData, setClockData] = useState<ClockWidgetData>(dataset.clockData);

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
    <section>
      <TimesheetToolbar
        title={dataset.pageData.timesheetTitle}
        payPeriodLabel={dataset.pageData.payPeriodLabel}
      />

      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        <TimesheetCard periodLabel={dataset.pageData.periodLabel} days={dataset.pageData.days} />
        <ClockWidgetCard clockData={clockData} onToggleClock={handleToggleClock} />
      </div>
    </section>
  );
}

export default TimesheetsTabContent;
