<svelte:options tag="uni-radial-bar-chart" />
<script>
  import Original from '@w5-ui/svelte/components/RadialBarChart.svelte';
  export let items = [];
  export let ariaLabel = 'Radial bar chart';
</script>

<Original {items} {ariaLabel}>
  <slot />
</Original>
