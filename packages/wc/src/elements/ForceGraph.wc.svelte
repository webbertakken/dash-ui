<svelte:options customElement="uni-force-graph" />
<script>
  import Original from '@w5-ui/svelte/components/ForceGraph.svelte';
  let {
    nodes = [],
    links = [],
    height = 260,
    ariaLabel = 'Force-directed network graph'
  } = $props();
</script>

<Original {nodes} {links} {height} {ariaLabel}>
  <slot />
</Original>
