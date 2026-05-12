<svelte:options customElement="uni-stacked-bar-chart" />
<script>
  import Original from '@w5-ui/svelte/components/StackedBarChart.svelte';
  let {
    series = [],
    labels = [],
    height = 180,
    normalized = false,
    ariaLabel = 'Stacked bar chart'
  } = $props();
</script>

<Original {series} {labels} {height} {normalized} {ariaLabel}>
  <slot />
</Original>
