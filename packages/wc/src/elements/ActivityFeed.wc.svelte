<svelte:options customElement={{ tag: "uni-activity-feed", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ActivityFeed.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    label = 'Activity feed',
    busy = false,
    maxHeight = 360,
    autoScroll = false
  } = $props();
</script>

<Original {items} {label} {busy} {maxHeight} {autoScroll}>
  <slot />
</Original>
