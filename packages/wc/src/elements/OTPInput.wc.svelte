<svelte:options customElement={{ tag: "uni-otpinput", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/OTPInput.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    length = 6,
    value = '',
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {label} {length} {value} {disabled} class={className}>
  <slot />
</Original>
