<svelte:options customElement={{ tag: "uni-radar-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/RadarChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    axes = [],
    height = 200,
    ariaLabel = 'Radar chart'
  } = $props();
</script>

<Original {series} {axes} {height} {ariaLabel}>
  <slot />
</Original>
