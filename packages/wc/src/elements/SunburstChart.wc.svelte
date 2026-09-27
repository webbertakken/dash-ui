<svelte:options customElement={{ tag: "uni-sunburst-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SunburstChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    root = undefined,
    ariaLabel = 'Sunburst chart'
  } = $props();
</script>

<Original {root} {ariaLabel}>
  <slot />
</Original>
