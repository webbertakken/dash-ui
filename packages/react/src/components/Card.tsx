import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  span?: number
  children?: ReactNode
}

export function Card({ span, style, className = '', children, ...rest }: CardProps) {
  const merged: CSSProperties = { ...style, ...(span ? { gridColumn: `span ${span}` } : null) }
  return (
    <div className={`card ${className}`.trim()} style={merged} {...rest}>
      {children}
    </div>
  )
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

/**
 * Title row inside a `<Card>` tile. Renders a plain `<h3>` so the `.card h3`
 * rule in `@w5-ui/tokens/dashboard.css` sets the canonical 12 px size, weight
 * 500, `--text-3` (muted) colour, and flex layout (title on the left, any trailing
 * `<Pill>` / `<CardMore>` pushed to the right edge). Stops userland reaching
 * for an `<h2>` or a custom `<div className="title">` that would skip the
 * rule and read broken inside the tile.
 *
 * Use the typed wrapper instead of a raw `<h3>` when the markup is awkward
 * (codegen, MDX, mixed JSX trees); otherwise a plain `<h3>` works equally
 * well. Pair with `<CardMore>` for a trailing "View all →" affordance and
 * `<Pill>` for inline status.
 */
export function CardTitle({ children, className = '', ...rest }: CardTitleProps) {
  return (
    <h3 className={className} {...rest}>
      {children}
    </h3>
  )
}
