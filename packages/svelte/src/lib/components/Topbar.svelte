<script module lang="ts">
  export interface AppDef { id: string; label: string; logo: AppLogo }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { appLogos, type AppLogoKey as AppLogo } from '@w5-ui/assets';
  import IconButton from './IconButton.svelte';
  import Avatar from './Avatar.svelte';
  import CaretIcon from '../icons/CaretIcon.svelte';
  import SearchIcon from '../icons/SearchIcon.svelte';
  import UpdatesIcon from '../icons/UpdatesIcon.svelte';
  import BellIcon from '../icons/BellIcon.svelte';
  import HelpIcon from '../icons/HelpIcon.svelte';

  export const DEFAULT_APPS: AppDef[] = [
    { id: 'system', label: 'System', logo: 'system' },
    { id: 'instances', label: 'Instances', logo: 'instances' },
    { id: 'agents', label: 'Agents', logo: 'agents' },
  ];

  interface Props {
    siteName: string;
    activeApp: string;
    apps?: AppDef[];
    initials?: string;
    notificationCount?: number;
  }

  let {
    siteName,
    activeApp = $bindable(),
    apps = DEFAULT_APPS,
    initials = 'MS',
    notificationCount = 1
  }: Props = $props();
  const dispatch = createEventDispatcher<{ appchange: string }>();
</script>

<header class="topbar">
  <button type="button" class="site-switch" aria-label="Switch site: {siteName}" aria-haspopup="menu">
    <span class="status-ring"></span>
    <span class="site-name" aria-hidden="true">{siteName}</span>
    <CaretIcon class="caret" />
  </button>
  <nav class="app-tabs" aria-label="Apps">
    {#each apps as a (a.id)}
      <button
        type="button"
        class="app-tab {a.id === activeApp ? 'active' : ''}"
        aria-current={a.id === activeApp ? 'page' : undefined}
        onclick={() => { activeApp = a.id; dispatch('appchange', a.id); }}
      >
        <img src={appLogos[a.logo]} alt="" width="24" height="24" />
        <span class="label">{a.label}</span>
      </button>
    {/each}
  </nav>
  <div class="topbar-spacer"></div>
  <div class="topbar-right">
    <IconButton aria-label="Search" title="Search"><SearchIcon /></IconButton>
    <IconButton aria-label="Updates" title="Updates"><UpdatesIcon /></IconButton>
    <IconButton
      aria-label={notificationCount > 0 ? `Notifications, ${notificationCount} new` : 'Notifications'}
      title="Notifications"
      style="position:relative;"
    >
      <BellIcon />
      {#if notificationCount > 0}
        <span aria-hidden="true" style="position:absolute;top:6px;right:6px;width:6px;height:6px;background:#F03A3A;border-radius:50%;border:1.5px solid #0A0A0B;"></span>
      {/if}
    </IconButton>
    <IconButton aria-label="Help" title="Help"><HelpIcon /></IconButton>
    <Avatar initials={initials} size="sm" alt="Account, {initials}" />
  </div>
</header>
