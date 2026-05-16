import type { HTMLAttributes, ReactNode } from 'react'

export interface FieldStackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Single-column form rhythm: a vertical stack of `<Field>`s with the canonical
 * 16 px gap. Typed equivalent of `<div className="field-stack">` from
 * `@w5-ui/tokens/dashboard.css`. Reach for this inside narrow `<Card>` tiles
 * and `<Modal>` bodies.
 */
export function FieldStack({ className = '', children, ...rest }: FieldStackProps) {
  return (
    <div className={`field-stack ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
