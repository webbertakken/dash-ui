<svelte:options tag="uni-donut" />
<script>
  import Original from '@w5-ui/svelte/components/Donut.svelte';
  export let size = 96;
  export let segments = [];
  export let centerValue = undefined;
  export let centerLabel = undefined;
  export let trackColor = 'rgba(255,255,255,0.06)';
  export let ariaLabel = undefined;
</script>

<Original {size} {segments} {centerValue} {centerLabel} {trackColor} {ariaLabel}>
  <slot />
</Original>
