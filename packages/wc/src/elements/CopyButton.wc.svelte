<svelte:options customElement={{ tag: "uni-copy-button", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CopyButton.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    text = undefined,
    label = 'Copy'
  } = $props();
</script>

<Original {text} {label}>
  <slot />
</Original>
