import { Icon } from '../Icon';
import type { InputHTMLAttributes } from 'react';

interface TextInputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'dropdown' | 'date';
  size?: 'default' | 'small';
  className?: string;
  inputClassName?: string;
  icon?: string;
  onKeyPress?: InputHTMLAttributes<HTMLInputElement>['onKeyPress'];
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
  size = 'default',
  className = '',
  inputClassName = '',
  icon,
  onKeyPress,
}: TextInputProps) {
  const isSmall = size === 'small';

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
          ${isSmall ? 'h-8 px-4 py-2' : 'h-10 pl-4 pr-3 py-2'}
          bg-[var(--surface-neutral-white)]
          border border-[var(--border-neutral-medium)]
          ${isSmall ? 'rounded-full' : 'rounded-[var(--radius-xx-small)]'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${inputClassName}
        `}
        style={{ boxShadow: '1px 1px 0px 1px rgba(56,49,47,0.04)' }}
      >
        {icon && (
          <Icon name={icon as any} size={16} className="text-[var(--icon-neutral-strong)] shrink-0" />
        )}
        <input
          type={type === 'date' ? 'text' : 'text'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 bg-transparent ${isSmall ? 'text-[14px] leading-[20px]' : 'text-[15px] leading-[22px]'} text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-weak)] outline-none min-w-0`}
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
