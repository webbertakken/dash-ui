import type { HTMLAttributes, ReactNode } from 'react'

export interface BodyLgProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode
}

/**
 * Longer-form prose paragraph - settings descriptions, onboarding copy,
 * empty-state explanations, anywhere the default 14 px body feels too
 * cramped for multi-sentence reading. Renders `<p class="dash-ui-body-lg">`
 * so the `.dash-ui-body-lg` rule in `@w5-ui/tokens/tokens.css` applies the
 * canonical 16 px / regular weight, 1.55 line-height, and `--text-2`
 * colour pair. Stops userland reaching for a one-off `font-size: 16px;
 * line-height: 1.6;` duo on every settings description.
 *
 * Typed equivalent of `<p className="dash-ui-body-lg">`. This is the
 * userland-facing semantic class documented in **Foundations / Type**.
 * Reach for `<BodyLg>` when the cliff between 1.25 (heading) and 1.4
 * (default body) feels too dense for a 2-3 sentence paragraph; keep the
 * default `.dash-ui-body` (14 / 1.4) for table cells, table footnotes,
 * and single-line labels.
 */
export function BodyLg({ className = '', children, ...rest }: BodyLgProps) {
  return (
    <p className={`dash-ui-body-lg ${className}`.trim()} {...rest}>
      {children}
    </p>
  )
}
