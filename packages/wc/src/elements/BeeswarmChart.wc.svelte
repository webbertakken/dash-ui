<svelte:options customElement="uni-beeswarm-chart" />
<script>
  import Original from '@w5-ui/svelte/components/BeeswarmChart.svelte';
  let {
    series = [],
    yRange = undefined,
    height = 200,
    unit = '',
    dotRadius = 4,
    ariaLabel = 'Beeswarm chart'
  } = $props();
</script>

<Original {series} {yRange} {height} {unit} {dotRadius} {ariaLabel}>
  <slot />
</Original>
