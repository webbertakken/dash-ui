<script lang="ts">
  import IconButton from './IconButton.svelte';
  import Avatar from './Avatar.svelte';
  import SearchIcon from '../icons/SearchIcon.svelte';
  import UpdatesIcon from '../icons/UpdatesIcon.svelte';
  import BellIcon from '../icons/BellIcon.svelte';
  import HelpIcon from '../icons/HelpIcon.svelte';

  interface Props {
    /** Avatar initials shown in the trailing account chip. */
    initials?: string;
    /** Unread count surfaced via the bell `aria-label` and the red dot
     * overlay. `0` hides the dot. */
    notificationCount?: number;
  }

  let { initials = 'MS', notificationCount = 1 }: Props = $props();
</script>

<!--
  The canonical right-side action group inside <Topbar>: Search, Updates,
  Notifications (with red dot overlay when unread), Help, and the account
  <Avatar>. Renders the same five controls in the same order and with the
  same Tailwind chrome as the default block inside <Topbar> itself, so
  passing <Topbar actions={...}>{<TopbarActions />}</> behaves identically
  to omitting the snippet.

  Use it when userland wants to slot extra controls (theme toggle, status
  pill, environment switch) _alongside_ the canonical block rather than
  replace it. Compose your custom controls plus <TopbarActions /> and the
  Topbar keeps the search / bell / avatar rhythm the reference dashboard
  ships without copying classes, icons, or the inline notif span.
-->
<IconButton aria-label="Search" title="Search"><SearchIcon /></IconButton>
<IconButton aria-label="Updates" title="Updates"><UpdatesIcon /></IconButton>
<IconButton
  aria-label={notificationCount > 0
    ? `Notifications, ${notificationCount} new`
    : 'Notifications'}
  title="Notifications"
  class="relative"
>
  <BellIcon />
  {#if notificationCount > 0}
    <span
      aria-hidden="true"
      class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border-[1.5px] border-bg-page bg-status-danger"
    ></span>
  {/if}
</IconButton>
<IconButton aria-label="Help" title="Help"><HelpIcon /></IconButton>
<Avatar initials={initials} size="sm" alt="Account, {initials}" class="ml-1" />
