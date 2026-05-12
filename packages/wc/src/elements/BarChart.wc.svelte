<svelte:options customElement="uni-bar-chart" />
<script>
  import Original from '@w5-ui/svelte/components/BarChart.svelte';
  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Bar chart'
  } = $props();
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
