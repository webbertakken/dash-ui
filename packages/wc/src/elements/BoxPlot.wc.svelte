<svelte:options customElement={{ tag: "uni-box-plot", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/BoxPlot.svelte';
  import { withShadowStyles } from '../styled.ts';
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
