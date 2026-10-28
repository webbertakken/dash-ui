<svelte:options customElement={{ tag: "uni-button", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Button.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    variant = 'ghost',
    iconOnly = false,
    loading = false,
    type = 'button',
    disabled = false,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {variant} {iconOnly} {loading} {type} {disabled} class={className} {style}>
  <slot />
</Original>
