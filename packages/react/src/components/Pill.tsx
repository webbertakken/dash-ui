import type { ReactNode, CSSProperties } from 'react'

export type PillVariant = 'success' | 'warn' | 'danger' | 'info' | 'neutral'

export interface PillProps {
  variant?: PillVariant
  showDot?: boolean
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export function Pill({
  variant = 'neutral',
  showDot = true,
  children,
  style,
  className = '',
}: PillProps) {
  return (
    <span className={`pill pill-${variant} ${className}`.trim()} style={style}>
      {showDot && <span className="dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
