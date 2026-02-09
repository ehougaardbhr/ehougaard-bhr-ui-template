// ============================================
// TYPE DEFINITIONS
// ============================================

export type ArtifactType = 'chart' | 'text' | 'document' | 'org-chart' | 'table' | 'plan';

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

export type ToneType = 'professional' | 'casual' | 'formal' | 'friendly';
export type LengthType = 'brief' | 'standard' | 'detailed';
export type FormatType = 'paragraph' | 'bullets' | 'numbered';

export interface TextSettings {
  tone: ToneType;
  length: LengthType;
  format: FormatType;
}

export type LayoutType = 'top-down' | 'left-right';
export type DepartmentFilterType = 'all' | 'technology' | 'product' | 'operations' | 'finance' | 'marketing' | 'human resources' | 'executive';

export interface OrgChartSettings {
  rootEmployee: string;           // Employee ID or "all" for CEO
  depth: number | 'all';          // 1-5 or "all" levels
  filter: DepartmentFilterType;   // Department filter
  layout: LayoutType;             // "top-down" | "left-right"
  showPhotos: boolean;            // Toggle for avatar display
  compact: boolean;               // Compact vs expanded node view
  selectedEmployee?: number;      // Initially selected employee ID
  expandedEmployees?: number[];   // Initially expanded employee IDs
}

// Plan artifact types
export type PlanStatus = 'proposed' | 'running' | 'paused' | 'completed';

export interface ActionItem {
  id: string;
  description: string;
  owner?: string;
  status: 'planned' | 'queued' | 'working' | 'done';
  dueDate?: string;
  toolCall?: string; // Tool name from registry, e.g. 'analyze_compensation'
  toolParams?: Record<string, unknown>; // Parameters for the tool call
}

export interface PlanSection {
  id: string;
  title: string;
  description?: string;
  content?: string; // Legacy field, use description for new plans
  actionItems: ActionItem[];
}

export interface ReviewStep {
  id: string;
  description: string;  // e.g. "Review — Sarah Chen"
  reviewer: string;
  status: 'planned' | 'passed' | 'ready' | 'future';
  afterItem: string;           // action item ID this gate follows
  type: 'findings' | 'artifact'; // review of analysis output vs created artifact
}

export interface PlanSettings {
  status: PlanStatus;
  sections: PlanSection[];
  reviewSteps?: ReviewStep[];  // interleaved between sections
  approvedBy?: string;
  approvedAt?: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  conversationId: string;
  createdAt: Date;
  settings: ChartSettings | TextSettings | OrgChartSettings | PlanSettings | Record<string, unknown>; // Extensible for other artifact types
  content?: string; // For text artifacts
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
  pie: 'chart-pie-simple',
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

export const toneLabels: Record<ToneType, string> = {
  professional: 'Professional',
  casual: 'Casual',
  formal: 'Formal',
  friendly: 'Friendly',
};

export const lengthLabels: Record<LengthType, string> = {
  brief: 'Brief',
  standard: 'Standard',
  detailed: 'Detailed',
};

export const formatLabels: Record<FormatType, string> = {
  paragraph: 'Paragraph',
  bullets: 'Bullets',
  numbered: 'Numbered',
};

export const layoutLabels: Record<LayoutType, string> = {
  'top-down': 'Top-Down',
  'left-right': 'Left-Right',
};

export const departmentFilterLabels: Record<DepartmentFilterType, string> = {
  all: 'All Departments',
  technology: 'Technology',
  product: 'Product',
  operations: 'Operations',
  finance: 'Finance',
  marketing: 'Marketing',
  'human resources': 'Human Resources',
  executive: 'Executive',
};

export const planStatusLabels: Record<PlanStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
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
    id: 'artifact-plan-1',
    type: 'plan',
    title: 'Backfill Plan: Senior Software Engineer (Tony Ramirez)',
    conversationId: '20',
    createdAt: new Date('2026-01-25T09:00:00'),
    settings: {
      status: 'proposed',
      sections: [
        {
          id: 'section-1',
          title: 'Impact & Risk Assessment',
          description: 'Analyze the organizational impact of Tony\'s departure and identify immediate risks to the Technology team.',
          actionItems: [
            {
              id: 'ai-1',
              description: 'Analyze org impact of Tony Ramirez\'s departure on team structure and span of control',
              status: 'planned',
              toolCall: 'analyze_org_impact',
              toolParams: { scenario: 'departure', employeeId: 15, department: 'Technology' },
            },
            {
              id: 'ai-2',
              description: 'Identify flight risks among Uma Patel\'s remaining direct reports',
              status: 'planned',
              toolCall: 'identify_flight_risks',
              toolParams: { team: 'Uma Patel direct reports', department: 'Technology' },
            },
            {
              id: 'ai-3',
              description: 'Run compensation analysis for Technology team — flag anyone below midpoint',
              status: 'planned',
              toolCall: 'analyze_compensation',
              toolParams: { department: 'Technology', benchmark: true },
            },
          ],
        },
        {
          id: 'section-2',
          title: 'Internal Candidate Evaluation',
          description: 'Assess internal candidates for promotion into the Senior Software Engineer role. Daniel Kim and Rachel Green are succession candidates.',
          actionItems: [
            {
              id: 'ai-4',
              description: 'Score promotion readiness for Daniel Kim and Rachel Green',
              status: 'planned',
              toolCall: 'assess_promotion_readiness',
              toolParams: { candidates: ['Daniel Kim', 'Rachel Green'], targetRole: 'Senior Software Engineer' },
            },
            {
              id: 'ai-5',
              description: 'Model org impact of promoting Daniel Kim to Senior Software Engineer',
              status: 'planned',
              toolCall: 'analyze_org_impact',
              toolParams: { scenario: 'promotion', employeeName: 'Daniel Kim', targetRole: 'Senior Software Engineer' },
            },
            {
              id: 'ai-6',
              description: 'Draft development plan for top internal candidate based on skill gaps',
              status: 'planned',
              toolCall: 'draft_development_plan',
              toolParams: { employeeName: 'Daniel Kim', targetRole: 'Senior Software Engineer' },
            },
          ],
        },
        {
          id: 'section-3',
          title: 'External Hiring Pipeline',
          description: 'Launch external hiring track in parallel — post the role and engage the Technology talent pool.',
          actionItems: [
            {
              id: 'ai-8',
              description: 'Screen Technology talent pool for candidates matching role requirements',
              status: 'planned',
              toolCall: 'screen_talent_pool',
              toolParams: { pool: 'Technology', requirements: { skills: ['React', 'TypeScript', 'Node.js'], minExperience: 5 } },
            },
            {
              id: 'ai-7',
              description: 'Create job posting for Senior Software Engineer using role data and pay band',
              status: 'planned',
              toolCall: 'create_job_posting',
              toolParams: { template: 'Senior Software Engineer', department: 'Technology', salaryRange: 'from_pay_band' },
            },
            {
              id: 'ai-9',
              description: 'Draft personalized outreach to top-ranked external candidates',
              status: 'planned',
              toolCall: 'draft_candidate_outreach',
              toolParams: { candidates: 'top_ranked', role: 'Senior Software Engineer' },
            },
          ],
        },
        {
          id: 'section-4',
          title: 'Retention Actions',
          description: 'Address compensation gaps and retention risks surfaced in the analysis. Tony\'s below-market salary may signal broader team issues.',
          actionItems: [
            {
              id: 'ai-10',
              description: 'Draft compensation adjustment proposals for at-risk team members',
              status: 'planned',
              toolCall: 'propose_compensation_change',
              toolParams: { employees: 'flagged_below_midpoint', department: 'Technology', rationale: 'retention_risk' },
            },
            {
              id: 'ai-11',
              description: 'Generate workforce analytics report on Technology team health',
              status: 'planned',
              toolCall: 'generate_report',
              toolParams: { type: 'team_health', department: 'Technology', metrics: ['turnover', 'tenure', 'comp_ratio', 'flight_risk'] },
            },
          ],
        },
      ],
      reviewSteps: [
        // Section 1: after all analysis completes
        { id: 'rs-1', description: 'Review impact and risk findings before proceeding', reviewer: 'Uma Patel', status: 'planned', afterItem: 'ai-3', type: 'findings' },
        // Section 2: after analysis, then after draft
        { id: 'rs-2', description: 'Review internal candidate assessment results', reviewer: 'Uma Patel', status: 'planned', afterItem: 'ai-5', type: 'findings' },
        { id: 'rs-3', description: 'Review development plan before sharing with candidate', reviewer: 'Uma Patel', status: 'planned', afterItem: 'ai-6', type: 'artifact' },
        // Section 3: after screening, after job posting, after outreach
        { id: 'rs-4', description: 'Review talent pool screening results', reviewer: 'Uma Patel', status: 'planned', afterItem: 'ai-8', type: 'findings' },
        { id: 'rs-5', description: 'Approve job posting before publishing', reviewer: 'Shannon Rivera', status: 'planned', afterItem: 'ai-7', type: 'artifact' },
        { id: 'rs-6', description: 'Approve outreach messages before sending', reviewer: 'Uma Patel', status: 'planned', afterItem: 'ai-9', type: 'artifact' },
        // Section 4: after comp change proposal
        { id: 'rs-7', description: 'Approve compensation adjustments', reviewer: 'Uma Patel', status: 'planned', afterItem: 'ai-10', type: 'artifact' },
      ],
      approvedBy: undefined,
      approvedAt: undefined,
    } as PlanSettings,
    content: 'Tool-based backfill plan for Tony Ramirez\'s Senior Software Engineer role. 11 actions across 4 sections: impact analysis, internal candidate evaluation, external hiring pipeline, and retention actions. 7 review gates.',
  },
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
  {
    id: 'artifact-5',
    type: 'text',
    title: 'PTO Policy Summary',
    conversationId: '2', // Links to "PTO Policy Updates"
    createdAt: new Date('2026-01-11T11:30:00'),
    settings: {
      tone: 'professional',
      length: 'standard',
      format: 'paragraph',
    } as TextSettings,
    content: `Our company offers a comprehensive Paid Time Off (PTO) policy designed to support work-life balance. Full-time employees accrue 15 days of PTO annually during their first year, increasing to 20 days after three years of service. PTO can be used for vacation, personal matters, or illness.\n\nEmployees are encouraged to schedule time off in advance when possible, and all requests should be submitted through the HR portal. PTO accrues bi-weekly and rolls over up to 5 days into the following year. We also observe 10 company holidays throughout the year.\n\nFor questions about your PTO balance or to request time off, please contact the HR team or access your account through the employee portal.`,
  },
  {
    id: 'artifact-6',
    type: 'text',
    title: 'Welcome Message for New Hires',
    conversationId: '1', // Links to "Employee Onboarding"
    createdAt: new Date('2026-01-10T09:00:00'),
    settings: {
      tone: 'friendly',
      length: 'brief',
      format: 'paragraph',
    } as TextSettings,
    content: `Welcome to the team! We're thrilled to have you join us. Your first week will be packed with exciting introductions, training sessions, and getting to know your new colleagues.\n\nYou'll receive your equipment and access credentials on day one. Don't hesitate to ask questions—everyone here remembers being new and is happy to help. We're excited to see all the great things you'll accomplish!`,
  },
  {
    id: 'artifact-7',
    type: 'text',
    title: 'Performance Review Guidelines',
    conversationId: '4', // Links to "Performance Reviews"
    createdAt: new Date('2026-01-09T14:15:00'),
    settings: {
      tone: 'formal',
      length: 'detailed',
      format: 'numbered',
    } as TextSettings,
    content: `1. Review Period and Schedule\nPerformance reviews are conducted bi-annually in January and July. Managers will schedule 60-minute one-on-one meetings with each direct report to discuss performance, goals, and development opportunities.\n\n2. Evaluation Criteria\nEmployees are evaluated across five key competencies: job knowledge and skills, quality of work, productivity and efficiency, communication and collaboration, and initiative and innovation. Each area is rated on a scale from 1 (needs improvement) to 5 (exceptional).\n\n3. Self-Assessment Process\nEmployees are required to complete a self-assessment form at least one week before their scheduled review meeting. This form should include accomplishments, challenges faced, goals achieved, and professional development interests.\n\n4. Manager Preparation\nManagers should review the employee's self-assessment, gather feedback from colleagues and stakeholders, compile specific examples of performance (both strengths and areas for improvement), and prepare development recommendations.\n\n5. Review Discussion\nThe review meeting should be a two-way conversation. Begin by discussing accomplishments and strengths, then address areas for development constructively, and conclude by setting clear goals for the next review period and identifying growth opportunities.`,
  },
  {
    id: 'artifact-8',
    type: 'text',
    title: 'Remote Work Best Practices',
    conversationId: '3', // Links to "Benefits Overview"
    createdAt: new Date('2026-01-08T10:20:00'),
    settings: {
      tone: 'casual',
      length: 'standard',
      format: 'bullets',
    } as TextSettings,
    content: `• Set up a dedicated workspace with good lighting and minimal distractions\n• Stick to regular working hours and take breaks to avoid burnout\n• Use video for meetings when possible to maintain team connection\n• Over-communicate with your team since casual hallway chats don't happen remotely\n• Keep your calendar updated so teammates know when you're available\n• Use status indicators in Slack to show when you're focused, in meetings, or away\n• Schedule virtual coffee chats with colleagues to maintain relationships\n• Take advantage of flexible hours but be present for core team collaboration time\n• Set boundaries between work and personal life—close your laptop at end of day\n• Speak up if you're feeling isolated or need more team interaction`,
  },
  {
    id: 'artifact-9',
    type: 'org-chart',
    title: 'Technology Team Structure - Q1 2026',
    conversationId: '6', // Could link to a scenario planning conversation
    createdAt: new Date('2026-01-20T15:30:00'),
    settings: {
      rootEmployee: 'all',
      depth: 3,
      filter: 'all',
      layout: 'top-down',
      showPhotos: true,
      compact: false,
    } as OrgChartSettings,
  },
  {
    id: 'artifact-10',
    type: 'org-chart',
    title: 'Finance Team Expansion Scenario',
    content: 'Explored adding 3 Financial Analysts to Finance team, analyzed span of control and budget impact',
    conversationId: '7', // Could link to another conversation
    createdAt: new Date('2026-01-19T11:45:00'),
    settings: {
      rootEmployee: 'all',
      depth: 'all',
      filter: 'all',
      layout: 'top-down',
      showPhotos: true,
      compact: false,
      selectedEmployee: 6, // Frank Rodriguez - Finance Manager
      expandedEmployees: [100, 5, 6], // CEO -> VP Finance -> Frank Rodriguez (with his direct reports visible)
    } as OrgChartSettings,
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
