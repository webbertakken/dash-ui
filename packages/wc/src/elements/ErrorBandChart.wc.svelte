<svelte:options tag="uni-error-band-chart" />
<script>
  import Original from '@w5-ui/svelte/components/ErrorBandChart.svelte';
  export let series = [];
  export let xLabels = [];
  export let yRange = undefined;
  export let height = 180;
  export let unit = '';
  export let ariaLabel = 'Error band chart';
</script>

<Original {series} {xLabels} {yRange} {height} {unit} {ariaLabel}>
  <slot />
</Original>
