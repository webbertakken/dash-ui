<svelte:options customElement="uni-radial-bar-chart" />
<script>
  import Original from '@w5-ui/svelte/components/RadialBarChart.svelte';
  let {
    items = [],
    ariaLabel = 'Radial bar chart'
  } = $props();
</script>

<Original {items} {ariaLabel}>
  <slot />
</Original>
