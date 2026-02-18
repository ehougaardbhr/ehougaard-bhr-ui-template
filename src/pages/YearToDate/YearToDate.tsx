import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon } from '../../components';
import type { IconName } from '../../components/Icon';

interface YearToDateTab {
  id: string;
  label: string;
  icon: IconName;
}
type TabId = YearToDateTab['id'];

interface HeaderMenuItem {
  id: string;
  label: string;
  icon: IconName;
  danger?: boolean;
  hasChevron?: boolean;
}

const yearToDateTabs: YearToDateTab[] = [
  { id: 'wages', label: 'Wages', icon: 'circle-dollar' },
  { id: 'hours', label: 'Hours', icon: 'clock' },
  { id: 'taxes', label: 'Taxes', icon: 'building' },
  { id: 'deductions', label: 'Deductions', icon: 'sliders' },
];

const headerMenuItems: HeaderMenuItem[] = [
  { id: 'edit', label: 'Edit Pay Type', icon: 'pen-to-square' },
  { id: 'move-hours', label: 'Move to Hours', icon: 'arrow-up-from-bracket' },
  { id: 'move-taxes', label: 'Move to Taxes', icon: 'arrow-up-from-bracket' },
  { id: 'move-deductions', label: 'Move to Deductions', icon: 'arrow-up-from-bracket' },
  { id: 'pin', label: 'Pin Column', icon: 'paperclip', hasChevron: true },
  { id: 'hide', label: 'Hide', icon: 'eye' },
  { id: 'delete', label: 'Delete', icon: 'trash-can', danger: true },
];

const GRID_ROW_HEIGHT = 34;
const DISCREPANCY_TOP = GRID_ROW_HEIGHT - 1;
const REPORT_TOTAL_TOP = (GRID_ROW_HEIGHT * 2) - 2;
const CALCULATED_TOTAL_TOP = (GRID_ROW_HEIGHT * 3) - 3;
const DISCREPANCY_EPSILON = 0.000001;

type EmployeeValues = Record<string, number | null>;

interface EmployeeRow {
  name: string;
  values: EmployeeValues;
}

interface TableConfig {
  columns: readonly string[];
  initialReportTotals: EmployeeValues;
  initialEmployeeRows: EmployeeRow[];
  newTypeLabel: string;
  valueFormat: 'currency' | 'hours';
  zeroAsDash: boolean;
  zeroReportTotalIsAlert: boolean;
}

const wageColumns = ['Regular', 'Commission', 'Bonus', 'Overtime', 'Holiday', 'Sick Leave', 'Misc.'] as const;
const initialWageReportTotals: EmployeeValues = {
  'Regular': 3198472.15,
  'Commission': null,
  'Bonus': 2875.3,
  'Overtime': 3395.97,
  'Holiday': 3567.89,
  'Sick Leave': 0,
  'Misc.': 0,
};

const initialWageRows: EmployeeRow[] = [
  { name: 'Isaac Navarro', values: { 'Regular': 145783.52, 'Commission': null, 'Bonus': 1987.65, 'Overtime': null, 'Holiday': 2500, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Maverick Figueroa', values: { 'Regular': 189654.28, 'Commission': 8345.6, 'Bonus': null, 'Overtime': null, 'Holiday': 3110.45, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Vivian Hunter', values: { 'Regular': 210457.76, 'Commission': 6222.1, 'Bonus': 3589.25, 'Overtime': null, 'Holiday': null, 'Sick Leave': 1750, 'Misc.': 0 } },
  { name: 'Autumn Gonzales (NY)', values: { 'Regular': 25304.04, 'Commission': null, 'Bonus': 4760.15, 'Overtime': null, 'Holiday': 1234.56, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Autumn Gonzales (DE)', values: { 'Regular': 173890.33, 'Commission': null, 'Bonus': 1230.5, 'Overtime': null, 'Holiday': null, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Addie Thao', values: { 'Regular': 167890.12, 'Commission': 5678, 'Bonus': 3999.99, 'Overtime': 502, 'Holiday': 2876.54, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Bryant Karlson', values: { 'Regular': 223478.59, 'Commission': null, 'Bonus': null, 'Overtime': null, 'Holiday': null, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Sofia Cheng', values: { 'Regular': 145672.4, 'Commission': null, 'Bonus': 4500, 'Overtime': null, 'Holiday': null, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Jameson Martin', values: { 'Regular': 199123.56, 'Commission': 9450.12, 'Bonus': 1800.7, 'Overtime': null, 'Holiday': null, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Autumn Joseph', values: { 'Regular': 157849.75, 'Commission': 7200.25, 'Bonus': null, 'Overtime': null, 'Holiday': 1678.9, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Danny Jordan', values: { 'Regular': 213567.84, 'Commission': null, 'Bonus': 2250.8, 'Overtime': 595, 'Holiday': 3200.15, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Paisley Trinh', values: { 'Regular': 181234.5, 'Commission': null, 'Bonus': 4890.45, 'Overtime': null, 'Holiday': 1999.99, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Samantha Vargas', values: { 'Regular': 164987.61, 'Commission': null, 'Bonus': 3145.55, 'Overtime': null, 'Holiday': 2700.88, 'Sick Leave': 0, 'Misc.': 0 } },
  { name: 'Violet Hall', values: { 'Regular': 199876.44, 'Commission': 6789.99, 'Bonus': 2678.9, 'Overtime': null, 'Holiday': 1500.5, 'Sick Leave': 0, 'Misc.': 0 } },
];

const hourColumns = ['Regular', 'Overtime', 'Holiday', 'Sick Leave', 'Misc.'] as const;
const initialHourRows: EmployeeRow[] = [
  { name: 'Isaac Navarro', values: { 'Regular': 357, 'Overtime': null, 'Holiday': 23, 'Sick Leave': null, 'Misc.': 84 } },
  { name: 'Maverick Figueroa', values: { 'Regular': 489, 'Overtime': null, 'Holiday': 34, 'Sick Leave': null, 'Misc.': 6 } },
  { name: 'Vivian Hunter', values: { 'Regular': 532, 'Overtime': 23, 'Holiday': 12, 'Sick Leave': null, 'Misc.': 42 } },
  { name: 'Autumn Gonzales (NY)', values: { 'Regular': 647, 'Overtime': null, 'Holiday': 45, 'Sick Leave': 5, 'Misc.': null } },
  { name: 'Autumn Gonzales (DE)', values: { 'Regular': 758, 'Overtime': null, 'Holiday': 28, 'Sick Leave': null, 'Misc.': null } },
  { name: 'Addie Thao', values: { 'Regular': 869, 'Overtime': null, 'Holiday': 39, 'Sick Leave': 7, 'Misc.': null } },
  { name: 'Bryant Karlson', values: { 'Regular': 971, 'Overtime': 22, 'Holiday': 40, 'Sick Leave': null, 'Misc.': 5 } },
  { name: 'Sofia Cheng', values: { 'Regular': 1082, 'Overtime': null, 'Holiday': 32, 'Sick Leave': 23, 'Misc.': 53 } },
  { name: 'Jameson Martin', values: { 'Regular': 1193, 'Overtime': 18, 'Holiday': 23, 'Sick Leave': null, 'Misc.': null } },
  { name: 'Autumn Joseph', values: { 'Regular': 1304, 'Overtime': null, 'Holiday': 19, 'Sick Leave': 80, 'Misc.': null } },
  { name: 'Danny Jordan', values: { 'Regular': 315, 'Overtime': 3, 'Holiday': 27, 'Sick Leave': null, 'Misc.': null } },
  { name: 'Paisley Trinh', values: { 'Regular': 426, 'Overtime': 14, 'Holiday': 33, 'Sick Leave': null, 'Misc.': null } },
  { name: 'Samantha Vargas', values: { 'Regular': 537, 'Overtime': 25, 'Holiday': 41, 'Sick Leave': null, 'Misc.': 34 } },
  { name: 'Violet Hall', values: { 'Regular': 648, 'Overtime': 6, 'Holiday': 29, 'Sick Leave': null, 'Misc.': 7 } },
];
const initialHourReportTotals: EmployeeValues = {
  'Regular': 10195,
  'Overtime': 102,
  'Holiday': 470,
  'Sick Leave': 115,
  'Misc.': 231,
};
const taxColumns = ['FIT', 'SS', 'MED', 'FUTA', 'SDI'] as const;
const initialTaxRows: EmployeeRow[] = initialWageRows.map((row) => ({
  name: row.name,
  values: {
    'FIT': row.values['Regular'] ?? 0,
    'SS': row.values['Commission'] ?? 0,
    'MED': row.values['Bonus'] ?? 0,
    'FUTA': row.values['Overtime'] ?? 0,
    'SDI': row.values['Holiday'] ?? 0,
  },
}));
const initialTaxReportTotals: EmployeeValues = {
  'FIT': 2398770.74,
  'SS': 43686.06,
  'MED': 34833.94,
  'FUTA': 1002.97,
  'SDI': 21047.24,
};
const deductionColumns = ['401k', 'HSA', 'LIFE', 'LTD', 'CMB'] as const;
const initialDeductionRows: EmployeeRow[] = [
  { name: 'Isaac Navarro', values: { '401k': 1238.0, 'HSA': 1789.0, 'LIFE': 3456.78, 'LTD': null, 'CMB': 2500.0 } },
  { name: 'Maverick Figueroa', values: { '401k': 2874.5, 'HSA': 1560.0, 'LIFE': 2345.99, 'LTD': null, 'CMB': 3110.45 } },
  { name: 'Vivian Hunter', values: { '401k': 3456.1, 'HSA': 1423.0, 'LIFE': 1234.56, 'LTD': null, 'CMB': null } },
  { name: 'Autumn Gonzales (NY)', values: { '401k': 1567.75, 'HSA': 1890.0, 'LIFE': 2789.0, 'LTD': null, 'CMB': 1234.56 } },
  { name: 'Autumn Gonzales (DE)', values: { '401k': 2890.2, 'HSA': 1337.0, 'LIFE': 3890.12, 'LTD': null, 'CMB': null } },
  { name: 'Addie Thao', values: { '401k': 3012.33, 'HSA': 1750.0, 'LIFE': 2111.23, 'LTD': 502.0, 'CMB': 2876.54 } },
  { name: 'Bryant Karlson', values: { '401k': 1905.45, 'HSA': 1625.0, 'LIFE': 4000.0, 'LTD': null, 'CMB': null } },
  { name: 'Sofia Cheng', values: { '401k': 2123.99, 'HSA': 1180.0, 'LIFE': 3333.45, 'LTD': null, 'CMB': null } },
  { name: 'Jameson Martin', values: { '401k': 4000.0, 'HSA': 1412.0, 'LIFE': 2245.25, 'LTD': null, 'CMB': null } },
  { name: 'Autumn Joseph', values: { '401k': 3750.25, 'HSA': 1705.0, 'LIFE': 1500.5, 'LTD': null, 'CMB': 1678.9 } },
  { name: 'Danny Jordan', values: { '401k': 1560.8, 'HSA': 1498.0, 'LIFE': 3999.99, 'LTD': 595.0, 'CMB': null } },
  { name: 'Paisley Trinh', values: { '401k': 2999.99, 'HSA': 1999.0, 'LIFE': 2600.3, 'LTD': null, 'CMB': null } },
  { name: 'Samantha Vargas', values: { '401k': 1111.0, 'HSA': 1577.0, 'LIFE': 1111.11, 'LTD': null, 'CMB': null } },
  { name: 'Violet Hall', values: { '401k': 3333.3, 'HSA': 1300.0, 'LIFE': 3200.4, 'LTD': null, 'CMB': 1500.5 } },
];
const initialDeductionReportTotals: EmployeeValues = {
  '401k': 35823.66,
  'HSA': 22045.0,
  'LIFE': 37818.68,
  'LTD': 1097.0,
  'CMB': 13146.22,
};

const tableConfigs: Record<TabId, TableConfig> = {
  wages: {
    columns: wageColumns,
    initialReportTotals: initialWageReportTotals,
    initialEmployeeRows: initialWageRows,
    newTypeLabel: 'New Pay Type',
    valueFormat: 'currency',
    zeroAsDash: true,
    zeroReportTotalIsAlert: true,
  },
  hours: {
    columns: hourColumns,
    initialReportTotals: initialHourReportTotals,
    initialEmployeeRows: initialHourRows,
    newTypeLabel: 'New Hours Type',
    valueFormat: 'hours',
    zeroAsDash: false,
    zeroReportTotalIsAlert: true,
  },
  taxes: {
    columns: taxColumns,
    initialReportTotals: initialTaxReportTotals,
    initialEmployeeRows: initialTaxRows,
    newTypeLabel: 'New Tax Type',
    valueFormat: 'currency',
    zeroAsDash: false,
    zeroReportTotalIsAlert: false,
  },
  deductions: {
    columns: deductionColumns,
    initialReportTotals: initialDeductionReportTotals,
    initialEmployeeRows: initialDeductionRows,
    newTypeLabel: 'New Deduction',
    valueFormat: 'currency',
    zeroAsDash: true,
    zeroReportTotalIsAlert: true,
  },
};

type EditingCell =
  | { kind: 'body'; rowIndex: number; column: string }
  | { kind: 'report'; column: string }
  | null;

function formatValue(
  value: number | null,
  valueFormat: 'currency' | 'hours',
  includePlus = false,
  zeroAsDash = false
) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '-';
  if (zeroAsDash && value === 0) return '-';

  const absValue = Math.abs(value);
  const formatted =
    valueFormat === 'currency'
      ? `$${absValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : absValue.toLocaleString('en-US', {
          useGrouping: false,
          minimumFractionDigits: Number.isInteger(absValue) ? 0 : 2,
          maximumFractionDigits: 2,
        });

  if (!includePlus) {
    return value < 0 ? `-${formatted}` : formatted;
  }

  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function parseNumericInput(rawValue: string): { valid: boolean; value: number | null } {
  const trimmed = rawValue.trim().replace(/[$,]/g, '');
  if (trimmed === '') return { valid: true, value: null };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return { valid: false, value: null };
  return { valid: true, value: parsed };
}

export function YearToDate() {
  const [activeTab, setActiveTab] = useState<TabId>('wages');
  const [tableRowsByTab, setTableRowsByTab] = useState<Record<TabId, EmployeeRow[]>>(() => ({
    wages: tableConfigs.wages.initialEmployeeRows.map((row) => ({ ...row, values: { ...row.values } })),
    hours: tableConfigs.hours.initialEmployeeRows.map((row) => ({ ...row, values: { ...row.values } })),
    taxes: tableConfigs.taxes.initialEmployeeRows.map((row) => ({ ...row, values: { ...row.values } })),
    deductions: tableConfigs.deductions.initialEmployeeRows.map((row) => ({ ...row, values: { ...row.values } })),
  }));
  const [reportTotalsByTab, setReportTotalsByTab] = useState<Record<TabId, EmployeeValues>>(() => ({
    wages: { ...tableConfigs.wages.initialReportTotals },
    hours: { ...tableConfigs.hours.initialReportTotals },
    taxes: { ...tableConfigs.taxes.initialReportTotals },
    deductions: { ...tableConfigs.deductions.initialReportTotals },
  }));
  const [isDiscrepancyExpanded, setIsDiscrepancyExpanded] = useState(true);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [editingValue, setEditingValue] = useState('');
  const [openHeaderMenu, setOpenHeaderMenu] = useState<string | null>(null);
  const [isFiltersPopoverOpen, setIsFiltersPopoverOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isNewTypeModalOpen, setIsNewTypeModalOpen] = useState(false);
  const headerMenuRef = useRef<HTMLDivElement>(null);
  const filtersPopoverRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const activeConfig = tableConfigs[activeTab];
  const activeColumns = activeConfig.columns;
  const tableRows = tableRowsByTab[activeTab];
  const reportTotals = reportTotalsByTab[activeTab];
  const tableMinWidth = 44 + 268 + (activeColumns.length * 158);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setOpenHeaderMenu(null);
      }
      if (filtersPopoverRef.current && !filtersPopoverRef.current.contains(event.target as Node)) {
        setIsFiltersPopoverOpen(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenHeaderMenu(null);
        setIsFiltersPopoverOpen(false);
        setIsDownloadMenuOpen(false);
        setIsNewTypeModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const calculatedTotals = useMemo(() => {
    return activeColumns.reduce((acc, column) => {
      acc[column] = tableRows.reduce((sum, row) => sum + (row.values[column] ?? 0), 0);
      return acc;
    }, {} as Record<string, number>);
  }, [tableRows, activeColumns]);

  const discrepancyTotals = useMemo(() => {
    return activeColumns.reduce((acc, column) => {
      const report = reportTotals[column];
      if (report === null || report === undefined || !Number.isFinite(report)) {
        acc[column] = null;
        return acc;
      }

      const rawDiscrepancy = report - calculatedTotals[column];
      acc[column] = Math.abs(rawDiscrepancy) < DISCREPANCY_EPSILON ? 0 : rawDiscrepancy;
      return acc;
    }, {} as Record<string, number | null>);
  }, [reportTotals, calculatedTotals, activeColumns]);

  const reportTotalHasAlert = (column: string) =>
    reportTotals[column] === null ||
    reportTotals[column] === undefined ||
    !Number.isFinite(reportTotals[column]) ||
    (activeConfig.zeroReportTotalIsAlert && reportTotals[column] === 0);

  const discrepancyHasAlert = (column: string) => {
    const discrepancy = discrepancyTotals[column];
    return reportTotalHasAlert(column) || (discrepancy !== null && Math.abs(discrepancy) >= DISCREPANCY_EPSILON);
  };

  const discrepancyDisplayValue = (column: string) => {
    const discrepancy = discrepancyTotals[column];
    if (discrepancy === null) {
      return formatValue(null, activeConfig.valueFormat, false, false);
    }
    if (Math.abs(discrepancy) < DISCREPANCY_EPSILON) {
      return formatValue(0, activeConfig.valueFormat, false, false);
    }
    return formatValue(discrepancy, activeConfig.valueFormat, true, false);
  };

  const beginEditBodyCell = (rowIndex: number, column: string) => {
    const value = tableRows[rowIndex].values[column];
    setEditingCell({ kind: 'body', rowIndex, column });
    setEditingValue(value === null ? '' : String(value));
  };

  const beginEditReportCell = (column: string) => {
    const value = reportTotals[column];
    setEditingCell({ kind: 'report', column });
    setEditingValue(value === null ? '' : String(value));
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const parsed = parseNumericInput(editingValue);
    if (!parsed.valid) {
      setEditingCell(null);
      setEditingValue('');
      return;
    }
    const nextValue = parsed.value;

    if (editingCell.kind === 'body') {
      setTableRowsByTab((current) => ({
        ...current,
        [activeTab]: current[activeTab].map((row, index) =>
          index === editingCell.rowIndex
            ? { ...row, values: { ...row.values, [editingCell.column]: nextValue } }
            : row
        ),
      }));
    } else {
      setReportTotalsByTab((current) => ({
        ...current,
        [activeTab]: { ...current[activeTab], [editingCell.column]: nextValue },
      }));
    }

    setEditingCell(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  const handleHeaderMenuToggle = (menuId: string) => {
    setIsFiltersPopoverOpen(false);
    setIsDownloadMenuOpen(false);
    setIsNewTypeModalOpen(false);
    setOpenHeaderMenu((current) => (current === menuId ? null : menuId));
  };

  const handleTabChange = (tabId: TabId) => {
    setOpenHeaderMenu(null);
    setIsFiltersPopoverOpen(false);
    setIsDownloadMenuOpen(false);
    setIsNewTypeModalOpen(false);
    setEditingCell(null);
    setEditingValue('');
    setActiveTab(tabId);
  };

  const openNewTypeModal = () => {
    setOpenHeaderMenu(null);
    setIsFiltersPopoverOpen(false);
    setIsDownloadMenuOpen(false);
    setIsNewTypeModalOpen(true);
  };

  return (
    <div className="h-full p-6">
      <div className="flex h-full min-h-0 flex-col bg-[var(--surface-neutral-x-weak)] p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1
              className="text-[44px] font-bold leading-[52px] text-[var(--color-primary-strong)]"
              style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
            >
              Year to Date
            </h1>
            <p className="mt-2 text-[15px] leading-[22px] text-[var(--text-neutral-strong)]">ACME Corp LLC - 123456</p>
          </div>

          <div className="pt-2 text-right">
            <p className="text-[14px] leading-[20px] text-[var(--text-neutral-weak)]">Date Range</p>
            <p className="text-[15px] font-medium leading-[22px] text-[var(--text-neutral-x-strong)]">Jan 01, 2025 - Aug 16, 2025</p>
          </div>
        </div>

        <section className="mt-3 flex min-h-0 flex-1 flex-col pb-8">
          <div
            className="flex h-full min-h-0 flex-col rounded-[var(--radius-small)] bg-[var(--surface-neutral-white)] p-6"
            style={{ boxShadow: 'var(--shadow-100)' }}
          >
            <div className="border-b border-[var(--border-neutral-x-weak)]">
              <div className="flex items-center gap-6">
                {yearToDateTabs.map((tab) => {
                  const isActive = tab.id === activeTab;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id as TabId)}
                      className={`
                        inline-flex items-center gap-2 border-b-2 px-2 py-2 text-[16px] leading-[24px] transition-colors
                        ${
                          isActive
                            ? 'border-[var(--color-primary-strong)] text-[var(--color-primary-strong)] font-bold'
                            : 'border-transparent text-[var(--text-neutral-x-strong)] font-medium hover:text-[var(--text-neutral-xx-strong)]'
                        }
                      `}
                    >
                      <Icon name={tab.icon} size={14} className="text-current" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-[248px] items-center gap-2 rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3"
                  style={{ boxShadow: 'var(--shadow-100)' }}
                >
                  <Icon name="magnifying-glass" size={12} className="text-[var(--text-neutral-weak)]" />
                  <input
                    type="text"
                    placeholder="Search by name or ID"
                    className="min-w-0 flex-1 bg-transparent text-[14px] leading-[20px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-weak)] outline-none"
                  />
                </div>

                <div className="relative" ref={filtersPopoverRef}>
                  <Button
                    variant="standard"
                    size="small"
                    icon="sliders"
                    showCaret
                    className="text-[13px] leading-[19px]"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setIsDownloadMenuOpen(false);
                      setIsFiltersPopoverOpen((current) => !current);
                    }}
                  >
                    Filters
                  </Button>
                  {isFiltersPopoverOpen && (
                    <div
                      className="absolute left-0 top-full z-[180] mt-2 w-[560px] rounded-[10px] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-5 pb-5 pt-6"
                      style={{ boxShadow: '3px 3px 10px 2px rgba(56, 49, 47, 0.10)' }}
                    >
                      <div className="flex items-start justify-between">
                        <h3
                          className="text-[30px] font-semibold leading-[36px] text-[var(--color-primary-strong)]"
                          style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
                        >
                          Filters
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsFiltersPopoverOpen(false)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)]"
                          aria-label="Close filters popover"
                        >
                          <Icon name="xmark" size={14} />
                        </button>
                      </div>

                      <div className="mt-3">
                        <p className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">Employment Status</p>
                        <button
                          type="button"
                          className="mt-2 flex h-8 w-[160px] items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-strong)]"
                        >
                          <span>All</span>
                          <span className="mx-2 h-4 w-px bg-[var(--border-neutral-x-weak)]" />
                          <Icon name="caret-down" size={10} className="text-[var(--text-neutral-medium)]" />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="mt-4 inline-flex items-center gap-2 text-[13px] leading-[19px] text-[#0b4fd1]"
                      >
                        <Icon name="circle-plus-lined" size={16} className="text-[#0b4fd1]" />
                        <span>Add filter</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[14px] leading-[20px] text-[var(--text-neutral-medium)]">Showing 243 rows</span>
              </div>

              <div className="flex items-center gap-3">
                {activeTab === 'taxes' && (
                  <button
                    type="button"
                    className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-[#8dcff5] bg-[var(--surface-neutral-white)] px-3 text-[13px] font-semibold leading-[19px] text-[#0078af]"
                    style={{ boxShadow: 'var(--shadow-100)' }}
                  >
                    <Icon name="sparkles" size={13} className="text-[#0078af]" />
                    Tax Assistant
                  </button>
                )}
                <Button
                  variant="standard"
                  size="small"
                  icon="circle-plus-lined"
                  className="text-[13px] leading-[19px]"
                  onClick={openNewTypeModal}
                >
                  {activeConfig.newTypeLabel}
                </Button>
                <div className="relative" ref={downloadMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setIsFiltersPopoverOpen(false);
                      setIsDownloadMenuOpen((current) => !current);
                    }}
                    className="inline-flex h-8 w-10 items-center justify-center gap-1 rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)]"
                    style={{ boxShadow: 'var(--shadow-100)' }}
                    aria-label="Download options"
                  >
                    <Icon name="arrow-down-to-line" size={10} />
                    <Icon name="caret-down" size={8} />
                  </button>
                  {isDownloadMenuOpen && (
                    <div
                      className="absolute right-0 top-full z-[180] mt-2 w-[120px] rounded-[10px] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] px-4 py-3"
                      style={{ boxShadow: '3px 3px 10px 2px rgba(56, 49, 47, 0.10)' }}
                    >
                      <p className="text-[14px] font-semibold leading-[20px] text-[var(--text-neutral-x-strong)]">Export as...</p>
                      <button
                        type="button"
                        onClick={() => setIsDownloadMenuOpen(false)}
                        className="mt-3 block w-full text-left text-[14px] font-normal leading-[20px] text-[var(--text-neutral-x-strong)]"
                      >
                        Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDownloadMenuOpen(false)}
                        className="mt-3 block w-full text-left text-[14px] font-normal leading-[20px] text-[var(--text-neutral-x-strong)]"
                      >
                        CSV
                      </button>
                    </div>
                  )}
                </div>
                <Button variant="standard" size="small" className="text-[13px] leading-[19px]">
                  Save &amp; Close
                </Button>
                <Button variant="primary" size="small" className="text-[13px] leading-[19px]">
                  Save &amp; Sync
                </Button>
              </div>
            </div>

            <div className="mt-4 flex-1 min-h-0 overflow-auto rounded-[var(--radius-xx-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)]">
              <table
                className="table-fixed border-separate border-spacing-0 text-[14px] leading-[20px]"
                style={{ minWidth: `${tableMinWidth}px` }}
              >
                <thead>
                  <tr className="bg-[var(--surface-neutral-x-weak)]">
                    <th className="sticky left-0 top-0 z-50 w-[44px] border-b border-r border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-x-weak)] px-2 py-[6px]" />
                    <th
                      className={`
                        sticky left-[44px] top-0 w-[268px] border-b border-r border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-x-weak)] px-3 py-[6px] text-left font-medium text-[var(--text-neutral-medium)]
                        ${openHeaderMenu === 'employee' ? 'z-[140]' : 'z-50'}
                      `}
                      style={{ boxShadow: 'inset 0 -1px 0 0 var(--border-neutral-medium)' }}
                    >
                      <div className="relative flex items-center justify-between gap-2" ref={openHeaderMenu === 'employee' ? headerMenuRef : undefined}>
                        <span>Employee</span>
                        <button
                          type="button"
                          onClick={() => handleHeaderMenuToggle('employee')}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-xx-small)] text-[var(--text-neutral-weak)] hover:bg-[var(--surface-neutral-xx-weak)]"
                          aria-label="Open employee column tools"
                        >
                          <Icon name="ellipsis" size={12} className="rotate-90 text-[var(--text-neutral-weak)]" />
                        </button>
                        {openHeaderMenu === 'employee' && (
                          <div
                            className="absolute right-0 top-full z-[150] mt-2 w-[200px] rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] p-2"
                            style={{ boxShadow: '3px 3px 10px 2px rgba(56, 49, 47, 0.10)' }}
                          >
                            {headerMenuItems.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setOpenHeaderMenu(null)}
                                className={`
                                  flex w-full items-center justify-between gap-2 rounded-[var(--radius-xx-small)] px-3 py-2 text-left text-[15px] leading-[22px]
                                  ${item.danger ? 'text-[#d62828]' : 'text-[var(--text-neutral-x-strong)]'}
                                  hover:bg-[var(--surface-neutral-xx-weak)]
                                `}
                              >
                                <span className="flex items-center gap-2">
                                  <Icon name={item.icon} size={14} className={item.danger ? 'text-[#d62828]' : 'text-[var(--text-neutral-x-strong)]'} />
                                  <span>{item.label}</span>
                                </span>
                                {item.hasChevron && <Icon name="chevron-right" size={10} className="text-[var(--text-neutral-medium)]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </th>
                    {activeColumns.map((column) => (
                      <th
                        key={column}
                        className={`
                          sticky top-0 w-[158px] border-b border-r border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-x-weak)] px-3 py-[6px] text-left font-medium text-[var(--text-neutral-medium)]
                          ${openHeaderMenu === column ? 'z-[140]' : 'z-40'}
                        `}
                        style={{ boxShadow: 'inset 0 -1px 0 0 var(--border-neutral-medium)' }}
                      >
                        <div className="relative flex items-center justify-between gap-2" ref={openHeaderMenu === column ? headerMenuRef : undefined}>
                          <span>{column}</span>
                          <button
                            type="button"
                            onClick={() => handleHeaderMenuToggle(column)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-xx-small)] text-[var(--text-neutral-weak)] hover:bg-[var(--surface-neutral-xx-weak)]"
                            aria-label={`Open ${column} column tools`}
                          >
                            <Icon name="ellipsis" size={12} className="rotate-90 text-[var(--text-neutral-weak)]" />
                          </button>
                          {openHeaderMenu === column && (
                            <div
                              className="absolute right-0 top-full z-[150] mt-2 w-[200px] rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)] p-2"
                              style={{ boxShadow: '3px 3px 10px 2px rgba(56, 49, 47, 0.10)' }}
                            >
                              {headerMenuItems.map((item) => (
                                <button
                                  key={`${column}-${item.id}`}
                                  type="button"
                                  onClick={() => setOpenHeaderMenu(null)}
                                  className={`
                                    flex w-full items-center justify-between gap-2 rounded-[var(--radius-xx-small)] px-3 py-2 text-left text-[15px] leading-[22px]
                                    ${item.danger ? 'text-[#d62828]' : 'text-[var(--text-neutral-x-strong)]'}
                                    hover:bg-[var(--surface-neutral-xx-weak)]
                                  `}
                                >
                                  <span className="flex items-center gap-2">
                                    <Icon name={item.icon} size={14} className={item.danger ? 'text-[#d62828]' : 'text-[var(--text-neutral-x-strong)]'} />
                                    <span>{item.label}</span>
                                  </span>
                                  {item.hasChevron && <Icon name="chevron-right" size={10} className="text-[var(--text-neutral-medium)]" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-[#f2f2f2]">
                    <th className="sticky left-0 z-40 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-2 py-[6px]" style={{ top: `${DISCREPANCY_TOP}px` }} />
                    <th
                      className="sticky left-[44px] z-40 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-3 py-[6px] font-semibold text-[var(--text-neutral-x-strong)]"
                      style={{ top: `${DISCREPANCY_TOP}px`, boxShadow: 'inset 0 -1px 0 0 var(--border-neutral-medium), inset 0 1px 0 0 var(--border-neutral-medium)' }}
                    >
                      <button
                        type="button"
                        onClick={() => setIsDiscrepancyExpanded((current) => !current)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span>Discrepancy</span>
                        <Icon name={isDiscrepancyExpanded ? 'chevron-up' : 'chevron-down'} size={12} />
                      </button>
                    </th>
                    {activeColumns.map((column) => (
                      <th
                        key={column}
                        className={`
                          sticky z-30 border-b border-r border-[var(--border-neutral-medium)] px-3 py-[6px] text-[var(--text-neutral-x-strong)]
                          ${discrepancyHasAlert(column) ? 'bg-[#fff3e9] outline outline-1 outline-[#d85f0b] outline-offset-[-1px]' : 'bg-[#f2f2f2]'}
                        `}
                        style={{ top: `${DISCREPANCY_TOP}px`, boxShadow: 'inset 0 -1px 0 0 var(--border-neutral-medium), inset 0 1px 0 0 var(--border-neutral-medium)' }}
                      >
                        <div className="relative w-full pl-5 text-right">
                          {discrepancyHasAlert(column) && (
                            <Icon name="triangle-exclamation" size={11} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#d85f0b]" />
                          )}
                          <span className="block font-normal">{discrepancyDisplayValue(column)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                  {isDiscrepancyExpanded && (
                    <>
                      <tr className="bg-[#f2f2f2]">
                        <th className="sticky left-0 z-40 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-2 py-[6px]" style={{ top: `${REPORT_TOTAL_TOP}px` }} />
                        <th className="sticky left-[44px] z-40 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-3 py-[6px] text-left font-semibold text-[var(--text-neutral-x-strong)]" style={{ top: `${REPORT_TOTAL_TOP}px` }}>
                          Report Total
                        </th>
                        {activeColumns.map((column) => {
                          const isEditing =
                            editingCell?.kind === 'report' &&
                            editingCell.column === column;

                          return (
                            <th
                              key={`report-${column}`}
                              className={`
                                sticky z-30 border-b border-r border-[var(--border-neutral-medium)] px-3 py-[6px] text-[var(--text-neutral-x-strong)]
                                ${reportTotalHasAlert(column) ? 'bg-[#fff3e9] outline outline-1 outline-[#d85f0b] outline-offset-[-1px]' : 'bg-[#f2f2f2]'}
                              `}
                              style={{ top: `${REPORT_TOTAL_TOP}px` }}
                            >
                              {isEditing ? (
                                <input
                                  autoFocus
                                  value={editingValue}
                                  onChange={(event) => setEditingValue(event.target.value)}
                                  onBlur={commitEdit}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') commitEdit();
                                    if (event.key === 'Escape') cancelEdit();
                                  }}
                                  className="w-full bg-transparent text-right text-[15px] font-normal leading-[22px] outline-none"
                                  placeholder="-"
                                />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => beginEditReportCell(column)}
                                  className="w-full"
                                  title={reportTotalHasAlert(column) ? 'Enter a report total' : undefined}
                                >
                                  <div className="relative w-full pl-5 text-right">
                                    {reportTotalHasAlert(column) && (
                                      <Icon name="triangle-exclamation" size={11} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#d85f0b]" />
                                    )}
                                    <span className="block font-normal">{formatValue(reportTotals[column], activeConfig.valueFormat, false, activeConfig.zeroAsDash)}</span>
                                  </div>
                                </button>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                      <tr className="bg-[#f2f2f2]">
                        <th className="sticky left-0 z-40 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-2 py-[6px]" style={{ top: `${CALCULATED_TOTAL_TOP}px` }} />
                        <th className="sticky left-[44px] z-40 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-3 py-[6px] text-left font-semibold text-[var(--text-neutral-x-strong)]" style={{ top: `${CALCULATED_TOTAL_TOP}px` }}>
                          Calculated Total
                        </th>
                        {activeColumns.map((column) => (
                          <th
                            key={`calculated-${column}`}
                            className="sticky z-30 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-3 py-[6px] text-right font-normal text-[var(--text-neutral-x-strong)]"
                            style={{ top: `${CALCULATED_TOTAL_TOP}px` }}
                          >
                            {formatValue(calculatedTotals[column], activeConfig.valueFormat, false, activeConfig.zeroAsDash)}
                          </th>
                        ))}
                      </tr>
                    </>
                  )}
                </thead>

                <tbody>

                  {tableRows.map((row, index) => (
                    <tr key={row.name} className="bg-[var(--surface-neutral-white)]">
                      <td className="sticky left-0 z-20 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-2 py-[6px] text-center text-[var(--text-neutral-medium)]">
                        {index + 1}
                      </td>
                      <td className="sticky left-[44px] z-20 border-b border-r border-[var(--border-neutral-medium)] bg-[#f2f2f2] px-3 py-[6px] text-left text-[var(--text-neutral-x-strong)]">
                        {row.name}
                      </td>
                      {activeColumns.map((column) => (
                        <td
                          key={`${row.name}-${column}`}
                          className="border-b border-r border-[var(--border-neutral-x-weak)] px-3 py-[6px] text-right text-[var(--text-neutral-x-strong)]"
                        >
                          {editingCell?.kind === 'body' &&
                          editingCell.rowIndex === index &&
                          editingCell.column === column ? (
                            <input
                              autoFocus
                              value={editingValue}
                              onChange={(event) => setEditingValue(event.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') commitEdit();
                                if (event.key === 'Escape') cancelEdit();
                              }}
                              className="w-full bg-transparent text-right text-[15px] leading-[22px] outline-none"
                              placeholder="-"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => beginEditBodyCell(index, column)}
                              className="w-full text-right"
                            >
                              {formatValue(row.values[column], activeConfig.valueFormat, false, activeConfig.zeroAsDash)}
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      {isNewTypeModalOpen && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-[#676260]/90 p-6"
          onClick={() => setIsNewTypeModalOpen(false)}
        >
          <div
            className="w-full max-w-[664px] overflow-hidden rounded-[16px] border border-[var(--border-neutral-x-weak)] bg-[var(--surface-neutral-white)]"
            style={{ boxShadow: '2px 2px 0px 2px rgba(56, 49, 47, 0.08)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[var(--surface-neutral-x-weak)] px-6 py-5">
              <h3
                className="text-[36px] font-semibold leading-[44px] text-[var(--color-primary-strong)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
              >
                {activeConfig.newTypeLabel}
              </h3>
              <button
                type="button"
                onClick={() => setIsNewTypeModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)]"
                aria-label="Close new pay type modal"
              >
                <Icon name="xmark" size={14} />
              </button>
            </div>

            <div className="px-6 pb-0 pt-8">
              {activeTab === 'taxes' ? (
                <>
                  <div className="w-[218px]">
                    <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">Effective Date</label>
                    <button
                      type="button"
                      className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-medium)]"
                      style={{ boxShadow: 'var(--shadow-100)' }}
                    >
                      <span>mm/dd/yyyy</span>
                      <span className="mx-2 h-5 w-px bg-[var(--border-neutral-x-weak)]" />
                      <Icon name="calendar" size={14} className="text-[var(--text-neutral-medium)]" />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5">
                    <div>
                      <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                        State <span className="text-[var(--text-neutral-x-strong)]">*</span>
                      </label>
                      <button
                        type="button"
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-medium)]"
                        style={{ boxShadow: 'var(--shadow-100)' }}
                      >
                        <span>-Select-</span>
                        <span className="mx-2 h-5 w-px bg-[var(--border-neutral-x-weak)]" />
                        <Icon name="caret-down" size={10} className="text-[var(--text-neutral-medium)]" />
                      </button>
                    </div>
                    <div>
                      <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                        Tax Type <span className="text-[var(--text-neutral-x-strong)]">*</span>
                      </label>
                      <button
                        type="button"
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-medium)]"
                        style={{ boxShadow: 'var(--shadow-100)' }}
                      >
                        <span>-Select-</span>
                        <span className="mx-2 h-5 w-px bg-[var(--border-neutral-x-weak)]" />
                        <Icon name="caret-down" size={10} className="text-[var(--text-neutral-medium)]" />
                      </button>
                    </div>
                    <div>
                      <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                        Tax Deposit Frequency<span className="text-[var(--text-neutral-x-strong)]">*</span>
                      </label>
                      <button
                        type="button"
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-medium)]"
                        style={{ boxShadow: 'var(--shadow-100)' }}
                      >
                        <span>-Select-</span>
                        <span className="mx-2 h-5 w-px bg-[var(--border-neutral-x-weak)]" />
                        <Icon name="caret-down" size={10} className="text-[var(--text-neutral-medium)]" />
                      </button>
                    </div>
                    <div className="w-[130px]">
                      <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                        Tax Rate<span className="text-[var(--text-neutral-x-strong)]">*</span>
                      </label>
                      <button
                        type="button"
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-medium)]"
                        style={{ boxShadow: 'var(--shadow-100)' }}
                      >
                        <span>0.00</span>
                        <span className="mx-2 h-5 w-px bg-[var(--border-neutral-x-weak)]" />
                        <span className="text-[15px] leading-[22px] text-[var(--text-neutral-medium)]">%</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 w-[432px]">
                    <label className="inline-flex items-center gap-1 text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                      <span>Tax Account ID</span>
                      <Icon name="circle-info" size={14} className="text-[var(--text-neutral-medium)]" />
                    </label>
                    <input
                      type="text"
                      className="mt-2 h-10 w-full rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-strong)] outline-none"
                      style={{ boxShadow: 'var(--shadow-100)' }}
                    />
                  </div>
                </>
              ) : activeTab === 'deductions' ? (
                <>
                  <div className="grid grid-cols-2 gap-x-4">
                    <div>
                      <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                        Category <span className="text-[var(--text-neutral-x-strong)]">*</span>
                      </label>
                      <button
                        type="button"
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-medium)]"
                        style={{ boxShadow: 'var(--shadow-100)' }}
                      >
                        <span>-Select-</span>
                        <span className="mx-2 h-5 w-px bg-[var(--border-neutral-x-weak)]" />
                        <Icon name="caret-down" size={10} className="text-[var(--text-neutral-medium)]" />
                      </button>
                    </div>
                    <div>
                      <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                        Name <span className="text-[var(--text-neutral-x-strong)]">*</span>
                      </label>
                      <input
                        type="text"
                        className="mt-2 h-10 w-full rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-strong)] outline-none"
                        style={{ boxShadow: 'var(--shadow-100)' }}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[15px] font-normal leading-[22px] text-[var(--text-neutral-x-strong)]">
                      Is the payroll deduction pre-tax or post-tax?
                    </p>
                    <div className="mt-2 flex items-center gap-5">
                      <button type="button" className="inline-flex items-center gap-2 text-[15px] font-normal leading-[22px] text-[var(--text-neutral-medium)]">
                        <Icon name="circle" size={15} className="text-[var(--text-neutral-medium)]" />
                        <span>Pre-tax</span>
                      </button>
                      <button type="button" className="inline-flex items-center gap-2 text-[15px] font-normal leading-[22px] text-[var(--text-neutral-medium)]">
                        <Icon name="circle" size={15} className="text-[var(--text-neutral-medium)]" />
                        <span>Post-tax</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[15px] font-normal leading-[22px] text-[var(--text-neutral-medium)]">
                      Reportable on the W-2 (Box 12 Code DD)?
                    </p>
                    <div className="mt-2">
                      <button type="button" className="inline-flex items-center gap-2 text-[15px] font-normal leading-[22px] text-[var(--text-neutral-medium)]">
                        <Icon name="circle" size={15} className="text-[var(--text-neutral-medium)]" />
                        <span>Yes, reportable (most common)</span>
                      </button>
                    </div>
                    <div className="mt-3">
                      <button type="button" className="inline-flex items-center gap-2 text-[15px] font-normal leading-[22px] text-[var(--text-neutral-medium)]">
                        <Icon name="circle" size={15} className="text-[var(--text-neutral-medium)]" />
                        <span>No, not reportable</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[324px]">
                    <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                      Name <span className="text-[var(--text-neutral-x-strong)]">*</span>
                    </label>
                    <input
                      type="text"
                      className="mt-2 h-10 w-full rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-strong)] outline-none"
                      style={{ boxShadow: 'var(--shadow-100)' }}
                    />
                  </div>

                  <div className="mt-5 w-[324px]">
                    <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
                      Pay Type Rule <span className="text-[var(--text-neutral-x-strong)]">*</span>
                    </label>
                    <button
                      type="button"
                      className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border border-[var(--border-neutral-medium)] bg-[var(--surface-neutral-white)] px-3 text-[14px] leading-[20px] text-[var(--text-neutral-medium)]"
                      style={{ boxShadow: 'var(--shadow-100)' }}
                    >
                      <span>-Select-</span>
                      <span className="mx-2 h-5 w-px bg-[var(--border-neutral-x-weak)]" />
                      <Icon name="caret-down" size={10} className="text-[var(--text-neutral-medium)]" />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="mt-8 flex items-center justify-end gap-3 bg-[var(--surface-neutral-x-weak)] px-6 py-5">
                <button
                  type="button"
                  onClick={() => setIsNewTypeModalOpen(false)}
                  className="text-[15px] font-semibold leading-[22px] text-[#0b4fd1]"
                >
                  Cancel
                </button>
                <Button variant="primary" size="medium" onClick={() => setIsNewTypeModalOpen(false)}>
                  {activeConfig.newTypeLabel}
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YearToDate;
