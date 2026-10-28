<svelte:options customElement={{ tag: "uni-arc-diagram", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ArcDiagram.svelte';
  import { withShadowStyles } from '../styled.ts';
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
