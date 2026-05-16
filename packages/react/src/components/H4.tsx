import type { HTMLAttributes, ReactNode } from 'react'

export interface H4Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

/**
 * Card / tile title - the 18 px / semibold / `--lh-snug` rhythm used
 * for the heading that sits inside a card, a stat tile, or a settings
 * sub-panel. Renders `<h4 class="dash-ui-h4">` so the `.dash-ui-h4`
 * rule in `@w5-ui/tokens/tokens.css` pins the canonical size, weight,
 * line-height, and `--text-1` colour. Stops userland reaching for a
 * one-off `<h3 style={{ fontSize: 20 }}>` or `text-xl` (the documented
 * "card title size doesn't match the reference" case), and stops them
 * leaving an unstyled browser default `<h4>` at ~13.3 px / 700 / 1.2
 * which reads as caption text instead of a title.
 *
 * Typed equivalent of `<h4 className="dash-ui-h4">`. This is the
 * userland-facing semantic class documented in **Foundations / Type**.
 * Use `<H4>` when you build a card-like tile by hand and need the
 * canonical 18 / 600 title. If you reach for `<Card title="…">` you
 * get the same class injected for you - prefer that. For page section
 * heads prefer `<H2>`; for sub-section heads prefer `<H3>`.
 */
export function H4({ className = '', children, ...rest }: H4Props) {
  return (
    <h4 className={`dash-ui-h4 ${className}`.trim()} {...rest}>
      {children}
    </h4>
  )
}
