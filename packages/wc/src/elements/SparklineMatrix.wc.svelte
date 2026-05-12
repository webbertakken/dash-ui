<svelte:options customElement="uni-sparkline-matrix" />
<script>
  import Original from '@w5-ui/svelte/components/SparklineMatrix.svelte';
  let {
    rows = [],
    height = 160,
    ariaLabel = 'Sparkline matrix'
  } = $props();
</script>

<Original {rows} {height} {ariaLabel}>
  <slot />
</Original>
