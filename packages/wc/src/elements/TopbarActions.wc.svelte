<svelte:options customElement={{ tag: "uni-topbar-actions", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TopbarActions.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    initials = 'MS',
    notificationCount = 1
  } = $props();
</script>

<Original {initials} {notificationCount}>
  <slot />
</Original>
