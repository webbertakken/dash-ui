<svelte:options customElement="uni-parallel-coordinates" />
<script>
  import Original from '@w5-ui/svelte/components/ParallelCoordinates.svelte';
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
