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

export interface PlanDeliverable {
  id: string; // maps to artifactContents key
  icon: IconName;
  title: string;
  type: ArtifactContentType;
  status: 'ready' | 'pending';
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
    { id: 'comp', icon: 'chart-bar', title: 'Compensation Analysis', type: 'chart', status: 'ready' },
    { id: 'org', icon: 'sitemap', title: 'Org Impact Report', type: 'report', status: 'ready' },
    { id: 'jobreq', icon: 'briefcase', title: 'Job Requisition Draft', type: 'job', status: 'pending' },
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
    { id: 'comp', icon: 'chart-bar', title: 'Compensation Analysis', type: 'chart', status: 'ready' },
    { id: 'org', icon: 'sitemap', title: 'Org Impact Report', type: 'report', status: 'ready' },
    { id: 'jobreq', icon: 'briefcase', title: 'Job Requisition', type: 'job', status: 'ready' },
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
// Export
// ============================================================================

export const planDetailDataMap: Record<string, PlanDetailData> = {
  'plan-backfill-mid': planBackfillMid,
  'plan-backfill-done': planBackfillDone,
  'plan-pipeline-review': planPipelineReview,
};
