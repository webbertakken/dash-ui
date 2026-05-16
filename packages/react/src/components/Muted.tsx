import type { HTMLAttributes, ReactNode } from 'react'

export interface MutedProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/**
 * Inline span that drops a phrase to the tertiary text colour
 * (`--text-3`). Renders `<span class="t-muted">` so the `.t-muted` rule in
 * `@w5-ui/tokens/dashboard.css` applies the canonical muted colour used by
 * `.submeta`, `.stat .unit` and the `.card h3` title chrome. Use for
 * "X active" counters next to an icon, caption-style metadata sitting
 * beside a primary label, or any sub-line that would otherwise tempt
 * userland to reach for a one-off `color: #...` override.
 *
 * Typed equivalent of `<span className="t-muted">`. The contrast pair is
 * AA against every motif background (verified for `--text-3` over
 * `--depthBg-0`/`--depthBg-1`/`--depthBg-2` in both dark and light
 * motifs).
 */
export function Muted({ className = '', children, ...rest }: MutedProps) {
  return (
    <span className={`t-muted ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
