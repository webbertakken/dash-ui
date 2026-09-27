<svelte:options customElement={{ tag: "uni-radial-bar-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/RadialBarChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    ariaLabel = 'Radial bar chart'
  } = $props();
</script>

<Original {items} {ariaLabel}>
  <slot />
</Original>
