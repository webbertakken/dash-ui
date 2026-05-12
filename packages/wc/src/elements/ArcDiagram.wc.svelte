<svelte:options tag="uni-arc-diagram" />
<script>
  import Original from '@w5-ui/svelte/components/ArcDiagram.svelte';
  export let nodes = undefined;
  export let links = undefined;
  export let height = 180;
  export let ariaLabel = 'Arc diagram';
</script>

<Original {nodes} {links} {height} {ariaLabel}>
  <slot />
</Original>
