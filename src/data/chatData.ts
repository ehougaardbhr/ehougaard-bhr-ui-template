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
