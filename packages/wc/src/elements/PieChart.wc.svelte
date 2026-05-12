<svelte:options tag="uni-pie-chart" />
<script>
  import Original from '@w5-ui/svelte/components/PieChart.svelte';
  export let slices = [];
  export let size = 140;
  export let ariaLabel = 'Pie chart';
</script>

<Original {slices} {size} {ariaLabel}>
  <slot />
</Original>
