<svelte:options tag="uni-chord-diagram" />
<script>
  import Original from '@dash-ui/svelte/components/ChordDiagram.svelte';
  export let nodes = undefined;
  export let matrix = undefined;
  export let ariaLabel = 'Chord diagram';
</script>

<Original {nodes} {matrix} {ariaLabel}>
  <slot />
</Original>
