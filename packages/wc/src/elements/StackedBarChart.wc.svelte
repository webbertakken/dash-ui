<svelte:options tag="uni-stacked-bar-chart" />
<script>
  import Original from '@dash-ui/svelte/components/StackedBarChart.svelte';
  export let series = [];
  export let labels = [];
  export let height = 180;
  export let normalized = false;
  export let ariaLabel = 'Stacked bar chart';
</script>

<Original {series} {labels} {height} {normalized} {ariaLabel}>
  <slot />
</Original>
