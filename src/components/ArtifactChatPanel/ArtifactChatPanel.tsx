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

  return (
    <div
      className="w-[400px] flex flex-col shrink-0"
      style={{
        backgroundColor: 'var(--surface-neutral-xx-weak)',
        borderLeft: '1px solid var(--border-neutral-weak)',
      }}
    >
      {/* Chat Header */}
      <div
        className="px-5 py-4"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          borderBottom: '1px solid var(--border-neutral-x-weak)',
        }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-neutral-xx-strong)]">
          <Icon name="sparkles" size={14} className="text-[var(--color-primary-strong)]" />
          BambooHR Assistant
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          {conversation?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'user' ? (
                <div
                  className="max-w-[90%] px-4 py-3 rounded-xl rounded-br-sm text-sm text-[var(--text-neutral-strong)]"
                  style={{ backgroundColor: 'var(--surface-neutral-white)' }}
                >
                  {message.text}
                </div>
              ) : (
                <div className="max-w-[90%]">
                  <div className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary-strong)] mb-1">
                    <Icon name="sparkles" size={12} />
                    BambooHR Assistant
                  </div>
                  <div
                    className="px-4 py-3 rounded-xl rounded-bl-sm text-sm text-[var(--text-neutral-strong)]"
                    style={{ backgroundColor: 'var(--surface-neutral-white)' }}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInputValue(suggestion)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:bg-[var(--surface-neutral-x-weak)]"
                            style={{
                              borderColor: 'var(--border-neutral-weak)',
                              color: 'var(--text-neutral-medium)',
                            }}
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

          {/* Empty state */}
          {(!conversation || conversation.messages.length === 0) && (
            <div className="text-center py-8">
              <Icon name="sparkles" size={24} className="text-[var(--color-primary-weak)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-neutral-medium)]">
                Ask questions about this chart or request changes
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div
        className="px-5 py-4"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          borderTop: '1px solid var(--border-neutral-x-weak)',
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'var(--surface-neutral-xx-weak)',
            border: '1px solid var(--border-neutral-weak)',
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this chart..."
            className="flex-1 bg-transparent text-sm outline-none text-[var(--text-neutral-xx-strong)] placeholder:text-[var(--text-neutral-weak)]"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary-strong)' }}
          >
            <Icon name="arrow-up" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArtifactChatPanel;
