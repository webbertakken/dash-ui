<svelte:options customElement={{ tag: "uni-delta", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Delta.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    dir = undefined,
    class: className = ''
  } = $props();
</script>

<Original {dir} class={className}>
  <slot />
</Original>
