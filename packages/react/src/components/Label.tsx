import type { HTMLAttributes, ReactNode } from 'react'

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/**
 * Small categorical label - the line above a KPI number ("Active devices"),
 * the cell heading on a hand-rolled form row, the tag on a definition list
 * term, anywhere a 13 px / medium-weight tag belongs without the full form
 * field machinery. Renders `<span class="dash-ui-label">` so the
 * `.dash-ui-label` rule in `@w5-ui/tokens/tokens.css` applies the canonical
 * 13 px / 500 weight, 1.25 line-height, and `--text-2` colour. Stops
 * userland reaching for a one-off `font-size: 13px; font-weight: 500;` duo
 * on every KPI label or hand-rolled form caption.
 *
 * Typed equivalent of `<span className="dash-ui-label">`. This is the
 * userland-facing semantic class documented in **Foundations / Type**.
 * For real form fields prefer `<Field label="…">` - it wires `htmlFor`,
 * required, hint, and error semantics for you. For KPI tiles prefer the
 * `<Stat>` label slot. Reach for `<Label>` only when hand-rolling a tile
 * or row where the higher-level component doesn't fit.
 */
export function Label({ className = '', children, ...rest }: LabelProps) {
  return (
    <span className={`dash-ui-label ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
