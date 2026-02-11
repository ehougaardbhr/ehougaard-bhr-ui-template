// Automations page mock data — matches v7 mockup design

export interface FindingPreview {
  severity: 'red' | 'amber';
  label: string;
  detail: string;
}

export interface PreviewRow {
  iconClass: string;
  text: string; // may contain HTML-like markup — rendered with dangerouslySetInnerHTML
}

export interface AutomationAlert {
  id: string;
  type: 'review' | 'approve' | 'paused';
  title: string;
  age: string;
  findings?: FindingPreview[];
  previewRows?: PreviewRow[];
  ctaLabel: string;
  ctaIcon?: string;
  planId: string;
}

export interface RunningAutomation {
  id: string;
  name: string;
  meta: string;
  status: 'working' | 'done';
  progress?: { current: number; total: number };
  lastUpdate: string;
  planId: string;
}

// --- Alert type config ---
// Colors use CSS custom properties for dark mode support.
// Accent colors (teal, purple, amber) are intentionally hardcoded as they
// remain vivid in both themes — only the light backgrounds adapt via vars.

export const alertTypeConfig: Record<AutomationAlert['type'], {
  color: string;
  colorVar: string;       // CSS class-friendly color reference
  bgLightClass: string;   // Tailwind bg class
  darkBgLightClass: string; // dark mode bg override
  icon: string;
  label: string;
}> = {
  review: {
    color: '#0891B2',
    colorVar: 'review',
    bgLightClass: 'bg-[#ECFEFF]',
    darkBgLightClass: 'dark:bg-[#164E63]',
    icon: 'fa-solid fa-eye',
    label: 'I have something to show you',
  },
  approve: {
    color: '#7C3AED',
    colorVar: 'approve',
    bgLightClass: 'bg-[#EDE9FE]',
    darkBgLightClass: 'dark:bg-[#3B1F6E]',
    icon: 'fa-solid fa-stamp',
    label: 'I need your approval',
  },
  paused: {
    color: '#D97706',
    colorVar: 'paused',
    bgLightClass: 'bg-[#FEF3C7]',
    darkBgLightClass: 'dark:bg-[#78350F]',
    icon: 'fa-solid fa-pause',
    label: 'Paused — waiting on you',
  },
};

// --- Mock data: "With Alerts" state ---

export const alertsData: AutomationAlert[] = [
  {
    id: 'alert-1',
    type: 'review',
    title: 'Q1 Hiring Pipeline Review',
    age: 'Waiting since Jan 17',
    findings: [
      { severity: 'red', label: 'Senior DevOps Engineer', detail: '— 0 qualified candidates in pipeline' },
      { severity: 'red', label: 'Product Manager, Growth', detail: '— 1 candidate, 45-day stale' },
      { severity: 'amber', label: '4 roles below market rate', detail: '— avg 12% under, may hurt conversion' },
    ],
    ctaLabel: 'Review Findings',
    planId: 'plan-pipeline-review',
  },
  {
    id: 'alert-2',
    type: 'approve',
    title: 'Onboarding — Feb New Hires',
    age: 'Proposed 2 days ago',
    previewRows: [
      { iconClass: 'fa-solid fa-list-check', text: '5-step plan: doc collection, IT setup, welcome kit, orientation, 30-day check-in' },
      { iconClass: 'fa-solid fa-users', text: '<strong>3 employees</strong> starting Feb 15 — Sarah Chen, Marcus Rivera, Aisha Patel' },
    ],
    ctaLabel: 'Approve',
    ctaIcon: 'fa-solid fa-check',
    planId: 'plan-onboarding',
  },
  {
    id: 'alert-3',
    type: 'paused',
    title: 'Comp Review — Engineering',
    age: 'Paused 3 days ago',
    previewRows: [
      { iconClass: 'fa-solid fa-circle-half-stroke', text: '<strong>6/8 steps done</strong> — paused for budget review' },
      { iconClass: 'fa-solid fa-arrow-trend-down', text: '<strong>7 employees</strong> below market rate identified so far' },
    ],
    ctaLabel: 'Resume',
    ctaIcon: 'fa-solid fa-play',
    planId: 'plan-comp-review',
  },
];

// --- Mock data: Running rows (alerts state — 5 rows) ---

export const runningRowsWithAlerts: RunningAutomation[] = [
  {
    id: 'run-1',
    name: 'Backfill — Tony Ramirez',
    meta: '3/5 · Screening candidates · 3 strong matches',
    status: 'working',
    progress: { current: 3, total: 5 },
    lastUpdate: '30m ago',
    planId: 'plan-backfill-mid',
  },
  {
    id: 'run-2',
    name: 'PTO Balance Audit',
    meta: '2/5 · Analyzing department patterns · 142 employees',
    status: 'working',
    progress: { current: 2, total: 5 },
    lastUpdate: '1h ago',
    planId: 'plan-pto-audit',
  },
  {
    id: 'run-3',
    name: 'Flight Risk — Marketing',
    meta: 'Continuous · 2 high risk, 5 moderate',
    status: 'done',
    lastUpdate: '2h ago',
    planId: 'plan-flight-risk',
  },
  {
    id: 'run-4',
    name: 'Succession Plan — VP Sales',
    meta: '1/4 · Identifying internal candidates',
    status: 'working',
    progress: { current: 1, total: 4 },
    lastUpdate: '3h ago',
    planId: 'plan-succession',
  },
  {
    id: 'run-5',
    name: 'Benefits Enrollment Prep',
    meta: '3/6 · Compiling plan options · 4 vendors contacted',
    status: 'working',
    progress: { current: 3, total: 6 },
    lastUpdate: '45m ago',
    planId: 'plan-benefits-enrollment',
  },
];

// --- Mock data: History (completed agent runs) ---

export interface CompletedAutomation {
  id: string;
  name: string;
  summary: string;
  completedAt: string;
  duration: string;
  deliverables: number;
  planId: string;
}

export const historyData: CompletedAutomation[] = [
  {
    id: 'hist-1',
    name: 'Backfill — Tony Ramirez',
    summary: 'Completed 3 deliverables: job requisition, candidate shortlist, interview schedule',
    completedAt: 'Jan 15, 2026',
    duration: 'Completed in 1 day',
    deliverables: 3,
    planId: 'plan-backfill-done',
  },
  {
    id: 'hist-2',
    name: 'Q4 Performance Review Prep',
    summary: 'Generated review packets for 28 employees across 4 departments',
    completedAt: 'Dec 18, 2025',
    duration: 'Completed in 3 days',
    deliverables: 2,
    planId: 'plan-backfill-done',
  },
  {
    id: 'hist-3',
    name: 'Holiday Schedule Coverage',
    summary: 'Mapped coverage gaps and created rotation schedule for Dec 20–Jan 2',
    completedAt: 'Dec 12, 2025',
    duration: 'Completed in 4 hours',
    deliverables: 1,
    planId: 'plan-backfill-done',
  },
  {
    id: 'hist-4',
    name: 'New Hire Orientation — Nov Cohort',
    summary: 'Onboarded 5 employees: doc collection, IT setup, welcome kits, orientation sessions',
    completedAt: 'Nov 22, 2025',
    duration: 'Completed in 5 days',
    deliverables: 2,
    planId: 'plan-backfill-done',
  },
  {
    id: 'hist-5',
    name: 'Engineering Headcount Analysis',
    summary: 'Analyzed team growth, span of control, and budget impact for 2026 planning',
    completedAt: 'Nov 8, 2025',
    duration: 'Completed in 2 days',
    deliverables: 3,
    planId: 'plan-backfill-done',
  },
];

// --- Mock data: Running rows (all-clear state — 6 rows, no alerts) ---

export const runningRowsAllClear: RunningAutomation[] = [
  {
    id: 'clear-1',
    name: 'Q1 Hiring Pipeline Review',
    meta: '5/7 · Generating recommendations',
    status: 'working',
    progress: { current: 5, total: 7 },
    lastUpdate: '10m ago',
    planId: 'plan-pipeline-review',
  },
  {
    id: 'clear-2',
    name: 'Backfill — Tony Ramirez',
    meta: '3/5 · Screening candidates · 3 strong matches',
    status: 'working',
    progress: { current: 3, total: 5 },
    lastUpdate: '30m ago',
    planId: 'plan-backfill-mid',
  },
  {
    id: 'clear-3',
    name: 'Onboarding — Feb New Hires',
    meta: '1/5 · Collecting documents from 3 employees',
    status: 'working',
    progress: { current: 1, total: 5 },
    lastUpdate: '15m ago',
    planId: 'plan-onboarding',
  },
  {
    id: 'clear-4',
    name: 'PTO Balance Audit',
    meta: '2/5 · Analyzing department patterns · 142 employees',
    status: 'working',
    progress: { current: 2, total: 5 },
    lastUpdate: '1h ago',
    planId: 'plan-pto-audit',
  },
  {
    id: 'clear-5',
    name: 'Flight Risk — Marketing',
    meta: 'Continuous · 2 high risk, 5 moderate',
    status: 'done',
    lastUpdate: '2h ago',
    planId: 'plan-flight-risk',
  },
  {
    id: 'clear-6',
    name: 'Comp Review — Engineering',
    meta: '7/8 · Drafting adjustment proposals',
    status: 'working',
    progress: { current: 7, total: 8 },
    lastUpdate: '20m ago',
    planId: 'plan-comp-review',
  },
];
