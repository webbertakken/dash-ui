import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner.js'

export type ButtonVariant = 'primary' | 'ghost' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  iconOnly?: boolean
  loading?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'ghost',
  iconOnly = false,
  loading = false,
  className = '',
  type = 'button',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const cls = ['btn', `btn-${variant}`, iconOnly && 'btn-icon', className].filter(Boolean).join(' ')
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export function IconButton({
  className = '',
  type = 'button',
  children,
  title,
  'aria-label': ariaLabel,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`icon-btn ${className}`.trim()}
      title={title}
      aria-label={ariaLabel ?? title}
      {...rest}
    >
      {children}
    </button>
  )
}
