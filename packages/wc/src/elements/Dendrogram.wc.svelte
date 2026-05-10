<svelte:options tag="uni-dendrogram" />
<script>
  import Original from '@dash-ui/svelte/components/Dendrogram.svelte';
  export let root = undefined;
  export let colWidth = 130;
  export let rowHeight = 28;
  export let ariaLabel = 'Dendrogram';
</script>

<Original {root} {colWidth} {rowHeight} {ariaLabel}>
  <slot />
</Original>
