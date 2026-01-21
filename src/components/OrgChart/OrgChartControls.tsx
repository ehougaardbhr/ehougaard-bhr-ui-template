import { useState, useRef, useEffect } from 'react';
import type { Employee } from '../../data/employees';
import { Icon } from '../Icon';

interface OrgChartControlsProps {
  employees: Employee[];
  depth: number | 'all';
  onDepthChange: (depth: number | 'all') => void;
  onEmployeeJump: (employeeId: number) => void;
  onGoUp: () => void;
  onFilterOpen: () => void;
  onExportOpen: () => void;
}

export function OrgChartControls({
  employees,
  depth,
  onDepthChange,
  onEmployeeJump,
  onGoUp,
  onFilterOpen,
  onExportOpen,
}: OrgChartControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [depthDropdownOpen, setDepthDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  // Filter employees based on search query
  const searchResults = searchQuery.trim()
    ? employees.filter((emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (depthRef.current && !depthRef.current.contains(event.target as Node)) {
        setDepthDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const depthOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 'all' as const, label: 'All' },
  ];

  const currentDepthLabel = depth === 'all' ? 'All' : (depth ?? 'all').toString();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
      {/* Left: Search */}
      <div ref={searchRef} className="relative flex-1 max-w-sm">
        <div className="relative">
          <Icon
            name="magnifying-glass"
            size={14}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Jump to an employee..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full h-10 pl-9 pr-4 text-sm rounded-full
                     bg-white
                     border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     placeholder:text-gray-400"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div
            className="absolute left-0 top-full mt-1 w-full rounded-lg shadow-lg py-1 z-50 max-h-64 overflow-y-auto"
            style={{
              backgroundColor: 'var(--surface-neutral-white)',
              border: '1px solid var(--border-neutral-weak)',
            }}
          >
            {searchResults.map((emp) => (
              <button
                key={emp.id}
                onClick={() => {
                  onEmployeeJump(emp.id);
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {emp.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {emp.title} · {emp.department}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center: Depth Selector and Up Arrow */}
      <div className="flex items-center gap-2">
        {/* Depth Dropdown */}
        <div ref={depthRef} className="relative">
          <button
            onClick={() => setDepthDropdownOpen(!depthDropdownOpen)}
            className="h-10 w-16 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-medium transition-colors hover:bg-gray-50 text-gray-900"
          >
            <span>{currentDepthLabel}</span>
            <Icon
              name="caret-down"
              size={8}
              className={`ml-1 transition-transform duration-150 ${
                depthDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {depthDropdownOpen && (
            <div
              className="absolute left-0 top-full mt-1 w-24 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: 'var(--surface-neutral-white)',
                border: '1px solid var(--border-neutral-weak)',
              }}
            >
              {depthOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onDepthChange(option.value);
                    setDepthDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-gray-900"
                  style={{
                    backgroundColor:
                      depth === option.value ? '#f3f4f6' : 'transparent',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Up Arrow */}
        <button
          onClick={onGoUp}
          className="h-10 w-10 rounded-full bg-white border border-gray-300 flex items-center justify-center transition-colors hover:bg-gray-50 text-gray-900"
          aria-label="Go to parent"
        >
          <Icon name="arrow-up" size={16} />
        </button>
      </div>

      {/* Right: Filter and Export */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Filter Button */}
        <button
          onClick={onFilterOpen}
          className="h-10 px-4 rounded-full bg-white border border-gray-300 flex items-center gap-2 text-sm font-medium transition-colors hover:bg-gray-50 text-gray-900"
        >
          <Icon name="sliders" size={16} />
          <Icon name="caret-down" size={8} />
        </button>

        {/* Export Button */}
        <button
          onClick={onExportOpen}
          className="h-10 px-4 rounded-full bg-white border border-gray-300 flex items-center gap-2 text-sm font-medium transition-colors hover:bg-gray-50 text-gray-900"
        >
          <Icon name="arrow-up-from-bracket" size={16} />
          <span>Export</span>
          <Icon name="caret-down" size={8} />
        </button>
      </div>
    </div>
  );
}
