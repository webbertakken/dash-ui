import type { HTMLAttributes, ReactNode } from 'react'

export interface TablePagerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Sibling row that sits directly under a `<TableShell>` (or
 * `<div className="table-shell">`) and carries the rows-per-page control on
 * the left and the `<Pagination>` nav on the right. Renders the canonical
 * `<div class="table-pager">` markup so the flex / space-between / 12 px top
 * margin from `@w5-ui/tokens/dashboard.css` applies and userland drops the
 * inline `style={{ display: 'flex', justifyContent: 'space-between', … }}`
 * wrapper that every reference page used to ship.
 *
 * Typed equivalent of the manual `<div className="table-pager">` pattern
 * documented in **Foundations / Tables**. Render it as a sibling of
 * `<TableShell>` — never inside it — so the focus rings on the pager buttons
 * are not clipped by `overflow: hidden`.
 */
export function TablePager({ className = '', children, ...rest }: TablePagerProps) {
  return (
    <div className={`table-pager ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
