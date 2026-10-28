<svelte:options customElement={{ tag: "uni-icon-button", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/IconButton.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    title = undefined,
    type = 'button',
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {title} {type} class={className} {style}>
  <slot />
</Original>
