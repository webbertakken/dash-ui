<svelte:options customElement="uni-kvtable" />
<script>
  import Original from '@w5-ui/svelte/components/KVTable.svelte';
  let {
    rows = [],
    caption = undefined
  } = $props();
</script>

<Original {rows} {caption}>
  <slot />
</Original>
