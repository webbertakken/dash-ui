<svelte:options customElement="uni-topbar" />
<script>
  import Original from '@w5-ui/svelte/components/Topbar.svelte';
  let {
    siteName = undefined,
    activeApp = undefined,
    apps = DEFAULT_APPS,
    initials = 'MS',
    notificationCount = 1,
    status = 'ok',
    siteSwitchable = true
  } = $props();
</script>

<Original {siteName} {activeApp} {apps} {initials} {notificationCount} {status} {siteSwitchable}>
  <slot />
</Original>
