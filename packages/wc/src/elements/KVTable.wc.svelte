<svelte:options customElement="uni-kvtable" />
<script>
  import Original from '@w5-ui/svelte/components/KVTable.svelte';
  export let rows = [];
  export let caption = undefined;
</script>

<Original {rows} {caption}>
  <slot />
</Original>
