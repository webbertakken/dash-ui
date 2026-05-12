<svelte:options customElement="uni-sunburst-chart" />
<script>
  import Original from '@w5-ui/svelte/components/SunburstChart.svelte';
  let {
    root = undefined,
    ariaLabel = 'Sunburst chart'
  } = $props();
</script>

<Original {root} {ariaLabel}>
  <slot />
</Original>
