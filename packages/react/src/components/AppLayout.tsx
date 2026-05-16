import type { ReactNode } from 'react'
import { SkipLink } from './SkipLink.js'

export interface AppLayoutProps {
  /** Rendered above the workspace, typically `<Topbar />`. */
  topbar: ReactNode
  /** Rendered to the left of the main content, typically `<Sidebar />`. */
  sidebar: ReactNode
  /** Page title for the visually-hidden `<h1>` that labels `<main>` (WCAG 2.4.6). */
  pageLabel: string
  children?: ReactNode
}

/**
 * Outer dashboard chrome: `<SkipLink>`, `<Topbar>` slot, `<Sidebar>` slot, and
 * a `<main className="content">` region with the page-title `<h1>` wired up.
 *
 * Reproducing this skeleton in userland is the #1 source of spacing drift —
 * `<AppLayout>` guarantees the `.app` grid, the `.workspace` columns, and the
 * sticky scroll container line up the same way the reference dashboards do.
 */
export function AppLayout({ topbar, sidebar, pageLabel, children }: AppLayoutProps) {
  return (
    <div className="app">
      <SkipLink />
      {topbar}
      <div className="workspace">
        {sidebar}
        <main className="content" id="main-content" tabIndex={-1} aria-labelledby="page-title">
          <h1 id="page-title" className="sr-only">
            {pageLabel}
          </h1>
          {children}
        </main>
      </div>
    </div>
  )
}
