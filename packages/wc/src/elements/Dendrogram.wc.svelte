<svelte:options customElement="uni-dendrogram" />
<script>
  import Original from '@w5-ui/svelte/components/Dendrogram.svelte';
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
