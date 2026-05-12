<svelte:options customElement="uni-violin-plot" />
<script>
  import Original from '@w5-ui/svelte/components/ViolinPlot.svelte';
  let {
    series = [],
    yRange = undefined,
    height = 160,
    ariaLabel = 'Violin plot'
  } = $props();
</script>

<Original {series} {yRange} {height} {ariaLabel}>
  <slot />
</Original>
