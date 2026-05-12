<svelte:options customElement="uni-scatter-plot" />
<script>
  import Original from '@w5-ui/svelte/components/ScatterPlot.svelte';
  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    height = 160,
    ariaLabel = 'Scatter plot'
  } = $props();
</script>

<Original {points} {xRange} {yRange} {height} {ariaLabel}>
  <slot />
</Original>
