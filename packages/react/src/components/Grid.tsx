import type { HTMLAttributes, ReactNode } from 'react'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * The canonical 12-column page grid: `repeat(12, 1fr)` with a 12 px gap and
 * `16px 24px` padding, reserving room for the bottom panel when present.
 *
 * Typed equivalent of `<div className="grid">` from `@w5-ui/tokens/dashboard.css`.
 * Use as a direct child of the scrolling `.content` region; place `<Card>` /
 * `<Stat>` tiles inside with `span={4 | 6 | 8 | 12}`.
 */
export function Grid({ className = '', children, ...rest }: GridProps) {
  return (
    <div className={`grid ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
