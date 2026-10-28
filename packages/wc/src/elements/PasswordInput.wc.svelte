<svelte:options customElement={{ tag: "uni-password-input", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/PasswordInput.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    value = '',
    placeholder = undefined,
    disabled = false,
    autocomplete = 'current-password',
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {placeholder} {disabled} {autocomplete} class={className}>
  <slot />
</Original>
