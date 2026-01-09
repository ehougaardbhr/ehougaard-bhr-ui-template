export interface Insight {
  id: number;
  title: string;
  description: string;
  icon: 'document' | 'circle-info' | 'graduation-cap';
}

export interface RecentReport {
  id: number;
  name: string;
  owner: string;
  lastViewed: string;
  icon: 'chart' | 'users' | 'document';
}

export const insights: Insight[] = [
  {
    id: 1,
    title: 'Engineering Turnover Spike',
    description: 'Engineering department turnover is 23% higher this quarter than last.',
    icon: 'document',
  },
  {
    id: 2,
    title: 'Gender Pay Gap',
    description: '12% pay gap between male and female employees',
    icon: 'circle-info',
  },
  {
    id: 3,
    title: 'Training Completion Rates',
    description: 'Only 67% of employees have completed their trainings.',
    icon: 'graduation-cap',
  },
];

export const recentReports: RecentReport[] = [
  {
    id: 1,
    name: 'Age Profile',
    owner: 'BambooHR',
    lastViewed: '',
    icon: 'chart',
  },
  {
    id: 2,
    name: 'Birthdays',
    owner: 'BambooHR',
    lastViewed: '',
    icon: 'chart',
  },
  {
    id: 3,
    name: 'EEO Details',
    owner: 'BambooHR',
    lastViewed: '',
    icon: 'users',
  },
  {
    id: 4,
    name: 'EEO-1',
    owner: 'BambooHR',
    lastViewed: '',
    icon: 'users',
  },
];

export const suggestionQuestions = [
  'What are the key factors of turnover?',
  'Do an analysis of compensation equity',
  'How happy are employees?',
  'What important trends should be aware of?',
];
