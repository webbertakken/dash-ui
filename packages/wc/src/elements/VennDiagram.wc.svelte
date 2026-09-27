<svelte:options customElement={{ tag: "uni-venn-diagram", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/VennDiagram.svelte';
  import { withShadowStyles } from '../styled.ts';
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
