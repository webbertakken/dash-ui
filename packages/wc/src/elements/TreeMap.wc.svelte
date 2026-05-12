<svelte:options customElement="uni-tree-map" />
<script>
  import Original from '@w5-ui/svelte/components/TreeMap.svelte';
  let {
    nodes = [],
    height = 160,
    ariaLabel = 'Treemap chart'
  } = $props();
</script>

<Original {nodes} {height} {ariaLabel}>
  <slot />
</Original>
