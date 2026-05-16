import type { HTMLAttributes, ReactNode } from 'react'

export interface NameCellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Square 28 px avatar / initial that sits to the left of the name. Pass a
   * letter (`r[0]`), an emoji, or a small SVG. Rendered inside a
   * `<span class="nc-thumb">` so the canonical thumbnail rule applies.
   * Omit if the row has no leading affordance.
   */
  thumb?: ReactNode
  /**
   * Extra `className` for the inner `.nc-thumb` (e.g. `'cam'` for the
   * camera gradient variant). Ignored when `thumb` is not supplied.
   */
  thumbClassName?: string
  children?: ReactNode
}

/**
 * First-column row in a list / table: a 28 px square thumbnail or initial
 * followed by the device / client / alert name. Renders the canonical
 * `<div class="name-cell"><span class="nc-thumb">…</span>…</div>` markup so
 * the `.name-cell` and `.nc-thumb` rules from `@w5-ui/tokens/dashboard.css`
 * apply (28 px thumb, 10 px gap, white name colour, JetBrains Mono initial).
 * Stops userland reaching for ad-hoc flex / padding / colour overrides on the
 * first column.
 *
 * Typed equivalent of the manual `<div className="name-cell"><span
 * className="nc-thumb">{x}</span>{name}</div>` pattern used across the
 * Dashboard, Devices, Wi-Fi, and Alarms reference pages.
 */
export function NameCell({
  className = '',
  thumb,
  thumbClassName = '',
  children,
  ...rest
}: NameCellProps) {
  return (
    <div className={`name-cell ${className}`.trim()} {...rest}>
      {thumb !== undefined && <span className={`nc-thumb ${thumbClassName}`.trim()}>{thumb}</span>}
      {children}
    </div>
  )
}
