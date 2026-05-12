<svelte:options customElement="uni-chord-diagram" />
<script>
  import Original from '@w5-ui/svelte/components/ChordDiagram.svelte';
  let {
    nodes = undefined,
    matrix = undefined,
    ariaLabel = 'Chord diagram'
  } = $props();
</script>

<Original {nodes} {matrix} {ariaLabel}>
  <slot />
</Original>
