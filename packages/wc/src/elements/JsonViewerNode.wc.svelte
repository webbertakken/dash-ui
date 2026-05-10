<svelte:options tag="uni-json-viewer-node" />
<script>
  import Original from '@dash-ui/svelte/components/JsonViewerNode.svelte';
  export let v = undefined;
  export let k = undefined;
  export let depth = 0;
  export let maxDepth = 3;
  export let startOpen = true;
</script>

<Original {v} {k} {depth} {maxDepth} {startOpen}>
  <slot />
</Original>
