<svelte:options customElement="uni-password-input" />
<script>
  import Original from '@w5-ui/svelte/components/PasswordInput.svelte';
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
