<svelte:options tag="uni-correlation-matrix" />
<script>
  import Original from '@dash-ui/svelte/components/CorrelationMatrix.svelte';
  export let labels = [];
  export let data = [];
  export let cellSize = 52;
  export let ariaLabel = 'Correlation matrix';
</script>

<Original {labels} {data} {cellSize} {ariaLabel}>
  <slot />
</Original>
