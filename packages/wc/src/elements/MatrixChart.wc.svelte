<svelte:options customElement={{ tag: "uni-matrix-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/MatrixChart.svelte';
  import { withShadowStyles } from '../styled.ts';
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
