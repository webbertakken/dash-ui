<svelte:options customElement={{ tag: "uni-status-indicator", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StatusIndicator.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    color = undefined,
    text = undefined,
    textColor = undefined
  } = $props();
</script>

<Original {color} {text} {textColor}>
  <slot />
</Original>
