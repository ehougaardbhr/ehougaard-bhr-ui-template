export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  suggestions?: string[];
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export const defaultConversation: ChatConversation = {
  id: '1',
  title: 'Employee Onboarding',
  messages: [
    {
      id: '1',
      type: 'user',
      text: 'How can we make this better for you?',
    },
    {
      id: '2',
      type: 'ai',
      text: `Here are a few improvements I recommend:

1. Personalize the onboarding journey
2. Streamline administrative tasks
3. Strengthen human connection
4. Provide clear milestones and progress tracking`,
      suggestions: [
        'Set up employee welcome dashboard',
        'Assign onboarding buddies',
        'Add progress indicators',
      ],
    },
  ],
};

export const suggestionChips = [
  'Set up employee welcome dashboard',
  'Assign onboarding buddies',
  'Add progress indicators',
];

export const recentConversations: ChatConversation[] = [
  {
    id: '1',
    title: 'Employee Onboarding',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'How can we make this better for you?',
      },
      {
        id: '2',
        type: 'ai',
        text: `Here are a few improvements I recommend:

1. Personalize the onboarding journey
2. Streamline administrative tasks
3. Strengthen human connection
4. Provide clear milestones and progress tracking`,
        suggestions: [
          'Set up employee welcome dashboard',
          'Assign onboarding buddies',
          'Add progress indicators',
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'PTO Policy Updates',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'What are the latest PTO policy changes?',
      },
      {
        id: '2',
        type: 'ai',
        text: 'Here are the recent PTO policy updates for 2026:\n\n1. Unlimited PTO for employees with 3+ years tenure\n2. Minimum 2 weeks vacation required annually\n3. Rollover policy extended to 10 days',
      },
    ],
  },
  {
    id: '3',
    title: 'Benefits Enrollment',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'When does benefits enrollment start?',
      },
      {
        id: '2',
        type: 'ai',
        text: 'Benefits enrollment begins on January 15, 2026 and runs through January 31, 2026. You can review and update your health insurance, dental, vision, and 401(k) selections during this period.',
      },
    ],
  },
  {
    id: '4',
    title: 'Performance Reviews',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Help me prepare for performance reviews',
      },
      {
        id: '2',
        type: 'ai',
        text: 'Here are key steps to prepare for performance reviews:\n\n1. Review goal completion from last quarter\n2. Gather peer feedback\n3. Document key achievements\n4. Identify areas for growth',
      },
    ],
  },
  {
    id: '5',
    title: 'Review Upcoming Payroll Anomalies',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Show me any payroll anomalies for the upcoming pay period',
      },
      {
        id: '2',
        type: 'ai',
        text: 'I found 3 potential payroll anomalies:\n\n1. John Smith - Overtime exceeds 40 hours\n2. Sarah Johnson - Missing timesheet approval\n3. Mike Williams - Duplicate expense entry',
      },
    ],
  },
  {
    id: '6',
    title: 'Active marketing employees',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'List all active employees in the marketing department',
      },
      {
        id: '2',
        type: 'ai',
        text: 'There are 12 active employees in Marketing:\n\n1. Jess Cordova - Director\n2. Alex Chen - Senior Manager\n3. Taylor Swift - Content Lead\n... and 9 more',
      },
    ],
  },
  {
    id: '7',
    title: 'Sally Lee PTO balance',
    messages: [
      {
        id: '1',
        type: 'user',
        text: "What is Sally Lee's current PTO balance?",
      },
      {
        id: '2',
        type: 'ai',
        text: "Sally Lee's PTO balance:\n\n- Vacation: 12 days remaining\n- Sick leave: 5 days remaining\n- Personal: 2 days remaining\n\nTotal: 19 days available",
      },
    ],
  },
  {
    id: '8',
    title: 'Upcoming Certificates Expiration',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Which employee certifications are expiring soon?',
      },
      {
        id: '2',
        type: 'ai',
        text: '5 certifications expiring in the next 30 days:\n\n1. CPR Certification - 3 employees\n2. OSHA Safety - 2 employees\n3. First Aid - 4 employees',
      },
    ],
  },
  {
    id: '9',
    title: 'Benefit Plan Set Up',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Help me set up a new benefit plan',
      },
      {
        id: '2',
        type: 'ai',
        text: "I can help you set up a new benefit plan. Here's what we'll need:\n\n1. Plan type (Health, Dental, Vision, etc.)\n2. Eligibility criteria\n3. Coverage details\n4. Employer contribution percentage",
      },
    ],
  },
  {
    id: '10',
    title: 'Engineering department org chart',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Show me the engineering department org chart',
      },
      {
        id: '2',
        type: 'ai',
        text: 'Engineering Department Structure:\n\nVP of Engineering: David Kim\n├── Director of Frontend: Lisa Park\n├── Director of Backend: James Wilson\n└── Director of DevOps: Maria Garcia',
      },
    ],
  },
  {
    id: '11',
    title: 'Onboarding Maddy Matthews',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Start onboarding process for new hire Maddy Matthews',
      },
      {
        id: '2',
        type: 'ai',
        text: "I'll help you onboard Maddy Matthews. Here's the checklist:\n\n1. ☐ Send welcome email\n2. ☐ Set up workstation\n3. ☐ Schedule orientation\n4. ☐ Assign onboarding buddy",
      },
    ],
  },
  {
    id: '12',
    title: 'Offboarding departing employees',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Show me the offboarding checklist for departing employees',
      },
      {
        id: '2',
        type: 'ai',
        text: 'Standard Offboarding Checklist:\n\n1. Exit interview scheduled\n2. Equipment return\n3. Access revocation\n4. Final paycheck processing\n5. COBRA notification',
      },
    ],
  },
  {
    id: '13',
    title: 'Welcome email to Cesar Berhow',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Draft a welcome email for Cesar Berhow',
      },
      {
        id: '2',
        type: 'ai',
        text: "Here's a draft welcome email:\n\nSubject: Welcome to BambooHR, Cesar!\n\nDear Cesar,\n\nWe're thrilled to have you join our team! Your first day is Monday, and we've prepared everything for your arrival...",
      },
    ],
  },
  {
    id: '14',
    title: 'Remote work eligibility policies',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'What are our remote work eligibility policies?',
      },
      {
        id: '2',
        type: 'ai',
        text: 'Remote Work Eligibility:\n\n1. Minimum 6 months tenure\n2. Performance rating of 3+ \n3. Role suitable for remote work\n4. Manager approval required\n5. Reliable internet connection',
      },
    ],
  },
  {
    id: '15',
    title: 'Leave of absence inquiry',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'How do I request a leave of absence?',
      },
      {
        id: '2',
        type: 'ai',
        text: 'To request a leave of absence:\n\n1. Submit request 30 days in advance\n2. Include start and end dates\n3. Specify leave type (FMLA, personal, etc.)\n4. Get manager approval\n5. HR will confirm eligibility',
      },
    ],
  },
];
