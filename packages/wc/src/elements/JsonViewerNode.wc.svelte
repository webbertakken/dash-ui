<svelte:options customElement={{ tag: "uni-json-viewer-node", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/JsonViewerNode.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    v = undefined,
    k = undefined,
    depth = 0,
    maxDepth = 3,
    startOpen = true
  } = $props();
</script>

<Original {v} {k} {depth} {maxDepth} {startOpen}>
  <slot />
</Original>
