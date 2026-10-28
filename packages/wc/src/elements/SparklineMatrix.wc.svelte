<svelte:options customElement={{ tag: "uni-sparkline-matrix", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SparklineMatrix.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    rows = [],
    height = 160,
    ariaLabel = 'Sparkline matrix'
  } = $props();
</script>

<Original {rows} {height} {ariaLabel}>
  <slot />
</Original>
