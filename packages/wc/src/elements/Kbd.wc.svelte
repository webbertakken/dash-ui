<svelte:options customElement={{ tag: "uni-kbd", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Kbd.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    keys = undefined,
    class: className = ''
  } = $props();
</script>

<Original {keys} class={className}>
  <slot />
</Original>
