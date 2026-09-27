<svelte:options customElement={{ tag: "uni-sort-header", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SortHeader.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    sortKey = undefined,
    activeKey = null,
    dir = 'asc'
  } = $props();
</script>

<Original {sortKey} {activeKey} {dir}>
  <slot />
</Original>
