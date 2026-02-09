import type { IconName } from '../components/Icon/Icon';

// ============================================================================
// Types
// ============================================================================

export type FindingStatus = 'done' | 'awaiting' | 'working' | 'upcoming';
export type SeverityLevel = 'high' | 'med' | 'low' | 'info' | 'neutral';
export type ReviewGateStatus = 'passed' | 'waiting' | 'future';
export type ArtifactContentType = 'chart' | 'report' | 'text' | 'job';

export interface SecondaryFinding {
  text: string; // HTML string with <strong> tags
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
  leadFinding: string; // HTML string
  secondaryFindings?: SecondaryFinding[];
  artifacts?: FindingArtifact[];
  upcomingItems?: UpcomingItem[];
  reviewGate?: ReviewGate;
  parallelGroupId?: string; // findings with same ID render side-by-side
}

export interface StandaloneReviewGate {
  id: string;
  afterParallelGroupId: string;
  status: ReviewGateStatus;
  label: string;
  sublabel: string;
}

// Artifact panel content types
export interface CompChartContent {
  kind: 'comp-chart';
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

export type ArtifactContent =
  | { id: string; title: string; meta: string; type: 'chart'; content: CompChartContent }
  | { id: string; title: string; meta: string; type: 'report'; content: OrgReportContent }
  | { id: string; title: string; meta: string; type: 'text'; content: DevPlanContent };

export interface PlanDetailData {
  id: string;
  title: string;
  status: 'running' | 'paused' | 'completed';
  statusLabel: string;
  startedAt: string;
  completedAt?: string;
  totalItems: number;
  completedItems: number;
  totalReviews: number;
  totalArtifacts: number;
  conversationId: string;
  findings: PlanDetailFinding[];
  standaloneGates?: StandaloneReviewGate[];
  artifactContents: Record<string, ArtifactContent>;
}

// ============================================================================
// Mock Data - Mid-Execution (Next-Day Check-In)
// ============================================================================

const planBackfillMid: PlanDetailData = {
  id: 'plan-backfill-mid',
  title: 'Backfill Plan for Tony Ramirez',
  status: 'paused',
  statusLabel: 'Waiting for review',
  startedAt: 'Started yesterday',
  totalItems: 9,
  completedItems: 3,
  totalReviews: 1,
  totalArtifacts: 3,
  conversationId: '20',
  findings: [
    // Finding 1: Done
    {
      id: 'finding-1',
      sectionTitle: 'Team Compensation & Retention Risk',
      status: 'done',
      timestamp: 'Yesterday, 10:23 AM',
      icon: 'check',
      leadFinding:
        '<strong>Daniel Kim is significantly underpaid and a high flight risk.</strong> 15% below midpoint ($118K vs $135K), no promotion in 2 years. Tony\'s departure creates an AWS cert gap and leaves 2 projects without a lead.',
      secondaryFindings: [
        {
          text: '<strong>Rachel Green — MEDIUM risk.</strong> $105K, 8% below midpoint, top performer, no comp adjustment in 14 months.',
          severity: 'med',
        },
        {
          text: '<strong>James Liu — LOW risk.</strong> Recently promoted, comp at midpoint.',
          severity: 'low',
        },
        {
          text: '<strong>Team compa-ratio: 0.87</strong> — below target range across the board.',
          severity: 'info',
        },
      ],
      artifacts: [
        { id: 'comp', icon: 'chart-bar', label: 'Compensation Analysis', type: 'chart' },
        { id: 'org', icon: 'sitemap', label: 'Org Impact Report', type: 'report' },
      ],
      reviewGate: {
        status: 'passed',
        reviewer: 'You',
        label: 'Reviewed by You',
        sublabel: 'Approved to proceed — Yesterday, 10:27 AM',
      },
    },
    // Finding 2: Awaiting
    {
      id: 'finding-2',
      sectionTitle: 'Internal Candidate Assessment',
      status: 'awaiting',
      timestamp: 'Analysis complete — Yesterday, 10:30 AM',
      icon: 'clock',
      leadFinding:
        '<strong>Daniel Kim scores 82/100 on promotion readiness — ready for Senior SE.</strong> Strong technical skills, exceeds expectations. Primary gap: mentorship experience. Development plan drafted.',
      secondaryFindings: [
        {
          text: '<strong>Rachel Green: 71/100</strong> — needs 6–12 months. Worth tracking for next cycle.',
          severity: 'med',
        },
        {
          text: '<strong>Promoting Daniel creates a secondary backfill</strong> at mid-level SE — lower risk, 3 talent pool candidates available.',
          severity: 'info',
        },
      ],
      artifacts: [
        {
          id: 'devplan',
          icon: 'file-lines',
          label: 'Daniel Kim — Development Plan',
          type: 'text',
        },
      ],
      reviewGate: {
        status: 'waiting',
        reviewer: 'Uma Patel',
        label: 'Waiting for Uma Patel\'s review',
        sublabel: 'Confirm internal candidate direction — sent yesterday',
        chatLink: true,
      },
    },
    // Finding 3: Upcoming
    {
      id: 'finding-3',
      sectionTitle: 'External Hiring Pipeline',
      status: 'upcoming',
      timestamp: 'Starts after review gate · 3 items',
      icon: 'arrow-right',
      leadFinding: '',
      upcomingItems: [
        { text: 'Create job posting for Senior Software Engineer ($125K–$155K)' },
        { text: 'Screen talent pool candidates against role requirements' },
        { text: 'Draft personalized outreach for top-ranked candidates' },
      ],
      reviewGate: {
        status: 'future',
        reviewer: 'You',
        label: 'You approve job posting and outreach before publishing',
        sublabel: '',
      },
    },
    // Finding 4: Upcoming
    {
      id: 'finding-4',
      sectionTitle: 'Retention & Compensation Adjustments',
      status: 'upcoming',
      timestamp: 'Final section · 2 items',
      icon: 'arrow-right',
      leadFinding: '',
      upcomingItems: [
        { text: 'Propose compensation adjustment for Daniel Kim (promotion)' },
        { text: 'Propose retention adjustment for Rachel Green' },
      ],
      reviewGate: {
        status: 'future',
        reviewer: 'Finance (VP)',
        label: 'Finance (VP) approves compensation changes',
        sublabel: '',
      },
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
          {
            name: 'Daniel Kim',
            salary: '$118K',
            fillPct: 62,
            markerPct: 71,
            color: '#DC2626',
          },
          {
            name: 'Rachel Green',
            salary: '$105K',
            fillPct: 55,
            markerPct: 60,
            color: '#D97706',
          },
          { name: 'James Liu', salary: '$128K', fillPct: 67, markerPct: 67, color: '#059669' },
        ],
        rows: [
          {
            name: 'Daniel Kim',
            salary: '$118,000',
            midpoint: '$135,000',
            compa: '0.87',
            compaColor: '#DC2626',
            risk: 'HIGH',
            riskBg: '#FEE2E2',
            riskColor: '#DC2626',
          },
          {
            name: 'Rachel Green',
            salary: '$105,000',
            midpoint: '$114,000',
            compa: '0.92',
            compaColor: '#D97706',
            risk: 'MED',
            riskBg: '#FEF3C7',
            riskColor: '#D97706',
          },
          {
            name: 'James Liu',
            salary: '$128,000',
            midpoint: '$128,000',
            compa: '1.00',
            compaColor: '#059669',
            risk: 'LOW',
            riskBg: '#D1FAE5',
            riskColor: '#059669',
          },
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
    devplan: {
      id: 'devplan',
      title: 'Daniel Kim — Development Plan',
      meta: 'Yesterday, 10:29 AM · Senior SE Track',
      type: 'text',
      content: {
        kind: 'dev-plan',
        readiness: 82,
        milestones: [
          {
            period: 'Month 1',
            description: 'Take over API Gateway lead. Shadow Uma on architecture reviews.',
          },
          { period: 'Month 2', description: 'Mentor junior engineer. Begin AWS cert prep.' },
          {
            period: 'Month 3',
            description: 'Lead cross-team review. Complete AWS Solutions Architect.',
          },
        ],
        compAdjustment:
          'Proposed: $118K → $138K (+17%). Compa-ratio 0.87 → 1.02. Within Senior SE band ($125K–$155K).',
      },
    },
  },
};

// ============================================================================
// Mock Data - Completed (Week-Later Retrospective)
// ============================================================================

const planBackfillDone: PlanDetailData = {
  id: 'plan-backfill-done',
  title: 'Backfill Plan for Tony Ramirez',
  status: 'completed',
  statusLabel: 'Completed',
  startedAt: 'Jan 14–15, 2026',
  completedAt: 'Completed in 2 days',
  totalItems: 9,
  completedItems: 9,
  totalReviews: 3,
  totalArtifacts: 5,
  conversationId: '20',
  findings: [
    // Finding 1: Done (same as mid)
    {
      id: 'finding-1',
      sectionTitle: 'Team Compensation & Retention Risk',
      status: 'done',
      timestamp: 'Jan 14, 10:23 AM',
      icon: 'check',
      leadFinding:
        '<strong>Daniel Kim is significantly underpaid and a high flight risk.</strong> 15% below midpoint ($118K vs $135K), no promotion in 2 years. Tony\'s departure creates AWS cert gap and 2 projects without a lead.',
      secondaryFindings: [
        {
          text: '<strong>Rachel Green — MEDIUM risk.</strong> $105K, 8% below midpoint, top performer.',
          severity: 'med',
        },
        { text: '<strong>James Liu — LOW risk.</strong> At midpoint, recently promoted.', severity: 'low' },
        { text: '<strong>Team compa-ratio: 0.87.</strong>', severity: 'info' },
      ],
      artifacts: [
        { id: 'comp2', icon: 'chart-bar', label: 'Compensation Analysis', type: 'chart' },
        { id: 'org2', icon: 'sitemap', label: 'Org Impact Report', type: 'report' },
      ],
      reviewGate: {
        status: 'passed',
        reviewer: 'You',
        label: 'Reviewed by You',
        sublabel: 'Approved to proceed — Jan 14, 10:27 AM',
      },
    },
    // Finding 2: Done (parallel group)
    {
      id: 'finding-2-parallel',
      sectionTitle: 'Internal Candidates',
      status: 'done',
      timestamp: 'Jan 14, 10:28 AM',
      icon: 'check',
      leadFinding:
        '<strong>Daniel Kim: 82/100 — ready for Senior SE.</strong> Gap: mentorship. Development plan drafted.',
      secondaryFindings: [
        {
          text: '<strong>Rachel Green: 71/100</strong> — 6–12 months out.',
          severity: 'med',
        },
        {
          text: '<strong>Secondary backfill</strong> at mid-level — 3 candidates available.',
          severity: 'info',
        },
      ],
      artifacts: [
        { id: 'devplan2', icon: 'file-lines', label: 'Development Plan', type: 'text' },
      ],
      parallelGroupId: 'parallel-1',
    },
    // Finding 3: Done (parallel group)
    {
      id: 'finding-3-parallel',
      sectionTitle: 'External Hiring Pipeline',
      status: 'done',
      timestamp: 'Jan 14, 10:28 AM',
      icon: 'check',
      leadFinding:
        '<strong>3 strong candidates identified.</strong> Sarah Chen (94/100), Marcus Johnson (88), Alex Rivera (85).',
      secondaryFindings: [
        {
          text: '<strong>Sarah Chen</strong> — 8 yrs, AWS certified, best match.',
          severity: 'low',
        },
        { text: '2 candidates below 80 threshold — not recommended.', severity: 'neutral' },
      ],
      artifacts: [
        { id: 'job', icon: 'briefcase', label: 'Job Posting', type: 'job' },
        { id: 'outreach', icon: 'envelope', label: 'Outreach (3)', type: 'text' },
      ],
      parallelGroupId: 'parallel-1',
    },
    // Finding 4: Done
    {
      id: 'finding-4',
      sectionTitle: 'Retention & Compensation Adjustments',
      status: 'done',
      timestamp: 'Jan 15, 9:15 AM',
      icon: 'check',
      leadFinding:
        '<strong>Two compensation proposals drafted and approved.</strong> Daniel Kim: $118K→$138K (+17%) on promotion. Rachel Green: $105K→$114K (+8.6%) retention adjustment.',
      secondaryFindings: [
        {
          text: '<strong>Combined budget impact: $29K/yr.</strong> Within department budget ($45K remaining).',
          severity: 'low',
        },
        {
          text: '<strong>Team compa-ratio improves to 0.96</strong> — within target range for the first time in 8 months.',
          severity: 'info',
        },
      ],
      reviewGate: {
        status: 'passed',
        reviewer: 'Sarah Mitchell (Finance VP)',
        label: 'Reviewed by Sarah Mitchell (Finance VP)',
        sublabel: 'Both adjustments approved, effective next pay period — Jan 15, 10:02 AM',
      },
    },
  ],
  standaloneGates: [
    {
      id: 'gate-parallel-1',
      afterParallelGroupId: 'parallel-1',
      status: 'passed',
      label: 'Reviewed by Uma Patel & You',
      sublabel:
        'Uma confirmed Daniel Kim promotion. You approved posting and outreach. — Jan 15, 9:14 AM',
    },
  ],
  artifactContents: {
    // Reuse same artifact content as mid-execution
    comp2: planBackfillMid.artifactContents.comp,
    org2: planBackfillMid.artifactContents.org,
    devplan2: planBackfillMid.artifactContents.devplan,
  },
};

// ============================================================================
// Export
// ============================================================================

export const planDetailDataMap: Record<string, PlanDetailData> = {
  'plan-backfill-mid': planBackfillMid,
  'plan-backfill-done': planBackfillDone,
};
