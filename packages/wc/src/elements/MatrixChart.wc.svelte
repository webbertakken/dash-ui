<svelte:options customElement="uni-matrix-chart" />
<script>
  import Original from '@w5-ui/svelte/components/MatrixChart.svelte';
  export let rows = [];
  export let cols = [];
  export let values = [];
  export let unit = '';
  export let ariaLabel = 'Matrix chart';
</script>

<Original {rows} {cols} {values} {unit} {ariaLabel}>
  <slot />
</Original>
