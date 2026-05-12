<svelte:options customElement="uni-horizon-chart" />
<script>
  import Original from '@w5-ui/svelte/components/HorizonChart.svelte';
  let {
    series = [],
    xLabels = undefined,
    bands = 3,
    ariaLabel = 'Horizon chart'
  } = $props();
</script>

<Original {series} {xLabels} {bands} {ariaLabel}>
  <slot />
</Original>
