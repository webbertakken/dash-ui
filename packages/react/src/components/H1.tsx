import type { HTMLAttributes, ReactNode } from 'react'

export interface H1Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

/**
 * Page title - the 38 px / bold / `--lh-snug` rhythm with
 * `--tracking-display` (-0.02em) used for the top-of-page heading on
 * marketing surfaces (login, onboarding splash, top-level landing).
 * Renders `<h1 class="dash-ui-h1">` so the `.dash-ui-h1` rule in
 * `@w5-ui/tokens/tokens.css` pins the canonical size, weight,
 * line-height, letter-spacing, and `--text-1` colour. Stops userland
 * reaching for a one-off `<h1 style={{ fontSize: 36 }}>` (or worse,
 * leaving an unstyled browser default `<h1>` at 32 px / 700 / 1.2
 * with no negative tracking, which is the documented "headings break
 * awkwardly across two lines" drift fixed by `--tracking-display`).
 *
 * Typed equivalent of `<h1 className="dash-ui-h1">`. This is the
 * userland-facing semantic class documented in **Foundations / Type**.
 * Use `<H1>` for marketing-grade page titles. In-app pages should reach
 * for `<PageHeader>` (which already styles the page title) and use
 * `<H2>` for section heads, `<H3>` for sub-sections, `<H4>` for card
 * titles.
 */
export function H1({ className = '', children, ...rest }: H1Props) {
  return (
    <h1 className={`dash-ui-h1 ${className}`.trim()} {...rest}>
      {children}
    </h1>
  )
}
