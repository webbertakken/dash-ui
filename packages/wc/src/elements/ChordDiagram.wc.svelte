<svelte:options tag="uni-chord-diagram" />
<script>
  import Original from '@w5-ui/svelte/components/ChordDiagram.svelte';
  export let nodes = undefined;
  export let matrix = undefined;
  export let ariaLabel = 'Chord diagram';
</script>

<Original {nodes} {matrix} {ariaLabel}>
  <slot />
</Original>
