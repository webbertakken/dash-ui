<svelte:options customElement={{ tag: "uni-kvtable", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/KVTable.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    rows = [],
    caption = undefined
  } = $props();
</script>

<Original {rows} {caption}>
  <slot />
</Original>
