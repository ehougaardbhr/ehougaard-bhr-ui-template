import { useState } from 'react';
import { Icon, TextInput, Button, PendingFeedbackCard, FeedbackCard } from '../../components';
import { useChat } from '../../contexts/ChatContext';

interface FeedbackTabContentProps {
  employeeName: string;
}

// Feedback themes extracted from peer feedback
interface FeedbackTheme {
  id: string;
  label: string;
  type: 'positive' | 'growth';
  details: {
    title: string;
    description: string;
    quotes?: Array<{
      text: string;
      author: string;
      role: string;
    }>;
  };
}

export function FeedbackTabContent({ employeeName }: FeedbackTabContentProps) {
  const [searchValue, setSearchValue] = useState('');
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);
  const [showAllChips, setShowAllChips] = useState(false);
  const { createNewChat, addMessage } = useChat();

  // Themes extracted from peer feedback
  const feedbackThemes: FeedbackTheme[] = [
    {
      id: 'perseverance',
      label: 'Praised for perseverance',
      type: 'positive',
      details: {
        title: 'Perseverance',
        description: 'Multiple colleagues noted her resilience during transitions and dedication to protecting team morale.',
        quotes: [
          {
            text: 'Her dedication during the transition period really helped maintain team morale. She kept everyone focused when things got tough.',
            author: 'Sarah Chen',
            role: 'Engineering Manager',
          },
          {
            text: 'Even when the project timeline shifted, she stayed positive and helped others adapt to the changes.',
            author: 'Marcus Johnson',
            role: 'Senior Developer',
          },
        ],
      },
    },
    {
      id: 'dependability',
      label: 'Dependable teammate',
      type: 'positive',
      details: {
        title: 'Dependability',
        description: 'Consistently meets deadlines and follows through on commitments. Team members trust her to deliver.',
        quotes: [
          {
            text: 'I can always count on her to get things done on time. She\'s the person I go to when something absolutely needs to ship.',
            author: 'Rachel Kim',
            role: 'Director of Engineering',
          },
          {
            text: 'She asks good questions upfront which means her work rarely needs revisions. Very reliable.',
            author: 'James Wilson',
            role: 'Staff Engineer',
          },
        ],
      },
    },
    {
      id: 'team-support',
      label: 'Strong team supporter',
      type: 'positive',
      details: {
        title: 'Team Support',
        description: 'Described as a great counselor and team member, generous and kind.',
        quotes: [
          {
            text: 'She does a great job of keeping things afloat and making everyone feel welcome.',
            author: 'Lisa Patel',
            role: 'Project Manager',
          },
        ],
      },
    },
    {
      id: 'good-questions',
      label: 'Asks good questions',
      type: 'positive',
      details: {
        title: 'Curiosity & Inquiry',
        description: 'Known for asking thoughtful questions that help clarify requirements and improve outcomes.',
      },
    },
    {
      id: 'speak-up',
      label: 'Could speak up more',
      type: 'growth',
      details: {
        title: 'Speaking Up',
        description: 'Some colleagues feel she has valuable insights but doesn\'t always share them in group settings.',
        quotes: [
          {
            text: 'She has great ideas but sometimes holds back in meetings. I\'d love to hear her perspective more often.',
            author: 'David Park',
            role: 'Product Manager',
          },
          {
            text: 'In 1:1s she shares brilliant suggestions, but I wish she\'d bring those to the team discussions too.',
            author: 'Emily Torres',
            role: 'Tech Lead',
          },
        ],
      },
    },
  ];

  const handleThemeClick = (themeId: string) => {
    setExpandedTheme(expandedTheme === themeId ? null : themeId);
  };

  const handleOpenAIChat = () => {
    const newConversation = createNewChat();

    addMessage(newConversation.id, {
      type: 'user',
      text: `Tell me more about ${employeeName}'s feedback`,
    });

    addMessage(newConversation.id, {
      type: 'assistant',
      text: generateMockResponse('patterns'),
    });

    setTimeout(() => {
      localStorage.setItem('bhr-chat-panel-open', 'true');
    }, 100);
  };

  const summaryText = `${employeeName}'s colleagues have shared positive feedback, praising her for her perseverance and dedication to protecting employee morale during times of transition. She is appreciated for her dependability, good questions, and ability to get work done on time. However, some suggest she should speak up about her ideas. Overall, she is seen as a great counselor and team member, with a notable sense of generosity and kindness.`;

  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('strength') || lowerQuestion.includes('does well')) {
      return `Based on the feedback, ${employeeName}'s key strengths are:\n\n• **Perseverance** - Multiple colleagues noted her resilience during transitions\n• **Dependability** - She consistently meets deadlines and is reliable\n• **Team support** - Described as a great counselor with generosity and kindness\n\nHer ability to protect employee morale during difficult times stands out as particularly valuable.`;
    }

    if (lowerQuestion.includes('improve') || lowerQuestion.includes('growth') || lowerQuestion.includes('speak up')) {
      return `The main area for growth mentioned is **speaking up about her ideas**. Some colleagues feel she has valuable insights but doesn't always share them.\n\n**Suggested approach:**\n• In your 1:1, ask about times she held back sharing ideas\n• Explore if it's confidence, timing, or team dynamics\n• Set a goal to contribute one idea per meeting\n• Create safe spaces for her to practice sharing`;
    }

    if (lowerQuestion.includes('1:1') || lowerQuestion.includes('one on one') || lowerQuestion.includes('questions')) {
      return `Here are some good questions for your 1:1 with ${employeeName}:\n\n1. **Acknowledge strengths**: "Your colleagues really appreciate your dependability during transitions. How did you approach that?"\n\n2. **Explore growth area**: "Some feedback mentioned you could speak up more with your ideas. What holds you back?"\n\n3. **Action planning**: "What support would help you feel more comfortable sharing your perspective?"\n\n4. **Forward-looking**: "What would success look like for you this quarter?"`;
    }

    if (lowerQuestion.includes('pattern') || lowerQuestion.includes('theme')) {
      return `The feedback reveals a clear pattern: **${employeeName} is a stabilizing force during change**.\n\n**What's working:**\n• She protects team morale during transitions\n• People rely on her for consistency\n• She asks good questions and gets work done\n\n**The tension:**\n• She may be so focused on stability that she holds back disruptive (but valuable) ideas\n• Her supportive nature might make her hesitant to challenge\n\nThis suggests she'd benefit from explicit permission to voice concerns and ideas.`;
    }

    // Default response
    return `That's a great question about ${employeeName}'s feedback. Based on the summary, her colleagues consistently highlight her perseverance, dependability, and team support. The one area mentioned for growth is speaking up more about her ideas.\n\nWould you like me to elaborate on any specific aspect of her feedback?`;
  };


  // Mock pending feedback requests
  const pendingRequests = [
    {
      id: '1',
      personName: 'Theo Hanley',
      personTitle: 'Director of Puppy Sciences',
      personAvatar: 'https://i.pravatar.cc/150?img=12',
      requestDate: 'March 25, 2024',
      emailSentDate: 'Tuesday, May 7, 2024',
      dueDate: 'Wed, May 22, 2024',
      daysRemaining: 14,
    },
    {
      id: '2',
      personName: 'Theo Hanley',
      personTitle: 'Director of Puppy Sciences',
      personAvatar: 'https://i.pravatar.cc/150?img=12',
      requestDate: 'March 25, 2024',
      emailSentDate: 'Tuesday, May 7, 2024',
      dueDate: 'Wed, May 22, 2024',
      daysRemaining: 14,
    },
  ];

  // Mock received feedback
  const receivedFeedback = [
    {
      id: '1',
      authorName: 'Stevie Nordness',
      authorTitle: 'VP of Good Dogs',
      date: 'March 25, 2024',
      iconName: 'face-smile',
      strengths: {
        question: 'What are some things Jessica does well?',
        answer:
          'Jessica is a really nice person. She does a great job of purchasing the right supplies, making customers and dogs alike feel welcome, and generally keeping things afloat.',
      },
      improvements: {
        question: 'How could Jessica improve?',
        answer:
          'Punctuality does make a big difference when we have hourly workers coming in -- Jessica could be a bit more punctual to help us keep things on track.',
      },
    },
    {
      id: '2',
      authorName: 'Stevie Nordness',
      authorTitle: 'VP of Good Dogs',
      date: 'March 25, 2024',
      iconName: 'face-smile',
      strengths: {
        question: 'What are some things Jessica does well?',
        answer:
          'Jessica is a really nice person. She does a great job of throwing the ball, giving good scritches, and she knows all of the best treats and toys to buy. She also likes cats, which is good because I love my cat friend.',
      },
      improvements: {
        question: 'How could Jessica improve?',
        answer:
          "She doesn't give the longest belly rubs, and I think if she did those for a bit longer, she'd get an A+ from me. Sometimes she washes my fur and I don't love that either.",
      },
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Helper Text (Info Message) */}
      <div className="flex items-start gap-2">
        <Icon name="eye-slash" size={16} className="text-[var(--icon-neutral-strong)] mt-0.5" />
        <span className="text-[14px] leading-[20px] text-[var(--text-neutral-medium)]">
          Just so you know, feedback is hidden from {employeeName}.
        </span>
      </div>

      {/* Request Feedback Section */}
      <div className="mt-4">
        {/* Section Header with Icon and Tooltip */}
        <div className="flex items-center gap-2">
          <Icon name="users" size={20} className="text-[var(--text-neutral-x-strong)]" />
          <span className="text-[16px] leading-[24px] font-medium text-[var(--text-neutral-x-strong)]">
            Request feedback about {employeeName}
          </span>
          <Icon name="circle-question" size={16} className="text-[var(--icon-neutral-strong)]" />
        </div>

        {/* Instruction Text */}
        <p className="text-[14px] leading-[20px] text-[var(--text-neutral-medium)] mt-2">
          Select some employees who work with {employeeName}
        </p>

        {/* Feedback Request Form */}
        <div className="flex items-center gap-2 mt-2">
          <TextInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search names"
            size="small"
            className="w-[395px]"
          />
          <Button variant="standard" size="small">
            Send Request
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[var(--border-neutral-x-weak)] my-4" />

      {/* Feedback Summary Section */}
      <div>
        {/* Section Header with Icon, Tooltip, and AI Button */}
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={20} className="text-[var(--text-neutral-x-strong)]" />
          <span className="text-[16px] leading-[24px] font-medium text-[var(--text-neutral-x-strong)]">
            Summary of feedback about {employeeName}
          </span>
          <Icon name="circle-question" size={16} className="text-[var(--icon-neutral-strong)]" />
          <div className="flex-1" />
          <Button
            variant="ai"
            size="small"
            icon="sparkles"
            onClick={handleOpenAIChat}
          >
            Ask about feedback
          </Button>
        </div>

        {/* Summary Text */}
        <p className="text-[16px] leading-[24px] text-[var(--text-neutral-x-strong)] mt-2 pl-7">
          {summaryText}
        </p>

        {/* Feedback Themes - Option 3: Chips + AI Button */}
        <div className="mt-4 pl-7">
          {/* Chips Container */}
          <div className="flex gap-2 flex-wrap items-center">
            {/* Theme Chips - show 3 or all based on state */}
            {(showAllChips ? feedbackThemes : feedbackThemes.slice(0, 3)).map((theme) => {
              const isPositive = theme.type === 'positive';
              const isActive = expandedTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeClick(theme.id)}
                  className={`
                    px-2.5 py-1 rounded-full text-[12px] transition-all inline-flex items-center gap-1
                    ${isPositive
                      ? isActive
                        ? 'bg-[#E8F4F4] dark:bg-[#0D4548] text-[#0A5C5F] dark:text-[#7DD3D7] border border-[#0D7377] dark:border-[#0D7377] shadow-[0_0_0_1px_#0D7377]'
                        : 'bg-[#E8F4F4] dark:bg-[#0A3A3D] text-[#0A5C5F] dark:text-[#7DD3D7] border border-[#B8DCDD] dark:border-[#0A5C5F] hover:border-[#0D7377]'
                      : isActive
                        ? 'bg-[#FFF4ED] dark:bg-[#4A2400] text-[#CD4A00] dark:text-[#FF9D66] border border-[#CD4A00] dark:border-[#CD4A00] shadow-[0_0_0_1px_#CD4A00]'
                        : 'bg-[#FFF4ED] dark:bg-[#3D1E00] text-[#CD4A00] dark:text-[#FF9D66] border border-[#FDCDB8] dark:border-[#9D3A00] hover:border-[#CD4A00]'
                    }
                  `}
                >
                  <Icon name={isPositive ? 'thumbs-up' : 'compass'} size={10} />
                  {theme.label}
                  <Icon
                    name="chevron-down"
                    size={8}
                    className={`opacity-70 transition-transform ${isActive ? 'rotate-180' : ''}`}
                  />
                </button>
              );
            })}

            {/* +X More Button */}
            {!showAllChips && feedbackThemes.length > 3 && (
              <button
                onClick={() => setShowAllChips(true)}
                className="px-3 py-1 text-[13px] text-[var(--color-primary)] hover:underline"
              >
                +{feedbackThemes.length - 3} more
              </button>
            )}

            {/* Show Less button when expanded */}
            {showAllChips && feedbackThemes.length > 3 && (
              <button
                onClick={() => setShowAllChips(false)}
                className="px-3 py-1 text-[13px] text-[var(--text-neutral-strong)] hover:underline"
              >
                Show less
              </button>
            )}
          </div>

          {/* Expanded Theme Content */}
          {expandedTheme && (() => {
            const theme = feedbackThemes.find(t => t.id === expandedTheme);
            if (!theme) return null;
            const isGrowthArea = theme.type === 'growth';
            const borderColor = isGrowthArea ? '#CD4A00' : '#0D7377';
            const titleColor = isGrowthArea ? '#CD4A00' : '#0D7377';

            return (
              <div
                className="mt-4 p-4 bg-[var(--surface-neutral-xx-weak)] rounded-lg border-l-4"
                style={{
                  borderLeftColor: borderColor,
                  borderLeftWidth: '4px'
                }}
              >
                <div
                  className={`font-semibold text-[15px] mb-1 ${
                    isGrowthArea
                      ? 'text-[#CD4A00] dark:text-[#FF9D66]'
                      : 'text-[#0D7377] dark:text-[#7DD3D7]'
                  }`}
                >
                  {theme.details.title}
                </div>
                {/* Description is prominent */}
                <div className="text-[14px] text-[var(--text-neutral-strong)] leading-[1.5] mb-4">
                  {theme.details.description}
                </div>
                {/* Quotes are secondary/supporting */}
                {theme.details.quotes && theme.details.quotes.length > 0 && (
                  <div className="space-y-[14px]">
                    {theme.details.quotes.map((quote, idx) => (
                      <div key={idx}>
                        <div className="text-[13px] text-[var(--text-neutral-medium)] italic leading-[1.5] mb-1">
                          "{quote.text}"
                        </div>
                        <div className="flex items-center gap-[6px] text-[12px]">
                          <Icon name="circle-user" size={16} className="text-[var(--text-neutral-medium)]" />
                          <span className="font-medium text-[var(--text-neutral-strong)]">{quote.author}</span>
                          <span className="text-[var(--text-neutral-medium)]">· {quote.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Pending Feedback Requests */}
      <div className="mt-6">
        <PendingFeedbackCard
          requests={pendingRequests}
          onCancel={(id) => console.log('Cancel request:', id)}
        />
      </div>

      {/* Received Feedback */}
      <div className="mt-6 space-y-6">
        {receivedFeedback.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            authorName={feedback.authorName}
            authorTitle={feedback.authorTitle}
            date={feedback.date}
            iconName={feedback.iconName}
            strengths={feedback.strengths}
            improvements={feedback.improvements}
          />
        ))}
      </div>
    </div>
  );
}

export default FeedbackTabContent;
