<svelte:options tag="uni-column-toggle" />
<script>
  import Original from '@w5-ui/svelte/components/ColumnToggle.svelte';
  export let columns = [];
  export let visible = new Set();
  export let onChange = () => {};
</script>

<Original {columns} {visible} {onChange}>
  <slot />
</Original>
