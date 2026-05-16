import { appLogos, logos } from '@w5-ui/assets'
import { Fragment, type ReactNode } from 'react'
import { CaretIcon, SearchIcon, UpdatesIcon, BellIcon, HelpIcon } from '../icons.js'
import { Avatar } from './Avatar.js'
import { IconButton } from './Button.js'

void logos

export interface AppDef {
  id: string
  label: string
  logo: keyof typeof appLogos
}

export const DEFAULT_APPS: AppDef[] = [
  { id: 'system', label: 'System', logo: 'system' },
  { id: 'instances', label: 'Instances', logo: 'instances' },
  { id: 'agents', label: 'Agents', logo: 'agents' },
]

export interface TopbarProps {
  siteName: string
  apps?: AppDef[]
  activeApp: string
  onAppChange?: (id: string) => void
  initials?: string
  notificationCount?: number
  /** When false, the site label renders as a static element instead of a
   * site-switcher dropdown trigger. Use for single-site dashboards. */
  siteSwitchable?: boolean
  /** Custom right-side actions. When provided, replaces the default
   * Search/Updates/Notifications/Help/Avatar block in full. Use to slot in
   * app-specific controls (theme toggle, status pill, etc.). */
  actions?: ReactNode
}

export function Topbar({
  siteName,
  apps = DEFAULT_APPS,
  activeApp,
  onAppChange,
  initials = 'MS',
  notificationCount = 1,
  siteSwitchable = true,
  actions,
}: TopbarProps) {
  const siteLabel = (
    <>
      <span className="status-ring" />
      <span className="site-name" aria-hidden={siteSwitchable ? 'true' : undefined}>
        {siteName}
      </span>
      {siteSwitchable && <CaretIcon className="caret" aria-hidden="true" />}
    </>
  )
  return (
    <header className="topbar">
      {siteSwitchable ? (
        <button
          type="button"
          className="site-switch"
          aria-label={`Switch site: ${siteName}`}
          aria-haspopup="menu"
        >
          {siteLabel}
        </button>
      ) : (
        <div className="site-switch" role="presentation">
          {siteLabel}
        </div>
      )}
      <nav className="app-tabs" aria-label="Apps">
        {apps.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`app-tab ${a.id === activeApp ? 'active' : ''}`}
            aria-current={a.id === activeApp ? 'page' : undefined}
            onClick={() => onAppChange?.(a.id)}
          >
            <img src={appLogos[a.logo]} alt="" width={24} height={24} />
            <span className="label">{a.label}</span>
          </button>
        ))}
      </nav>
      <div className="topbar-spacer" />
      <div className="topbar-right">
        {actions ?? (
          <>
            <IconButton aria-label="Search" title="Search">
              <SearchIcon />
            </IconButton>
            <IconButton aria-label="Updates" title="Updates">
              <UpdatesIcon />
            </IconButton>
            <IconButton
              aria-label={
                notificationCount > 0 ? `Notifications, ${notificationCount} new` : 'Notifications'
              }
              title="Notifications"
              style={{ position: 'relative' }}
            >
              <BellIcon />
              {notificationCount > 0 && <span aria-hidden="true" className="topbar-notif-dot" />}
            </IconButton>
            <IconButton aria-label="Help" title="Help">
              <HelpIcon />
            </IconButton>
            <Avatar initials={initials} size="sm" alt={`Account, ${initials}`} />
          </>
        )}
      </div>
    </header>
  )
}

export interface SidebarSectionDef {
  title: string
  items: SidebarItemDef[]
}

export interface SidebarItemDef {
  id: string
  label: string
  icon: ReactNode
  count?: number
  pill?: number
}

export interface SidebarProps {
  sections: SidebarSectionDef[]
  activeId: string
  onChange?: (id: string) => void
}

export function Sidebar({ sections, activeId, onChange }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Primary">
      {sections.map((sec) => (
        <Fragment key={sec.title}>
          <h2 className="sb-section">{sec.title}</h2>
          <ul className="sb-list">
            {sec.items.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  className={`sb-item ${it.id === activeId ? 'active' : ''}`}
                  aria-current={it.id === activeId ? 'page' : undefined}
                  onClick={() => onChange?.(it.id)}
                >
                  <span className="sb-ico">{it.icon}</span>
                  {it.label}
                  {it.count !== undefined && <span className="sb-count">{it.count}</span>}
                  {it.pill !== undefined && (
                    <span className="sb-pill">
                      {it.pill}
                      <span className="sr-only"> alert{it.pill !== 1 ? 's' : ''}</span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </nav>
  )
}
