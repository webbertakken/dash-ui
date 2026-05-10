<svelte:options tag="uni-notification-panel" />
<script>
  import Original from '@dash-ui/svelte/components/NotificationPanel.svelte';
  export let open = false;
  export let notifications = [];
  export let onClose = () => {};
  export let onMarkRead = undefined;
  export let onMarkAllRead = undefined;
</script>

<Original {open} {notifications} {onClose} {onMarkRead} {onMarkAllRead}>
  <slot />
</Original>
