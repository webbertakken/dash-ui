<svelte:options tag="uni-confirm-dialog" />
<script>
  import Original from '@w5-ui/svelte/components/ConfirmDialog.svelte';
  export let open = false;
  export let title = '';
  export let description = undefined;
  export let confirmLabel = 'Confirm';
  export let cancelLabel = 'Cancel';
  export let variant = 'info';
  export let onConfirm = () => {};
  export let onCancel = () => {};
</script>

<Original {open} {title} {description} {confirmLabel} {cancelLabel} {variant} {onConfirm} {onCancel}>
  <slot />
</Original>
