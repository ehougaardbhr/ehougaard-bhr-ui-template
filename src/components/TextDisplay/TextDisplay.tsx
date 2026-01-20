interface TextDisplayProps {
  content: string;
  maxLength?: number;
  className?: string;
}

export function TextDisplay({ content, maxLength, className = '' }: TextDisplayProps) {
  const displayContent = maxLength && content.length > maxLength
    ? content.substring(0, maxLength) + '...'
    : content;

  return (
    <div
      className={`whitespace-pre-wrap ${className}`}
      style={{
        color: 'var(--text-neutral-strong)',
        fontSize: '15px',
        lineHeight: '1.6',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {displayContent}
    </div>
  );
}

export default TextDisplay;
