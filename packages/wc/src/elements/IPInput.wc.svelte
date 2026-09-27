<svelte:options customElement={{ tag: "uni-ipinput", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/IPInput.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    value = '0.0.0.0',
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {disabled} class={className}>
  <slot />
</Original>
