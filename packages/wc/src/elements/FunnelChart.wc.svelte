<svelte:options customElement={{ tag: "uni-funnel-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/FunnelChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    segments = [],
    height = 160,
    ariaLabel = 'Funnel chart'
  } = $props();
</script>

<Original {segments} {height} {ariaLabel}>
  <slot />
</Original>
