import type { HTMLAttributes, ReactNode } from 'react'

export interface BodyProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode
}

/**
 * Default body paragraph - the 14 px / regular / 1.4 / `--text-2` rhythm
 * that runs across table cells, paragraphs, and most user-readable copy
 * in the dashboard. Renders `<p class="dash-ui-body">` so the
 * `.dash-ui-body` rule in `@w5-ui/tokens/tokens.css` pins the canonical
 * size, weight, line-height, and colour. Stops userland reaching for a
 * one-off `font-size: 14px; line-height: 1.4;` duo (or worse, leaving the
 * 16 px browser default in place and getting the #1 documented spacing
 * drift: "page text looks too big vs the reference dashboard").
 *
 * Typed equivalent of `<p className="dash-ui-body">`. This is the
 * userland-facing semantic class documented in **Foundations / Type**.
 * Body copy is "almost always inherited, almost never overridden" inside
 * `.card` / `.table-shell` / page chrome - reach for `<Body>` when
 * wrapping standalone prose in userland (empty states, onboarding
 * paragraphs, info banners) or when a parent stylesheet has reset the
 * default size and you need to opt back in explicitly. For 16 px
 * settings descriptions prefer `<BodyLg>`.
 */
export function Body({ className = '', children, ...rest }: BodyProps) {
  return (
    <p className={`dash-ui-body ${className}`.trim()} {...rest}>
      {children}
    </p>
  )
}
