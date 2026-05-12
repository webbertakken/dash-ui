<svelte:options customElement="uni-expandable-row" />
<script>
  import Original from '@w5-ui/svelte/components/ExpandableRow.svelte';
  export let colSpan = undefined;
  export let defaultExpanded = false;
</script>

<Original {colSpan} {defaultExpanded}>
  <slot />
</Original>
