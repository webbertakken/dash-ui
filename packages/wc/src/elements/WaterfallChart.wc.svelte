<svelte:options customElement={{ tag: "uni-waterfall-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/WaterfallChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    bars = [],
    height = 160,
    ariaLabel = 'Waterfall chart'
  } = $props();
</script>

<Original {bars} {height} {ariaLabel}>
  <slot />
</Original>
