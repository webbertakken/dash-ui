import { Fragment, type ReactNode } from 'react';
import { appLogos, brand } from '@dash-ui/assets';
import { IconButton } from './Button.js';
import { CaretIcon, SearchIcon, UpdatesIcon, BellIcon, HelpIcon } from '../icons.js';

void brand;

export interface AppDef {
  id: string;
  label: string;
  logo: keyof typeof appLogos;
}

export const DEFAULT_APPS: AppDef[] = [
  { id: 'network', label: 'Network', logo: 'network' },
  { id: 'protect', label: 'Protect', logo: 'protect' },
  { id: 'access', label: 'Access', logo: 'access' },
  { id: 'talk', label: 'Talk', logo: 'talk' },
  { id: 'connect', label: 'Connect', logo: 'connect' },
  { id: 'drive', label: 'Drive', logo: 'drive' },
];

export interface TopbarProps {
  siteName: string;
  apps?: AppDef[];
  activeApp: string;
  onAppChange?: (id: string) => void;
  initials?: string;
  notificationCount?: number;
}

export function Topbar({
  siteName,
  apps = DEFAULT_APPS,
  activeApp,
  onAppChange,
  initials = 'MS',
  notificationCount = 1,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="site-switch">
        <span className="status-ring" />
        <span className="site-name">{siteName}</span>
        <CaretIcon className="caret" />
      </div>
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
        <IconButton aria-label="Search" title="Search">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="Updates" title="Updates">
          <UpdatesIcon />
        </IconButton>
        <IconButton
          aria-label={
            notificationCount > 0
              ? `Notifications, ${notificationCount} new`
              : 'Notifications'
          }
          title="Notifications"
          style={{ position: 'relative' }}
        >
          <BellIcon />
          {notificationCount > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                background: '#F03A3A',
                borderRadius: '50%',
                border: '1.5px solid #0A0A0B',
              }}
            />
          )}
        </IconButton>
        <IconButton aria-label="Help" title="Help">
          <HelpIcon />
        </IconButton>
        <div className="avatar" role="img" aria-label={`Account, ${initials}`}>{initials}</div>
      </div>
    </header>
  );
}

export interface SidebarSectionDef {
  title: string;
  items: SidebarItemDef[];
}

export interface SidebarItemDef {
  id: string;
  label: string;
  icon: ReactNode;
  count?: number;
  pill?: number;
}

export interface SidebarProps {
  sections: SidebarSectionDef[];
  activeId: string;
  onChange?: (id: string) => void;
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
  );
}
