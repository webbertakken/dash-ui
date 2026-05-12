<svelte:options customElement="uni-pie-chart" />
<script>
  import Original from '@w5-ui/svelte/components/PieChart.svelte';
  let {
    slices = [],
    size = 140,
    ariaLabel = 'Pie chart'
  } = $props();
</script>

<Original {slices} {size} {ariaLabel}>
  <slot />
</Original>
