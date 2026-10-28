<svelte:options customElement={{ tag: "uni-tree-browser", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TreeBrowser.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    collections = {},
    items = {},
    rootId = 'root',
    defaultExpanded = [],
    expanded = undefined,
    selected = undefined,
    size: _size = 'medium',
    variant = 'folderTree',
    label = undefined,
    className = ''
  } = $props();
</script>

<Original {collections} {items} {rootId} {defaultExpanded} {expanded} {selected} size={_size} {variant} {label} {className}>
  <slot />
</Original>
