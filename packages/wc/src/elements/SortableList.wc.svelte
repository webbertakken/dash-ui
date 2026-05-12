<svelte:options customElement="uni-sortable-list" />
<script>
  import Original from '@w5-ui/svelte/components/SortableList.svelte';
  let {
    items = [],
    ariaLabel = undefined
  } = $props();
</script>

<Original {items} {ariaLabel}>
  <slot />
</Original>
