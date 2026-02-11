import type { IconName } from '../components/Icon/Icon';

// ============================================================================
// Types — New simplified plan model
// ============================================================================

export type ReviewGateStatus = 'passed' | 'waiting' | 'future';
export type ArtifactContentType = 'chart' | 'report' | 'text' | 'job';

export interface PlanActionItem {
  id: string;
  label: string;
  status: 'done' | 'working' | 'awaiting' | 'planned';
  timestamp?: string;
}

export interface PlanReviewGate {
  id: string;
  afterItemId: string;
  status: ReviewGateStatus;
  reviewer: string;
  label: string;
  sublabel?: string;
}

export interface DeliverableApproval {
  reviewer: string;
  status: 'approved' | 'waiting' | 'not_required';
}

export interface PlanDeliverable {
  id: string; // maps to artifactContents key
  icon: IconName;
  title: string;
  type: ArtifactContentType;
  approvals?: DeliverableApproval[];
}

// ============================================================================
// Types — Legacy findings model (used by pipeline review)
// ============================================================================

export type FindingStatus = 'done' | 'awaiting' | 'working' | 'upcoming';
export type SeverityLevel = 'high' | 'med' | 'low' | 'info' | 'neutral';

export interface SecondaryFinding {
  text: string;
  severity: SeverityLevel;
}

export interface FindingArtifact {
  id: string;
  icon: IconName;
  label: string;
  type: ArtifactContentType;
}

export interface ReviewGate {
  status: ReviewGateStatus;
  reviewer: string;
  label: string;
  sublabel: string;
  chatLink?: boolean;
}

export interface UpcomingItem {
  text: string;
}

export interface PlanDetailFinding {
  id: string;
  sectionTitle: string;
  status: FindingStatus;
  timestamp?: string;
  icon: IconName;
  leadFinding: string;
  secondaryFindings?: SecondaryFinding[];
  artifacts?: FindingArtifact[];
  upcomingItems?: UpcomingItem[];
  reviewGate?: ReviewGate;
  parallelGroupId?: string;
}

export interface StandaloneReviewGate {
  id: string;
  afterParallelGroupId: string;
  status: ReviewGateStatus;
  label: string;
  sublabel: string;
}

// ============================================================================
// Artifact panel content types
// ============================================================================

export interface CompChartContent {
  kind: 'comp-chart';
  chartTitle?: string;
  columnHeaders?: {
    name: string;
    col1: string;
    col2: string;
    col3: string;
    col4: string;
  };
  bars: Array<{
    name: string;
    salary: string;
    fillPct: number;
    markerPct: number;
    color: string;
  }>;
  rows: Array<{
    name: string;
    salary: string;
    midpoint: string;
    compa: string;
    compaColor: string;
    risk: string;
    riskBg: string;
    riskColor: string;
  }>;
}

export interface OrgReportContent {
  kind: 'org-report';
  html: string;
}

export interface DevPlanContent {
  kind: 'dev-plan';
  readiness: number;
  milestones: Array<{ period: string; description: string }>;
  compAdjustment?: string;
}

export interface JobReqContent {
  kind: 'job-req';
  html: string;
}

export type ArtifactContent =
  | { id: string; title: string; meta: string; type: 'chart'; content: CompChartContent }
  | { id: string; title: string; meta: string; type: 'report'; content: OrgReportContent }
  | { id: string; title: string; meta: string; type: 'text'; content: DevPlanContent }
  | { id: string; title: string; meta: string; type: 'job'; content: JobReqContent };

// ============================================================================
// Main data type
// ============================================================================

export interface PlanDetailData {
  id: string;
  title: string;
  subtitle?: string;
  status: 'running' | 'paused' | 'completed';
  statusLabel: string;
  startedAt: string;
  completedAt?: string;
  totalItems: number;
  completedItems: number;
  totalReviews: number;
  totalArtifacts: number;
  conversationId: string;
  // New simplified plan model
  actionItems?: PlanActionItem[];
  reviewGates?: PlanReviewGate[];
  deliverables?: PlanDeliverable[];
  // Legacy findings model
  findings?: PlanDetailFinding[];
  standaloneGates?: StandaloneReviewGate[];
  // Artifact panel content (shared by both models)
  artifactContents: Record<string, ArtifactContent>;
}

// ============================================================================
// Mock Data - Mid-Execution (Awaiting Approval on Job Req)
// ============================================================================

const planBackfillMid: PlanDetailData = {
  id: 'plan-backfill-mid',
  title: 'Backfill plan: Senior Software Engineer',
  subtitle: 'Tony Ramirez',
  status: 'paused',
  statusLabel: 'Waiting for approval',
  startedAt: 'Started yesterday',
  totalItems: 3,
  completedItems: 2,
  totalReviews: 1,
  totalArtifacts: 2,
  conversationId: '20',
  actionItems: [
    {
      id: 'item-1',
      label: 'Analyze role context & org impact',
      status: 'done',
      timestamp: 'Yesterday, 10:23 AM',
    },
    {
      id: 'item-2',
      label: 'Benchmark compensation for replacement',
      status: 'done',
      timestamp: 'Yesterday, 10:25 AM',
    },
    {
      id: 'item-3',
      label: 'Draft job requisition',
      status: 'awaiting',
      timestamp: 'Ready for review',
    },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-3',
      status: 'waiting',
      reviewer: 'Jessica Cordova',
      label: 'Approve job requisition before posting',
      sublabel: 'Review the draft and approve to publish',
    },
  ],
  deliverables: [
    { id: 'comp', icon: 'chart-bar', title: 'Compensation Analysis', type: 'chart' },
    { id: 'org', icon: 'sitemap', title: 'Org Impact Report', type: 'report' },
    {
      id: 'jobreq', icon: 'briefcase', title: 'Job Requisition Draft', type: 'job',
      approvals: [{ reviewer: 'Jessica Cordova', status: 'waiting' }],
    },
  ],
  artifactContents: {
    comp: {
      id: 'comp',
      title: 'Compensation Analysis',
      meta: 'Yesterday, 10:23 AM · Technology Department',
      type: 'chart',
      content: {
        kind: 'comp-chart',
        bars: [
          { name: 'Daniel Kim', salary: '$118K', fillPct: 62, markerPct: 71, color: '#DC2626' },
          { name: 'Rachel Green', salary: '$105K', fillPct: 55, markerPct: 60, color: '#D97706' },
          { name: 'James Liu', salary: '$128K', fillPct: 67, markerPct: 67, color: '#059669' },
        ],
        rows: [
          { name: 'Daniel Kim', salary: '$118,000', midpoint: '$135,000', compa: '0.87', compaColor: '#DC2626', risk: 'HIGH', riskBg: '#FEE2E2', riskColor: '#DC2626' },
          { name: 'Rachel Green', salary: '$105,000', midpoint: '$114,000', compa: '0.92', compaColor: '#D97706', risk: 'MED', riskBg: '#FEF3C7', riskColor: '#D97706' },
          { name: 'James Liu', salary: '$128,000', midpoint: '$128,000', compa: '1.00', compaColor: '#059669', risk: 'LOW', riskBg: '#D1FAE5', riskColor: '#059669' },
        ],
      },
    },
    org: {
      id: 'org',
      title: 'Org Impact Report',
      meta: 'Yesterday, 10:25 AM',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>Span of control:</strong> Uma Patel drops from 8→7 direct reports.</p>
          <p style="margin-bottom:14px;"><strong>Projects affected:</strong></p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:#F5F3F2;border-radius:8px;font-size:12px;"><strong>API Gateway v2</strong> — 65% complete, Tony is sole reviewer. Daniel Kim has most context.</div>
            <div style="padding:10px 14px;background:#F5F3F2;border-radius:8px;font-size:12px;"><strong>Mobile SDK</strong> — 30% complete, Tony owns architecture. Rachel Green is secondary.</div>
          </div>
          <p><strong>Knowledge gaps:</strong></p>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
            <span style="padding:4px 10px;background:#FEE2E2;color:#DC2626;border-radius:6px;font-size:11px;font-weight:600;">AWS Infrastructure</span>
            <span style="padding:4px 10px;background:#FEF3C7;color:#D97706;border-radius:6px;font-size:11px;font-weight:600;">API Architecture</span>
            <span style="padding:4px 10px;background:#FEF3C7;color:#D97706;border-radius:6px;font-size:11px;font-weight:600;">CI/CD Pipeline</span>
          </div>
        `,
      },
    },
    jobreq: {
      id: 'jobreq',
      title: 'Job Requisition — Senior Software Engineer',
      meta: 'Draft · Pending approval',
      type: 'job',
      content: {
        kind: 'job-req',
        html: `
          <div style="margin-bottom:16px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-neutral-weak);margin-bottom:4px;">Position</div>
            <div style="font-size:14px;font-weight:600;color:var(--text-neutral-x-strong);">Senior Software Engineer</div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-neutral-weak);margin-bottom:4px;">Department</div>
            <div style="font-size:13px;color:var(--text-neutral-strong);">Technology · Uma Patel's Team</div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-neutral-weak);margin-bottom:4px;">Compensation Band</div>
            <div style="font-size:13px;color:var(--text-neutral-strong);">$125,000 – $155,000 · Based on market benchmarking</div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-neutral-weak);margin-bottom:4px;">Key Requirements</div>
            <ul style="margin:6px 0 0 18px;font-size:13px;color:var(--text-neutral-strong);line-height:1.6;">
              <li>5+ years backend/full-stack experience</li>
              <li>AWS infrastructure (EC2, Lambda, RDS, CloudFormation)</li>
              <li>API architecture and microservices design</li>
              <li>CI/CD pipeline ownership</li>
              <li>Experience mentoring junior engineers</li>
            </ul>
          </div>
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-neutral-weak);margin-bottom:4px;">Context from AI Analysis</div>
            <div style="font-size:12px;color:var(--text-neutral-medium);line-height:1.6;padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;">
              Requirements derived from Tony Ramirez's responsibilities, team knowledge gaps (AWS Infrastructure, API Architecture, CI/CD Pipeline), and current project needs (API Gateway v2, Mobile SDK). Compensation band based on market data and team compa-ratio analysis.
            </div>
          </div>
        `,
      },
    },
  },
};

// ============================================================================
// Mock Data - Completed
// ============================================================================

const planBackfillDone: PlanDetailData = {
  id: 'plan-backfill-done',
  title: 'Backfill plan: Senior Software Engineer',
  subtitle: 'Tony Ramirez',
  status: 'completed',
  statusLabel: 'Completed',
  startedAt: 'Jan 14, 2026',
  completedAt: 'Completed in 1 day',
  totalItems: 3,
  completedItems: 3,
  totalReviews: 1,
  totalArtifacts: 3,
  conversationId: '20',
  actionItems: [
    {
      id: 'item-1',
      label: 'Analyze role context & org impact',
      status: 'done',
      timestamp: 'Jan 14, 10:23 AM',
    },
    {
      id: 'item-2',
      label: 'Benchmark compensation for replacement',
      status: 'done',
      timestamp: 'Jan 14, 10:25 AM',
    },
    {
      id: 'item-3',
      label: 'Draft job requisition',
      status: 'done',
      timestamp: 'Jan 14, 10:30 AM',
    },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-3',
      status: 'passed',
      reviewer: 'Jessica Cordova',
      label: 'Approved by Jessica Cordova',
      sublabel: 'Job requisition approved — Jan 14, 11:15 AM',
    },
  ],
  deliverables: [
    { id: 'comp', icon: 'chart-bar', title: 'Compensation Analysis', type: 'chart' },
    { id: 'org', icon: 'sitemap', title: 'Org Impact Report', type: 'report' },
    {
      id: 'jobreq', icon: 'briefcase', title: 'Job Requisition', type: 'job',
      approvals: [{ reviewer: 'Jessica Cordova', status: 'approved' }],
    },
  ],
  artifactContents: {
    comp: planBackfillMid.artifactContents.comp,
    org: planBackfillMid.artifactContents.org,
    jobreq: {
      ...planBackfillMid.artifactContents.jobreq,
      meta: 'Jan 14, 10:30 AM · Approved',
    },
  },
};

// ============================================================================
// Mock Data - Pipeline Review (Hiring Quarterly Check-In)
// ============================================================================

const planPipelineReview: PlanDetailData = {
  id: 'plan-pipeline-review',
  title: 'Q1 Hiring Pipeline Review',
  status: 'paused',
  statusLabel: 'Waiting for review',
  startedAt: 'Started yesterday',
  totalItems: 7,
  completedItems: 4,
  totalReviews: 2,
  totalArtifacts: 2,
  conversationId: '21',
  findings: [
    {
      id: 'finding-1',
      sectionTitle: 'Pipeline Health Analysis',
      status: 'done',
      timestamp: 'Yesterday, 9:15 AM',
      icon: 'chart-bar',
      leadFinding:
        '<strong>3 of 7 open positions are at risk of missing Q1 hiring targets.</strong> Marketing Coordinator has zero applicants after 2 weeks.',
      secondaryFindings: [
        { text: '<strong>President of Sales — HIGH risk.</strong> 60 days open, 9 candidates but stalled at reference check stage. No movement in 2 weeks.', severity: 'high' },
        { text: '<strong>Medical Assistant — MED risk.</strong> 45 days open, only 2 applicants. Low inbound interest.', severity: 'med' },
        { text: '<strong>Dog Trainer — on track.</strong> 22 candidates (8 new this week), healthy pipeline.', severity: 'low' },
        { text: '<strong>Web Designer — normal velocity.</strong> 5 candidates, 1 interviewed.', severity: 'info' },
      ],
      artifacts: [
        { id: 'pipeline-chart', icon: 'chart-bar', label: 'Pipeline Health Dashboard', type: 'chart' },
      ],
      reviewGate: {
        status: 'passed',
        reviewer: 'You',
        label: 'Reviewed by You',
        sublabel: 'Approved to proceed — Yesterday, 9:18 AM',
      },
    },
    {
      id: 'finding-2',
      sectionTitle: 'Talent Pool Screening',
      status: 'awaiting',
      timestamp: 'Analysis complete — Yesterday, 9:22 AM',
      icon: 'users',
      leadFinding:
        '<strong>Found 4 talent pool candidates matching open requirements — 2 strong fits for Marketing Coordinator.</strong> Adison Donin (3★ rating, content marketing background) and 1 other from Marketing pool match requirements well.',
      secondaryFindings: [
        { text: '<strong>Technology pool — 5 candidates available</strong> but already being evaluated for Senior SE backfill. No incremental matches for other reqs.', severity: 'med' },
        { text: '<strong>No talent pool matches for Medical Assistant or Nursing Assistant</strong> — specialized roles need job board sourcing.', severity: 'info' },
      ],
      artifacts: [
        { id: 'candidate-matches', icon: 'file-lines', label: 'Candidate Match Report', type: 'report' },
      ],
      reviewGate: {
        status: 'waiting',
        reviewer: 'You',
        label: 'Waiting for your review',
        sublabel: 'Approve outreach to matched candidates',
        chatLink: true,
      },
    },
    {
      id: 'finding-3',
      sectionTitle: 'Candidate Outreach & Prioritization',
      status: 'upcoming',
      timestamp: 'Starts after review gate · 3 items',
      icon: 'arrow-right',
      leadFinding: '',
      upcomingItems: [
        { text: 'Draft personalized outreach for approved Marketing pool candidates' },
        { text: 'Create hiring manager briefing packet for President of Sales (escalate stalled pipeline)' },
        { text: 'Update req priority rankings based on pipeline health' },
      ],
      reviewGate: {
        status: 'future',
        reviewer: 'You',
        label: 'You approve outreach messages before sending',
        sublabel: '',
      },
    },
  ],
  artifactContents: {
    'pipeline-chart': {
      id: 'pipeline-chart',
      title: 'Pipeline Health Dashboard',
      meta: 'Yesterday, 9:15 AM · 7 Open Requisitions',
      type: 'chart',
      content: {
        kind: 'comp-chart',
        chartTitle: 'Days Open vs 90-Day Target — All Open Requisitions',
        columnHeaders: { name: 'Position', col1: 'Days Open', col2: 'Candidates', col3: 'New/Wk', col4: 'Status' },
        bars: [
          { name: 'President of Sales', salary: '60 days', fillPct: 67, markerPct: 60, color: '#DC2626' },
          { name: 'Medical Assistant', salary: '45 days', fillPct: 50, markerPct: 45, color: '#D97706' },
          { name: 'Marketing Coordinator', salary: '14 days', fillPct: 16, markerPct: 0, color: '#D97706' },
          { name: 'Dog Trainer', salary: '28 days', fillPct: 31, markerPct: 58, color: '#059669' },
          { name: 'Web Designer', salary: '22 days', fillPct: 24, markerPct: 33, color: '#059669' },
        ],
        rows: [
          { name: 'President of Sales', salary: '60', midpoint: '9', compa: '0', compaColor: '#DC2626', risk: 'STALLED', riskBg: '#FEE2E2', riskColor: '#DC2626' },
          { name: 'Medical Assistant', salary: '45', midpoint: '2', compa: '0', compaColor: '#D97706', risk: 'SLOW', riskBg: '#FEF3C7', riskColor: '#D97706' },
          { name: 'Marketing Coordinator', salary: '14', midpoint: '0', compa: '0', compaColor: '#D97706', risk: 'NO APPS', riskBg: '#FEF3C7', riskColor: '#D97706' },
          { name: 'Dog Trainer', salary: '28', midpoint: '22', compa: '8', compaColor: '#059669', risk: 'HEALTHY', riskBg: '#D1FAE5', riskColor: '#059669' },
          { name: 'Web Designer', salary: '22', midpoint: '5', compa: '2', compaColor: '#059669', risk: 'NORMAL', riskBg: '#D1FAE5', riskColor: '#059669' },
        ],
      },
    },
    'candidate-matches': {
      id: 'candidate-matches',
      title: 'Candidate Match Report',
      meta: 'Yesterday, 9:22 AM · Screened 4 talent pools',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>Marketing Coordinator Matches (2 candidates)</strong></p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Adison Donin</strong> (3★ rating) — 4 years content marketing experience. Skills: SEO, social media, email campaigns. Currently open to new opportunities.
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Taylor Chen</strong> (2★ rating) — 2 years marketing coordinator experience. Skills: event planning, copywriting, analytics. Available immediately.
            </div>
          </div>
          <p style="margin-bottom:14px;"><strong>Technology Pool Status</strong></p>
          <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;margin-bottom:14px;">
            5 candidates in Technology pool are already being evaluated for Senior SE backfill. No additional matches for other open reqs.
          </div>
          <p style="margin-bottom:6px;"><strong>Recommendations:</strong></p>
          <ul style="margin-left:20px;font-size:12px;color:var(--text-neutral-medium);">
            <li style="margin-bottom:4px;">Prioritize outreach to Adison Donin — strongest fit for Marketing Coordinator role</li>
            <li style="margin-bottom:4px;">Expand sourcing for Medical Assistant and Nursing Assistant (no talent pool matches)</li>
            <li>Consider accelerating President of Sales search — stalled for 2 weeks with no new activity</li>
          </ul>
        `,
      },
    },
  },
};

// ============================================================================
// Mock Data - Onboarding (Proposed — Feb New Hires)
// ============================================================================

const planOnboarding: PlanDetailData = {
  id: 'plan-onboarding',
  title: 'Onboarding Plan — Feb New Hires',
  subtitle: 'Sarah Chen, Marcus Rivera, Aisha Patel',
  status: 'paused',
  statusLabel: 'Proposed — awaiting approval',
  startedAt: 'Created today',
  totalItems: 5,
  completedItems: 0,
  totalReviews: 1,
  totalArtifacts: 1,
  conversationId: '30',
  actionItems: [
    { id: 'item-1', label: 'Collect new hire documents (I-9, W-4, direct deposit)', status: 'planned' },
    { id: 'item-2', label: 'Provision IT accounts & equipment', status: 'planned' },
    { id: 'item-3', label: 'Prepare welcome kits & desk assignments', status: 'planned' },
    { id: 'item-4', label: 'Schedule orientation sessions (Feb 15–16)', status: 'planned' },
    { id: 'item-5', label: 'Set up 30-day check-in reminders for managers', status: 'planned' },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-3',
      status: 'future',
      reviewer: 'Grace Anderson',
      label: 'Approve onboarding plan before kickoff',
      sublabel: 'HR Director reviews scope and timeline',
    },
  ],
  deliverables: [
    {
      id: 'onboard-checklist',
      icon: 'clipboard-check',
      title: 'Onboarding Checklist',
      type: 'report',
      approvals: [{ reviewer: 'Grace Anderson', status: 'waiting' }],
    },
  ],
  artifactContents: {
    'onboard-checklist': {
      id: 'onboard-checklist',
      title: 'Onboarding Checklist — Feb 2026 Cohort',
      meta: 'Draft · 3 new hires · Start date Feb 15',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>New Hire Cohort — February 15, 2026</strong></p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Sarah Chen</strong> — Marketing Coordinator · Reports to Mia Turner · Remote
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Marcus Rivera</strong> — Software Engineer · Reports to Uma Patel · Hercules, CA
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Aisha Patel</strong> — Financial Analyst · Reports to Frank Rodriguez · Lindon, UT
            </div>
          </div>
          <p style="margin-bottom:6px;"><strong>Pre-arrival tasks (by Feb 12):</strong></p>
          <ul style="margin-left:20px;font-size:12px;color:var(--text-neutral-medium);line-height:1.8;">
            <li>I-9 verification, W-4, direct deposit forms</li>
            <li>Laptop provisioning & software licenses</li>
            <li>Badge access & building orientation</li>
            <li>Welcome kits shipped to remote employees</li>
          </ul>
          <p style="margin-top:14px;margin-bottom:6px;"><strong>Orientation schedule (Feb 15–16):</strong></p>
          <ul style="margin-left:20px;font-size:12px;color:var(--text-neutral-medium);line-height:1.8;">
            <li>Day 1 AM: Company overview, benefits enrollment, IT setup</li>
            <li>Day 1 PM: Department introductions, manager 1:1</li>
            <li>Day 2: Role-specific training & buddy assignment</li>
          </ul>
        `,
      },
    },
  },
};

// ============================================================================
// Mock Data - Comp Review (Paused for budget review)
// ============================================================================

const planCompReview: PlanDetailData = {
  id: 'plan-comp-review',
  title: 'Comp Review — Engineering',
  subtitle: '7 employees below market rate',
  status: 'paused',
  statusLabel: 'Paused for budget review',
  startedAt: 'Feb 3, 2026',
  totalItems: 8,
  completedItems: 6,
  totalReviews: 1,
  totalArtifacts: 2,
  conversationId: '31',
  actionItems: [
    { id: 'item-1', label: 'Pull current compensation data for Engineering', status: 'done', timestamp: 'Feb 3, 2:15 PM' },
    { id: 'item-2', label: 'Benchmark against market data (Radford, Levels.fyi)', status: 'done', timestamp: 'Feb 3, 2:18 PM' },
    { id: 'item-3', label: 'Identify employees below 90% compa-ratio', status: 'done', timestamp: 'Feb 3, 2:22 PM' },
    { id: 'item-4', label: 'Calculate adjustment recommendations per employee', status: 'done', timestamp: 'Feb 3, 2:25 PM' },
    { id: 'item-5', label: 'Generate comp analysis chart & summary report', status: 'done', timestamp: 'Feb 3, 2:28 PM' },
    { id: 'item-6', label: 'Flag high flight-risk employees for priority adjustment', status: 'done', timestamp: 'Feb 3, 2:30 PM' },
    { id: 'item-7', label: 'Draft budget impact memo for Finance', status: 'awaiting', timestamp: 'Paused — pending budget approval' },
    { id: 'item-8', label: 'Prepare manager talking points for adjustments', status: 'planned' },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-7',
      status: 'waiting',
      reviewer: 'Emma Wilson',
      label: 'Approve compensation budget increase',
      sublabel: 'CFO reviews $47K total adjustment impact',
    },
  ],
  deliverables: [
    { id: 'eng-comp-chart', icon: 'chart-bar', title: 'Engineering Comp Analysis', type: 'chart' },
    {
      id: 'comp-summary',
      icon: 'file-lines',
      title: 'Budget Impact Summary',
      type: 'report',
      approvals: [{ reviewer: 'Emma Wilson', status: 'waiting' }],
    },
  ],
  artifactContents: {
    'eng-comp-chart': {
      id: 'eng-comp-chart',
      title: 'Engineering Compensation Analysis',
      meta: 'Feb 3, 2:28 PM · Technology Department',
      type: 'chart',
      content: {
        kind: 'comp-chart',
        bars: [
          { name: 'Daniel Kim', salary: '$118K', fillPct: 62, markerPct: 71, color: '#DC2626' },
          { name: 'Rachel Green', salary: '$105K', fillPct: 55, markerPct: 60, color: '#DC2626' },
          { name: 'Chris Martinez', salary: '$112K', fillPct: 59, markerPct: 65, color: '#D97706' },
          { name: 'Isabella Garcia', salary: '$95K', fillPct: 50, markerPct: 58, color: '#DC2626' },
          { name: 'Samuel Wright', salary: '$122K', fillPct: 64, markerPct: 67, color: '#D97706' },
          { name: 'Jack Bennett', salary: '$98K', fillPct: 51, markerPct: 60, color: '#DC2626' },
          { name: 'Amanda Wilson', salary: '$108K', fillPct: 57, markerPct: 62, color: '#D97706' },
        ],
        rows: [
          { name: 'Daniel Kim', salary: '$118,000', midpoint: '$135,000', compa: '0.87', compaColor: '#DC2626', risk: 'HIGH', riskBg: '#FEE2E2', riskColor: '#DC2626' },
          { name: 'Rachel Green', salary: '$105,000', midpoint: '$114,000', compa: '0.92', compaColor: '#D97706', risk: 'MED', riskBg: '#FEF3C7', riskColor: '#D97706' },
          { name: 'Chris Martinez', salary: '$112,000', midpoint: '$128,000', compa: '0.88', compaColor: '#DC2626', risk: 'HIGH', riskBg: '#FEE2E2', riskColor: '#DC2626' },
          { name: 'Isabella Garcia', salary: '$95,000', midpoint: '$110,000', compa: '0.86', compaColor: '#DC2626', risk: 'HIGH', riskBg: '#FEE2E2', riskColor: '#DC2626' },
          { name: 'Samuel Wright', salary: '$122,000', midpoint: '$135,000', compa: '0.90', compaColor: '#D97706', risk: 'MED', riskBg: '#FEF3C7', riskColor: '#D97706' },
          { name: 'Jack Bennett', salary: '$98,000', midpoint: '$114,000', compa: '0.86', compaColor: '#DC2626', risk: 'HIGH', riskBg: '#FEE2E2', riskColor: '#DC2626' },
          { name: 'Amanda Wilson', salary: '$108,000', midpoint: '$122,000', compa: '0.89', compaColor: '#DC2626', risk: 'MED', riskBg: '#FEF3C7', riskColor: '#D97706' },
        ],
      },
    },
    'comp-summary': {
      id: 'comp-summary',
      title: 'Budget Impact Summary',
      meta: 'Feb 3, 2:30 PM · Pending CFO review',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>Compensation Adjustment Recommendations — Engineering</strong></p>
          <p style="margin-bottom:14px;font-size:12px;color:var(--text-neutral-medium);">7 of 14 engineering employees are below 90% compa-ratio. Total recommended adjustment: <strong style="color:var(--text-neutral-x-strong);">$47,200/year</strong> (3.2% of department payroll).</p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:#FEE2E2;border-radius:8px;font-size:12px;">
              <strong>Priority 1 — High flight risk (3 employees):</strong> Daniel Kim (+$8K), Isabella Garcia (+$9K), Jack Bennett (+$7K). Combined: $24K. These employees have received competing offers or shown disengagement signals.
            </div>
            <div style="padding:10px 14px;background:#FEF3C7;border-radius:8px;font-size:12px;">
              <strong>Priority 2 — Below market (4 employees):</strong> Rachel Green (+$5K), Chris Martinez (+$7K), Samuel Wright (+$5.2K), Amanda Wilson (+$6K). Combined: $23.2K.
            </div>
          </div>
          <p style="margin-bottom:6px;"><strong>Recommendation:</strong></p>
          <p style="font-size:12px;color:var(--text-neutral-medium);">Implement Priority 1 adjustments immediately (mid-cycle) to mitigate retention risk. Schedule Priority 2 for Q2 merit cycle to spread budget impact.</p>
        `,
      },
    },
  },
};

// ============================================================================
// Mock Data - PTO Balance Audit (Running)
// ============================================================================

const planPtoAudit: PlanDetailData = {
  id: 'plan-pto-audit',
  title: 'PTO Balance Audit',
  subtitle: '142 employees · All departments',
  status: 'running',
  statusLabel: 'Running',
  startedAt: 'Started 2 hours ago',
  totalItems: 5,
  completedItems: 2,
  totalReviews: 1,
  totalArtifacts: 1,
  conversationId: '32',
  actionItems: [
    { id: 'item-1', label: 'Pull PTO balances & accrual data for all active employees', status: 'done', timestamp: 'Today, 9:05 AM' },
    { id: 'item-2', label: 'Flag employees with balances exceeding policy caps', status: 'done', timestamp: 'Today, 9:12 AM' },
    { id: 'item-3', label: 'Analyze department-level PTO usage patterns', status: 'working' },
    { id: 'item-4', label: 'Identify employees with zero PTO usage in 6+ months', status: 'planned' },
    { id: 'item-5', label: 'Generate audit report with manager recommendations', status: 'planned' },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-5',
      status: 'future',
      reviewer: 'Grace Anderson',
      label: 'Approve sending PTO reminders to managers',
      sublabel: 'HR Director reviews before notifications go out',
    },
  ],
  deliverables: [
    { id: 'pto-report', icon: 'calendar', title: 'PTO Audit Report', type: 'report' },
  ],
  artifactContents: {
    'pto-report': {
      id: 'pto-report',
      title: 'PTO Audit Report',
      meta: 'In progress · 142 employees analyzed',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>PTO Balance Audit — Preliminary Findings</strong></p>
          <p style="margin-bottom:14px;font-size:12px;color:var(--text-neutral-medium);">Scanned 142 active employees across 6 departments. Analysis in progress — department patterns pending.</p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:#FEE2E2;border-radius:8px;font-size:12px;">
              <strong>8 employees exceed 200-hour cap.</strong> Highest: Tom Harrison (Operations) at 247 hours. Policy requires use-it-or-lose-it by fiscal year end.
            </div>
            <div style="padding:10px 14px;background:#FEF3C7;border-radius:8px;font-size:12px;">
              <strong>12 employees have taken zero PTO in 6+ months.</strong> Concentrated in Technology (5) and Operations (4). May indicate workload or culture concerns.
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Company average:</strong> 68% of accrued PTO used YTD. Finance leads at 82%; Technology trails at 51%.
            </div>
          </div>
          <p style="font-size:11px;color:var(--text-neutral-weak);font-style:italic;">Department-level breakdown pending. Report will update when analysis completes.</p>
        `,
      },
    },
  },
};

// ============================================================================
// Mock Data - Flight Risk Assessment (Running, continuous)
// ============================================================================

const planFlightRisk: PlanDetailData = {
  id: 'plan-flight-risk',
  title: 'Flight Risk Assessment — Marketing',
  subtitle: '2 high risk · 5 moderate',
  status: 'running',
  statusLabel: 'Running — monitoring active',
  startedAt: 'Started Jan 27, 2026',
  totalItems: 4,
  completedItems: 3,
  totalReviews: 1,
  totalArtifacts: 1,
  conversationId: '33',
  actionItems: [
    { id: 'item-1', label: 'Analyze engagement signals across Marketing team', status: 'done', timestamp: 'Jan 27, 3:40 PM' },
    { id: 'item-2', label: 'Cross-reference compensation, tenure, and performance data', status: 'done', timestamp: 'Jan 27, 3:45 PM' },
    { id: 'item-3', label: 'Generate risk assessment report with retention recommendations', status: 'done', timestamp: 'Jan 27, 3:52 PM' },
    { id: 'item-4', label: 'Monitor for new risk signals (ongoing)', status: 'working' },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-3',
      status: 'passed',
      reviewer: 'Liam Foster',
      label: 'Reviewed by Liam Foster',
      sublabel: 'VP Marketing acknowledged findings — Jan 28, 9:10 AM',
    },
  ],
  deliverables: [
    {
      id: 'risk-report',
      icon: 'shield',
      title: 'Flight Risk Assessment',
      type: 'report',
      approvals: [{ reviewer: 'Liam Foster', status: 'approved' }],
    },
  ],
  artifactContents: {
    'risk-report': {
      id: 'risk-report',
      title: 'Flight Risk Assessment — Marketing Department',
      meta: 'Jan 27, 3:52 PM · 12 employees analyzed',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>Marketing Team Flight Risk Summary</strong></p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:#FEE2E2;border-radius:8px;font-size:12px;">
              <strong style="color:#DC2626;">HIGH RISK</strong> — <strong>Alex Johnson</strong>, Content Marketing Specialist<br/>
              <span style="color:var(--text-neutral-medium);">Compa-ratio: 0.82 · No promotion in 3 years · Engagement survey score dropped 18pts. LinkedIn activity increased 3x in past month.</span>
            </div>
            <div style="padding:10px 14px;background:#FEE2E2;border-radius:8px;font-size:12px;">
              <strong style="color:#DC2626;">HIGH RISK</strong> — <strong>Jordan Lee</strong>, Digital Marketing Specialist<br/>
              <span style="color:var(--text-neutral-medium);">Compa-ratio: 0.85 · Declined last two optional projects · Manager 1:1 notes indicate dissatisfaction with growth path.</span>
            </div>
            <div style="padding:10px 14px;background:#FEF3C7;border-radius:8px;font-size:12px;">
              <strong style="color:#D97706;">MODERATE</strong> — <strong>Mia Turner</strong>, Marketing Manager<br/>
              <span style="color:var(--text-neutral-medium);">Compa-ratio: 0.91 · High performer but team of 2 is stretched thin. Risk increases if either direct report departs.</span>
            </div>
          </div>
          <p style="margin-bottom:6px;"><strong>Retention Recommendations:</strong></p>
          <ul style="margin-left:20px;font-size:12px;color:var(--text-neutral-medium);line-height:1.8;">
            <li>Immediate: Mid-cycle comp adjustment for Alex Johnson (+$8K to reach 0.90 compa)</li>
            <li>Short-term: Career pathing conversation with Jordan Lee — explore Senior role</li>
            <li>Strategic: Add headcount to Marketing to reduce burnout risk on Mia Turner's team</li>
          </ul>
        `,
      },
    },
  },
};

// ============================================================================
// Mock Data - Succession Plan (Running, early stage)
// ============================================================================

const planSuccession: PlanDetailData = {
  id: 'plan-succession',
  title: 'Succession Plan — VP Sales',
  subtitle: 'Identifying internal candidates',
  status: 'running',
  statusLabel: 'Running — early stage',
  startedAt: 'Started today',
  totalItems: 4,
  completedItems: 1,
  totalReviews: 1,
  totalArtifacts: 2,
  conversationId: '34',
  actionItems: [
    { id: 'item-1', label: 'Profile VP Sales role requirements & leadership competencies', status: 'done', timestamp: 'Today, 11:15 AM' },
    { id: 'item-2', label: 'Screen internal candidates by performance, tenure, and readiness', status: 'working' },
    { id: 'item-3', label: 'Build development plans for top 2–3 candidates', status: 'planned' },
    { id: 'item-4', label: 'Prepare succession brief for executive review', status: 'planned' },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-4',
      status: 'future',
      reviewer: 'Sarah Chen',
      label: 'CEO reviews succession candidates',
      sublabel: 'Final approval before development plans are shared with candidates',
    },
  ],
  deliverables: [
    { id: 'candidate-readiness', icon: 'user-tie', title: 'Candidate Readiness Profiles', type: 'text' },
    {
      id: 'succession-brief',
      icon: 'file-lines',
      title: 'Succession Planning Brief',
      type: 'report',
      approvals: [{ reviewer: 'Sarah Chen', status: 'waiting' }],
    },
  ],
  artifactContents: {
    'candidate-readiness': {
      id: 'candidate-readiness',
      title: 'Candidate Readiness — VP Sales Succession',
      meta: 'In progress · Screening internal candidates',
      type: 'text',
      content: {
        kind: 'dev-plan',
        readiness: 0,
        milestones: [
          { period: 'Phase 1 (Current)', description: 'Profiling role requirements and screening 4 potential candidates from Operations and cross-functional leadership.' },
          { period: 'Phase 2 (Next)', description: 'Deep-dive assessments on top candidates — 360 feedback, leadership simulations, and stakeholder interviews.' },
          { period: 'Phase 3', description: 'Individualized 12-month development plans with mentorship pairings and stretch assignments.' },
        ],
      },
    },
    'succession-brief': {
      id: 'succession-brief',
      title: 'Succession Planning Brief — VP Sales',
      meta: 'Pending · Will generate after candidate screening',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>VP Sales Succession — Screening in Progress</strong></p>
          <p style="margin-bottom:14px;font-size:12px;color:var(--text-neutral-medium);">Evaluating internal candidates for VP Sales succession. Current VP Noah Jackson to transition by Q4 2026.</p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Initial candidate pool (4):</strong> Screening against leadership competencies, sales acumen, cross-functional experience, and P&L ownership history.
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Role requirements:</strong> 10+ years sales leadership, enterprise deal experience, team of 15+, demonstrated ability to scale revenue operations.
            </div>
          </div>
          <p style="font-size:11px;color:var(--text-neutral-weak);font-style:italic;">Full brief will be generated after candidate screening completes.</p>
        `,
      },
    },
  },
};

// ============================================================================
// Mock Data - Benefits Enrollment Prep (Running)
// ============================================================================

const planBenefitsEnrollment: PlanDetailData = {
  id: 'plan-benefits-enrollment',
  title: 'Benefits Enrollment Prep',
  subtitle: 'Open enrollment · March 1–15',
  status: 'running',
  statusLabel: 'Running',
  startedAt: 'Feb 5, 2026',
  totalItems: 6,
  completedItems: 3,
  totalReviews: 1,
  totalArtifacts: 1,
  conversationId: '35',
  actionItems: [
    { id: 'item-1', label: 'Compile current plan options & renewal rates from carriers', status: 'done', timestamp: 'Feb 5, 1:30 PM' },
    { id: 'item-2', label: 'Analyze utilization data from prior plan year', status: 'done', timestamp: 'Feb 5, 1:45 PM' },
    { id: 'item-3', label: 'Draft vendor comparison matrix (4 vendors contacted)', status: 'done', timestamp: 'Feb 6, 10:20 AM' },
    { id: 'item-4', label: 'Model employee cost impact for proposed plan changes', status: 'working' },
    { id: 'item-5', label: 'Prepare employee communications & enrollment guide', status: 'planned' },
    { id: 'item-6', label: 'Configure enrollment portal & test submission flow', status: 'planned' },
  ],
  reviewGates: [
    {
      id: 'gate-1',
      afterItemId: 'item-5',
      status: 'future',
      reviewer: 'Emma Wilson',
      label: 'Approve benefits package before announcing to employees',
      sublabel: 'CFO reviews cost impact and plan selections',
    },
  ],
  deliverables: [
    {
      id: 'vendor-matrix',
      icon: 'clipboard-list',
      title: 'Vendor Comparison Matrix',
      type: 'report',
      approvals: [{ reviewer: 'Emma Wilson', status: 'waiting' }],
    },
  ],
  artifactContents: {
    'vendor-matrix': {
      id: 'vendor-matrix',
      title: 'Benefits Vendor Comparison — 2026 Plan Year',
      meta: 'Feb 6, 10:20 AM · 4 carriers evaluated',
      type: 'report',
      content: {
        kind: 'org-report',
        html: `
          <p style="margin-bottom:14px;"><strong>Vendor Comparison — Medical & Dental Plans</strong></p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Anthem Blue Cross (Current)</strong> — 6.2% premium increase. Network: 94% provider retention. Employee satisfaction: 4.1/5.
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Aetna</strong> — 3.8% premium increase. Broader network but higher deductibles. Would save $18K/yr company-wide.
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Cigna</strong> — 5.1% premium increase. Strong mental health coverage add-on. $4K/yr more than current.
            </div>
            <div style="padding:10px 14px;background:var(--surface-neutral-x-weak);border-radius:8px;font-size:12px;">
              <strong>Kaiser Permanente</strong> — 2.9% premium increase. HMO only — would disrupt 38% of employees currently on PPO plans.
            </div>
          </div>
          <p style="margin-bottom:6px;"><strong>Preliminary Recommendation:</strong></p>
          <p style="font-size:12px;color:var(--text-neutral-medium);">Stay with Anthem Blue Cross for medical (minimal disruption) but switch dental to Aetna (saves $6K/yr, comparable network). Add Cigna mental health rider as supplemental option.</p>
        `,
      },
    },
  },
};

// ============================================================================
// Export
// ============================================================================

export const planDetailDataMap: Record<string, PlanDetailData> = {
  'plan-backfill-mid': planBackfillMid,
  'plan-backfill-done': planBackfillDone,
  'plan-pipeline-review': planPipelineReview,
  'plan-onboarding': planOnboarding,
  'plan-comp-review': planCompReview,
  'plan-pto-audit': planPtoAudit,
  'plan-flight-risk': planFlightRisk,
  'plan-succession': planSuccession,
  'plan-benefits-enrollment': planBenefitsEnrollment,
};
