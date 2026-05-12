<svelte:options customElement="uni-bubble-chart" />
<script>
  import Original from '@w5-ui/svelte/components/BubbleChart.svelte';
  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    rRange = [4, 20],
    height = 160,
    ariaLabel = 'Bubble chart'
  } = $props();
</script>

<Original {points} {xRange} {yRange} {rRange} {height} {ariaLabel}>
  <slot />
</Original>
