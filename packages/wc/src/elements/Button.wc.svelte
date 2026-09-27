<svelte:options customElement="uni-button" />
<script>
  import Original from '@w5-ui/svelte/components/Button.svelte';
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
