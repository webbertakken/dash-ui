<svelte:options tag="uni-stripe-chart" />
<script>
  import Original from '@w5-ui/svelte/components/StripeChart.svelte';
  export let data = [];
  export let height = 48;
  export let colorLow = '#0A2840';
  export let colorHigh = '#FF4040';
  export let ariaLabel = 'Stripe chart';
</script>

<Original {data} {height} {colorLow} {colorHigh} {ariaLabel}>
  <slot />
</Original>
