<svelte:options customElement={{ tag: "uni-toggle", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Toggle.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    on = false,
    ariaLabel = undefined,
    ariaDescribedBy = undefined
  } = $props();
</script>

<Original {on} {ariaLabel} {ariaDescribedBy}>
  <slot />
</Original>
