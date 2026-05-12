<svelte:options customElement="uni-arc-diagram" />
<script>
  import Original from '@w5-ui/svelte/components/ArcDiagram.svelte';
  let {
    nodes = undefined,
    links = undefined,
    height = 180,
    ariaLabel = 'Arc diagram'
  } = $props();
</script>

<Original {nodes} {links} {height} {ariaLabel}>
  <slot />
</Original>
