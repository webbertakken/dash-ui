<svelte:options tag="uni-sankey-diagram" />
<script>
  import Original from '@dash-ui/svelte/components/SankeyDiagram.svelte';
  export let nodes = [];
  export let links = [];
  export let height = 180;
  export let ariaLabel = 'Sankey diagram';
</script>

<Original {nodes} {links} {height} {ariaLabel}>
  <slot />
</Original>
