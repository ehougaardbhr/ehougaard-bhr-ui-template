import { useState } from 'react';
import { Icon, Button, TextInput } from '../components';

type OptionType = 1 | 2 | 3 | 4 | 5;

export function FeedbackUXMockups() {
  const [activeOption, setActiveOption] = useState<OptionType>(1);
  const [expandedChip, setExpandedChip] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const employeeName = 'Jess';

  const summaryText = `${employeeName}'s colleagues have shared positive feedback, praising her for her perseverance and dedication to protecting employee morale during times of transition. She is appreciated for her dependability, good questions, and ability to get work done on time. However, some suggest she should speak up about her ideas. Overall, she is seen as a great counselor and team member, with a notable sense of generosity and kindness.`;

  const strengths = [
    { title: 'Perseverance', description: 'Multiple colleagues noted her resilience during transitions and dedication to protecting team morale' },
    { title: 'Dependability', description: 'Consistently meets deadlines, reliable follow-through, gets work done on time' },
    { title: 'Team support', description: 'Described as a great counselor and team member, generous and kind' },
  ];

  const growthAreas = [
    { title: 'Speaking up', description: 'Some colleagues suggest she should be more vocal about sharing her ideas and perspectives' },
  ];

  const examples = [
    '"She does a great job of keeping things afloat and making everyone feel welcome."',
    '"Her dedication during the transition period really helped maintain team morale."',
    '"I appreciate her dependability and how she always asks good questions."',
  ];

  const suggestedPrompts = [
    'What patterns do you see in this feedback?',
    'How should I approach the "speaking up" concern?',
    'What questions should I ask Jess in our 1:1?',
    'How does this compare to her last review period?',
  ];

  const handleChipClick = (chipId: string) => {
    setExpandedChip(expandedChip === chipId ? null : chipId);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const question = inputValue.trim();
      setUserQuestion(question);

      // Add user message
      const newMessages = [
        { role: 'user' as const, content: question },
      ];

      // Generate mock AI response based on question
      const mockResponse = generateMockResponse(question);
      newMessages.push({ role: 'assistant' as const, content: mockResponse });

      setChatMessages(newMessages);
      setInputValue('');
      setSidebarOpen(true);
    }
  };

  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('strength') || lowerQuestion.includes('does well')) {
      return "Based on the feedback, Jess's key strengths are:\n\n• **Perseverance** - Multiple colleagues noted her resilience during transitions\n• **Dependability** - She consistently meets deadlines and is reliable\n• **Team support** - Described as a great counselor with generosity and kindness\n\nHer ability to protect employee morale during difficult times stands out as particularly valuable.";
    }

    if (lowerQuestion.includes('improve') || lowerQuestion.includes('growth') || lowerQuestion.includes('speak up')) {
      return "The main area for growth mentioned is **speaking up about her ideas**. Some colleagues feel she has valuable insights but doesn't always share them.\n\n**Suggested approach:**\n• In your 1:1, ask about times she held back sharing ideas\n• Explore if it's confidence, timing, or team dynamics\n• Set a goal to contribute one idea per meeting\n• Create safe spaces for her to practice sharing";
    }

    if (lowerQuestion.includes('1:1') || lowerQuestion.includes('one on one') || lowerQuestion.includes('questions')) {
      return "Here are some good questions for your 1:1 with Jess:\n\n1. **Acknowledge strengths**: \"Your colleagues really appreciate your dependability during transitions. How did you approach that?\"\n\n2. **Explore growth area**: \"Some feedback mentioned you could speak up more with your ideas. What holds you back?\"\n\n3. **Action planning**: \"What support would help you feel more comfortable sharing your perspective?\"\n\n4. **Forward-looking**: \"What would success look like for you this quarter?\"";
    }

    if (lowerQuestion.includes('pattern') || lowerQuestion.includes('theme')) {
      return "The feedback reveals a clear pattern: **Jess is a stabilizing force during change**.\n\n**What's working:**\n• She protects team morale during transitions\n• People rely on her for consistency\n• She asks good questions and gets work done\n\n**The tension:**\n• She may be so focused on stability that she holds back disruptive (but valuable) ideas\n• Her supportive nature might make her hesitant to challenge\n\nThis suggests she'd benefit from explicit permission to voice concerns and ideas.";
    }

    // Default response
    return `That's a great question about Jess's feedback. Based on the summary, her colleagues consistently highlight her perseverance, dependability, and team support. The one area mentioned for growth is speaking up more about her ideas.\n\nWould you like me to elaborate on any specific aspect of her feedback?`;
  };

  const OptionButton = ({ option, label }: { option: OptionType; label: string }) => (
    <Button
      variant={activeOption === option ? 'ai' : 'standard'}
      size="small"
      onClick={() => {
        setActiveOption(option);
        setExpandedChip(null);
        setSidebarOpen(false);
      }}
    >
      {label}
    </Button>
  );

  const SummaryHeader = () => (
    <div className="flex items-center gap-2 mb-3">
      <Icon name="sparkles" size={20} className="text-[var(--text-neutral-x-strong)]" />
      <span className="text-[16px] leading-[24px] font-medium text-[var(--text-neutral-x-strong)]">
        Summary of feedback about {employeeName}
      </span>
      <Icon name="circle-question" size={16} className="text-[var(--icon-neutral-strong)]" />
    </div>
  );

  const SummaryText = ({ interactive = false }: { interactive?: boolean }) => (
    <p className={`text-[16px] leading-[24px] text-[var(--text-neutral-x-strong)] ${interactive ? '' : ''}`}>
      {interactive ? (
        <>
          {employeeName}'s colleagues have shared positive feedback, praising her for her{' '}
          <span className="border-b-2 border-dotted border-[var(--color-primary-strong)] cursor-pointer hover:text-[var(--color-primary-strong)]">
            perseverance
          </span>{' '}
          and dedication to protecting employee morale during times of transition. She is appreciated for her{' '}
          <span className="border-b-2 border-dotted border-[var(--color-primary-strong)] cursor-pointer hover:text-[var(--color-primary-strong)]">
            dependability
          </span>
          , good questions, and ability to get work done on time. However, some suggest she should{' '}
          <span className="border-b-2 border-dotted border-[#E89AB4] cursor-pointer hover:text-[#9D7FC9]">
            speak up
          </span>{' '}
          about her ideas. Overall, she is seen as a great counselor and team member, with a notable sense of generosity and kindness.
        </>
      ) : (
        summaryText
      )}
    </p>
  );

  const QuickChips = ({ prefix = '' }: { prefix?: string }) => (
    <div className="flex gap-3 flex-wrap mt-4">
      <button
        onClick={() => handleChipClick(`${prefix}strengths`)}
        className={`
          px-4 py-2 rounded-full text-[14px] font-medium transition-all
          ${expandedChip === `${prefix}strengths`
            ? 'bg-[var(--surface-primary-weak)] text-[var(--color-primary-strong)] border border-[var(--color-primary-strong)]'
            : 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-medium)] hover:border-[var(--color-primary-strong)]'
          }
        `}
      >
        <Icon name="thumbs-up" size={14} className="inline mr-2" />
        Key strengths
      </button>
      <button
        onClick={() => handleChipClick(`${prefix}growth`)}
        className={`
          px-4 py-2 rounded-full text-[14px] font-medium transition-all
          ${expandedChip === `${prefix}growth`
            ? 'bg-[var(--surface-primary-weak)] text-[var(--color-primary-strong)] border border-[var(--color-primary-strong)]'
            : 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-medium)] hover:border-[var(--color-primary-strong)]'
          }
        `}
      >
        <Icon name="chart-line" size={14} className="inline mr-2" />
        Growth areas
      </button>
      <button
        onClick={() => handleChipClick(`${prefix}examples`)}
        className={`
          px-4 py-2 rounded-full text-[14px] font-medium transition-all
          ${expandedChip === `${prefix}examples`
            ? 'bg-[var(--surface-primary-weak)] text-[var(--color-primary-strong)] border border-[var(--color-primary-strong)]'
            : 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-medium)] hover:border-[var(--color-primary-strong)]'
          }
        `}
      >
        <Icon name="comment" size={14} className="inline mr-2" />
        See examples
      </button>
    </div>
  );

  const ExpandedContent = ({ prefix = '' }: { prefix?: string }) => (
    <>
      {expandedChip === `${prefix}strengths` && (
        <div className="mt-4 p-4 bg-[var(--surface-neutral-xx-weak)] rounded-lg border-l-4 border-[var(--color-primary-strong)]">
          {strengths.map((item, idx) => (
            <div key={idx} className={idx < strengths.length - 1 ? 'mb-3' : ''}>
              <div className="font-semibold text-[var(--color-primary-strong)] text-[15px]">{item.title}</div>
              <div className="text-[14px] text-[var(--text-neutral-medium)]">{item.description}</div>
            </div>
          ))}
        </div>
      )}
      {expandedChip === `${prefix}growth` && (
        <div className="mt-4 p-4 bg-[var(--surface-neutral-xx-weak)] rounded-lg border-l-4 border-[#9D7FC9]">
          {growthAreas.map((item, idx) => (
            <div key={idx} className={idx < growthAreas.length - 1 ? 'mb-3' : ''}>
              <div className="font-semibold text-[#9D7FC9] text-[15px]">{item.title}</div>
              <div className="text-[14px] text-[var(--text-neutral-medium)]">{item.description}</div>
            </div>
          ))}
        </div>
      )}
      {expandedChip === `${prefix}examples` && (
        <div className="mt-4 p-4 bg-[var(--surface-neutral-xx-weak)] rounded-lg border-l-4 border-[var(--border-neutral-medium)]">
          {examples.map((quote, idx) => (
            <div key={idx} className={`text-[14px] text-[var(--text-neutral-strong)] italic ${idx < examples.length - 1 ? 'mb-3' : ''}`}>
              {quote}
            </div>
          ))}
        </div>
      )}
    </>
  );

  const Sidebar = () => {
    const showChat = chatMessages.length > 0 && activeOption === 5;

    return (
      <div className={`
        fixed top-0 right-0 h-full w-[400px] bg-[#2d2a28] text-white p-6
        transform transition-transform duration-300 shadow-2xl z-50 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Icon name="sparkles" size={20} className="text-white" />
            <span className="text-[18px] font-semibold">Ask AI</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        <div className="bg-[rgba(91,168,207,0.2)] px-3 py-2 rounded-md text-[13px] text-[#5BA8CF] mb-6">
          <Icon name="user" size={14} className="inline mr-2" />
          Exploring feedback about {employeeName} Cordova
        </div>

        {showChat ? (
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {chatMessages.map((message, idx) => (
              <div key={idx} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                {message.role === 'user' ? (
                  <div className="inline-block bg-[#5BA8CF] text-white px-4 py-2 rounded-lg max-w-[85%] text-left">
                    <div className="text-[14px] leading-[20px]">{message.content}</div>
                  </div>
                ) : (
                  <div className="inline-block bg-white/10 text-white px-4 py-3 rounded-lg max-w-[90%] text-left">
                    <div className="text-[14px] leading-[20px] whitespace-pre-line">{message.content}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-6">
            <div className="text-[12px] font-semibold text-white/50 uppercase tracking-wide mb-3">
              Suggested prompts
            </div>
            {suggestedPrompts.map((prompt, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/10 rounded-lg mb-2 cursor-pointer hover:bg-white/15 transition-colors text-[14px]"
              >
                {prompt}
              </div>
            ))}
          </div>
        )}

        <div>
          <TextInput
            value=""
            onChange={() => {}}
            placeholder="Ask a follow-up question..."
            size="default"
            className="[&>div]:bg-white/10 [&>div]:border-white/20"
            inputClassName="bg-white/10 border-white/20"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--surface-neutral-xx-weak)] p-8">
      {/* Option Switcher */}
      <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] p-6 mb-6 max-w-4xl mx-auto">
        <h1 className="text-[22px] font-semibold text-[var(--color-primary-strong)] mb-4" style={{ fontFamily: 'Fields, system-ui, sans-serif' }}>
          AI Feedback Summary - UX Options
        </h1>
        <div className="flex gap-3 flex-wrap">
          <OptionButton option={1} label="Option 1: Quick Chips" />
          <OptionButton option={2} label="Option 2: AI Sidebar" />
          <OptionButton option={3} label="Option 3: Combined" />
          <OptionButton option={4} label="Option 4: Interactive Text" />
          <OptionButton option={5} label="Option 5: Text Input" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[var(--surface-neutral-white)] rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] p-6 max-w-4xl mx-auto">
        {/* Option Description */}
        <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-r-lg mb-6">
          {activeOption === 1 && (
            <p className="text-[14px] text-[#92400E]">
              <strong>Option 1:</strong> Quick answer chips expand inline. No sidebar needed. Good for shallow exploration.
            </p>
          )}
          {activeOption === 2 && (
            <p className="text-[14px] text-[#92400E]">
              <strong>Option 2:</strong> Single AI button opens sidebar for deep conversation. Clean main view.
            </p>
          )}
          {activeOption === 3 && (
            <p className="text-[14px] text-[#92400E]">
              <strong>Option 3:</strong> Both! Quick chips for common questions, AI button for deeper exploration.
            </p>
          )}
          {activeOption === 4 && (
            <p className="text-[14px] text-[#92400E]">
              <strong>Option 4:</strong> Hover/click keywords in summary to explore themes. More discoverable?
            </p>
          )}
          {activeOption === 5 && (
            <p className="text-[14px] text-[#92400E]">
              <strong>Option 5:</strong> Text input below summary. Type a question and hit Enter to open sidebar chat.
            </p>
          )}
        </div>

        {/* Feedback Section */}
        <div>
          <SummaryHeader />

          {/* Option 1: Quick Chips Only */}
          {activeOption === 1 && (
            <>
              <SummaryText />
              <QuickChips prefix="opt1-" />
              <ExpandedContent prefix="opt1-" />
            </>
          )}

          {/* Option 2: AI Button → Sidebar */}
          {activeOption === 2 && (
            <>
              <SummaryText />
              <div className="flex justify-center mt-6">
                <Button variant="ai" size="medium" icon="sparkles" onClick={() => setSidebarOpen(true)}>
                  Ask about this feedback
                </Button>
              </div>
            </>
          )}

          {/* Option 3: Combined */}
          {activeOption === 3 && (
            <>
              <SummaryText />
              <div className="flex gap-3 flex-wrap mt-4 items-center">
                <button
                  onClick={() => handleChipClick('opt3-strengths')}
                  className={`
                    px-4 py-2 rounded-full text-[14px] font-medium transition-all
                    ${expandedChip === 'opt3-strengths'
                      ? 'bg-[var(--surface-primary-weak)] text-[var(--color-primary-strong)] border border-[var(--color-primary-strong)]'
                      : 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-medium)] hover:border-[var(--color-primary-strong)]'
                    }
                  `}
                >
                  <Icon name="thumbs-up" size={14} className="inline mr-2" />
                  Key strengths
                </button>
                <button
                  onClick={() => handleChipClick('opt3-growth')}
                  className={`
                    px-4 py-2 rounded-full text-[14px] font-medium transition-all
                    ${expandedChip === 'opt3-growth'
                      ? 'bg-[var(--surface-primary-weak)] text-[var(--color-primary-strong)] border border-[var(--color-primary-strong)]'
                      : 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-medium)] hover:border-[var(--color-primary-strong)]'
                    }
                  `}
                >
                  <Icon name="chart-line" size={14} className="inline mr-2" />
                  Growth areas
                </button>
                <button
                  onClick={() => handleChipClick('opt3-examples')}
                  className={`
                    px-4 py-2 rounded-full text-[14px] font-medium transition-all
                    ${expandedChip === 'opt3-examples'
                      ? 'bg-[var(--surface-primary-weak)] text-[var(--color-primary-strong)] border border-[var(--color-primary-strong)]'
                      : 'bg-[var(--surface-neutral-white)] text-[var(--text-neutral-strong)] border border-[var(--border-neutral-medium)] hover:border-[var(--color-primary-strong)]'
                    }
                  `}
                >
                  <Icon name="comment" size={14} className="inline mr-2" />
                  See examples
                </button>
                <Button variant="ai" size="small" icon="sparkles" onClick={() => setSidebarOpen(true)}>
                  Ask more questions
                </Button>
              </div>
              <ExpandedContent prefix="opt3-" />
            </>
          )}

          {/* Option 4: Interactive Text */}
          {activeOption === 4 && (
            <>
              <SummaryText interactive />
              <div className="mt-4 p-3 bg-[linear-gradient(99.36deg,rgb(233,243,252)_0%,rgb(245,238,248)_100%)] rounded-lg">
                <p className="text-[13px] text-[#004876]">
                  <Icon name="lightbulb" size={14} className="inline mr-2" />
                  <strong>Tip:</strong> Click highlighted words to explore themes in detail
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <Button variant="ai" size="medium" icon="sparkles" onClick={() => setSidebarOpen(true)}>
                  Ask about this feedback
                </Button>
              </div>
            </>
          )}

          {/* Option 5: Text Input */}
          {activeOption === 5 && (
            <>
              <SummaryText />
              <div className="mt-4">
                <TextInput
                  value={inputValue}
                  onChange={setInputValue}
                  onKeyPress={handleInputKeyPress}
                  placeholder="Ask a follow-up question..."
                  size="default"
                  icon="sparkles"
                />
                <p className="text-[13px] text-[var(--text-neutral-medium)] mt-2">
                  <Icon name="keyboard" size={13} className="inline mr-1" />
                  Press Enter to open AI chat
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default FeedbackUXMockups;
