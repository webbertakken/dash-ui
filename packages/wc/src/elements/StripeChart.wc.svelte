<svelte:options customElement={{ tag: "uni-stripe-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StripeChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    data = [],
    height = 48,
    colorLow = '#0A2840',
    colorHigh = '#FF4040',
    ariaLabel = 'Stripe chart'
  } = $props();
</script>

<Original {data} {height} {colorLow} {colorHigh} {ariaLabel}>
  <slot />
</Original>
