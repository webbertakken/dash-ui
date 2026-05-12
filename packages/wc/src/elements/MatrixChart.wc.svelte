<svelte:options customElement="uni-matrix-chart" />
<script>
  import Original from '@w5-ui/svelte/components/MatrixChart.svelte';
  let {
    rows = [],
    cols = [],
    values = [],
    unit = '',
    ariaLabel = 'Matrix chart'
  } = $props();
</script>

<Original {rows} {cols} {values} {unit} {ariaLabel}>
  <slot />
</Original>
