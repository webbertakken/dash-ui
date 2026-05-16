import type { HTMLAttributes, ReactNode } from 'react'

export interface TableShellProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Rounded, bordered wrapper for any full-width `<table>` on a page. Carries the
 * 8 px radius, `--neutral-09` background, single 1 px border and `overflow:
 * hidden` clip so userland tables read like the reference Devices / Clients
 * pages without inline `border` / `borderRadius` styles.
 *
 * Typed equivalent of `<div className="table-shell">` from
 * `@w5-ui/tokens/dashboard.css`. Render the `<Pagination>` row as a sibling
 * below, not inside, so its focus rings aren't clipped.
 */
export function TableShell({ className = '', children, ...rest }: TableShellProps) {
  return (
    <div className={`table-shell ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
