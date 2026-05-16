import type { HTMLAttributes } from 'react'

export interface StatusRingProps extends HTMLAttributes<HTMLSpanElement> {}

/**
 * Pulsing status indicator: a soft translucent ring around a solid coloured
 * inner dot. Renders `<span aria-hidden class="status-ring">` so the
 * `.status-ring` rule in `@w5-ui/tokens/dashboard.css` paints the canonical
 * 18 px green ring + 8 px inner dot (success colour) without userland having
 * to hand-roll the two layers.
 *
 * Used by `<Topbar>` next to the site name to signal "site healthy"; also
 * suitable for tunnel / session / device tiles where a small live-state dot
 * sits at the leading edge of a row. Decorative — the rule sets `aria-hidden`
 * via the typed wrapper; pair with a label so screen readers announce the
 * state.
 *
 * Typed equivalent of `<span aria-hidden className="status-ring" />`. Stops
 * userland copying the class name into bespoke status rows and silently
 * drifting when the ring colour / size tokens change.
 */
export function StatusRing({ className = '', ...rest }: StatusRingProps) {
  return <span aria-hidden="true" className={`status-ring ${className}`.trim()} {...rest} />
}
