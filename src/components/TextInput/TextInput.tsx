import { Icon } from '../Icon';

interface TextInputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'dropdown' | 'date';
  className?: string;
  inputClassName?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
  className = '',
  inputClassName = '',
}: TextInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[14px] font-medium leading-[20px] text-[var(--text-neutral-x-strong)]">
          {label}
        </label>
      )}
      <div
        className={`
          flex items-center gap-4
          h-10 pl-4 pr-3 py-2
          bg-[var(--surface-neutral-white)]
          border border-[var(--border-neutral-medium)]
          rounded-[var(--radius-xx-small)]
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${inputClassName}
        `}
        style={{ boxShadow: 'var(--shadow-100)' }}
      >
        <input
          type={type === 'date' ? 'text' : 'text'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-[15px] leading-[22px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-weak)] outline-none min-w-0"
        />
        {type === 'dropdown' && (
          <div className="flex items-center gap-2 h-full shrink-0">
            <div className="w-px h-full bg-[var(--border-neutral-medium)]" />
            <Icon name="caret-down" size={16} className="text-[var(--icon-neutral-strong)]" />
          </div>
        )}
        {type === 'date' && (
          <Icon name="calendar" size={16} className="text-[var(--icon-neutral-strong)] shrink-0" />
        )}
      </div>
    </div>
  );
}

export default TextInput;
