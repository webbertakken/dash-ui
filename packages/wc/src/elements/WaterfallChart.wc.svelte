<svelte:options tag="uni-waterfall-chart" />
<script>
  import Original from '@dash-ui/svelte/components/WaterfallChart.svelte';
  export let bars = [];
  export let height = 160;
  export let ariaLabel = 'Waterfall chart';
</script>

<Original {bars} {height} {ariaLabel}>
  <slot />
</Original>
