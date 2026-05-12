<svelte:options customElement="uni-sankey-diagram" />
<script>
  import Original from '@w5-ui/svelte/components/SankeyDiagram.svelte';
  let {
    nodes = [],
    links = [],
    height = 180,
    ariaLabel = 'Sankey diagram'
  } = $props();
</script>

<Original {nodes} {links} {height} {ariaLabel}>
  <slot />
</Original>
