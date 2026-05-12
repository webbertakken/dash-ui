<svelte:options customElement="uni-donut" />
<script>
  import Original from '@w5-ui/svelte/components/Donut.svelte';
  let {
    size = 96,
    segments = [],
    centerValue = undefined,
    centerLabel = undefined,
    trackColor = 'rgba(255,255,255,0.06)',
    ariaLabel = undefined
  } = $props();
</script>

<Original {size} {segments} {centerValue} {centerLabel} {trackColor} {ariaLabel}>
  <slot />
</Original>
