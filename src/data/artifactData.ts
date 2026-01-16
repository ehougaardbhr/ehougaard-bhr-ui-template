// ============================================
// TYPE DEFINITIONS
// ============================================

export type ArtifactType = 'chart' | 'document' | 'org-chart' | 'table';

export type ChartType = 'bar' | 'line' | 'pie' | 'table';
export type MeasureType = 'headcount' | 'salary' | 'tenure' | 'turnover';
export type CategoryType = 'department' | 'location' | 'job-level' | 'employment-type';
export type ColorType = 'green' | 'blue' | 'purple' | 'multi';
export type FilterType = 'all' | 'full-time' | 'contractors' | 'remote';
export type BenchmarkType = 'none' | 'industry' | 'previous';

export interface ChartSettings {
  chartType: ChartType;
  measure: MeasureType;
  category: CategoryType;
  color: ColorType;
  filter: FilterType;
  benchmark: BenchmarkType;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  conversationId: string;
  createdAt: Date;
  settings: ChartSettings | Record<string, unknown>; // Extensible for other artifact types
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

// ============================================
// LABEL MAPPINGS
// ============================================

export const chartTypeLabels: Record<ChartType, string> = {
  bar: 'Bar',
  line: 'Line',
  pie: 'Pie',
  table: 'Table',
};

export const chartTypeIcons: Record<ChartType, string> = {
  bar: 'chart-simple',
  line: 'chart-line',
  pie: 'chart-pie',
  table: 'table',
};

export const measureLabels: Record<MeasureType, string> = {
  headcount: 'Headcount',
  salary: 'Average Salary',
  tenure: 'Average Tenure',
  turnover: 'Turnover Rate',
};

export const categoryLabels: Record<CategoryType, string> = {
  department: 'Department',
  location: 'Location',
  'job-level': 'Job Level',
  'employment-type': 'Employment Type',
};

export const colorLabels: Record<ColorType, string> = {
  green: 'Green',
  blue: 'Blue',
  purple: 'Purple',
  multi: 'Multi-color',
};

export const filterLabels: Record<FilterType, string> = {
  all: 'All Employees',
  'full-time': 'Full-time Only',
  contractors: 'Contractors Only',
  remote: 'Remote Only',
};

export const benchmarkLabels: Record<BenchmarkType, string> = {
  none: 'None',
  industry: 'Industry Average',
  previous: 'Previous Year',
};

// ============================================
// COLOR PALETTES
// ============================================

export interface ColorPalette {
  gradient: string;
  solid: string;
  multi: string[];
}

export const colorPalettes: Record<ColorType, ColorPalette> = {
  green: {
    gradient: 'linear-gradient(180deg, #4CAF50 0%, #2e7918 100%)',
    solid: '#2e7918',
    multi: ['#2e7918', '#4CAF50', '#87C276', '#7AB8EE', '#C198D4'],
  },
  blue: {
    gradient: 'linear-gradient(180deg, #4A90E2 0%, #2563EB 100%)',
    solid: '#2563EB',
    multi: ['#2563EB', '#4A90E2', '#7AB8EE', '#87C276', '#C198D4'],
  },
  purple: {
    gradient: 'linear-gradient(180deg, #9F7AEA 0%, #6B46C1 100%)',
    solid: '#6B46C1',
    multi: ['#6B46C1', '#9F7AEA', '#C198D4', '#7AB8EE', '#87C276'],
  },
  multi: {
    gradient: '',
    solid: '',
    multi: ['#2e7918', '#4A90E2', '#C198D4', '#F2A766', '#4CAF50'],
  },
};

// ============================================
// CHART MOCK DATA
// ============================================

export const chartMockData: Record<CategoryType, Record<MeasureType, ChartDataPoint[]>> = {
  department: {
    headcount: [
      { label: 'Engineering', value: 45 },
      { label: 'Sales', value: 30 },
      { label: 'Marketing', value: 25 },
      { label: 'HR', value: 20 },
      { label: 'Finance', value: 15 },
    ],
    salary: [
      { label: 'Engineering', value: 95000 },
      { label: 'Sales', value: 75000 },
      { label: 'Marketing', value: 70000 },
      { label: 'HR', value: 65000 },
      { label: 'Finance', value: 85000 },
    ],
    tenure: [
      { label: 'Engineering', value: 3.2 },
      { label: 'Sales', value: 2.8 },
      { label: 'Marketing', value: 2.5 },
      { label: 'HR', value: 4.1 },
      { label: 'Finance', value: 5.3 },
    ],
    turnover: [
      { label: 'Engineering', value: 12 },
      { label: 'Sales', value: 18 },
      { label: 'Marketing', value: 15 },
      { label: 'HR', value: 8 },
      { label: 'Finance', value: 6 },
    ],
  },
  location: {
    headcount: [
      { label: 'San Francisco', value: 50 },
      { label: 'New York', value: 35 },
      { label: 'Austin', value: 30 },
      { label: 'Remote', value: 20 },
    ],
    salary: [
      { label: 'San Francisco', value: 105000 },
      { label: 'New York', value: 95000 },
      { label: 'Austin', value: 75000 },
      { label: 'Remote', value: 80000 },
    ],
    tenure: [
      { label: 'San Francisco', value: 2.8 },
      { label: 'New York', value: 3.5 },
      { label: 'Austin', value: 2.2 },
      { label: 'Remote', value: 4.0 },
    ],
    turnover: [
      { label: 'San Francisco', value: 15 },
      { label: 'New York', value: 12 },
      { label: 'Austin', value: 10 },
      { label: 'Remote', value: 8 },
    ],
  },
  'job-level': {
    headcount: [
      { label: 'Executive', value: 8 },
      { label: 'Senior', value: 35 },
      { label: 'Mid-level', value: 52 },
      { label: 'Junior', value: 40 },
    ],
    salary: [
      { label: 'Executive', value: 180000 },
      { label: 'Senior', value: 120000 },
      { label: 'Mid-level', value: 85000 },
      { label: 'Junior', value: 65000 },
    ],
    tenure: [
      { label: 'Executive', value: 8.5 },
      { label: 'Senior', value: 5.2 },
      { label: 'Mid-level', value: 3.1 },
      { label: 'Junior', value: 1.8 },
    ],
    turnover: [
      { label: 'Executive', value: 3 },
      { label: 'Senior', value: 8 },
      { label: 'Mid-level', value: 12 },
      { label: 'Junior', value: 22 },
    ],
  },
  'employment-type': {
    headcount: [
      { label: 'Full-time', value: 105 },
      { label: 'Part-time', value: 18 },
      { label: 'Contractor', value: 12 },
    ],
    salary: [
      { label: 'Full-time', value: 85000 },
      { label: 'Part-time', value: 45000 },
      { label: 'Contractor', value: 95000 },
    ],
    tenure: [
      { label: 'Full-time', value: 3.8 },
      { label: 'Part-time', value: 2.1 },
      { label: 'Contractor', value: 1.2 },
    ],
    turnover: [
      { label: 'Full-time', value: 10 },
      { label: 'Part-time', value: 25 },
      { label: 'Contractor', value: 35 },
    ],
  },
};

// ============================================
// MOCK ARTIFACTS
// ============================================

export const mockArtifacts: Artifact[] = [
  {
    id: 'artifact-1',
    type: 'chart',
    title: 'Headcount by Department',
    conversationId: '1', // Links to "Employee Onboarding" conversation
    createdAt: new Date('2026-01-15T10:30:00'),
    settings: {
      chartType: 'bar',
      measure: 'headcount',
      category: 'department',
      color: 'green',
      filter: 'all',
      benchmark: 'none',
    } as ChartSettings,
  },
  {
    id: 'artifact-2',
    type: 'chart',
    title: 'Salary by Location',
    conversationId: '2', // Links to "PTO Policy Updates" conversation
    createdAt: new Date('2026-01-14T14:20:00'),
    settings: {
      chartType: 'bar',
      measure: 'salary',
      category: 'location',
      color: 'blue',
      filter: 'all',
      benchmark: 'none',
    } as ChartSettings,
  },
  {
    id: 'artifact-3',
    type: 'chart',
    title: 'Turnover by Job Level',
    conversationId: '4', // Links to "Performance Reviews" conversation
    createdAt: new Date('2026-01-13T09:15:00'),
    settings: {
      chartType: 'pie',
      measure: 'turnover',
      category: 'job-level',
      color: 'multi',
      filter: 'all',
      benchmark: 'none',
    } as ChartSettings,
  },
  {
    id: 'artifact-4',
    type: 'chart',
    title: 'Tenure by Employment Type',
    conversationId: '5', // Links to "Review Upcoming Payroll Anomalies"
    createdAt: new Date('2026-01-12T16:45:00'),
    settings: {
      chartType: 'line',
      measure: 'tenure',
      category: 'employment-type',
      color: 'purple',
      filter: 'full-time',
      benchmark: 'previous',
    } as ChartSettings,
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate artifact title from settings
 */
export function generateArtifactTitle(settings: ChartSettings): string {
  return `${measureLabels[settings.measure]} by ${categoryLabels[settings.category]}`;
}

/**
 * Format a value for display based on measure type
 */
export function formatValue(value: number, measure: MeasureType): string {
  switch (measure) {
    case 'salary':
      return '$' + (value / 1000).toFixed(0) + 'k';
    case 'tenure':
      return value.toFixed(1) + ' yrs';
    case 'turnover':
      return value + '%';
    default:
      return String(value);
  }
}

/**
 * Get chart data for current settings
 */
export function getChartData(settings: ChartSettings): ChartDataPoint[] {
  return chartMockData[settings.category][settings.measure] || [];
}
