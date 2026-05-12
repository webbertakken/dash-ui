<svelte:options customElement="uni-area-chart" />
<script>
  import Original from '@w5-ui/svelte/components/AreaChart.svelte';
  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Area chart'
  } = $props();
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
