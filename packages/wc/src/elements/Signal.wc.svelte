<svelte:options customElement={{ tag: "uni-signal", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Signal.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    weak = false,
    label = undefined
  } = $props();
</script>

<Original {weak} {label}>
  <slot />
</Original>
