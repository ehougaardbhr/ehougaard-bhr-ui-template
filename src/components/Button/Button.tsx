import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'standard' | 'primary' | 'ghost' | 'outlined' | 'text' | 'ai';
  size?: 'small' | 'medium' | 'large';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  showCaret?: boolean;
}

export function Button({
  children,
  variant = 'standard',
  size = 'medium',
  icon,
  iconPosition = 'left',
  showCaret = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold
    rounded-[var(--radius-full)]
    transition-all duration-200
    cursor-pointer
  `;

  const fontSizeStyles = {
    small: 'text-[13px] leading-[19px]',
    medium: 'text-[15px] leading-[22px]',
    large: 'text-[18px] leading-[26px]',
  };

  const variantStyles = {
    standard: `
      bg-[var(--surface-neutral-white)]
      border border-[var(--border-neutral-medium)]
      text-[var(--text-neutral-strong)]
      hover:bg-[var(--surface-neutral-xx-weak)]
    `,
    primary: `
      bg-[var(--color-primary-strong)]
      border border-transparent
      text-white
      hover:bg-[var(--color-primary-medium)]
    `,
    ghost: `
      bg-transparent
      border border-transparent
      text-[var(--text-neutral-strong)]
      hover:bg-[var(--surface-neutral-xx-weak)]
    `,
    outlined: `
      bg-[var(--surface-neutral-white)]
      border border-[var(--color-primary-strong)]
      text-[var(--color-primary-strong)]
      hover:bg-[var(--surface-neutral-xx-weak)]
    `,
    text: `
      bg-transparent
      border border-transparent
      text-[#0b4fd1]
      hover:underline
      h-auto
      px-0
    `,
    ai: `
      border border-transparent
      text-[#004876] dark:text-[#7DD3D7]
      relative
      disabled:opacity-100
    `,
  };

  const sizeStyles = {
    small: 'h-8 px-4',
    medium: 'h-10 px-5',
    large: 'h-12 px-6',
  };

  const iconColor = {
    standard: 'var(--icon-neutral-x-strong)',
    primary: 'white',
    ghost: 'var(--icon-neutral-x-strong)',
    outlined: 'var(--color-primary-strong)',
    text: '#0b4fd1',
    ai: 'currentColor', // Inherit from CSS which handles dark mode
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${fontSizeStyles[size]}
        ${variantStyles[variant]}
        ${variant !== 'text' ? sizeStyles[size] : ''}
        ${variant === 'ai' ? 'ai-button' : ''}
        ${className}
      `}
      style={{
        ...(variant === 'standard' || variant === 'outlined' ? { boxShadow: 'var(--shadow-100)' } : {}),
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <Icon name={icon} size={16} style={{ color: iconColor[variant] }} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <Icon name={icon} size={16} style={{ color: iconColor[variant] }} />
      )}
      {showCaret && (
        <Icon name="caret-down" size={10} style={{ color: iconColor[variant] }} />
      )}
    </button>
  );
}

export default Button;
