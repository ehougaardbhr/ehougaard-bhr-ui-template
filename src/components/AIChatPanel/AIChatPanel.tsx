import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { InlineArtifactCard } from '../InlineArtifactCard';
import MarkdownContent from '../MarkdownContent';
import { useChat } from '../../contexts/ChatContext';
import { useArtifact } from '../../contexts/ArtifactContext';
import { useChatSend } from '../../hooks/useChatSend';
import { chartTypeIcons } from '../../data/artifactData';
import type { ChartSettings } from '../../data/artifactData';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const ARTIFACTS_INITIAL_COUNT = 3;

export function AIChatPanel({ isOpen, onClose, isExpanded, onExpandChange }: AIChatPanelProps) {
  const navigate = useNavigate();
  const { artifacts } = useArtifact();
  const {
    selectedConversation,
    selectConversation,
    createNewChat,
    conversations,
    searchQuery: contextSearchQuery,
    setSearchQuery: setContextSearchQuery,
    filteredConversations,
    addMessage
  } = useChat();
  const { sendMessage } = useChatSend();
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAllArtifacts, setShowAllArtifacts] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get artifact icon based on type
  const getArtifactIcon = (artifact: typeof artifacts[0]) => {
    if (artifact.type === 'chart') {
      return chartTypeIcons[(artifact.settings as ChartSettings).chartType];
    }
    if (artifact.type === 'document') return 'file-lines';
    if (artifact.type === 'org-chart') return 'sitemap';
    return 'table';
  };

  // Artifacts to display (limited or all)
  const displayedArtifacts = showAllArtifacts
    ? artifacts
    : artifacts.slice(0, ARTIFACTS_INITIAL_COUNT);

  const messages = selectedConversation?.messages || [];
  const title = selectedConversation?.title || 'New Chat';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExpand = () => {
    onExpandChange(true);
  };

  const handleCollapse = () => {
    onExpandChange(false);
  };

  const handleSend = async () => {
    if (inputValue.trim() && !isSending) {
      const text = inputValue;
      setInputValue('');
      setIsSending(true);
      try {
        // If no conversation selected, create a new one
        if (!selectedConversation) {
          const newConversation = createNewChat();
          selectConversation(newConversation.id);
          await sendMessage(text, newConversation.id);
        } else {
          await sendMessage(text);
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  // Generate AI response based on the prompt
  const generateAIResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();

    // Team growth scenarios
    if (lowerPrompt.includes('grew') || lowerPrompt.includes('expansion') || lowerPrompt.includes('grow')) {
      return `I'll analyze the impact of team growth. Based on current span of control metrics and industry benchmarks, here are some scenarios:

**Scenario 1: Add 2 Team Members**
• Estimated Cost: $180K annually
• Structure: Direct reports to current manager
• Impact: Span of control increases to 7 (within healthy range)

**Scenario 2: Add 5 Team Members**
• Estimated Cost: $320K annually
• Structure: Requires intermediate manager layer
• Impact: Creates two sub-teams of 3-4 people each

I recommend Scenario 1 for now, with plans to reassess in Q3.`;
    }

    // Span of control analysis
    if (lowerPrompt.includes('span of control') || lowerPrompt.includes('analyze')) {
      return `Looking at the span of control metrics:

**Current State:**
• Direct Reports: 5 people
• Span Ratio: 1:5
• Industry Benchmark: 1:5-8 (healthy range)

**Analysis:**
• ✓ Within optimal range for hands-on management
• ✓ Allows for regular 1-on-1s and mentorship
• ⚠️ May become stretched if team grows beyond 8

**Recommendations:**
• Current structure is sustainable
• Consider adding a team lead if expanding beyond 8 direct reports
• Monitor workload distribution across reports`;
    }

    // Succession planning
    if (lowerPrompt.includes('succession') || lowerPrompt.includes('replacement')) {
      return `Here's a succession analysis:

**Internal Candidates:**

**Alex Chen** (Senior Engineer)
• Readiness: 6-9 months
• Strengths: Technical excellence, respected by peers
• Development needs: Project management, stakeholder communication

**Jordan Kim** (Team Lead)
• Readiness: 3-6 months
• Strengths: Leadership experience, cross-functional collaboration
• Development needs: Deeper technical architecture knowledge

**Recommendations:**
• Start mentorship program for Alex focusing on leadership
• Give Jordan exposure to architecture decisions
• Document key processes and relationships`;
    }

    // Industry benchmarks
    if (lowerPrompt.includes('benchmark') || lowerPrompt.includes('industry') || lowerPrompt.includes('compare')) {
      return `Here's how this team compares to industry benchmarks:

**Team Structure:**
• Your Span: 1:5 | Industry Avg: 1:6.2 ✓
• Your Levels: 3 | Industry Avg: 3.5 ✓

**Performance Metrics:**
• Delivery Velocity: Above average (85th percentile)
• Employee Retention: 94% vs 87% industry avg ✓
• Promotion Rate: On par with industry

**Recommendations:**
• Team structure is well-optimized
• Consider slight expansion to match industry norms
• Continue investing in retention initiatives`;
    }

    // Default response
    return `I'll help you with that. Let me analyze the relevant org chart data and get back to you with insights and recommendations.`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!selectedConversation) return;

    // Add user message
    addMessage(selectedConversation.id, { type: 'user', text: suggestion });

    // Add AI response after brief delay
    setTimeout(() => {
      addMessage(selectedConversation.id, {
        type: 'ai',
        text: generateAIResponse(suggestion),
      });
    }, 500);
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed z-50 flex flex-col"
      data-chat-panel
      style={{
        top: isExpanded ? 0 : 106,
        bottom: isExpanded ? 0 : 48,
        right: 16,
        width: isExpanded ? 'calc(100% - 32px)' : 383,
        transition: 'all 700ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
    >
      <div
        className="w-full h-full bg-[var(--surface-neutral-white)] shadow-xl flex overflow-hidden"
        style={{
          borderRadius: isExpanded ? 0 : 20,
          transition: 'border-radius 700ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        {/* Sidebar - only visible when expanded */}
        <div
          className="shrink-0 bg-[var(--surface-neutral-white)] flex flex-col overflow-hidden"
          style={{
            width: isExpanded ? 280 : 0,
            opacity: isExpanded ? 1 : 0,
            transition: 'width 700ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 700ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
        >
          {/* New Chat Button */}
          <div className="px-4 py-3 pt-6">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] rounded-[var(--radius-xx-small)] transition-colors"
            >
              <Icon name="pen-to-square" size={16} className="text-[var(--icon-neutral-x-strong)]" />
              New Chat
            </button>
          </div>

          {/* Artifacts Section */}
          {artifacts.length > 0 && (
            <>
              <div className="px-5 py-2">
                <span className="text-[13px] font-semibold text-[var(--text-neutral-medium)]">
                  Artifacts
                </span>
              </div>
              <div className="px-2">
                {displayedArtifacts.map((artifact) => (
                  <button
                    key={artifact.id}
                    onClick={() => {
                      // Find the conversation that contains this artifact
                      const conversation = conversations.find(
                        conv => conv.id === artifact.conversationId
                      );
                      if (conversation) {
                        selectConversation(conversation.id);
                        // Expand chat if collapsed
                        if (!isExpanded) {
                          onExpandChange(true);
                        }
                        // Scroll to artifact after a brief delay for the DOM to update
                        setTimeout(() => {
                          const artifactElement = document.querySelector(`[data-artifact-id="${artifact.id}"]`);
                          if (artifactElement) {
                            artifactElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, isExpanded ? 100 : 800); // Longer delay if expanding
                      }
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-[var(--radius-xx-small)] text-[15px] text-[var(--text-neutral-x-strong)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors duration-150 flex items-center gap-3"
                  >
                    <Icon name={getArtifactIcon(artifact) as any} size={14} className="text-[var(--icon-neutral-strong)] shrink-0" />
                    <span className="truncate">{artifact.title}</span>
                  </button>
                ))}
                {artifacts.length > ARTIFACTS_INITIAL_COUNT && (
                  <button
                    onClick={() => setShowAllArtifacts(!showAllArtifacts)}
                    className="w-full text-left px-4 py-2 text-[13px] text-[var(--color-primary-strong)] hover:text-[var(--color-primary-medium)] transition-colors"
                  >
                    {showAllArtifacts ? 'Show less' : `See ${artifacts.length - ARTIFACTS_INITIAL_COUNT} more`}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Chats Section Header */}
          <div className="px-5 py-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-neutral-medium)]">
              Chats
            </span>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
              aria-label="Search chats"
            >
              <Icon name="magnifying-glass" size={14} className="text-[var(--icon-neutral-strong)]" />
            </button>
          </div>

          {/* Search Input */}
          {isSearchOpen && (
            <div className="px-4 pb-2">
              <input
                type="text"
                placeholder="Search conversations..."
                value={contextSearchQuery}
                onChange={(e) => setContextSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-[14px] bg-[var(--surface-neutral-xx-weak)] border border-[var(--border-neutral-weak)] rounded-[var(--radius-xx-small)] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-weak)] outline-none focus:border-[var(--color-primary-strong)]"
                autoFocus
              />
            </div>
          )}

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-2">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === selectedConversation?.id;
              return (
                <button
                  key={conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-[var(--radius-xx-small)]
                    text-[15px] text-[var(--text-neutral-x-strong)]
                    transition-colors duration-150
                    truncate
                    ${isActive
                      ? 'bg-[var(--surface-neutral-x-weak)] font-medium'
                      : 'hover:bg-[var(--surface-neutral-xx-weak)]'
                    }
                  `}
                >
                  {conversation.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Panel Header - only when not expanded */}
          {!isExpanded && (
            <div className="relative shrink-0 bg-[var(--surface-neutral-xx-weak)] rounded-tl-[20px]" ref={dropdownRef}>
              <div className="h-[62px] px-5 py-4 flex items-center justify-between">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <span className="text-[16px] font-medium leading-[24px] text-[var(--text-neutral-x-strong)]">
                    {title}
                  </span>
                  <Icon
                    name="caret-down"
                    size={10}
                    className={`text-[var(--icon-neutral-medium)] transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div className="flex items-center gap-[6px]">
                  <button
                    onClick={handleExpand}
                    className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xx-small)] hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
                    aria-label="Expand"
                  >
                    <Icon name="expand" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xx-small)] hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
                    aria-label="Close"
                    onClick={onClose}
                  >
                    <Icon name="xmark" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                  </button>
                </div>
              </div>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mx-1 mb-1 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-[var(--radius-small)] shadow-lg overflow-hidden">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        selectConversation(conversation.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`
                        w-full px-5 py-3 text-left text-[15px]
                        hover:bg-[var(--surface-neutral-xx-weak)]
                        transition-colors duration-150
                        ${
                          conversation.id === selectedConversation?.id
                            ? 'bg-[var(--surface-neutral-x-weak)] text-[var(--text-neutral-xx-strong)] font-medium'
                            : 'text-[var(--text-neutral-strong)]'
                        }
                      `}
                    >
                      {conversation.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Content Area */}
          <div className={`flex-1 flex flex-col min-h-0 ${isExpanded ? 'bg-[var(--surface-neutral-white)] p-6' : 'bg-[var(--surface-neutral-white)]'}`}>
            {isExpanded ? (
              /* Expanded view - grey rounded container */
              <>
                {/* Header with title and controls */}
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2>{title}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCollapse}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xx-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                      aria-label="Collapse to panel"
                    >
                      <Icon name="down-left-and-up-right-to-center" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xx-small)] hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
                      aria-label="Close chat"
                    >
                      <Icon name="xmark" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                    </button>
                  </div>
                </div>

              <div className="flex-1 flex flex-col bg-[var(--surface-neutral-xx-weak)] rounded-[20px] overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-[800px] mx-auto px-8 py-6 flex flex-col gap-6">
                    {messages.map((message) => (
                      <div key={message.id}>
                        {message.type === 'user' ? (
                          <div className="flex justify-end">
                            <div className="max-w-[70%] bg-[var(--surface-neutral-white)] px-4 py-3 rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px]">
                              <p className="text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)] whitespace-pre-line">
                                {message.text}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {/* AI Label */}
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 flex items-center justify-center bg-[var(--color-primary-strong)] rounded-full">
                                <Icon name="sparkles" size={12} className="text-white" />
                              </div>
                              <span className="text-[13px] font-semibold text-[var(--text-neutral-medium)]">
                                BambooHR Assistant
                              </span>
                            </div>
                            {/* AI Message */}
                            <div className="pl-8">
                              {message.text ? (
                                <MarkdownContent text={message.text} />
                              ) : (
                                <div className="flex items-center gap-2 text-[var(--text-neutral-medium)]">
                                  <div className="w-2 h-2 bg-[var(--color-primary-strong)] rounded-full animate-pulse"></div>
                                  <div className="w-2 h-2 bg-[var(--color-primary-strong)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                  <div className="w-2 h-2 bg-[var(--color-primary-strong)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                              )}
                              {/* Inline Artifact Card */}
                              {message.artifactId && (() => {
                                const artifact = artifacts.find(a => a.id === message.artifactId);
                                return artifact ? <InlineArtifactCard artifact={artifact} compact={false} /> : null;
                              })()}
                              {/* Suggestion Chips */}
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {message.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion)}
                                      className="px-4 py-2 text-[14px] text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer"
                                      style={{ boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)' }}
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex items-center gap-2 text-[var(--text-neutral-medium)] text-[13px]">
                        <Icon name="sparkles" size={12} className="text-[var(--color-primary-strong)]" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Input Area */}
                <div className="px-8 py-6">
                  <div className="max-w-[800px] mx-auto flex items-center gap-3 bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-weak)] rounded-full px-6 py-3 shadow-sm">
                    <textarea
                      placeholder="Ask Anything"
                      value={inputValue}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      className="flex-1 bg-transparent text-[15px] leading-[22px] text-white placeholder:text-[var(--text-neutral-medium)] outline-none resize-none overflow-hidden"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-70"
                      aria-label="Send message"
                    >
                      <Icon
                        name="paper-plane"
                        size={20}
                        className="text-[var(--icon-neutral-medium)]"
                      />
                    </button>
                  </div>
                </div>
              </div>
              </>
            ) : (
              /* Panel view - original layout */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-5 p-5">
                    {messages.map((message) => (
                      <div key={message.id}>
                        {message.type === 'user' ? (
                          <div className="flex justify-end pl-[34px]">
                            <div className="bg-[var(--surface-neutral-xx-weak)] px-4 py-3 rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px]">
                              <p className="text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)]">
                                {message.text}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            {message.text ? (
                              <MarkdownContent text={message.text} />
                            ) : (
                              <div className="flex items-center gap-2 text-[var(--text-neutral-medium)]">
                                <div className="w-2 h-2 bg-[var(--color-primary-strong)] rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-[var(--color-primary-strong)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-[var(--color-primary-strong)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            )}
                            {/* Inline Artifact Card */}
                            {message.artifactId && (() => {
                              const artifact = artifacts.find(a => a.id === message.artifactId);
                              return artifact ? <InlineArtifactCard artifact={artifact} compact={true} onExpand={handleExpand} /> : null;
                            })()}
                            {message.suggestions && message.suggestions.length > 0 && (
                              <div className="flex flex-col gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="self-start px-4 py-2 text-[14px] leading-[20px] text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer"
                                    style={{ boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)' }}
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex items-center gap-2 text-[var(--text-neutral-medium)] text-[13px]">
                        <Icon name="sparkles" size={12} className="text-[var(--color-primary-strong)]" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Input - Panel mode */}
                <div className="bg-[var(--surface-neutral-white)] px-5 pt-4 pb-5 rounded-b-[20px] shrink-0">
                  {/* AI gradient border wrapper */}
                  <div
                    className="relative rounded-lg p-[2px] min-h-[86px]"
                    style={{
                      background: 'linear-gradient(93deg, #87C276 0%, #7AB8EE 33.65%, #C198D4 66.83%, #F2A766 96.15%)',
                      boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04), 2px 2px 0px 2px rgba(56, 49, 47, 0.05)',
                    }}
                  >
                    <div className="bg-[var(--surface-neutral-white)] rounded-[6px] px-5 pt-4 pb-3 flex flex-col gap-3">
                      {/* Input field - Top row */}
                      <textarea
                        placeholder="Reply..."
                        value={inputValue}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="w-full bg-transparent text-[15px] leading-[22px] text-white placeholder:text-[var(--text-neutral-medium)] outline-none resize-none overflow-hidden"
                      />

                      {/* Icons row - Bottom */}
                      <div className="flex items-center justify-between">
                        {/* Left action icons */}
                        <div className="flex items-center gap-4">
                          <button className="hover:opacity-70 transition-opacity" aria-label="Attach file">
                            <Icon name="paperclip" size={16} className="text-[var(--icon-neutral-xx-strong)]" />
                          </button>
                          <button className="hover:opacity-70 transition-opacity" aria-label="Add image">
                            <Icon name="image" size={16} className="text-[var(--icon-neutral-xx-strong)]" />
                          </button>
                        </div>

                        {/* Right icons */}
                        <div className="flex items-center gap-4">
                          <button className="hover:opacity-70 transition-opacity" aria-label="Voice input">
                            <Icon name="microphone" size={16} className="text-[var(--icon-neutral-xx-strong)]" />
                          </button>
                          <button
                            type="button"
                            className="flex items-center justify-center"
                            onClick={handleSend}
                            aria-label="Send message"
                          >
                            <Icon
                              name="circle-arrow-up"
                              size={16}
                              className="text-[var(--icon-neutral-xx-strong)]"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatPanel;
