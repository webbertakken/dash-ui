<svelte:options customElement={{ tag: "uni-correlation-matrix", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CorrelationMatrix.svelte';
  import { withShadowStyles } from '../styled.ts';
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
