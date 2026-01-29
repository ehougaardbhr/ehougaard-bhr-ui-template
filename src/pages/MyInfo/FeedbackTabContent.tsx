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
  icon: 'heart' | 'users' | 'check-circle' | 'circle-question' | 'bullhorn';
  details: {
    title: string;
    description: string;
    quotes?: string[];
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
      icon: 'heart',
      details: {
        title: 'Perseverance',
        description: 'Multiple colleagues noted her resilience during transitions and dedication to protecting team morale.',
        quotes: ['"Her dedication during the transition period really helped maintain team morale."'],
      },
    },
    {
      id: 'dependability',
      label: 'Dependable teammate',
      icon: 'check-circle',
      details: {
        title: 'Dependability',
        description: 'Consistently meets deadlines, reliable follow-through, and gets work done on time.',
        quotes: ['"I appreciate her dependability and how she always asks good questions."'],
      },
    },
    {
      id: 'team-support',
      label: 'Strong team supporter',
      icon: 'users',
      details: {
        title: 'Team Support',
        description: 'Described as a great counselor and team member, generous and kind.',
        quotes: ['"She does a great job of keeping things afloat and making everyone feel welcome."'],
      },
    },
    {
      id: 'good-questions',
      label: 'Asks good questions',
      icon: 'circle-question',
      details: {
        title: 'Curiosity & Inquiry',
        description: 'Known for asking thoughtful questions that help clarify requirements and improve outcomes.',
      },
    },
    {
      id: 'speak-up',
      label: 'Could speak up more',
      icon: 'bullhorn',
      details: {
        title: 'Growth Area: Speaking Up',
        description: 'Some colleagues suggest she should be more vocal about sharing her ideas and perspectives.',
        quotes: ['"She has great insights but sometimes holds back from sharing them."'],
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
        {/* Section Header with Icon and Tooltip */}
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={20} className="text-[var(--text-neutral-x-strong)]" />
          <span className="text-[16px] leading-[24px] font-medium text-[var(--text-neutral-x-strong)]">
            Summary of feedback about {employeeName}
          </span>
          <Icon name="circle-question" size={16} className="text-[var(--icon-neutral-strong)]" />
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
            {(showAllChips ? feedbackThemes : feedbackThemes.slice(0, 3)).map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeClick(theme.id)}
                className={`
                  px-3 py-1.5 rounded-full text-[13px] transition-all inline-flex items-center gap-1.5
                  ${expandedTheme === theme.id
                    ? 'bg-[var(--surface-primary-weak)] text-[var(--color-primary-strong)] border border-[var(--color-primary-strong)]'
                    : 'bg-[var(--surface-neutral-x-weak)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-weak)] hover:border-[var(--border-neutral-medium)]'
                  }
                `}
              >
                <Icon name={theme.icon} size={12} className="opacity-70" />
                {theme.label}
              </button>
            ))}

            {/* +X More Button */}
            {!showAllChips && feedbackThemes.length > 3 && (
              <button
                onClick={() => setShowAllChips(true)}
                className="px-3 py-1.5 text-[13px] text-[var(--color-primary-strong)] hover:underline"
              >
                +{feedbackThemes.length - 3} more
              </button>
            )}

            {/* Show Less button when expanded */}
            {showAllChips && feedbackThemes.length > 3 && (
              <button
                onClick={() => setShowAllChips(false)}
                className="px-3 py-1.5 text-[13px] text-[var(--color-primary-strong)] hover:underline"
              >
                Show less
              </button>
            )}

            {/* AI Button */}
            <Button
              variant="ai"
              size="small"
              icon="sparkles"
              onClick={handleOpenAIChat}
            >
              Ask about feedback
            </Button>
          </div>

          {/* Expanded Theme Content */}
          {expandedTheme && (() => {
            const theme = feedbackThemes.find(t => t.id === expandedTheme);
            if (!theme) return null;
            const isGrowthArea = theme.id === 'speak-up';
            return (
              <div className={`mt-4 p-4 bg-[var(--surface-neutral-xx-weak)] rounded-lg border-l-4 ${isGrowthArea ? 'border-[#9D7FC9]' : 'border-[var(--color-primary-strong)]'}`}>
                <div className={`font-semibold text-[15px] ${isGrowthArea ? 'text-[#9D7FC9]' : 'text-[var(--color-primary-strong)]'}`}>
                  {theme.details.title}
                </div>
                <div className="text-[14px] text-[var(--text-neutral-medium)] mt-1">
                  {theme.details.description}
                </div>
                {theme.details.quotes && theme.details.quotes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {theme.details.quotes.map((quote, idx) => (
                      <div key={idx} className="text-[13px] text-[var(--text-neutral-strong)] italic pl-3 border-l-2 border-[var(--border-neutral-weak)]">
                        {quote}
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
