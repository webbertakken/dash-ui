<svelte:options customElement="uni-command-palette" />
<script>
  import Original from '@w5-ui/svelte/components/CommandPalette.svelte';
  let {
    open = false,
    items = [],
    placeholder = 'Search pages and actions…'
  } = $props();
</script>

<Original {open} {items} {placeholder}>
  <slot />
</Original>
