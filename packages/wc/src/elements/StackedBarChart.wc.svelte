<svelte:options customElement={{ tag: "uni-stacked-bar-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StackedBarChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    labels = [],
    height = 180,
    normalized = false,
    ariaLabel = 'Stacked bar chart'
  } = $props();
</script>

<Original {series} {labels} {height} {normalized} {ariaLabel}>
  <slot />
</Original>
