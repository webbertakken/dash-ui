<svelte:options customElement="uni-context-menu" />
<script>
  import Original from '@w5-ui/svelte/components/ContextMenu.svelte';
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
