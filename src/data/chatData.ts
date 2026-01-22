export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  suggestions?: string[];
  artifactId?: string; // Reference to an artifact to display inline
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
    {
      id: '3',
      type: 'user',
      text: 'Can you show me our current headcount by department?',
    },
    {
      id: '4',
      type: 'ai',
      text: "Here's the current breakdown of employees across departments:",
      artifactId: 'artifact-1', // Links to "Headcount by Department" chart
    },
    {
      id: '5',
      type: 'user',
      text: 'Can you draft a welcome message for new hires?',
    },
    {
      id: '6',
      type: 'ai',
      text: "I've created a friendly welcome message for new hires:",
      artifactId: 'artifact-6', // Links to "Welcome Message for New Hires" text
      suggestions: [
        'Make it more formal',
        'Add onboarding timeline',
        'Include team introductions',
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
      {
        id: '3',
        type: 'user',
        text: 'Can you show me our current headcount by department?',
      },
      {
        id: '4',
        type: 'ai',
        text: "Here's the current breakdown of employees across departments:",
        artifactId: 'artifact-1', // Links to "Headcount by Department" chart
      },
      {
        id: '5',
        type: 'user',
        text: 'Can you draft a welcome message for new hires?',
      },
      {
        id: '6',
        type: 'ai',
        text: "I've created a friendly welcome message for new hires:",
        artifactId: 'artifact-6', // Links to "Welcome Message for New Hires" text
        suggestions: [
          'Make it more formal',
          'Add onboarding timeline',
          'Include team introductions',
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
      {
        id: '3',
        type: 'user',
        text: 'Can you write up a summary document of our PTO policy?',
      },
      {
        id: '4',
        type: 'ai',
        text: "I've created a comprehensive PTO policy summary:",
        artifactId: 'artifact-5', // Links to "PTO Policy Summary" text
      },
      {
        id: '5',
        type: 'user',
        text: 'Can you show me a chart of average salaries by location?',
      },
      {
        id: '6',
        type: 'ai',
        text: "Here's a breakdown of average salaries across our office locations:",
        artifactId: 'artifact-2', // Links to "Salary by Location" chart
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
      {
        id: '3',
        type: 'user',
        text: 'Can you create a guide for remote work best practices?',
      },
      {
        id: '4',
        type: 'ai',
        text: "I've put together a helpful guide on remote work best practices:",
        artifactId: 'artifact-8', // Links to "Remote Work Best Practices" text
        suggestions: [
          'Add equipment recommendations',
          'Include communication tips',
          'Suggest productivity tools',
        ],
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
      {
        id: '3',
        type: 'user',
        text: 'Can you create formal performance review guidelines for managers?',
      },
      {
        id: '4',
        type: 'ai',
        text: "I've created comprehensive performance review guidelines:",
        artifactId: 'artifact-7', // Links to "Performance Review Guidelines" text
        suggestions: [
          'Add rating scale details',
          'Include sample questions',
          'Create manager checklist',
        ],
      },
      {
        id: '5',
        type: 'user',
        text: 'Show me turnover rates by job level',
      },
      {
        id: '6',
        type: 'ai',
        text: "Here's the turnover breakdown by job level:",
        artifactId: 'artifact-3', // Links to "Turnover by Job Level" chart
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
    title: 'Technology Team Structure Q1 2026',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Can you show me the org chart for the Technology department? I want to understand our current structure for Q1 planning.',
      },
      {
        id: '2',
        type: 'ai',
        text: "Here's the Technology team org chart. You can explore the team structure, see reporting relationships, and use this for scenario planning:",
        artifactId: 'artifact-9', // Links to Technology org chart
        suggestions: [
          'What if we added 2 engineers to the team?',
          'Show me span of control for each manager',
          'Compare to industry benchmarks',
        ],
      },
    ],
  },
  {
    id: '7',
    title: 'Finance Team Expansion Planning',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'What if we hired 3 more people on the Finance team?',
      },
      {
        id: '2',
        type: 'ai',
        text: "I've analyzed the implications of adding 3 Financial Analysts to the Finance team reporting to Frank Rodriguez:\n\n**Impact Summary:**\n• Total Finance headcount: 6 → 9 (50% increase)\n• Frank's direct reports: 2 → 5\n• Span of control: Still manageable (within 5-7 range)\n• Department budget impact: ~$270K annually (assuming $90K avg)\n\n**Considerations:**\n• Frank may need support with people management\n• Could enable better workload distribution\n• Aligns with Q1 revenue growth targets\n• May need additional workspace/equipment\n\nHere's the updated org chart showing the 3 open positions:",
        artifactId: 'artifact-10', // Links to full company org chart with TBH cards
        suggestions: [
          'Show me span of control across all teams',
          "What's the ideal team size for Finance?",
          'Compare to industry benchmarks',
        ],
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
