<svelte:options customElement="uni-json-viewer" />
<script>
  import Original from '@w5-ui/svelte/components/JsonViewer.svelte';
  let {
    data = undefined,
    label = 'JSON viewer',
    defaultExpanded = true,
    maxDepth = 3
  } = $props();
</script>

<Original {data} {label} {defaultExpanded} {maxDepth}>
  <slot />
</Original>
