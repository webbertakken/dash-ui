<svelte:options tag="uni-dot-plot" />
<script>
  import Original from '@w5-ui/svelte/components/DotPlot.svelte';
  export let items = [];
  export let min = 0;
  export let max = undefined;
  export let unit = '';
  export let valueLegend = undefined;
  export let compareLegend = undefined;
  export let ariaLabel = 'Dot plot';
</script>

<Original {items} {min} {max} {unit} {valueLegend} {compareLegend} {ariaLabel}>
  <slot />
</Original>
