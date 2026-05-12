<svelte:options customElement="uni-ridgeline-plot" />
<script>
  import Original from '@w5-ui/svelte/components/RidgelinePlot.svelte';
  let {
    series = [],
    xRange = undefined,
    height = 180,
    ariaLabel = 'Ridgeline plot'
  } = $props();
</script>

<Original {series} {xRange} {height} {ariaLabel}>
  <slot />
</Original>
