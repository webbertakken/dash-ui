<svelte:options customElement="uni-dot-plot" />
<script>
  import Original from '@w5-ui/svelte/components/DotPlot.svelte';
  let {
    items = [],
    min = 0,
    max = undefined,
    unit = '',
    valueLegend = undefined,
    compareLegend = undefined,
    ariaLabel = 'Dot plot'
  } = $props();
</script>

<Original {items} {min} {max} {unit} {valueLegend} {compareLegend} {ariaLabel}>
  <slot />
</Original>
