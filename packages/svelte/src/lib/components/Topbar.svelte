<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { appLogos, type AppLogo } from '@dash-ui/assets';
  import IconButton from './IconButton.svelte';
  import CaretIcon from '../icons/CaretIcon.svelte';
  import SearchIcon from '../icons/SearchIcon.svelte';
  import UpdatesIcon from '../icons/UpdatesIcon.svelte';
  import BellIcon from '../icons/BellIcon.svelte';
  import HelpIcon from '../icons/HelpIcon.svelte';

  export interface AppDef { id: string; label: string; logo: AppLogo }
  export const DEFAULT_APPS: AppDef[] = [
    { id: 'network', label: 'Network', logo: 'network' },
    { id: 'protect', label: 'Protect', logo: 'protect' },
    { id: 'access', label: 'Access', logo: 'access' },
    { id: 'talk', label: 'Talk', logo: 'talk' },
    { id: 'connect', label: 'Connect', logo: 'connect' },
    { id: 'drive', label: 'Drive', logo: 'drive' },
  ];

  export let siteName: string;
  export let activeApp: string;
  export let apps: AppDef[] = DEFAULT_APPS;
  export let initials: string = 'MS';
  export let notificationCount: number = 1;
  const dispatch = createEventDispatcher<{ appchange: string }>();
</script>

<div class="topbar">
  <div class="site-switch">
    <span class="status-ring"></span>
    <span class="site-name">{siteName}</span>
    <CaretIcon class="caret" />
  </div>
  <div class="app-tabs">
    {#each apps as a (a.id)}
      <a
        class="app-tab {a.id === activeApp ? 'active' : ''}"
        on:click={() => { activeApp = a.id; dispatch('appchange', a.id); }}
      >
        <img src={appLogos[a.logo]} alt="" width="24" height="24" />
        <span class="label">{a.label}</span>
      </a>
    {/each}
  </div>
  <div class="topbar-spacer"></div>
  <div class="topbar-right">
    <IconButton title="Search"><SearchIcon /></IconButton>
    <IconButton title="Updates"><UpdatesIcon /></IconButton>
    <IconButton title="Notifications" style="position:relative;">
      <BellIcon />
      {#if notificationCount > 0}
        <span style="position:absolute;top:6px;right:6px;width:6px;height:6px;background:#F03A3A;border-radius:50%;border:1.5px solid #0A0A0B;"></span>
      {/if}
    </IconButton>
    <IconButton title="Help"><HelpIcon /></IconButton>
    <div class="avatar">{initials}</div>
  </div>
</div>
