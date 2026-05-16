import type { HTMLAttributes, ReactNode } from 'react'

export interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
  dir: 'up' | 'down' | 'flat'
  children?: ReactNode
}

/**
 * Trend indicator span used inside `<Submeta>` or any inline copy where a delta
 * needs to be colour-coded (success/green when up, danger/red when down,
 * neutral when flat). Emits a visually-hidden `Trend: ` prefix so screen
 * readers announce the direction independent of the arrow glyph the caller
 * supplies in the copy.
 *
 * Typed equivalent of `<span className="delta-up | delta-down">` from
 * `@w5-ui/tokens/dashboard.css`.
 */
export function Delta({ dir, className = '', children, ...rest }: DeltaProps) {
  const cls = dir === 'flat' ? '' : `delta-${dir}`
  const merged = `${cls} ${className}`.trim()
  return (
    <>
      <span className="sr-only">Trend: </span>
      <span className={merged || undefined} {...rest}>
        {children}
      </span>
    </>
  )
}
