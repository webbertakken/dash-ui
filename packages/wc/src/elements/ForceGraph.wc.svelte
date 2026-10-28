<svelte:options customElement={{ tag: "uni-force-graph", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ForceGraph.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    nodes = [],
    links = [],
    height = 260,
    ariaLabel = 'Force-directed network graph'
  } = $props();
</script>

<Original {nodes} {links} {height} {ariaLabel}>
  <slot />
</Original>
