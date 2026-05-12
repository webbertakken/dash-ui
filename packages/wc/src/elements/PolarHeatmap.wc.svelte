<svelte:options tag="uni-polar-heatmap" />
<script>
  import Original from '@w5-ui/svelte/components/PolarHeatmap.svelte';
  export let data = [];
  export let rows = 7;
  export let cols = 24;
  export let colLabels = [];
  export let color = '#006FFF';
  export let ariaLabel = 'Polar heatmap';
</script>

<Original {data} {rows} {cols} {colLabels} {color} {ariaLabel}>
  <slot />
</Original>
