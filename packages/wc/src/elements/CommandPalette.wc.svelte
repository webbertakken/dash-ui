<svelte:options customElement={{ tag: "uni-command-palette", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CommandPalette.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    open = false,
    items = [],
    placeholder = 'Search pages and actions…'
  } = $props();
</script>

<Original {open} {items} {placeholder}>
  <slot />
</Original>
