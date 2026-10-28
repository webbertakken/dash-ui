<svelte:options customElement={{ tag: "uni-violin-plot", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ViolinPlot.svelte';
  import { withShadowStyles } from '../styled.ts';
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
