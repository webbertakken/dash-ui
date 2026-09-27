<svelte:options customElement={{ tag: "uni-circle-packing", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CirclePacking.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = undefined,
    height = 200,
    ariaLabel = 'Circle packing chart'
  } = $props();
</script>

<Original {items} {height} {ariaLabel}>
  <slot />
</Original>
