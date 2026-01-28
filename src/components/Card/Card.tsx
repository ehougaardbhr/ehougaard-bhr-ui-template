import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-[var(--surface-neutral-white)] dark:bg-neutral-800 rounded-[var(--radius-small)] ${className}`}
      style={{
        boxShadow: 'var(--shadow-300)',
      }}
    >
      {children}
    </div>
  );
}
