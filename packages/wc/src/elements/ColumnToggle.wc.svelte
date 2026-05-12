<svelte:options customElement="uni-column-toggle" />
<script>
  import Original from '@w5-ui/svelte/components/ColumnToggle.svelte';
  let {
    columns = [],
    visible = new Set()
  } = $props();
</script>

<Original {columns} {visible}>
  <slot />
</Original>
