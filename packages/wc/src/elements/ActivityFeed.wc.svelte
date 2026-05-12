<svelte:options customElement="uni-activity-feed" />
<script>
  import Original from '@w5-ui/svelte/components/ActivityFeed.svelte';
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
