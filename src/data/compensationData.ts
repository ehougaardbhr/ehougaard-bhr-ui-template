export interface PayBand {
  id: string;
  title: string;
  department: string;
  level: string;
  minSalary: number;
  midSalary: number;
  maxSalary: number;
  currency: string;
}

export interface MarketBenchmark {
  title: string;
  department: string;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  source: string;
  asOf: string;
}

export const payBands: PayBand[] = [
  { id: 'pb-1', title: 'Software Engineer I', department: 'Technology', level: 'Junior', minSalary: 85000, midSalary: 100000, maxSalary: 115000, currency: 'USD' },
  { id: 'pb-2', title: 'Software Engineer II', department: 'Technology', level: 'Mid', minSalary: 105000, midSalary: 120000, maxSalary: 135000, currency: 'USD' },
  { id: 'pb-3', title: 'Senior Software Engineer', department: 'Technology', level: 'Senior', minSalary: 130000, midSalary: 145000, maxSalary: 170000, currency: 'USD' },
  { id: 'pb-4', title: 'Staff Engineer', department: 'Technology', level: 'Staff', minSalary: 160000, midSalary: 185000, maxSalary: 210000, currency: 'USD' },
  { id: 'pb-5', title: 'Engineering Manager', department: 'Technology', level: 'Manager', minSalary: 150000, midSalary: 175000, maxSalary: 200000, currency: 'USD' },
  { id: 'pb-6', title: 'VP of Technology', department: 'Technology', level: 'VP', minSalary: 190000, midSalary: 220000, maxSalary: 260000, currency: 'USD' },
  { id: 'pb-7', title: 'Financial Analyst', department: 'Finance', level: 'Mid', minSalary: 70000, midSalary: 85000, maxSalary: 100000, currency: 'USD' },
  { id: 'pb-8', title: 'Senior Financial Analyst', department: 'Finance', level: 'Senior', minSalary: 90000, midSalary: 105000, maxSalary: 120000, currency: 'USD' },
  { id: 'pb-9', title: 'HR Generalist', department: 'Human Resources', level: 'Mid', minSalary: 60000, midSalary: 75000, maxSalary: 90000, currency: 'USD' },
  { id: 'pb-10', title: 'Marketing Manager', department: 'Marketing', level: 'Manager', minSalary: 95000, midSalary: 115000, maxSalary: 135000, currency: 'USD' },
];

export const marketBenchmarks: MarketBenchmark[] = [
  { title: 'Senior Software Engineer', department: 'Technology', percentile25: 130000, percentile50: 145000, percentile75: 165000, percentile90: 185000, source: 'Radford Survey', asOf: '2025-Q4' },
  { title: 'Software Engineer II', department: 'Technology', percentile25: 105000, percentile50: 120000, percentile75: 138000, percentile90: 155000, source: 'Radford Survey', asOf: '2025-Q4' },
  { title: 'Engineering Manager', department: 'Technology', percentile25: 155000, percentile50: 175000, percentile75: 195000, percentile90: 215000, source: 'Radford Survey', asOf: '2025-Q4' },
];
