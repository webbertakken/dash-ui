<svelte:options tag="uni-sort-header" />
<script>
  import Original from '@dash-ui/svelte/components/SortHeader.svelte';
  export let sortKey = undefined;
  export let activeKey = null;
  export let dir = 'asc';
</script>

<Original {sortKey} {activeKey} {dir}>
  <slot />
</Original>
