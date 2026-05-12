<svelte:options customElement="uni-expandable-row" />
<script>
  import Original from '@w5-ui/svelte/components/ExpandableRow.svelte';
  let {
    colSpan = undefined,
    defaultExpanded = false
  } = $props();
</script>

<Original {colSpan} {defaultExpanded}>
  <slot />
</Original>
