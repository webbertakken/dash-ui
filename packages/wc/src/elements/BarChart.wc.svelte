<svelte:options tag="uni-bar-chart" />
<script>
  import Original from '@dash-ui/svelte/components/BarChart.svelte';
  export let series = [];
  export let labels = [];
  export let height = 160;
  export let ariaLabel = 'Bar chart';
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
