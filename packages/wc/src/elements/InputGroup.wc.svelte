<svelte:options customElement={{ tag: "uni-input-group", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/InputGroup.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    prefix = undefined,
    suffix = undefined
  } = $props();
</script>

<Original {prefix} {suffix}>
  <slot />
</Original>
