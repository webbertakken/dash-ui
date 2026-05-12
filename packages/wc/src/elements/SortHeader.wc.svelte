<svelte:options tag="uni-sort-header" />
<script>
  import Original from '@w5-ui/svelte/components/SortHeader.svelte';
  export let sortKey = undefined;
  export let activeKey = null;
  export let dir = 'asc';
</script>

<Original {sortKey} {activeKey} {dir}>
  <slot />
</Original>
