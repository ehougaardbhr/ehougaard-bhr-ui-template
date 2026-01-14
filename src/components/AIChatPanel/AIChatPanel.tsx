import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { recentConversations } from '../../data/chatData';
import type { ChatConversation } from '../../data/chatData';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation>(recentConversations[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    // Close the slide-in panel
    localStorage.setItem('bhr-chat-panel-open', 'false');
    // Navigate to full-page chat
    navigate(`/chat/${selectedConversation.id}`);
  };

  const messages = selectedConversation.messages;
  const title = selectedConversation.title;

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

  const handleSend = () => {
    if (inputValue.trim()) {
      // In a real app, this would send the message
      setInputValue('');
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
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <div
      className={`fixed right-0 top-[106px] bottom-[40px] z-40 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[399px]' : 'w-0'
      } overflow-hidden`}
    >
      {/* Padding wrapper */}
      <div className="w-full h-full pr-10">
        {/* Beige border container */}
        <div className="w-full h-full bg-[var(--surface-neutral-xx-weak)] rounded-[20px] p-1">
          {/* White content container */}
          <div className="w-full h-full bg-[var(--surface-neutral-white)] rounded-[20px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="relative shrink-0 bg-[var(--surface-neutral-xx-weak)] rounded-t-[20px]" ref={dropdownRef}>
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
                  {recentConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setIsDropdownOpen(false);
                      }}
                      className={`
                        w-full px-5 py-3 text-left text-[15px]
                        hover:bg-[var(--surface-neutral-xx-weak)]
                        transition-colors duration-150
                        ${
                          conversation.id === selectedConversation.id
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

            {/* Content Area */}
            <div className="flex-1 bg-[var(--surface-neutral-white)] overflow-y-auto">
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
                        <p className="text-[15px] leading-[22px] text-[var(--text-neutral-xx-strong)] whitespace-pre-line">
                          {message.text}
                        </p>
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                className="self-start px-4 py-2 text-[14px] leading-[20px] text-[var(--text-neutral-x-strong)] bg-[var(--surface-neutral-white)] border border-[var(--border-neutral-medium)] rounded-full hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
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
              </div>
            </div>

            {/* Footer Input */}
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
                    className="w-full bg-transparent text-[15px] leading-[22px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-medium)] outline-none resize-none overflow-hidden"
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
        </div>
      </div>
    </div>
  );
}

export default AIChatPanel;
