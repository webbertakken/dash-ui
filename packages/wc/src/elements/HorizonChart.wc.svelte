<svelte:options customElement={{ tag: "uni-horizon-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/HorizonChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    xLabels = undefined,
    bands = 3,
    ariaLabel = 'Horizon chart'
  } = $props();
</script>

<Original {series} {xLabels} {bands} {ariaLabel}>
  <slot />
</Original>
