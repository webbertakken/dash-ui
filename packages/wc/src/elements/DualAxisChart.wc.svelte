<svelte:options customElement="uni-dual-axis-chart" />
<script>
  import Original from '@w5-ui/svelte/components/DualAxisChart.svelte';
  let {
    bars = undefined,
    line = undefined,
    labels = [],
    height = 160,
    ariaLabel = 'Dual axis chart'
  } = $props();
</script>

<Original {bars} {line} {labels} {height} {ariaLabel}>
  <slot />
</Original>
