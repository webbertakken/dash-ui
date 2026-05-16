import type { HTMLAttributes, ReactNode } from 'react'

export interface MacProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/**
 * Inline monospace label for MAC addresses, IPs, SKUs, serial numbers and
 * other fixed-width identifiers that read inside a table cell or a property
 * row. Renders a `<span class="mac">` so the `.mac` rule in
 * `@w5-ui/tokens/dashboard.css` applies the canonical JetBrains Mono family,
 * 12 px size, and muted colour. Stops userland reaching for inline
 * `font-family` / `font-size` overrides on bare identifiers.
 *
 * Typed equivalent of `<span className="mac">` (and `<td className="mac">`
 * inside a table — apply the class directly to the `<td>` there, or wrap the
 * cell contents with `<Mac>` when the cell carries other markup too).
 */
export function Mac({ className = '', children, ...rest }: MacProps) {
  return (
    <span className={`mac ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
