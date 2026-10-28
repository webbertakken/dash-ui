<svelte:options customElement={{ tag: "uni-context-menu", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ContextMenu.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    x = 0,
    y = 0,
    open = false,
    label = 'Context menu'
  } = $props();
</script>

<Original {items} {x} {y} {open} {label}>
  <slot />
</Original>
