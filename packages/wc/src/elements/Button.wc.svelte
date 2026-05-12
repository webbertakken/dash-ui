<svelte:options customElement="uni-button" />
<script>
  import Original from '@w5-ui/svelte/components/Button.svelte';
  let {
    variant = 'ghost',
    iconOnly = false,
    loading = false,
    title = undefined,
    type = 'button',
    disabled = false,
    class: className = '',
    style = '',
    ariaLabel = undefined
  } = $props();
</script>

<Original {variant} {iconOnly} {loading} {title} {type} {disabled} class={className} {style} {ariaLabel}>
  <slot />
</Original>
