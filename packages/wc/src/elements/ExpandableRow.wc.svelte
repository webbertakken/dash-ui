<svelte:options customElement={{ tag: "uni-expandable-row", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ExpandableRow.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    colSpan = undefined,
    defaultExpanded = false
  } = $props();
</script>

<Original {colSpan} {defaultExpanded}>
  <slot />
</Original>
