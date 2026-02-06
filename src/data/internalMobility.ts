export interface SuccessionCandidate {
  employeeId: number;
  employeeName: string;
  currentTitle: string;
  targetTitle: string;
  readiness: 'ready_now' | 'ready_6mo' | 'ready_1yr' | 'ready_2yr';
  strengthAreas: string[];
  developmentAreas: string[];
  riskIfPromoted: string;
}

export interface RippleEffect {
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedRole: string;
  mitigation: string;
}

export const successionCandidates: SuccessionCandidate[] = [
  {
    employeeId: 110,
    employeeName: 'Daniel Kim',
    currentTitle: 'Software Engineer',
    targetTitle: 'Senior Software Engineer',
    readiness: 'ready_now',
    strengthAreas: ['Strong technical skills', 'Team collaboration', 'Mentors junior devs'],
    developmentAreas: ['System design experience', 'Cross-team leadership'],
    riskIfPromoted: 'Creates a backfill need at the mid-level; Chris Martinez could step up with mentoring',
  },
  {
    employeeId: 111,
    employeeName: 'Rachel Green',
    currentTitle: 'Software Engineer',
    targetTitle: 'Senior Software Engineer',
    readiness: 'ready_6mo',
    strengthAreas: ['Fast learner', 'Full-stack capabilities', 'Great code quality'],
    developmentAreas: ['Needs more project leadership experience', 'Could improve in system design'],
    riskIfPromoted: 'Currently owns key frontend architecture; needs knowledge transfer plan',
  },
];

export const rippleEffects: RippleEffect[] = [
  {
    description: 'If Daniel Kim is promoted to Senior, the team loses a mid-level engineer',
    severity: 'medium',
    affectedRole: 'Software Engineer II',
    mitigation: 'Chris Martinez (id: 112) can take on more responsibility; accelerate his development plan',
  },
  {
    description: 'Tony\'s departure leaves only 3 engineers on Uma\'s team (was 4)',
    severity: 'high',
    affectedRole: 'Senior Software Engineer',
    mitigation: 'Fast-track external hiring while evaluating internal promotion',
  },
  {
    description: 'Tony owned the payment processing integration \u2014 no backup currently',
    severity: 'high',
    affectedRole: 'Senior Software Engineer',
    mitigation: 'Daniel Kim has partial knowledge; schedule emergency knowledge capture sessions',
  },
];
