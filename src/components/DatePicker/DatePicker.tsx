import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'MM/DD/YYYY',
  disabled = false,
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);

    // Format as MM/DD/YYYY
    const formatted = `${String(newDate.getMonth() + 1).padStart(2, '0')}/${String(newDate.getDate()).padStart(2, '0')}/${newDate.getFullYear()}`;
    onChange?.(formatted);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (monthIndex: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
  };

  const handleYearChange = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate);
  const today = new Date();

  // Generate year options (current year ± 100 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      viewDate.getMonth() === selectedDate.getMonth() &&
      viewDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={pickerRef}>
      {label && (
        <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            flex items-center justify-between gap-4
            w-full h-10 pl-4 pr-3 py-2
            bg-[var(--surface-neutral-white)]
            border border-[var(--border-neutral-medium)]
            rounded-[var(--radius-xx-small)]
            text-[15px] leading-[22px]
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            ${value ? 'text-[var(--text-neutral-strong)]' : 'text-[var(--text-neutral-weak)]'}
          `}
          style={{ boxShadow: '1px 1px 0px 1px rgba(56,49,47,0.04)' }}
        >
          <span className="flex-1 text-left truncate">
            {value || placeholder}
          </span>
          <Icon name="calendar" size={16} className="text-[var(--icon-neutral-strong)] shrink-0" />
        </button>

        {isOpen && !disabled && (
          <div
            className="
              absolute z-50 top-full left-0 mt-1
              w-[320px]
              bg-[var(--surface-neutral-white)]
              border border-[var(--border-neutral-medium)]
              rounded-[var(--radius-small)]
              shadow-lg
              p-4
            "
          >
            {/* Header with navigation */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex items-center justify-center w-8 h-8 rounded hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
              >
                <Icon name="chevron-left" size={16} className="text-[var(--icon-neutral-strong)]" />
              </button>

              <select
                value={viewDate.getMonth()}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="flex-1 h-8 px-2 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded text-[13px] text-[var(--text-neutral-strong)]"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={viewDate.getFullYear()}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="w-20 h-8 px-2 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded text-[13px] text-[var(--text-neutral-strong)]"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex items-center justify-center w-8 h-8 rounded hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
              >
                <Icon name="chevron-right" size={16} className="text-[var(--icon-neutral-strong)]" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day, index) => (
                <div
                  key={`day-header-${index}`}
                  className="flex items-center justify-center h-8 text-[11px] font-medium text-[var(--text-neutral-medium)]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div key={index} className="flex items-center justify-center">
                  {day ? (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`
                        flex items-center justify-center
                        w-10 h-10
                        rounded
                        text-[13px]
                        transition-colors
                        ${
                          isSelected(day)
                            ? 'bg-[var(--color-primary-strong)] text-white font-semibold'
                            : isToday(day)
                            ? 'bg-[var(--surface-neutral-x-weak)] text-[var(--text-neutral-xx-strong)] font-medium'
                            : 'text-[var(--text-neutral-strong)] hover:bg-[var(--surface-neutral-xx-weak)]'
                        }
                      `}
                    >
                      {day}
                    </button>
                  ) : (
                    <div className="w-10 h-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePicker;
