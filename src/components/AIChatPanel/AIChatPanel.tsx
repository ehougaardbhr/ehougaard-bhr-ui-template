import { useState } from 'react';
import { Icon } from '../Icon';
import { defaultConversation } from '../../data/chatData';
import type { ChatMessage } from '../../data/chatData';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages] = useState<ChatMessage[]>(defaultConversation.messages);
  const title = defaultConversation.title;

  const handleSend = () => {
    if (inputValue.trim()) {
      // In a real app, this would send the message
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            <div className="h-[62px] px-5 py-4 flex items-center justify-between shrink-0 bg-[var(--surface-neutral-xx-weak)] rounded-t-[20px]">
              <div className="flex items-center gap-3">
                <span className="text-[16px] font-medium leading-[24px] text-[var(--text-neutral-x-strong)]">
                  {title}
                </span>
                <Icon name="caret-down" size={10} className="text-[var(--icon-neutral-medium)]" />
              </div>
              <div className="flex items-center gap-[6px]">
                <button
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
            <div className="h-[118px] bg-[var(--surface-neutral-white)] p-4 rounded-b-[20px] shrink-0">
              <div className="relative">
                {/* AI gradient border wrapper */}
                <div
                  className="relative rounded-lg p-[2px]"
                  style={{
                    background: 'linear-gradient(93deg, #87C276 0%, #7AB8EE 33.65%, #C198D4 66.83%, #F2A766 96.15%)',
                    boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04), 2px 2px 0px 2px rgba(56, 49, 47, 0.05)',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Reply..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-[64px] pl-5 pr-14 bg-[var(--surface-neutral-white)] rounded-[6px] text-[15px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-medium)] outline-none"
                  />
                </div>
                {/* Send button */}
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                  onClick={handleSend}
                >
                  <Icon
                    name="circle-arrow-up"
                    size={20}
                    className={inputValue.trim() ? 'text-[var(--color-primary-strong)]' : 'text-[var(--icon-neutral-x-weak)]'}
                  />
                </button>
              </div>
              {/* Action icons */}
              <div className="flex items-center gap-4 mt-2 pl-1">
                <button className="p-1 hover:bg-[var(--surface-neutral-xx-weak)] rounded transition-colors">
                  <Icon name="paperclip" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                </button>
                <button className="p-1 hover:bg-[var(--surface-neutral-xx-weak)] rounded transition-colors">
                  <Icon name="image" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                </button>
                <button className="p-1 hover:bg-[var(--surface-neutral-xx-weak)] rounded transition-colors">
                  <Icon name="microphone" size={16} className="text-[var(--icon-neutral-x-strong)]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatPanel;
