<svelte:options tag="uni-topbar" />
<script>
  import Original from '@w5-ui/svelte/components/Topbar.svelte';
  export let siteName = undefined;
  export let activeApp = undefined;
  export let apps = DEFAULT_APPS;
  export let initials = 'MS';
  export let notificationCount = 1;
</script>

<Original {siteName} {activeApp} {apps} {initials} {notificationCount}>
  <slot />
</Original>
