<svelte:options tag="uni-tree-map" />
<script>
  import Original from '@w5-ui/svelte/components/TreeMap.svelte';
  export let nodes = [];
  export let height = 160;
  export let ariaLabel = 'Treemap chart';
</script>

<Original {nodes} {height} {ariaLabel}>
  <slot />
</Original>
