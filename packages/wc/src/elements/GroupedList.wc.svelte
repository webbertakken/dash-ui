<svelte:options customElement="uni-grouped-list" />
<script>
  import Original from '@w5-ui/svelte/components/GroupedList.svelte';
  let {
    groups = undefined,
    collapsible = true,
    ariaLabel = 'Grouped list'
  } = $props();
</script>

<Original {groups} {collapsible} {ariaLabel}>
  <slot />
</Original>
