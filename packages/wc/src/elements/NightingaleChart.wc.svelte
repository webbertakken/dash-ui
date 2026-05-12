<svelte:options customElement="uni-nightingale-chart" />
<script>
  import Original from '@w5-ui/svelte/components/NightingaleChart.svelte';
  let {
    segments = [],
    color = '#006FFF',
    ariaLabel = 'Nightingale chart'
  } = $props();
</script>

<Original {segments} {color} {ariaLabel}>
  <slot />
</Original>
