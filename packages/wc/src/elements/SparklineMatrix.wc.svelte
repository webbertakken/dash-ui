<svelte:options tag="uni-sparkline-matrix" />
<script>
  import Original from '@w5-ui/svelte/components/SparklineMatrix.svelte';
  export let rows = [];
  export let height = 160;
  export let ariaLabel = 'Sparkline matrix';
</script>

<Original {rows} {height} {ariaLabel}>
  <slot />
</Original>
