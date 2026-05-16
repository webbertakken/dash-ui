import type { AnchorHTMLAttributes, ReactNode } from 'react'

export interface CardMoreProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode
}

/**
 * Trailing "View all" / "More →" affordance inside a `<Card>` title row.
 * Renders an `<a class="more">` so the `.card h3 .more` rule in
 * `@w5-ui/tokens/dashboard.css` styles it (muted colour, pointer cursor) and
 * the parent `<h3>` flex pushes it to the right edge of the title.
 *
 * Typed equivalent of `<a className="more">` inside `<h3>` for the canonical
 * card title pattern; pair with `<Card>` / `<CardTitle>` for full ergonomics.
 */
export function CardMore({ className = '', children, ...rest }: CardMoreProps) {
  return (
    <a className={`more ${className}`.trim()} {...rest}>
      {children}
    </a>
  )
}
