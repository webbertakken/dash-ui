import type { HTMLAttributes, ReactNode } from 'react'

export interface SubmetaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Secondary one-line caption inside a `<Card>` tile: the muted row that sits
 * under the headline `.stat` number and carries supporting metrics, deltas, or
 * status. Carries the canonical 12 px font size, `--text-2` colour, and the
 * `↑` / `↓` separator rhythm the Dashboard reference tiles use.
 *
 * Typed equivalent of `<div className="submeta">` from
 * `@w5-ui/tokens/dashboard.css`. Pair with `.delta-up` / `.delta-down` spans
 * for trend text so screen readers announce the direction.
 */
export function Submeta({ className = '', children, ...rest }: SubmetaProps) {
  return (
    <div className={`submeta ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
