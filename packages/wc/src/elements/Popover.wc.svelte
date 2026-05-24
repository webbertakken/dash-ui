<svelte:options customElement="uni-popover" />
<script>
  import Original from '@w5-ui/svelte/components/Popover.svelte';
  let {
    label = undefined,
    variant = 'ghost',
    title = undefined,
    placement = 'bottom-start',
    open = false
  } = $props();
</script>

<Original {label} {variant} {title} {placement} {open}>
  <slot />
</Original>
