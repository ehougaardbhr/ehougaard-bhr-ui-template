import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import { useChat } from '../../contexts/ChatContext';

interface ArtifactChatPanelProps {
  conversationId: string | null;
}

export function ArtifactChatPanel({ conversationId }: ArtifactChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { conversations, addMessage, selectConversation } = useChat();

  // Find the conversation for this artifact
  const conversation = conversationId
    ? conversations.find(c => c.id === conversationId)
    : null;

  // Select this conversation when panel mounts
  useEffect(() => {
    if (conversationId) {
      selectConversation(conversationId);
    }
  }, [conversationId, selectConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !conversationId) return;

    // Add user message
    addMessage(conversationId, {
      type: 'user',
      text: inputValue.trim(),
    });

    // Simulate AI response after a short delay
    setTimeout(() => {
      addMessage(conversationId, {
        type: 'ai',
        text: "I've updated the chart based on your request. You can also use the settings panel to further customize the visualization.",
      });
    }, 1000);

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  return (
    <div
      className="w-[367px] flex flex-col shrink-0 p-1 rounded-[20px]"
      style={{
        backgroundColor: 'var(--surface-neutral-xx-weak)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 rounded-t-[12px]"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <Icon name="sparkles" size={20} className="text-[var(--color-primary-strong)]" />
          <span className="text-[16px] font-medium text-[var(--text-neutral-x-strong)]">
            BambooHR Assistant
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5"
        style={{ backgroundColor: 'var(--surface-neutral-white)' }}
      >
        <div className="flex flex-col gap-5">
          {conversation?.messages.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                <div className="flex justify-end pl-[34px]">
                  <div
                    className="px-4 py-3 rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] text-[15px] leading-[22px] text-[var(--text-neutral-x-strong)]"
                    style={{ backgroundColor: 'var(--surface-neutral-xx-weak)' }}
                  >
                    {message.text}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-[15px] leading-[22px] text-[var(--text-neutral-xx-strong)] whitespace-pre-line">
                    {message.text}
                  </p>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputValue(suggestion)}
                          className="px-4 py-2 text-[14px] text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
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

          {/* Empty state */}
          {(!conversation || conversation.messages.length === 0) && (
            <div className="text-center py-8">
              <Icon name="sparkles" size={24} className="text-[var(--color-primary-weak)] mx-auto mb-3" />
              <p className="text-[15px] text-[var(--text-neutral-medium)]">
                Ask questions about this chart or request changes
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div
        className="p-4 rounded-b-[16px]"
        style={{ backgroundColor: 'var(--surface-neutral-white)' }}
      >
        {/* Rainbow gradient border wrapper */}
        <div
          className="relative rounded-lg p-[2px] min-h-[86px]"
          style={{
            background: 'linear-gradient(93deg, #87C276 0%, #7AB8EE 33.65%, #C198D4 66.83%, #F2A766 96.15%)',
            boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04), 2px 2px 0px 2px rgba(56, 49, 47, 0.05)',
          }}
        >
          <div className="bg-[var(--surface-neutral-white)] rounded-[6px] px-5 pt-4 pb-3 flex flex-col gap-3">
            {/* Input field */}
            <textarea
              placeholder="Reply..."
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              className="w-full bg-transparent text-[15px] leading-[22px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-medium)] outline-none resize-none overflow-hidden"
            />

            {/* Icons row */}
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
                    className={inputValue.trim() ? 'text-[var(--icon-neutral-xx-strong)]' : 'text-[var(--icon-neutral-x-weak)]'}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtifactChatPanel;
