<svelte:options tag="uni-parallel-coordinates" />
<script>
  import Original from '@w5-ui/svelte/components/ParallelCoordinates.svelte';
  export let axes = [];
  export let series = [];
  export let height = 200;
  export let ariaLabel = 'Parallel coordinates chart';
</script>

<Original {axes} {series} {height} {ariaLabel}>
  <slot />
</Original>
