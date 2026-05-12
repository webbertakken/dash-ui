<svelte:options customElement="uni-box-plot" />
<script>
  import Original from '@w5-ui/svelte/components/BoxPlot.svelte';
  let {
    series = [],
    yRange = undefined,
    height = 160,
    ariaLabel = 'Box plot'
  } = $props();
</script>

<Original {series} {yRange} {height} {ariaLabel}>
  <slot />
</Original>
