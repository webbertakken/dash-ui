<svelte:options tag="uni-area-chart" />
<script>
  import Original from '@w5-ui/svelte/components/AreaChart.svelte';
  export let series = [];
  export let labels = [];
  export let height = 160;
  export let ariaLabel = 'Area chart';
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
