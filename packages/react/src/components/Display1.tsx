import type { HTMLAttributes, ReactNode } from 'react'

export interface Display1Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

/**
 * Display-1 - the 64 px / bold / `--lh-tight` / `--tracking-display`
 * (-0.02em) rhythm reserved for onboarding splashes and marketing
 * heroes (the top of the type scale, one step above the 48 px
 * `<Display2>`). Renders `<h1 class="dash-ui-display-1">` so the
 * `.dash-ui-display-1` rule in `@w5-ui/tokens/tokens.css` pins the
 * canonical size, weight, line-height, letter-spacing, and `--text-1`
 * colour.
 *
 * Stops userland reaching for an ad-hoc `<h1 style={{ fontSize: 64 }}>`
 * that almost always forgets `--lh-tight` (1.1) and the negative
 * tracking, which is the documented "headings break awkwardly across
 * two lines" drift in **Foundations / Type**.
 *
 * Typed equivalent of `<h1 className="dash-ui-display-1">`. Use for
 * onboarding splashes or large marketing heroes. In-app pages should
 * reach for `<PageHeader>` (page title) and `<H2>` (section heads);
 * never substitute `<Display1>` for an in-app screen — its 64 px
 * rhythm dwarfs dashboard chrome.
 */
export function Display1({ className = '', children, ...rest }: Display1Props) {
  return (
    <h1 className={`dash-ui-display-1 ${className}`.trim()} {...rest}>
      {children}
    </h1>
  )
}
