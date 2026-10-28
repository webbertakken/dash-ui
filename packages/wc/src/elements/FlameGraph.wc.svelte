<svelte:options customElement={{ tag: "uni-flame-graph", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/FlameGraph.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    root = undefined,
    height = 160,
    ariaLabel = 'Flame graph'
  } = $props();
</script>

<Original {root} {height} {ariaLabel}>
  <slot />
</Original>
