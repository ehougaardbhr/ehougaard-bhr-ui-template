import type { IconName } from '../components/Icon';

export interface SettingsNavItem {
  id: string;
  label: string;
  icon: IconName;
}

export interface SubTab {
  id: string;
  label: string;
}

export interface AddOn {
  id: string;
  title: string;
  subtitle?: string;
  employees?: string;
  icon: IconName;
}

export interface Upgrade {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
}

export interface TimeOffSidebarSection {
  id: string;
  label: string;
  icon: IconName;
  policies?: string[];
}

export interface TimeOffCategoryCard {
  id: string;
  title: string;
  subtitle?: string;
  icon: IconName;
  isAddNew?: boolean;
}

export interface TimeTrackingSidebarItem {
  id: string;
  label: string;
}

export interface TimeTrackingGroup {
  id: string;
  label: string;
  count: number;
}

export interface TimeTrackingEmployee {
  id: string;
  name: string;
  group: string;
  overtimeState: string;
  paySchedule: string;
}

export interface AccountInfo {
  companyName: string;
  accountNumber: string;
  url: string;
  owner: {
    name: string;
    avatar: string;
    role: string;
  };
}

export interface Subscription {
  plan: string;
  packageType: string;
  employees: number;
}

export const settingsNavItems: SettingsNavItem[] = [
  { id: 'account', label: 'Account', icon: 'wrench' },
  { id: 'access-levels', label: 'Access Levels', icon: 'lock' },
  { id: 'employee-fields', label: 'Employee Fields', icon: 'pen-to-square' },
  { id: 'approvals', label: 'Approvals', icon: 'thumbs-up' },
  { id: 'apps', label: 'Apps', icon: 'table-cells' },
  { id: 'ask-bamboohr', label: 'Ask BambooHR', icon: 'circle-question' },
  { id: 'benefits', label: 'Benefits', icon: 'heart' },
  { id: 'company-directory', label: 'Company Directory', icon: 'user-group' },
  { id: 'compensation', label: 'Compensation', icon: 'circle-dollar' },
  { id: 'core-values', label: 'Core Values', icon: 'heart' },
  { id: 'custom-fields', label: 'Custom Fields & Tables', icon: 'sliders' },
  { id: 'email-alerts', label: 'Email Alerts', icon: 'bell' },
  { id: 'employee-community', label: 'Employee Community', icon: 'user-group' },
  { id: 'employee-satisfaction', label: 'Employee Satisfaction', icon: 'face-smile' },
  { id: 'employee-wellbeing', label: 'Employee Wellbeing', icon: 'spa' },
  { id: 'global-employment', label: 'Global Employment', icon: 'location-dot' },
  { id: 'hiring', label: 'Hiring', icon: 'id-badge' },
  { id: 'holidays', label: 'Holidays', icon: 'calendar' },
  { id: 'logo-color', label: 'Logo & Color', icon: 'palette' },
  { id: 'offboarding', label: 'Offboarding', icon: 'door-open' },
  { id: 'onboarding', label: 'Onboarding', icon: 'door-closed' },
  { id: 'payroll', label: 'Payroll', icon: 'circle-dollar' },
  { id: 'performance', label: 'Performance', icon: 'chart-line' },
  { id: 'time-off', label: 'Time Off', icon: 'plane' },
  { id: 'time-tracking', label: 'Time Tracking', icon: 'clock' },
  { id: 'total-rewards', label: 'Total Rewards', icon: 'heart' },
  { id: 'training', label: 'Training', icon: 'graduation-cap' },
];

export const accountSubTabs: SubTab[] = [
  { id: 'account-info', label: 'Account Info' },
  { id: 'billing', label: 'Billing' },
  { id: 'aca-settings', label: 'ACA Settings' },
  { id: 'general-settings', label: 'General Settings' },
  { id: 'icalendar-feeds', label: 'iCalendar Feeds' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'import-hours', label: 'Import Hours' },
  { id: 'login-settings', label: 'Login Settings' },
  { id: 'api-app-access', label: 'API & App Access' },
  { id: 'company-ownership', label: 'Company Ownership' },
];

export const accountInfo: AccountInfo = {
  companyName: 'BambooHR User Testing',
  accountNumber: 'Account #91457',
  url: 'usabilitytesting.bamboohr.com',
  owner: {
    name: 'Janet Parker',
    avatar: 'https://i.pravatar.cc/300?img=47',
    role: 'Account Owner',
  },
};

export const subscription: Subscription = {
  plan: 'Pro',
  packageType: 'HR Package',
  employees: 129,
};

export const addOns: AddOn[] = [
  { id: 'payroll', title: 'Payroll', icon: 'circle-dollar' },
  { id: 'time-tracking', title: 'Time Tracking', employees: '23 Employees', icon: 'clock' },
];

export const jobPostings = {
  current: 4,
  max: 55,
};

export const fileStorage = {
  used: 0,
  total: 85,
  unit: 'GB',
};

export const upgrades: Upgrade[] = [
  {
    id: 'elite',
    title: 'Elite',
    subtitle: 'HR Package',
    icon: 'shield',
  },
  {
    id: 'benefits-admin',
    title: 'Benefits Administration',
    subtitle: 'Add-On',
    icon: 'heart',
  },
  {
    id: 'global-employment',
    title: 'Global Employment',
    subtitle: 'Powered by Remote',
    icon: 'location-dot',
  },
];

export const dataCenter = {
  location: 'Ohio',
};

export const timeOffSidebarSections: TimeOffSidebarSection[] = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  {
    id: 'bereavement',
    label: 'Bereavement',
    icon: 'clipboard',
    policies: ['Bereavement Manual Policy (0)', 'Bereavement Flexible Policy (89)'],
  },
  {
    id: 'comp-in-lieu-time',
    label: 'Comp/In Lieu Time',
    icon: 'clipboard',
    policies: ['Comp/In Lieu Time Manual Policy (0)', 'Comp/In Lieu Time Flexible Policy (89)'],
  },
  {
    id: 'covid-19-related-absence',
    label: 'COVID-19 Related Absence',
    icon: 'clipboard',
    policies: ['COVID-19 Related Absence Manual Policy (0)', 'COVID-19 Related Absence Flexible Policy (89)'],
  },
  {
    id: 'fmla',
    label: 'FMLA',
    icon: 'clipboard',
    policies: ['FMLA Manual Policy (0)', 'FMLA Flexible Policy (89)'],
  },
  {
    id: 'sick',
    label: 'Sick',
    icon: 'clipboard',
    policies: ['Sick Manual Policy (0)', 'Sick Flexible Policy (89)'],
  },
];

export const timeOffCategoryCards: TimeOffCategoryCard[] = [
  { id: 'vacation', title: 'Vacation', subtitle: '4 policies · 89 people', icon: 'plane' },
  { id: 'sick', title: 'Sick', subtitle: '3 policies · 89 people', icon: 'temperature-half' },
  { id: 'bereavement', title: 'Bereavement', subtitle: '2 policies · 89 people', icon: 'clipboard' },
  {
    id: 'covid-19-related-absence',
    title: 'COVID-19 Related Absence',
    subtitle: '2 policies · 89 people',
    icon: 'clipboard',
  },
  { id: 'comp-in-lieu-time', title: 'Comp/In Lieu Time', subtitle: '2 policies · 89 people', icon: 'clipboard' },
  { id: 'fmla', title: 'FMLA', subtitle: '2 policies · 89 people', icon: 'users' },
  { id: 'new-category', title: 'New Category', icon: 'circle-plus-lined', isAddNew: true },
];

export const timeTrackingSidebarItems: TimeTrackingSidebarItem[] = [
  { id: 'employees', label: 'Employees (56)' },
  { id: 'project-tracking', label: 'Project Tracking' },
  { id: 'meal-rest-breaks', label: 'Meal & Rest Breaks' },
  { id: 'shift-differentials', label: 'Shift Differentials' },
  { id: 'devices', label: 'Devices' },
];

export const timeTrackingGroups: TimeTrackingGroup[] = [
  { id: 'default', label: 'Default', count: 44 },
  { id: 'hourly-ut-employees', label: 'Hourly UT Employees', count: 12 },
];

export const timeTrackingEmployees: TimeTrackingEmployee[] = [
  { id: 'aaron-eckerly', name: 'Aaron Eckerly', group: 'Hourly UT Employees', overtimeState: 'Utah', paySchedule: 'Every other week' },
  { id: 'adam-hunter', name: 'Adam Hunter', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Twice a month' },
  { id: 'amy-granger', name: 'Amy Granger', group: 'Hourly UT Employees', overtimeState: 'Exempt', paySchedule: 'Every other week' },
  { id: 'andy-graves', name: 'Andy Graves', group: 'Hourly UT Employees', overtimeState: 'Exempt', paySchedule: 'Every other week' },
  { id: 'anthony-diaz', name: 'Anthony Diaz', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Twice a month' },
  { id: 'anthony-larsen', name: 'Anthony Larsen', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Twice a month' },
  { id: 'bob-jackson', name: 'Bob Jackson', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Twice a month' },
  { id: 'cameron-hill', name: 'Cameron Hill', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Twice a month' },
  { id: 'carly-seymour', name: 'Carly Seymour', group: 'Hourly UT Employees', overtimeState: 'Exempt', paySchedule: 'Every other week' },
  { id: 'chad-zurdette', name: 'Chad Zurdette', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Twice a month' },
  { id: 'charlotte-abbott', name: 'Charlotte Abbott', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Paper Co, Inc.' },
  { id: 'cheryl-barnet', name: 'Cheryl Barnet', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Paper Co, Inc.' },
  { id: 'clark-fuller', name: 'Clark Fuller', group: 'Default', overtimeState: 'Exempt', paySchedule: 'Twice a month' },
  { id: 'corey-ross', name: 'Corey Ross', group: 'Hourly UT Employees', overtimeState: 'Utah', paySchedule: 'Every other week' },
];
