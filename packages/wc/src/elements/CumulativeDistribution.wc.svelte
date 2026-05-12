<svelte:options customElement="uni-cumulative-distribution" />
<script>
  import Original from '@w5-ui/svelte/components/CumulativeDistribution.svelte';
  let {
    series = [],
    guides = [50, 95],
    height = 160,
    unit = '',
    ariaLabel = 'Cumulative distribution chart'
  } = $props();
</script>

<Original {series} {guides} {height} {unit} {ariaLabel}>
  <slot />
</Original>
