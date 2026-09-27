<svelte:options customElement={{ tag: "uni-pie-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/PieChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    slices = [],
    size = 140,
    ariaLabel = 'Pie chart'
  } = $props();
</script>

<Original {slices} {size} {ariaLabel}>
  <slot />
</Original>
