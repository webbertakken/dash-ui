<svelte:options customElement={{ tag: "uni-tree-view", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TreeView.svelte';
  import { withShadowStyles } from '../styled.ts';
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
