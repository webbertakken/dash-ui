import type { HTMLAttributes, ReactNode } from 'react'

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Two-column form grid: `1fr 1fr` with the canonical 14 px gap and 6 px top
 * offset that every Settings card uses. Typed equivalent of
 * `<div className="form-row">` from `@w5-ui/tokens/dashboard.css`. Use inside
 * wider `<Card>` tiles for dense editors.
 */
export function FormRow({ className = '', children, ...rest }: FormRowProps) {
  return (
    <div className={`form-row ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
