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

1. **Personalize the onboarding journey** - Tailor experiences to each new hire's role and background
2. **Streamline administrative tasks** - Reduce paperwork with automation and digital workflows
3. **Strengthen human connection** - Foster meaningful relationships from day one
4. **Provide clear milestones** - Track progress transparently with defined checkpoints`,
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
    id: '0',
    title: 'Markdown Check',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Show me all the markdown formatting features you support',
      },
      {
        id: '2',
        type: 'ai',
        text: `# Markdown Features Demo

I support a wide range of markdown formatting. Here's a comprehensive showcase:

## Text Formatting

- **Bold text** using double asterisks
- *Italic text* using single asterisks
- ***Bold and italic*** combined
- ~~Strikethrough text~~ using double tildes

## Headers

We support multiple heading levels:

### This is H3
#### This is H4
##### This is H5

## Lists

**Unordered list:**
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

**Ordered list:**
1. First step
2. Second step
3. Third step
4. Fourth step

## Task Lists

Here's a task checklist:

- [x] Completed task
- [x] Another completed task
- [ ] Pending task
- [ ] Another pending task

## Code

**Inline code:** Use \`const variable = "value"\` for inline code snippets.

**Code block:**

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);
\`\`\`

\`\`\`json
{
  "name": "BambooHR",
  "type": "HRIS",
  "features": ["onboarding", "PTO", "payroll"]
}
\`\`\`

## Blockquotes

> This is a blockquote. It's great for highlighting important information or quotes from other sources.
>
> *You can also use formatting inside blockquotes.*

## Tables

Here's a comparison table:

| Feature | Basic Plan | Pro Plan | Enterprise |
|---------|-----------|----------|------------|
| Users | Up to 10 | Up to 50 | Unlimited |
| Storage | 10 GB | 100 GB | 1 TB |
| Support | Email | Priority | 24/7 Dedicated |
| Price | $29/mo | $99/mo | Custom |

## Links

Visit [BambooHR](https://www.bamboohr.com) for more information.

You can also check out our [documentation](https://help.bamboohr.com) or [contact support](https://www.bamboohr.com/contact).

## Horizontal Rule

Use horizontal rules to separate sections:

---

## Mixed Content

Here's an example combining multiple features:

**Project Status Update:**

1. **Phase 1: Planning** ✅
   - [x] Requirements gathering
   - [x] Architecture design
   - [x] Team allocation

2. **Phase 2: Development** 🚧
   - [x] Backend API setup
   - [ ] Frontend implementation
   - [ ] Database migration

3. **Phase 3: Testing** ⏳
   - [ ] Unit tests
   - [ ] Integration tests
   - [ ] User acceptance testing

> 💡 **Pro tip:** Use markdown to make your messages more readable and organized!

For questions, contact the development team at \`dev-team@company.com\`.`,
      },
    ],
  },
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

1. **Personalize the onboarding journey** - Tailor experiences to each new hire's role and background
2. **Streamline administrative tasks** - Reduce paperwork with automation and digital workflows
3. **Strengthen human connection** - Foster meaningful relationships from day one
4. **Provide clear milestones** - Track progress transparently with defined checkpoints`,
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
        text: `## Recent PTO Policy Updates

Here are the key changes for **2026**:

- **Unlimited PTO** for employees with 3+ years tenure
- *Minimum 2 weeks* vacation required annually
- Rollover policy extended to **10 days**

You can view the full policy document [here](https://bamboohr.com/pto-policy).`,
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
        text: `### Performance Review Preparation

Here are the **key steps** to prepare:

1. **Review goal completion** from last quarter
2. **Gather peer feedback** and testimonials
3. **Document key achievements** with metrics
4. **Identify areas for growth** and development opportunities

> *Pro tip:* Use the STAR method (Situation, Task, Action, Result) when describing achievements.`,
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
        text: `I found **3 potential payroll anomalies** for the upcoming pay period:

| Employee | Issue | Status |
|----------|-------|--------|
| John Smith | Overtime exceeds 40 hours | ⚠️ Review needed |
| Sarah Johnson | Missing timesheet approval | ❌ Action required |
| Mike Williams | Duplicate expense entry | ⚠️ Review needed |

Please review these before processing payroll.`,
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
        text: "I've analyzed the implications of adding **3 Financial Analysts** to the Finance team reporting to **Frank Rodriguez**:\n\n### Impact Summary\n\n- **Total Finance headcount:** 6 → 9 (50% increase)\n- **Frank's direct reports:** 2 → 5\n- **Span of control:** Still manageable (within 5-7 range)\n- **Department budget impact:** ~$270K annually (assuming $90K avg)\n\n### Considerations\n\n- Frank may need support with people management\n- Could enable better workload distribution\n- Aligns with Q1 revenue growth targets\n- May need additional workspace/equipment\n\nHere's the updated org chart showing the 3 open positions:",
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
        text: `I'll help you onboard **Maddy Matthews**. Here's the checklist:

- [ ] Send welcome email
- [ ] Set up workstation
- [ ] Schedule orientation
- [ ] Assign onboarding buddy
- [ ] Create system accounts
- [ ] Order business cards

Use the command \`/onboarding start --employee="Maddy Matthews"\` to begin the automated process.`,
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
        text: `Here's a draft welcome email:

---

**Subject:** Welcome to BambooHR, Cesar! 🎉

Dear Cesar,

We're *thrilled* to have you join our team! Your first day is **Monday, February 3rd**, and we've prepared everything for your arrival.

**What to expect on Day 1:**
- 9:00 AM - Team meet & greet
- 10:30 AM - HR orientation
- 12:00 PM - Lunch with your manager
- 2:00 PM - Technology setup

Looking forward to seeing you soon!

Best regards,
*The BambooHR Team*`,
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
  {
    id: '16',
    title: 'Markdown Test',
    messages: [
      {
        id: '1',
        type: 'user',
        text: 'Show me all markdown formatting options',
      },
      {
        id: '2',
        type: 'ai',
        text: `# Markdown Formatting Guide

## Headers
This demonstrates different header levels.

### Level 3 Header
#### Level 4 Header
##### Level 5 Header
###### Level 6 Header

## Text Emphasis

**Bold text** shows strong emphasis.

*Italic text* adds subtle emphasis.

***Bold and italic*** combines both.

~~Strikethrough~~ marks deleted content.

## Lists

### Unordered List
- First item
- Second item
- Third item
  - Nested item A
  - Nested item B
- Fourth item

### Ordered List
1. First step
2. Second step
3. Third step
   1. Sub-step 3.1
   2. Sub-step 3.2
4. Fourth step

## Code

Inline code example: \`const greeting = "Hello World";\`

Block code example:
\`\`\`javascript
function calculatePTO(employee) {
  const yearsOfService = employee.tenure;
  const basePTO = 15;
  const bonus = yearsOfService * 2;
  return basePTO + bonus;
}
\`\`\`

## Links

Visit [BambooHR](https://www.bamboohr.com) for more information.

Check out [our documentation](https://docs.bamboohr.com) to learn more.

## Blockquotes

> "Great things in business are never done by one person. They're done by a team of people."
>
> — Steve Jobs

## Tables

| Employee | Department | Years | PTO Days |
|----------|-----------|-------|----------|
| Alice Chen | Engineering | 5 | 25 |
| Bob Smith | Marketing | 3 | 21 |
| Carol Davis | Sales | 7 | 29 |
| David Kim | HR | 2 | 19 |

## Horizontal Rule

---

## Task Lists

- [x] Complete onboarding documentation
- [x] Set up employee profiles
- [ ] Schedule team introductions
- [ ] Send welcome emails

## Combined Example

**Important Notice:** The Q1 benefits enrollment period is ~~January 1-15~~ **January 15-31**.

Key actions:
1. Review your *current benefits*
2. Compare with **new options**
3. Submit changes by deadline
4. Contact HR with questions

For help, visit [benefits portal](https://benefits.bamboohr.com) or run:
\`\`\`bash
npm run benefits-calculator
\`\`\`

> Remember: Enrollment is mandatory for all employees.`,
      },
    ],
  },
  {
    id: '20',
    title: 'Backfill Plan for Tony Ramirez',
    messages: [
      {
        id: '200',
        type: 'user',
        text: 'Tony Ramirez just gave his two weeks notice. He\'s a Senior Software Engineer on Uma Patel\'s team. Can you help me figure out a backfill plan?',
      },
      {
        id: '201',
        type: 'ai',
        text: `I'm sorry to hear about Tony's departure. Let me help you put together a comprehensive backfill plan. I have a few questions first:

1. **What's driving Tony's departure?** Understanding the reason can help us address potential retention risks for the rest of the team.
2. **Are there any critical projects** Tony is currently leading that need immediate coverage?
3. **Do you have a preference** for internal promotion vs. external hire?

While you think about those, I'll start pulling together relevant data on the team, compensation benchmarks, and potential internal candidates.`,
        suggestions: [
          'He got a better offer elsewhere',
          'Show me the team structure',
          'Check internal candidates first',
        ],
      },
      {
        id: '202',
        type: 'user',
        text: 'He got a better offer — higher comp at a competitor. I\'m open to either internal or external candidates. Let\'s see what makes sense.',
      },
      {
        id: '203',
        type: 'ai',
        text: `Got it — comp-driven departure. I'd recommend we start by getting a job requisition drafted so you're ready to move quickly. I'll pull Tony's role context and comp data to build it.`,
        artifactId: 'artifact-plan-1',
      },
    ],
  },
  {
    id: '21',
    title: 'Q1 Hiring Pipeline Review',
    messages: [
      {
        id: '210',
        type: 'user',
        text: 'Can you review our open hiring pipeline? I want to make sure we\'re on track for Q1 targets.',
      },
      {
        id: '211',
        type: 'ai',
        text: `Absolutely. I'll run a full pipeline health analysis across your 7 open requisitions. Give me a moment to pull the data.

I'll check:
- **Time-in-stage** for each open req
- **Candidate flow** and conversion rates
- **Stalled pipelines** that need intervention
- **Talent pool matches** for hard-to-fill roles`,
        suggestions: [
          'Focus on at-risk positions',
          'Include talent pool screening',
          'Show me the full dashboard',
        ],
      },
      {
        id: '212',
        type: 'user',
        text: 'Yes, include talent pool screening too. I want to see if we have any internal matches.',
      },
      {
        id: '213',
        type: 'ai',
        text: `I've completed the pipeline analysis and talent pool screening. Here's what I found:

**Pipeline Health:**
- **3 of 7 positions are at risk** of missing Q1 targets
- President of Sales is **stalled** — 9 candidates but no movement in 2 weeks
- Marketing Coordinator has **zero applicants** after 14 days

**Talent Pool Matches:**
- Found **2 strong matches** for Marketing Coordinator from the Marketing talent pool
- Adison Donin looks particularly promising — 4 years content marketing, 3★ rating

I've put together a plan with the analysis, matches, and recommended next steps. **I need your approval** before drafting outreach to the matched candidates.`,
        suggestions: [
          'Approve outreach to Adison Donin',
          'Show me the full candidate profiles',
          'What about the President of Sales pipeline?',
        ],
      },
    ],
  },
];
