<svelte:options customElement="uni-correlation-matrix" />
<script>
  import Original from '@w5-ui/svelte/components/CorrelationMatrix.svelte';
  let {
    labels = [],
    data = [],
    cellSize = 52,
    ariaLabel = 'Correlation matrix'
  } = $props();
</script>

<Original {labels} {data} {cellSize} {ariaLabel}>
  <slot />
</Original>
