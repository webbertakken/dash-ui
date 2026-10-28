<svelte:options customElement={{ tag: "uni-ridgeline-plot", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/RidgelinePlot.svelte';
  import { withShadowStyles } from '../styled.ts';
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
