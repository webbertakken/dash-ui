<svelte:options customElement={{ tag: "uni-modal", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Modal.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    open = false,
    title = undefined,
    size = 'md'
  } = $props();
</script>

<Original {open} {title} {size}>
  <slot />
</Original>
