<svelte:options customElement="uni-stripe-chart" />
<script>
  import Original from '@w5-ui/svelte/components/StripeChart.svelte';
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
