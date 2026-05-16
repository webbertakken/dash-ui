<svelte:options customElement="uni-topbar-actions" />
<script>
  import Original from '@w5-ui/svelte/components/TopbarActions.svelte';
  let {
    initials = 'MS',
    notificationCount = 1
  } = $props();
</script>

<Original {initials} {notificationCount}>
  <slot />
</Original>
