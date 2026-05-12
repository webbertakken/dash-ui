<svelte:options customElement="uni-venn-diagram" />
<script>
  import Original from '@w5-ui/svelte/components/VennDiagram.svelte';
  let {
    sets = [],
    intersections = [],
    height = 240,
    ariaLabel = 'Venn diagram'
  } = $props();
</script>

<Original {sets} {intersections} {height} {ariaLabel}>
  <slot />
</Original>
