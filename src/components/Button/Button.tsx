import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'standard' | 'primary' | 'ghost';
  size?: 'small' | 'medium';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'standard',
  size = 'medium',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold text-[15px] leading-[22px]
    rounded-[var(--radius-full)]
    transition-all duration-200
    cursor-pointer
  `;

  const variantStyles = {
    standard: `
      bg-white
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
  };

  const sizeStyles = {
    small: 'h-8 px-4',
    medium: 'h-10 px-5',
  };

  const iconColor = {
    standard: 'var(--icon-neutral-x-strong)',
    primary: 'white',
    ghost: 'var(--icon-neutral-x-strong)',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{ boxShadow: variant === 'standard' ? 'var(--shadow-100)' : undefined }}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <Icon name={icon} size={16} className={`text-[${iconColor[variant]}]`} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <Icon name={icon} size={16} className={`text-[${iconColor[variant]}]`} />
      )}
    </button>
  );
}

export default Button;
