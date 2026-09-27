<svelte:options customElement={{ tag: "uni-confirm-dialog", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ConfirmDialog.svelte';
  import { withShadowStyles } from '../styled.ts';
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
