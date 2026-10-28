<svelte:options customElement={{ tag: "uni-threshold-area-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ThresholdAreaChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    values = undefined,
    labels = [],
    threshold = undefined,
    thresholdLabel = undefined,
    belowColor = '#00C875',
    aboveColor = '#FF7B7B',
    height = 160,
    ariaLabel = 'Threshold area chart'
  } = $props();
</script>

<Original {values} {labels} {threshold} {thresholdLabel} {belowColor} {aboveColor} {height} {ariaLabel}>
  <slot />
</Original>
