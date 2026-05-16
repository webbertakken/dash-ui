import type { HTMLAttributes, ReactNode } from 'react'

export interface Display2Props extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

/**
 * Display-2 - the 48 px / bold / `--lh-tight` / `--tracking-display`
 * (-0.02em) rhythm used for login and large marketing surfaces (the
 * step below the 64 px Display-1 hero). Renders
 * `<h1 class="dash-ui-display-2">` so the `.dash-ui-display-2` rule in
 * `@w5-ui/tokens/tokens.css` pins the canonical size, weight,
 * line-height, letter-spacing, and `--text-1` colour.
 *
 * Stops userland reaching for an ad-hoc `<h1 style={{ fontSize: 48 }}>`
 * that almost always forgets `--lh-tight` (1.1) and the negative
 * tracking, which is the documented "headings break awkwardly across
 * two lines" drift in **Foundations / Type**.
 *
 * Typed equivalent of `<h1 className="dash-ui-display-2">`. Use for
 * login-page titles or large marketing heroes one step down from
 * `<Display1>`. In-app pages should reach for `<PageHeader>` (page
 * title) and `<H2>` (section heads); never substitute `<Display2>` for
 * an in-app screen — its 48 px rhythm dominates dashboard chrome.
 */
export function Display2({ className = '', children, ...rest }: Display2Props) {
  return (
    <h1 className={`dash-ui-display-2 ${className}`.trim()} {...rest}>
      {children}
    </h1>
  )
}
