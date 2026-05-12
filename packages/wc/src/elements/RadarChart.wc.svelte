<svelte:options customElement="uni-radar-chart" />
<script>
  import Original from '@w5-ui/svelte/components/RadarChart.svelte';
  let {
    series = [],
    axes = [],
    height = 200,
    ariaLabel = 'Radar chart'
  } = $props();
</script>

<Original {series} {axes} {height} {ariaLabel}>
  <slot />
</Original>
