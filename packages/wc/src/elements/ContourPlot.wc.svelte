<svelte:options tag="uni-contour-plot" />
<script>
  import Original from '@dash-ui/svelte/components/ContourPlot.svelte';
  export let points = [];
  export let xRange = undefined;
  export let yRange = undefined;
  export let height = 200;
  export let bandwidth = 3.5;
  export let color = '#006FFF';
  export let ariaLabel = 'Contour plot';
</script>

<Original {points} {xRange} {yRange} {height} {bandwidth} {color} {ariaLabel}>
  <slot />
</Original>
