<svelte:options customElement={{ tag: "uni-area-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/AreaChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Area chart'
  } = $props();
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
