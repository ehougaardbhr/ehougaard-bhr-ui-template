import { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';

interface Suggestion {
  label: string;
  variant?: 'standard' | 'ai';
  onClick?: () => void;
}

interface AIInlineMessageProps {
  title?: string;
  suggestions?: Suggestion[];
  onSuggestionClick?: (suggestion: Suggestion) => void;
  className?: string;
}

export function AIInlineMessage({
  title = "Explore staffing scenarios",
  suggestions = [
    { label: "Plan team expansion", variant: 'standard' },
    { label: "Analyze Shannon's span of control", variant: 'standard' },
    { label: "Ask about anything...", variant: 'ai' },
  ],
  onSuggestionClick,
  className = '',
}: AIInlineMessageProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else if (suggestion.onClick) {
      suggestion.onClick();
    }
  };

  const lightGradient = 'linear-gradient(137.805deg, rgb(233, 243, 252) 0%, rgb(245, 238, 248) 100%)';
  const darkGradient = 'linear-gradient(137.805deg, rgb(30, 41, 50) 0%, rgb(45, 35, 48) 100%)';

  return (
    <div
      className={`
        flex items-center gap-3
        px-5 py-3
        rounded-lg
        border-4 border-white dark:border-gray-700
        ${className}
      `}
      style={{
        background: isDarkMode ? darkGradient : lightGradient,
      }}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2">
        <Icon
          name="sparkles"
          size={16}
          className="text-[var(--icon-brand-strong)] dark:text-blue-400"
        />
        <span className="text-[14px] leading-5 font-semibold text-[var(--text-neutral-xx-strong)] dark:text-gray-100">
          {title}
        </span>
      </div>

      {/* Suggestions */}
      <div className="flex items-center gap-2 ml-auto">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant={suggestion.variant === 'ai' ? 'ai' : 'standard'}
            size="small"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default AIInlineMessage;
