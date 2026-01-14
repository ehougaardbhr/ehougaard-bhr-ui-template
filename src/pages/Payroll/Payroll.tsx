import { useState } from 'react';
import { Icon } from '../../components';
import {
  payrollDates,
  payrollStats,
  reminders as initialReminders,
  payrollDetails,
  payrollTitle,
  dueDate,
  payrollId,
  updatesText,
} from '../../data/payrollData';
import type { Reminder } from '../../data/payrollData';

export function Payroll() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  return (
    <div className="min-h-full bg-[var(--surface-neutral-x-weak)] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-[44px] font-bold text-[var(--color-primary-strong)]"
          style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '52px' }}
        >
          Payroll
        </h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-[15px] font-medium text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors">
            Open TRAXPayroll
          </button>
          <button className="px-4 py-2 text-[15px] font-semibold text-[var(--color-primary-strong)] bg-[var(--surface-neutral-white)] border-2 border-[var(--color-primary-strong)] rounded-[var(--radius-small)] hover:bg-[var(--color-primary-weak)] transition-colors flex items-center gap-2">
            <span className="text-[20px] leading-none">+</span>
            New off-cycle payroll
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-6 relative">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {payrollDates.map((date) => (
            <button
              key={date.id}
              className={`
                relative flex-shrink-0 w-32 h-28 rounded-[var(--radius-medium)] p-4 transition-all
                ${
                  date.isSelected
                    ? 'bg-[var(--surface-neutral-white)] border-2 border-[var(--color-primary-strong)]'
                    : 'bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] hover:border-[var(--border-neutral-medium)]'
                }
              `}
            >
              {date.badge && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-primary-strong)] text-white rounded-full flex items-center justify-center text-[12px] font-semibold">
                  {date.badge}
                </div>
              )}
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-[32px] font-bold leading-none ${date.isSelected ? 'text-[var(--color-primary-strong)]' : 'text-[var(--text-neutral-x-strong)]'}`}>
                  {date.day}
                </span>
                <span className="text-[13px] text-[var(--text-neutral-medium)] mt-2">
                  {date.month}
                </span>
                <span className="text-[13px] text-[var(--text-neutral-medium)]">
                  {date.dayOfWeek}
                </span>
              </div>
            </button>
          ))}
          <button className="flex-shrink-0 w-12 h-28 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] flex items-center justify-center hover:bg-[var(--surface-neutral-xx-weak)] transition-colors">
            <Icon name="chevron-right" size={20} className="text-[var(--icon-neutral-strong)]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1">
          <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] p-8">
            {/* Payroll Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-small)] flex items-center justify-center">
                <Icon name="circle-dollar" size={24} className="text-[var(--color-primary-strong)]" />
              </div>
              <h2
                className="text-[24px] font-semibold text-[var(--color-primary-strong)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '32px' }}
              >
                {payrollTitle}
              </h2>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {payrollStats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-x-weak)] rounded-[var(--radius-medium)] p-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={stat.icon as any} size={20} className="text-[var(--icon-neutral-strong)]" />
                    <span className="text-[28px] font-bold text-[var(--color-primary-strong)]">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-[14px] text-[var(--text-neutral-medium)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Reminders Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="gear" size={20} className="text-[var(--color-primary-strong)]" />
                <h3 className="text-[18px] font-semibold text-[var(--text-neutral-x-strong)]">
                  Reminders
                </h3>
              </div>
              <div className="space-y-3 mb-4">
                {reminders.map((reminder) => (
                  <label
                    key={reminder.id}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => toggleReminder(reminder.id)}
                      className="mt-1 w-4 h-4 rounded border-[var(--border-neutral-medium)] text-[var(--color-primary-strong)] focus:ring-[var(--color-primary-strong)] cursor-pointer"
                    />
                    <span className={`text-[15px] ${reminder.completed ? 'line-through text-[var(--text-neutral-medium)]' : 'text-[var(--text-neutral-x-strong)]'}`}>
                      {reminder.text}
                    </span>
                  </label>
                ))}
              </div>
              <button className="text-[15px] font-medium text-[var(--color-primary-strong)] hover:underline">
                + Add Reminder
              </button>
            </div>

            {/* Updates Section */}
            <div className="bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-medium)] p-6">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="circle-info" size={20} className="text-[var(--color-primary-strong)] mt-1" />
                <h3 className="text-[18px] font-semibold text-[var(--text-neutral-x-strong)]">
                  Updates since last payroll
                </h3>
              </div>
              <p className="text-[15px] text-[var(--text-neutral-medium)] mb-4 leading-relaxed">
                {updatesText}
              </p>
              <button className="px-4 py-2 text-[14px] font-medium text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] hover:bg-[var(--surface-neutral-x-weak)] transition-colors">
                Jump to report
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80">
          <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] p-6">
            {/* Start Payroll Button */}
            <button className="w-full px-6 py-3 text-[16px] font-semibold text-white bg-[var(--color-primary-strong)] rounded-[var(--radius-small)] hover:opacity-90 transition-opacity mb-3">
              Start payroll
            </button>
            <p className="text-[13px] text-[var(--text-neutral-medium)] mb-6 flex items-center gap-2">
              <Icon name="clock" size={12} className="text-[var(--icon-neutral-medium)]" />
              {dueDate}
            </p>

            {/* Payroll Details */}
            <div className="space-y-4 mb-6">
              {payrollDetails.map((detail) => (
                <div key={detail.id} className="flex items-start gap-3">
                  <Icon name={detail.icon as any} size={16} className="text-[var(--icon-neutral-medium)] mt-1" />
                  <div className="flex-1">
                    <p className="text-[13px] text-[var(--text-neutral-medium)]">
                      {detail.label}
                    </p>
                    <p className="text-[15px] font-medium text-[var(--text-neutral-x-strong)]">
                      {detail.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delete Button */}
            <button className="w-full px-4 py-2 text-[14px] font-medium text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors mb-3">
              Delete this payroll
            </button>

            {/* Payroll ID */}
            <p className="text-[12px] text-[var(--text-neutral-weak)] text-center">
              {payrollId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payroll;
