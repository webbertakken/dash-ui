import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconOnly?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'ghost',
  iconOnly = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const cls = ['btn', `btn-${variant}`, iconOnly && 'btn-icon', className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function IconButton({ className = '', children, ...rest }: IconButtonProps) {
  return (
    <button className={`icon-btn ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
