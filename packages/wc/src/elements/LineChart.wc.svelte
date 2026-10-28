<svelte:options customElement={{ tag: "uni-line-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/LineChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Line chart'
  } = $props();
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
