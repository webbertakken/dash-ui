<svelte:options customElement={{ tag: "uni-dendrogram", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Dendrogram.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    root = undefined,
    colWidth = 130,
    rowHeight = 28,
    ariaLabel = 'Dendrogram'
  } = $props();
</script>

<Original {root} {colWidth} {rowHeight} {ariaLabel}>
  <slot />
</Original>
