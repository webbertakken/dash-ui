<svelte:options customElement="uni-otpinput" />
<script>
  import Original from '@w5-ui/svelte/components/OTPInput.svelte';
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
