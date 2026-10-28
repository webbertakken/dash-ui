<svelte:options customElement={{ tag: "uni-grouped-list", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/GroupedList.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    groups = undefined,
    collapsible = true,
    ariaLabel = 'Grouped list'
  } = $props();
</script>

<Original {groups} {collapsible} {ariaLabel}>
  <slot />
</Original>
