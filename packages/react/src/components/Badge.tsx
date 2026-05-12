import type { ReactNode } from 'react'

export type BadgeColor = 'danger' | 'warn' | 'info' | 'success' | 'neutral'

export interface BadgeProps {
  children: ReactNode
  count?: number
  dot?: boolean
  max?: number
  showZero?: boolean
  color?: BadgeColor
  className?: string
}

export function Badge({
  children,
  count,
  dot = false,
  max = 99,
  showZero = false,
  color = 'danger',
  className = '',
}: BadgeProps) {
  const show = dot || (count !== undefined && (showZero || count > 0))
  const label = count !== undefined ? (count > max ? `${max}+` : String(count)) : ''
  return (
    <span className={`badge-wrapper${className ? ` ${className}` : ''}`}>
      {children}
      {show && (
        <span className={`badge badge-${color}${dot ? ' badge-dot' : ''}`} aria-hidden="true">
          {!dot && label}
        </span>
      )}
    </span>
  )
}
