<svelte:options customElement={{ tag: "uni-scatter-plot", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ScatterPlot.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    height = 160,
    ariaLabel = 'Scatter plot'
  } = $props();
</script>

<Original {points} {xRange} {yRange} {height} {ariaLabel}>
  <slot />
</Original>
