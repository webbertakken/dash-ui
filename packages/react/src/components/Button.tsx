import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner.js'

export type ButtonVariant = 'primary' | 'ghost' | 'danger'

/** Native `title` is omitted: name a control with `aria-label` and wrap it in a `Tooltip`. */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
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

/**
 * Icon-only button. Name it with `aria-label`, or wrap it in `<Tooltip label>`,
 * which names an unlabelled icon button after the tooltip.
 */
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  children?: ReactNode
}

export function IconButton({
  className = '',
  type = 'button',
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button type={type} className={`icon-btn ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
