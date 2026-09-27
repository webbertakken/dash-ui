<svelte:options customElement={{ tag: "uni-hexbin-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/HexbinChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    height = 200,
    hexRadius = 10,
    ariaLabel = 'Hexbin chart'
  } = $props();
</script>

<Original {points} {xRange} {yRange} {height} {hexRadius} {ariaLabel}>
  <slot />
</Original>
