<svelte:options customElement="uni-confirm-dialog" />
<script>
  import Original from '@w5-ui/svelte/components/ConfirmDialog.svelte';
  let {
    open = false,
    title = '',
    description = undefined,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'info'
  } = $props();
</script>

<Original {open} {title} {description} {confirmLabel} {cancelLabel} {variant}>
  <slot />
</Original>
