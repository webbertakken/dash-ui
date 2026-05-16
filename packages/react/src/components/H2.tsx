import type { HTMLAttributes, ReactNode } from 'react'

export interface H2Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

/**
 * Page section heading - the 30 px / semibold / `--lh-snug` rhythm used
 * for top-of-section labels on a dashboard page (above a grid of cards,
 * above a table, above a settings group). Renders
 * `<h2 class="dash-ui-h2">` so the `.dash-ui-h2` rule in
 * `@w5-ui/tokens/tokens.css` pins the canonical size, weight,
 * line-height, and `--text-1` colour. Stops userland reaching for a
 * one-off `<h2 style={{ fontSize: 30, fontWeight: 600 }}>` (or worse,
 * leaving an unstyled browser default `<h2>` at ~24 px with 700 weight
 * and 1.2 line-height, which is the documented "section headings feel
 * cramped on one line" drift).
 *
 * Typed equivalent of `<h2 className="dash-ui-h2">`. This is the
 * userland-facing semantic class documented in **Foundations / Type**.
 * Use `<H2>` for the page section head ("Devices", "Wi-Fi", "Settings")
 * sitting above a content block. For card titles prefer `<H4>` (or just
 * `<Card title="…">`, which injects `.dash-ui-h4` for you); for full
 * page titles in marketing pages prefer `<H1>`.
 */
export function H2({ className = '', children, ...rest }: H2Props) {
  return (
    <h2 className={`dash-ui-h2 ${className}`.trim()} {...rest}>
      {children}
    </h2>
  )
}
