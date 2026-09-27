<svelte:options customElement={{ tag: "uni-virtual-list", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/VirtualList.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    itemHeight = 48,
    height = 400,
    label = undefined,
    overscan = 3
  } = $props();
</script>

<Original {items} {itemHeight} {height} {label} {overscan}>
  <slot />
</Original>
