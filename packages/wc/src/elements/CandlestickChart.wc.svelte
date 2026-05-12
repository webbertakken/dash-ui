<svelte:options customElement="uni-candlestick-chart" />
<script>
  import Original from '@w5-ui/svelte/components/CandlestickChart.svelte';
  let {
    bars = [],
    yRange = undefined,
    height = 180,
    unit = '',
    upColor = '#00C875',
    downColor = '#FF7B7B',
    ariaLabel = 'Candlestick chart'
  } = $props();
</script>

<Original {bars} {yRange} {height} {unit} {upColor} {downColor} {ariaLabel}>
  <slot />
</Original>
