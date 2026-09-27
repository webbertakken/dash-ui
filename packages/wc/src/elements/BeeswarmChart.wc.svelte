<svelte:options customElement={{ tag: "uni-beeswarm-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/BeeswarmChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    yRange = undefined,
    height = 200,
    unit = '',
    dotRadius = 4,
    ariaLabel = 'Beeswarm chart'
  } = $props();
</script>

<Original {series} {yRange} {height} {unit} {dotRadius} {ariaLabel}>
  <slot />
</Original>
