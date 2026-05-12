<svelte:options customElement="uni-notification-panel" />
<script>
  import Original from '@w5-ui/svelte/components/NotificationPanel.svelte';
  let {
    open = false,
    notifications = []
  } = $props();
</script>

<Original {open} {notifications}>
  <slot />
</Original>
