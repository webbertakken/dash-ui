<svelte:options customElement={{ tag: "uni-parallel-coordinates", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ParallelCoordinates.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    axes = [],
    series = [],
    height = 200,
    ariaLabel = 'Parallel coordinates chart'
  } = $props();
</script>

<Original {axes} {series} {height} {ariaLabel}>
  <slot />
</Original>
