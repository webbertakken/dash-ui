import type { HTMLAttributes, ReactNode } from 'react'

export interface SrOnlyProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/**
 * Visually-hidden text that stays available to assistive tech. Renders a
 * `<span class="sr-only">` so the `.sr-only` rule in
 * `@w5-ui/tokens/dashboard.css` clips it from the visual layout while keeping
 * it announceable by screen readers. Use it to name regions that the design
 * intentionally leaves unlabelled, the way the reference Tables recipe wires
 * `<caption className="sr-only">` onto every `<table>` (WCAG 1.3.1).
 *
 * Typed equivalent of `<span className="sr-only">`. Apply the class directly
 * to a `<caption>` / `<label>` when the whole element is the hidden text, or
 * wrap an inline phrase with `<SrOnly>` when it sits alongside visible markup.
 */
export function SrOnly({ className = '', children, ...rest }: SrOnlyProps) {
  return (
    <span className={`sr-only ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
