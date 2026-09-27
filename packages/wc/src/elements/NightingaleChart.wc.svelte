<svelte:options customElement={{ tag: "uni-nightingale-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/NightingaleChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    segments = [],
    color = '#006FFF',
    ariaLabel = 'Nightingale chart'
  } = $props();
</script>

<Original {segments} {color} {ariaLabel}>
  <slot />
</Original>
