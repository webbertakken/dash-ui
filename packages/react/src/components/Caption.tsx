import type { HTMLAttributes, ReactNode } from 'react'

export interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/**
 * Small helper / metadata text - "last updated 5 min ago", table footnote,
 * timestamp under a chart, byline beneath a section heading. Renders
 * `<span class="dash-ui-caption">` so the `.dash-ui-caption` rule in
 * `@w5-ui/tokens/tokens.css` applies the canonical 12 px / regular weight,
 * 1.25 line-height, and the muted `--text-3` colour. Stops userland
 * reaching for a one-off `font-size: 12px; color: #a4a7b5;` trio on every
 * caption.
 *
 * Typed equivalent of `<span className="dash-ui-caption">`. This is the
 * userland-facing semantic class documented in **Foundations / Type**.
 * Use `<Caption>` for non-essential metadata only - on `--depthBg-3`
 * (popovers, drawers) the `--text-3` contrast slides toward 4.0:1, so
 * keep primary copy on `.dash-ui-body` / `--text-2`. Pair with `<Muted>`
 * when you want the same colour at the default 14 px body size.
 */
export function Caption({ className = '', children, ...rest }: CaptionProps) {
  return (
    <span className={`dash-ui-caption ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
