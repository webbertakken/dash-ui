<svelte:options customElement="uni-json-viewer-node" />
<script>
  import Original from '@w5-ui/svelte/components/JsonViewerNode.svelte';
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
