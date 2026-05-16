import type { HTMLAttributes, ReactNode } from 'react'

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Right-aligned action row that closes a form `<Card>` or modal body:
 * `display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px`.
 * Typed equivalent of `<div className="form-actions">` from
 * `@w5-ui/tokens/dashboard.css`. Place destructive / cancel buttons on the
 * left, primary on the right.
 */
export function FormActions({ className = '', children, ...rest }: FormActionsProps) {
  return (
    <div className={`form-actions ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
