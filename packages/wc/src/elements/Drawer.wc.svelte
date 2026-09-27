<svelte:options customElement={{ tag: "uni-drawer", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Drawer.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    open = false,
    title = undefined
  } = $props();
</script>

<Original {open} {title}>
  <slot />
</Original>
