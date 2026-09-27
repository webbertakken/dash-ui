<svelte:options customElement={{ tag: "uni-cumulative-distribution", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CumulativeDistribution.svelte';
  import { withShadowStyles } from '../styled.ts';
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
