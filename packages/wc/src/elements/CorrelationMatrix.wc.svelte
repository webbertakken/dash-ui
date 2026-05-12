<svelte:options customElement="uni-correlation-matrix" />
<script>
  import Original from '@w5-ui/svelte/components/CorrelationMatrix.svelte';
  export let labels = [];
  export let data = [];
  export let cellSize = 52;
  export let ariaLabel = 'Correlation matrix';
</script>

<Original {labels} {data} {cellSize} {ariaLabel}>
  <slot />
</Original>
