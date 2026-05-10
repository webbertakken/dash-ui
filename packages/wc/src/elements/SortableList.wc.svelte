<svelte:options tag="uni-sortable-list" />
<script>
  import Original from '@dash-ui/svelte/components/SortableList.svelte';
  export let items = [];
  export let onChange = () => {};
  export let ariaLabel = undefined;
</script>

<Original {items} {onChange} {ariaLabel}>
  <slot />
</Original>
