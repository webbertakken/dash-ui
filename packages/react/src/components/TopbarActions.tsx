import { SearchIcon, UpdatesIcon, BellIcon, HelpIcon } from '../icons.js'
import { Avatar } from './Avatar.js'
import { IconButton } from './Button.js'
import { NotifDot } from './NotifDot.js'

export interface TopbarActionsProps {
  /** Avatar initials shown in the trailing account chip. */
  initials?: string
  /** Unread count surfaced via the bell `aria-label` and the red `NotifDot`
   * overlay. `0` hides the dot. */
  notificationCount?: number
}

/**
 * The canonical right-side action group inside `<Topbar>`: Search, Updates,
 * Notifications (with `<NotifDot>` overlay when unread), Help, and the account
 * `<Avatar>`. Renders the same five controls in the same order as the default
 * block inside `<Topbar>` itself.
 *
 * Pass `<Topbar actions={...}>` replaces the default block in full — userland
 * that wants to inject a theme toggle, status pill, or environment switch
 * usually wants those _alongside_ the canonical controls, not instead of them.
 * `<TopbarActions>` is that re-entry point: compose your custom controls plus
 * `<TopbarActions />` and userland keeps the search / bell / avatar rhythm the
 * reference dashboards ship without copying classes or icons.
 *
 * ```tsx
 * <Topbar
 *   siteName="HQ"
 *   activeApp="system"
 *   onAppChange={setApp}
 *   actions={
 *     <>
 *       <ThemeToggle />
 *       <TopbarActions notificationCount={3} initials="WS" />
 *     </>
 *   }
 * />
 * ```
 *
 * The `<NotifDot>` ring colour, the `IconButton` 28 px square, and the
 * `Avatar` `size="sm"` chip all come from `@w5-ui/tokens/dashboard.css` — drop
 * the primitive in and the topbar reads identically to the Dashboard story.
 */
export function TopbarActions({ initials = 'MS', notificationCount = 1 }: TopbarActionsProps) {
  return (
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
        {notificationCount > 0 && <NotifDot />}
      </IconButton>
      <IconButton aria-label="Help" title="Help">
        <HelpIcon />
      </IconButton>
      <Avatar initials={initials} size="sm" alt={`Account, ${initials}`} />
    </>
  )
}
