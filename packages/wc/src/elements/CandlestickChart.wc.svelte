<svelte:options tag="uni-candlestick-chart" />
<script>
  import Original from '@dash-ui/svelte/components/CandlestickChart.svelte';
  export let bars = [];
  export let yRange = undefined;
  export let height = 180;
  export let unit = '';
  export let upColor = '#00C875';
  export let downColor = '#FF7B7B';
  export let ariaLabel = 'Candlestick chart';
</script>

<Original {bars} {yRange} {height} {unit} {upColor} {downColor} {ariaLabel}>
  <slot />
</Original>
