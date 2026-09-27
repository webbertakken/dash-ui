<svelte:options customElement={{ tag: "uni-pareto-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ParetoChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    height = 160,
    ariaLabel = 'Pareto chart',
    barColor = '#006FFF',
    lineColor = '#F5A623',
    threshold = 0.8
  } = $props();
</script>

<Original {items} {height} {ariaLabel} {barColor} {lineColor} {threshold}>
  <slot />
</Original>
