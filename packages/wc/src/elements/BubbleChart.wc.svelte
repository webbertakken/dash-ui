<svelte:options customElement={{ tag: "uni-bubble-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/BubbleChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    points = [],
    xRange = undefined,
    yRange = undefined,
    rRange = [4, 20],
    height = 160,
    ariaLabel = 'Bubble chart'
  } = $props();
</script>

<Original {points} {xRange} {yRange} {rRange} {height} {ariaLabel}>
  <slot />
</Original>
