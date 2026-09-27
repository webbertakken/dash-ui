<svelte:options customElement={{ tag: "uni-notification-panel", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/NotificationPanel.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    open = false,
    notifications = []
  } = $props();
</script>

<Original {open} {notifications}>
  <slot />
</Original>
