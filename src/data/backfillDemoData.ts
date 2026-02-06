export interface DepartedEmployeeContext {
  employeeId: number;
  name: string;
  lastDay: string;
  noticeDate: string;
  exitInterviewNotes: string;
  projectOwnership: string[];
  criticalKnowledge: string[];
  teamImpact: string;
  compensationContext: string;
}

export const tonyRamirezContext: DepartedEmployeeContext = {
  employeeId: 200,
  name: 'Tony Ramirez',
  lastDay: '2026-02-07',
  noticeDate: '2026-01-24',
  exitInterviewNotes: 'Tony cited compensation as the primary factor. He received a 25% increase from a direct competitor. He expressed that he enjoyed the team and the work, but felt his compensation had not kept pace with market rates despite strong performance reviews. He also mentioned limited promotion path visibility.',
  projectOwnership: [
    'Payment processing integration (sole owner)',
    'API gateway modernization (co-lead with Daniel Kim)',
    'CI/CD pipeline optimization (completed, needs documentation)',
    'Customer data migration tooling',
  ],
  criticalKnowledge: [
    'Payment processing vendor relationships and SLAs',
    'Legacy billing system architecture',
    'Production deployment runbook for payment services',
    'Customer data compliance requirements (SOC2, PCI)',
  ],
  teamImpact: 'Tony was the most senior IC on Uma Patel\'s team. His departure reduces the team to 3 engineers and eliminates the only Senior-level IC. Daniel Kim is the next most experienced but at a mid-level title. The team\'s velocity will likely decrease 25-30% in the short term.',
  compensationContext: 'Tony\'s salary of $135,000 was at the 7th percentile of the Senior Software Engineer pay band ($130K-$170K, midpoint $145K). Market data shows the 50th percentile at $145,000. His compensation had not been adjusted in 14 months despite a performance rating of 4/5.',
};

export const backfillScenarios = {
  internal: {
    title: 'Internal Promotion',
    pros: [
      'Daniel Kim is ready now \u2014 strong performance, team familiarity',
      'Faster time-to-productivity (already knows codebase)',
      'Positive signal to team about growth opportunities',
      'Lower cost than external senior hire',
    ],
    cons: [
      'Creates backfill need at mid-level',
      'Daniel may need mentoring in senior-level responsibilities',
      'Team loses a strong mid-level contributor',
    ],
    estimatedTimeToFill: '2-3 weeks (promotion process)',
    estimatedCost: '$128K \u2192 $142K (11% raise to midpoint)',
  },
  external: {
    title: 'External Hire',
    pros: [
      'Brings fresh perspective and new skills',
      'No internal backfill cascade',
      'Can hire at exact seniority level needed',
    ],
    cons: [
      'Longer time-to-fill (4-8 weeks typical)',
      'Ramp-up period (3-6 months to full productivity)',
      'Higher salary expectation ($145K-$165K market rate)',
      'Risk of poor culture fit',
    ],
    estimatedTimeToFill: '4-8 weeks',
    estimatedCost: '$145K-$165K (market rate)',
  },
  hybrid: {
    title: 'Promote Internal + Backfill Junior',
    pros: [
      'Rewards Daniel\'s performance and readiness',
      'Junior backfill is easier and cheaper to find',
      'Strengthens team culture and retention',
    ],
    cons: [
      'Still need to hire, just at a different level',
      'Net team seniority decreases temporarily',
    ],
    estimatedTimeToFill: '2-3 weeks (promotion) + 3-5 weeks (junior hire)',
    estimatedCost: 'Daniel at $142K + new junior at $95K-$105K',
  },
};
