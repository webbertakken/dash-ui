<svelte:options customElement="uni-contour-plot" />
<script>
  import Original from '@w5-ui/svelte/components/ContourPlot.svelte';
  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    height = 200,
    bandwidth = 3.5,
    color = '#006FFF',
    ariaLabel = 'Contour plot'
  } = $props();
</script>

<Original {points} {xRange} {yRange} {height} {bandwidth} {color} {ariaLabel}>
  <slot />
</Original>
