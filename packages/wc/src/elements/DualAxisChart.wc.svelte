<svelte:options customElement={{ tag: "uni-dual-axis-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/DualAxisChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    bars = undefined,
    line = undefined,
    labels = [],
    height = 160,
    ariaLabel = 'Dual axis chart'
  } = $props();
</script>

<Original {bars} {line} {labels} {height} {ariaLabel}>
  <slot />
</Original>
