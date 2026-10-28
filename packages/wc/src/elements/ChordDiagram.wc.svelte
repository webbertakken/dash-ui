<svelte:options customElement={{ tag: "uni-chord-diagram", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ChordDiagram.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    nodes = undefined,
    matrix = undefined,
    ariaLabel = 'Chord diagram'
  } = $props();
</script>

<Original {nodes} {matrix} {ariaLabel}>
  <slot />
</Original>
