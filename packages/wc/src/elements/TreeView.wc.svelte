<svelte:options customElement="uni-tree-view" />
<script>
  import Original from '@w5-ui/svelte/components/TreeView.svelte';
  let {
    nodes = [],
    selected = undefined,
    defaultExpanded = [],
    label = undefined,
    className = ''
  } = $props();
</script>

<Original {nodes} {selected} {defaultExpanded} {label} {className}>
  <slot />
</Original>
