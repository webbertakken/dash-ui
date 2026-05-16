import type { HTMLAttributes, ReactNode } from 'react'

export interface UnitProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/**
 * Small inline label that trails a hero number inside a `.stat` row or a
 * `<Card>` title row (e.g. "Mbps · down", "Last 24 h", "ms · jitter band").
 * Renders a `<span class="unit">` so the `.unit` rule in
 * `@w5-ui/tokens/dashboard.css` sets the canonical muted colour, 12 px size,
 * and inline-block rhythm. Stops userland reaching for inline `font-size` /
 * `color` overrides next to bare numbers.
 *
 * Typed equivalent of `<span className="unit">`; pair with `<Stat>` (which
 * already wires this internally) for hero tiles, or compose by hand inside a
 * `<Card>` when the headline number sits above a chart.
 */
export function Unit({ className = '', children, ...rest }: UnitProps) {
  return (
    <span className={`unit ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
