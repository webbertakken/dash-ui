<svelte:options customElement="uni-polar-heatmap" />
<script>
  import Original from '@w5-ui/svelte/components/PolarHeatmap.svelte';
  let {
    data = [],
    rows = 7,
    cols = 24,
    colLabels = [],
    color = '#006FFF',
    ariaLabel = 'Polar heatmap'
  } = $props();
</script>

<Original {data} {rows} {cols} {colLabels} {color} {ariaLabel}>
  <slot />
</Original>
