import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';

interface Suggestion {
  label: string;
  onClick?: () => void;
}

interface OrgChartAIInputProps {
  placeholder?: string;
  suggestions?: Suggestion[];
  onSubmit?: (value: string) => void;
  onSuggestionClick?: (suggestion: Suggestion) => void;
  className?: string;
}

export function OrgChartAIInput({
  placeholder = "Ask about Shannon's team",
  suggestions = [
    { label: "What if Shannon's team grew?" },
    { label: "Analyze span of control" },
  ],
  onSubmit,
  onSuggestionClick,
  className = '',
}: OrgChartAIInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to blur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else if (suggestion.onClick) {
      suggestion.onClick();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`
        ${isFocused ? 'border-transparent' : 'border border-[var(--border-neutral-x-weak)]'}
        rounded-[var(--radius-large)]
        p-[var(--space-l)]
        flex flex-col gap-4
        transition-all duration-200
        ${className}
      `}
      style={
        isFocused
          ? {
              background:
                'linear-gradient(var(--surface-neutral-white), var(--surface-neutral-white)) padding-box, linear-gradient(90deg, #87c276 0%, #5eb3d4 33%, #c77dd4 66%, #f0a36e 100%) border-box',
              border: '1px solid transparent',
              boxShadow: `
                -15px 0 30px -10px rgba(135, 194, 118, 0.5),
                0 -10px 30px -10px rgba(94, 179, 212, 0.5),
                15px 0 30px -10px rgba(240, 163, 110, 0.5),
                0 15px 30px -10px rgba(199, 125, 212, 0.4),
                3px 6px 10px 0px rgba(56, 49, 47, 0.15)
              `,
            }
          : {
              background: 'var(--surface-neutral-white)',
              boxShadow: '3px 6px 10px 0px rgba(56, 49, 47, 0.2)'
            }
      }
    >
      {/* Input Field */}
      <div
        className="
          flex items-center
          w-full min-w-[48px]
          bg-[var(--surface-neutral-white)]
          border border-[var(--border-neutral-medium)]
          rounded-[var(--radius-xx-small)]
        "
        style={{ boxShadow: '1px 1px 0px 0px rgba(56, 49, 47, 0.04)' }}
      >
        <div className="flex items-center gap-3 flex-1 h-12 pl-3 pr-4 py-2">
          {/* Sparkles Icon */}
          <div className="flex items-center justify-center w-5 h-5 shrink-0">
            <Icon
              name="sparkles"
              size={20}
              className="text-[var(--icon-neutral-xx-strong)]"
            />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="
              flex-1
              text-[16px] leading-6 font-normal
              text-[var(--text-neutral-strong)]
              placeholder:text-[var(--text-neutral-strong)]
              bg-transparent
              outline-none
              min-w-0
            "
          />

          {/* Submit Icon */}
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center w-5 h-5 shrink-0 cursor-pointer"
          >
            <Icon
              name="circle-arrow-up"
              size={20}
              className="text-[var(--icon-neutral-strong)]"
            />
          </button>
        </div>
      </div>

      {/* Suggestions - always visible, positioned below input */}
      {suggestions.length > 0 && (
        <div className="flex items-stretch gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="
                flex items-center gap-2
                min-h-8 py-1.5 px-3
                bg-[var(--surface-neutral-white)]
                border border-[var(--border-neutral-medium)]
                rounded-full
                cursor-pointer
                transition-colors
                hover:bg-[var(--surface-neutral-xx-weak)]
              "
              style={{ boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)' }}
            >
              <span className="text-[13px] font-semibold leading-[19px] text-[var(--text-neutral-strong)]">
                {suggestion.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrgChartAIInput;
