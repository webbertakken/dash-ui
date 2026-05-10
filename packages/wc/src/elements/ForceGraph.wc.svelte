<svelte:options tag="uni-force-graph" />
<script>
  import Original from '@dash-ui/svelte/components/ForceGraph.svelte';
  export let nodes = [];
  export let links = [];
  export let height = 260;
  export let ariaLabel = 'Force-directed network graph';
</script>

<Original {nodes} {links} {height} {ariaLabel}>
  <slot />
</Original>
