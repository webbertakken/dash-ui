<svelte:options customElement={{ tag: "uni-sortable-list", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SortableList.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    ariaLabel = undefined
  } = $props();
</script>

<Original {items} {ariaLabel}>
  <slot />
</Original>
