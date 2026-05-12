<svelte:options customElement="uni-waterfall-chart" />
<script>
  import Original from '@w5-ui/svelte/components/WaterfallChart.svelte';
  let {
    bars = [],
    height = 160,
    ariaLabel = 'Waterfall chart'
  } = $props();
</script>

<Original {bars} {height} {ariaLabel}>
  <slot />
</Original>
