export interface JobOpening {
  id: number;
  title: string;
  location: string;
  candidatesCount: number;
  newCandidatesCount: number;
  hiringLead: string;
  createdOn: string;
  status: 'Open' | 'Draft';
  department?: string;
  salaryRange?: string;
  description?: string;
}

export const jobOpenings: JobOpening[] = [
  {
    id: 1,
    title: 'Medical Assistant',
    location: 'Northridge, CA',
    candidatesCount: 2,
    newCandidatesCount: 1,
    hiringLead: 'Kathryn Murphy',
    createdOn: '9/18/24',
    status: 'Open',
  },
  {
    id: 2,
    title: 'Web Designer',
    location: 'Northridge, CA',
    candidatesCount: 5,
    newCandidatesCount: 0,
    hiringLead: 'Brooklyn Simmons',
    createdOn: '6/21/24',
    status: 'Open',
  },
  {
    id: 3,
    title: 'President of Sales',
    location: 'Northridge, CA',
    candidatesCount: 9,
    newCandidatesCount: 0,
    hiringLead: 'Dianne Russell',
    createdOn: '7/18/25',
    status: 'Open',
  },
  {
    id: 4,
    title: 'Dog Trainer',
    location: 'Henderson, NV',
    candidatesCount: 22,
    newCandidatesCount: 8,
    hiringLead: 'Devon Lane',
    createdOn: '7/11/25',
    status: 'Open',
  },
  {
    id: 5,
    title: 'Marketing Coordinator',
    location: 'Sacramento, CA',
    candidatesCount: 0,
    newCandidatesCount: 0,
    hiringLead: 'Kristin Watson',
    createdOn: '10/28/24',
    status: 'Draft',
  },
  {
    id: 6,
    title: 'Nursing Assistant',
    location: 'Seattle, WA',
    candidatesCount: 2,
    newCandidatesCount: 0,
    hiringLead: 'Darlene Robertson',
    createdOn: '8/16/25',
    status: 'Draft',
  },
  {
    id: 7,
    title: 'Senior Software Engineer',
    location: 'Hercules, CA (Remote eligible)',
    candidatesCount: 5,
    newCandidatesCount: 3,
    hiringLead: 'Uma Patel',
    createdOn: '1/24/26',
    status: 'Open',
    department: 'Technology',
    salaryRange: '$130,000 - $170,000',
    description: 'Backfill for Tony Ramirez. Full-stack senior engineer to work on payment processing, API development, and platform infrastructure.',
  },
];
