<svelte:options customElement={{ tag: "uni-dot-plot", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/DotPlot.svelte';
  import { withShadowStyles } from '../styled.ts';
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
