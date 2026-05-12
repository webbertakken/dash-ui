<svelte:options customElement="uni-error-band-chart" />
<script>
  import Original from '@w5-ui/svelte/components/ErrorBandChart.svelte';
  let {
    series = [],
    xLabels = [],
    yRange = undefined,
    height = 180,
    unit = '',
    ariaLabel = 'Error band chart'
  } = $props();
</script>

<Original {series} {xLabels} {yRange} {height} {unit} {ariaLabel}>
  <slot />
</Original>
