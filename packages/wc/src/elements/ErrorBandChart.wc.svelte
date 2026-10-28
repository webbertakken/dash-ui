<svelte:options customElement={{ tag: "uni-error-band-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ErrorBandChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    series = [],
    xLabels = [],
    yRange = undefined,
    height = 180,
    unit = '',
    ariaLabel = 'Error band chart'
  } = $props();
</script>

<Original {series} {xLabels} {yRange} {height} {unit} {ariaLabel}>
  <slot />
</Original>
