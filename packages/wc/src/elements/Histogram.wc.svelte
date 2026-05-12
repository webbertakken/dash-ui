<svelte:options customElement="uni-histogram" />
<script>
  import Original from '@w5-ui/svelte/components/Histogram.svelte';
  let {
    bins = [],
    height = 160,
    color = '#006FFF',
    xUnit = '',
    ariaLabel = 'Histogram'
  } = $props();
</script>

<Original {bins} {height} {color} {xUnit} {ariaLabel}>
  <slot />
</Original>
