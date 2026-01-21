import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import {
  type OrgChartSettings,
  type LayoutType,
  type DepartmentFilterType,
  layoutLabels,
  departmentFilterLabels,
} from '../../data/artifactData';
import type { Employee } from '../../data/employees';

interface OrgChartSettingsToolbarProps {
  settings: OrgChartSettings;
  employees: Employee[];
  onSettingsChange: (settings: Partial<OrgChartSettings>) => void;
}

function ToolbarDropdown({
  label,
  isOpen,
  onClick,
  children,
}: {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="h-8 px-3 rounded-full flex items-center gap-2 text-[13px] font-medium transition-colors hover:bg-[var(--surface-neutral-x-weak)]"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          border: '1px solid var(--border-neutral-weak)',
          color: 'var(--text-neutral-strong)',
        }}
      >
        <span>{label}</span>
        <Icon
          name="caret-down"
          size={8}
          className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-44 rounded-lg shadow-lg py-1 z-50"
          style={{
            backgroundColor: 'var(--surface-neutral-white)',
            border: '1px solid var(--border-neutral-weak)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className="w-9 h-5 rounded-full transition-colors
                     peer-checked:bg-blue-600 bg-neutral-300 dark:bg-neutral-600"
        ></div>
        <div
          className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white
                     transition-transform peer-checked:translate-x-4"
        ></div>
      </div>
      <span className="text-[13px] font-medium" style={{ color: 'var(--text-neutral-strong)' }}>
        {label}
      </span>
    </label>
  );
}

export function OrgChartSettingsToolbar({
  settings,
  employees,
  onSettingsChange,
}: OrgChartSettingsToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Get root employee name
  const rootEmployeeName =
    settings.rootEmployee === 'all'
      ? 'All (CEO)'
      : employees.find((emp) => emp.id.toString() === settings.rootEmployee)?.name || 'Unknown';

  const layoutOptions: LayoutType[] = ['top-down', 'left-right'];
  const filterOptions: DepartmentFilterType[] = [
    'all',
    'technology',
    'product',
    'operations',
    'finance',
    'marketing',
    'human resources',
    'executive',
  ];

  return (
    <div
      ref={toolbarRef}
      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700"
    >
      {/* Root Employee */}
      <ToolbarDropdown
        label={`Root: ${rootEmployeeName}`}
        isOpen={openDropdown === 'root'}
        onClick={() => toggleDropdown('root')}
      >
        <button
          onClick={() => {
            onSettingsChange({ rootEmployee: 'all' });
            setOpenDropdown(null);
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
          style={{
            backgroundColor:
              settings.rootEmployee === 'all' ? 'var(--surface-neutral-x-weak)' : 'transparent',
          }}
        >
          All (CEO)
        </button>
        {employees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => {
              onSettingsChange({ rootEmployee: emp.id.toString() });
              setOpenDropdown(null);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
            style={{
              backgroundColor:
                settings.rootEmployee === emp.id.toString()
                  ? 'var(--surface-neutral-x-weak)'
                  : 'transparent',
            }}
          >
            <div>{emp.name}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{emp.title}</div>
          </button>
        ))}
      </ToolbarDropdown>

      {/* Filter (Department) */}
      <ToolbarDropdown
        label={departmentFilterLabels[settings.filter]}
        isOpen={openDropdown === 'filter'}
        onClick={() => toggleDropdown('filter')}
      >
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
              onSettingsChange({ filter: option });
              setOpenDropdown(null);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
            style={{
              backgroundColor:
                settings.filter === option ? 'var(--surface-neutral-x-weak)' : 'transparent',
            }}
          >
            {departmentFilterLabels[option]}
          </button>
        ))}
      </ToolbarDropdown>

      {/* Layout */}
      <ToolbarDropdown
        label={layoutLabels[settings.layout]}
        isOpen={openDropdown === 'layout'}
        onClick={() => toggleDropdown('layout')}
      >
        {layoutOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
              onSettingsChange({ layout: option });
              setOpenDropdown(null);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
            style={{
              backgroundColor:
                settings.layout === option ? 'var(--surface-neutral-x-weak)' : 'transparent',
            }}
          >
            {layoutLabels[option]}
          </button>
        ))}
      </ToolbarDropdown>

      {/* Toggles */}
      <div className="ml-auto flex items-center gap-4">
        <ToggleSwitch
          label="Show Photos"
          checked={settings.showPhotos}
          onChange={(checked) => onSettingsChange({ showPhotos: checked })}
        />
        <ToggleSwitch
          label="Compact"
          checked={settings.compact}
          onChange={(checked) => onSettingsChange({ compact: checked })}
        />
      </div>

      {/* Saved Indicator */}
      <div className="flex items-center gap-2 text-[13px] text-green-600 dark:text-green-400">
        <Icon name="check" size={12} />
        <span>Saved</span>
      </div>
    </div>
  );
}
