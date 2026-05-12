<svelte:options customElement="uni-sort-header" />
<script>
  import Original from '@w5-ui/svelte/components/SortHeader.svelte';
  let {
    sortKey = undefined,
    activeKey = null,
    dir = 'asc'
  } = $props();
</script>

<Original {sortKey} {activeKey} {dir}>
  <slot />
</Original>
