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
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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
              absolute z-50 top-full left-0 mt-2
              w-[320px]
              bg-[var(--surface-neutral-white)]
              border border-[var(--border-neutral-medium)]
              rounded-[12px]
            "
            style={{
              boxShadow: '3px 3px 10px 2px rgba(56, 49, 47, 0.1)',
            }}
          >
            {/* Header with navigation and day labels */}
            <div className="bg-[var(--surface-neutral-xx-weak)] rounded-t-[8px] pt-2 pb-3 px-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="flex items-center justify-center w-10 h-8 rounded-full bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors px-3"
                  style={{ boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)' }}
                >
                  <Icon name="chevron-left" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                </button>

                <div className="relative">
                  <select
                    value={viewDate.getMonth()}
                    onChange={(e) => handleMonthChange(Number(e.target.value))}
                    className="w-[88px] h-8 pl-4 pr-9 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full text-[14px] font-normal leading-[20px] text-[var(--text-neutral-strong)] appearance-none cursor-pointer"
                    style={{ boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.03)' }}
                  >
                    {MONTHS.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                    <div className="w-px h-4 bg-[var(--surface-neutral-weak)]"></div>
                    <Icon name="caret-down" size={16} className="text-[var(--icon-neutral-weak)]" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={viewDate.getFullYear()}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="w-[96px] h-8 pl-4 pr-9 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full text-[14px] font-normal leading-[20px] text-[var(--text-neutral-strong)] appearance-none cursor-pointer"
                    style={{ boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.03)' }}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                    <div className="w-px h-4 bg-[var(--surface-neutral-weak)]"></div>
                    <Icon name="caret-down" size={16} className="text-[var(--icon-neutral-weak)]" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="flex items-center justify-center w-10 h-8 rounded-full bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors px-3"
                  style={{ boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)' }}
                >
                  <Icon name="chevron-right" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                </button>
              </div>

              {/* Days of week */}
              <div className="flex items-center justify-between px-1">
                {DAYS.map((day, index) => (
                  <div
                    key={`day-header-${index}`}
                    className="flex items-center justify-center text-[13px] font-semibold leading-[19px] text-[var(--text-neutral-weak)]"
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar days */}
            <div className="flex flex-col gap-1 p-1">
              {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
                <div key={`week-${weekIndex}`} className="flex gap-1">
                  {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                    const actualIndex = weekIndex * 7 + dayIndex;
                    return (
                      <div key={actualIndex} className="flex items-center justify-center w-10 h-10">
                        {day ? (
                          <button
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            className={`
                              flex items-center justify-center
                              w-10 h-10
                              text-[14px] leading-[20px]
                              transition-all
                              ${
                                isSelected(day)
                                  ? 'bg-[#2E7918] text-white font-bold rounded-[8px]'
                                  : isToday(day)
                                  ? 'border border-[var(--border-neutral-weak)] text-[var(--text-neutral-x-strong)] font-semibold rounded-[8px]'
                                  : 'text-[var(--text-neutral-x-strong)] font-medium hover:border hover:border-[var(--border-neutral-weak)] rounded-[8px]'
                              }
                            `}
                          >
                            {day}
                          </button>
                        ) : (
                          <div className="w-10 h-10" />
                        )}
                      </div>
                    );
                  })}
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
