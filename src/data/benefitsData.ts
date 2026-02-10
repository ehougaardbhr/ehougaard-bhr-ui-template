export type ElectionCategory = 'incomplete' | 'needs-attention' | 'completed';

export interface BenefitsEmployee {
  id: number;
  name: string;
  title: string;
  avatar: string;
  status: string;
  statusVariant: 'default' | 'warning' | 'success';
  /** Determines which tab (Incomplete, Needs Attention, Completed) the employee appears in */
  electionCategory: ElectionCategory;
}

export const benefitsEmployees: BenefitsEmployee[] = [
  // INCOMPLETE - Haven't started or submitted (New hire, Open enrollment)
  {
    id: 1,
    name: 'Wallace French',
    title: 'Marketing Manager',
    avatar: 'https://i.pravatar.cc/300?img=4',
    status: 'Incomplete - New Hire Enrollment (1 day remaining)',
    statusVariant: 'warning',
    electionCategory: 'incomplete',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    title: 'Software Engineer',
    avatar: 'https://i.pravatar.cc/300?img=11',
    status: 'Not Started - Open Enrollment',
    statusVariant: 'warning',
    electionCategory: 'incomplete',
  },
  // NEEDS ATTENTION - Pending approval, Missing details
  {
    id: 3,
    name: 'Jeremy Dench',
    title: 'Design Lead',
    avatar: 'https://i.pravatar.cc/300?img=3',
    status: 'Pending Approval - New Hire Enrollment (1 day remaining)',
    statusVariant: 'warning',
    electionCategory: 'needs-attention',
  },
  {
    id: 4,
    name: 'Steff Grossman',
    title: 'Group Product Manager',
    avatar: 'https://i.pravatar.cc/300?img=1',
    status: 'Request - Qualifying Life Event (Today)',
    statusVariant: 'default',
    electionCategory: 'needs-attention',
  },
  {
    id: 5,
    name: 'Diana Reyes',
    title: 'HR Coordinator',
    avatar: 'https://i.pravatar.cc/300?img=9',
    status: 'Pending Approval - Open Enrollment',
    statusVariant: 'warning',
    electionCategory: 'needs-attention',
  },
  {
    id: 6,
    name: 'James Okonkwo',
    title: 'Sales Representative',
    avatar: 'https://i.pravatar.cc/300?img=12',
    status: 'Missing Details - Plan selection incomplete',
    statusVariant: 'warning',
    electionCategory: 'needs-attention',
  },
  // COMPLETED - Enrolled
  {
    id: 7,
    name: 'Arnold Cross',
    title: 'Senior Engineer',
    avatar: 'https://i.pravatar.cc/300?img=2',
    status: 'Enrolled in 8 Plans',
    statusVariant: 'success',
    electionCategory: 'completed',
  },
  {
    id: 8,
    name: 'Jenny Abbott',
    title: 'HR Specialist',
    avatar: 'https://i.pravatar.cc/300?img=5',
    status: 'Enrolled in 8 Plans',
    statusVariant: 'success',
    electionCategory: 'completed',
  },
  {
    id: 9,
    name: 'Samantha Montgomery',
    title: 'Finance Analyst',
    avatar: 'https://i.pravatar.cc/300?img=6',
    status: 'Enrolled in 8 Plans',
    statusVariant: 'success',
    electionCategory: 'completed',
  },
  {
    id: 10,
    name: 'Heinz Von Doofenshmirtz',
    title: 'Operations Coordinator',
    avatar: 'https://i.pravatar.cc/300?img=7',
    status: 'Enrolled in 8 Plans',
    statusVariant: 'success',
    electionCategory: 'completed',
  },
  {
    id: 11,
    name: 'Raphael Torres',
    title: 'Customer Success Manager',
    avatar: 'https://i.pravatar.cc/300?img=8',
    status: 'Enrolled in 8 Plans',
    statusVariant: 'success',
    electionCategory: 'completed',
  },
  {
    id: 12,
    name: 'Elena Vasquez',
    title: 'Product Designer',
    avatar: 'https://i.pravatar.cc/300?img=10',
    status: 'Enrolled in 6 Plans',
    statusVariant: 'success',
    electionCategory: 'completed',
  },
];

export interface BenefitPlan {
  id: string;
  name: string;
  endDate: string;
  eligibility: string;
  enrolledCount: number;
  notEnrolledCount: number;
}

export interface PlanCategory {
  id: string;
  name: string;
  icon: 'heart' | 'shield' | 'eye' | 'compass' | 'building' | 'circle-dollar' | 'wrench' | 'piggy-bank' | 'arrows-rotate' | 'star';
  plans: BenefitPlan[];
}

export const planCategories: PlanCategory[] = [
  {
    id: 'medical',
    name: 'Medical',
    icon: 'heart',
    plans: [
      { id: 'm1', name: 'Medical Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
      { id: 'm2', name: 'Medical Plan Name 2', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
      { id: 'm3', name: 'Medical Plan Name 3', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'dental',
    name: 'Dental',
    icon: 'shield',
    plans: [
      { id: 'd1', name: 'Dental Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'vision',
    name: 'Vision',
    icon: 'eye',
    plans: [
      { id: 'v1', name: 'Vision Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'supplemental',
    name: 'Supplemental',
    icon: 'compass',
    plans: [
      { id: 's1', name: 'Supplemental Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
      { id: 's2', name: 'Supplemental Plan Name 2', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
      { id: 's3', name: 'Supplemental Plan Name 3', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'hsa',
    name: 'HSA',
    icon: 'building',
    plans: [
      { id: 'h1', name: 'HSA Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'fsa',
    name: 'FSA',
    icon: 'circle-dollar',
    plans: [
      { id: 'f1', name: 'FSA Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'disability',
    name: 'Disability',
    icon: 'wrench',
    plans: [
      { id: 'dis1', name: 'Disability Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
      { id: 'dis2', name: 'Disability Plan Name 2', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
      { id: 'dis3', name: 'Disability Plan Name 3', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'retirement',
    name: 'Retirement',
    icon: 'piggy-bank',
    plans: [
      { id: 'r1', name: '401(k) Plan', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'reimbursement',
    name: 'Reimbursement',
    icon: 'arrows-rotate',
    plans: [
      { id: 're1', name: 'Reimbursement Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'life',
    name: 'Life',
    icon: 'heart',
    plans: [
      { id: 'l1', name: 'Life Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'star',
    plans: [
      { id: 'o1', name: 'Other Plan Name 1', endDate: '12/31/2024', eligibility: 'Full-Time', enrolledCount: 120, notEnrolledCount: 20 },
    ],
  },
];

export type CarrierStatusType = 'connected' | 'pending' | 'request' | 'not-eligible' | 'warning';

export interface Carrier {
  id: string;
  name: string;
  statusType: CarrierStatusType;
  warningText?: string; // e.g. "1 plan is missing details"
}

export const carriers: Carrier[] = [
  { id: 'aetna', name: 'Aetna', statusType: 'connected' },
  { id: 'aflac', name: 'Aflac', statusType: 'pending' },
  { id: 'delta-dental', name: 'Delta Dental', statusType: 'request' },
  { id: 'fidelity', name: 'Fidelity', statusType: 'not-eligible' },
  { id: 'guardian', name: 'Guardian', statusType: 'request' },
  { id: 'met-life', name: 'Met Life', statusType: 'not-eligible' },
  { id: 'united', name: 'United Healthcare', statusType: 'request' },
  { id: 'vista', name: 'Vista', statusType: 'warning', warningText: '1 plan is missing details' },
];

export const attentionItems = [
  {
    id: 'plans',
    icon: 'circle-question' as const,
    text: '6 plans missing required details based on updated settings.',
    link: 'Go to Plans',
  },
  {
    id: 'elections',
    icon: 'pen-to-square' as const,
    text: '6 elections need your approval',
    link: 'Go to Elections',
  },
  {
    id: 'changes',
    icon: 'pen' as const,
    text: '4 employees had information changes that affected their eligibility',
    link: 'Review Changes',
  },
];
