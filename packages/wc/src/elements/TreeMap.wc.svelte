<svelte:options customElement={{ tag: "uni-tree-map", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TreeMap.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    nodes = [],
    height = 160,
    ariaLabel = 'Treemap chart'
  } = $props();
</script>

<Original {nodes} {height} {ariaLabel}>
  <slot />
</Original>
