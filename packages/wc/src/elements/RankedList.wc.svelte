<svelte:options customElement={{ tag: "uni-ranked-list", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/RankedList.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = undefined,
    unit = undefined,
    max = undefined,
    ariaLabel = 'Ranked list'
  } = $props();
</script>

<Original {items} {unit} {max} {ariaLabel}>
  <slot />
</Original>
