<svelte:options tag="uni-line-chart" />
<script>
  import Original from '@dash-ui/svelte/components/LineChart.svelte';
  export let series = [];
  export let labels = [];
  export let height = 160;
  export let ariaLabel = 'Line chart';
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
