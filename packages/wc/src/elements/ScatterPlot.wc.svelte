<svelte:options tag="uni-scatter-plot" />
<script>
  import Original from '@dash-ui/svelte/components/ScatterPlot.svelte';
  export let points = [];
  export let xRange = undefined;
  export let yRange = undefined;
  export let height = 160;
  export let ariaLabel = 'Scatter plot';
</script>

<Original {points} {xRange} {yRange} {height} {ariaLabel}>
  <slot />
</Original>
