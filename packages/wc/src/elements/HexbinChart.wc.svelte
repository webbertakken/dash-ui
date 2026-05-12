<svelte:options customElement="uni-hexbin-chart" />
<script>
  import Original from '@w5-ui/svelte/components/HexbinChart.svelte';
  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    height = 200,
    hexRadius = 10,
    ariaLabel = 'Hexbin chart'
  } = $props();
</script>

<Original {points} {xRange} {yRange} {height} {hexRadius} {ariaLabel}>
  <slot />
</Original>
