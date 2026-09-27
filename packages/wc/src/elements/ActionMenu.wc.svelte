<svelte:options customElement={{ tag: "uni-action-menu", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ActionMenu.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    label = 'Actions'
  } = $props();
</script>

<Original {items} {label}>
  <slot />
</Original>
