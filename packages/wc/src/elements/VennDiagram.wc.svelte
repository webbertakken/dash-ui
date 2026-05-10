<svelte:options tag="uni-venn-diagram" />
<script>
  import Original from '@dash-ui/svelte/components/VennDiagram.svelte';
  export let sets = [];
  export let intersections = [];
  export let height = 240;
  export let ariaLabel = 'Venn diagram';
</script>

<Original {sets} {intersections} {height} {ariaLabel}>
  <slot />
</Original>
