<svelte:options tag="uni-area-chart" />
<script>
  import Original from '@dash-ui/svelte/components/AreaChart.svelte';
  export let series = [];
  export let labels = [];
  export let height = 160;
  export let ariaLabel = 'Area chart';
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
