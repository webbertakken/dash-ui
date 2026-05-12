<svelte:options customElement="uni-line-chart" />
<script>
  import Original from '@w5-ui/svelte/components/LineChart.svelte';
  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Line chart'
  } = $props();
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
