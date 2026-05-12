<svelte:options customElement="uni-funnel-chart" />
<script>
  import Original from '@w5-ui/svelte/components/FunnelChart.svelte';
  let {
    segments = [],
    height = 160,
    ariaLabel = 'Funnel chart'
  } = $props();
</script>

<Original {segments} {height} {ariaLabel}>
  <slot />
</Original>
