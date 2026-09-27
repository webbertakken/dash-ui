<svelte:options customElement={{ tag: "uni-polar-heatmap", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/PolarHeatmap.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    data = [],
    rows = 7,
    cols = 24,
    colLabels = [],
    color = '#006FFF',
    ariaLabel = 'Polar heatmap'
  } = $props();
</script>

<Original {data} {rows} {cols} {colLabels} {color} {ariaLabel}>
  <slot />
</Original>
