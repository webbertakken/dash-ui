<svelte:options customElement={{ tag: "uni-pill", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Pill.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    variant = 'neutral',
    showDot = true,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {variant} {showDot} class={className} {style}>
  <slot />
</Original>
