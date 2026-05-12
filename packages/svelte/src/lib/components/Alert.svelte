<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';
  interface Props {
    variant?: 'success' | 'warn' | 'danger' | 'info';
    onDismiss?: (() => void) | undefined;
    children?: import('svelte').Snippet;
  }

  let { variant = 'info', onDismiss = undefined, children }: Props = $props();
</script>

<div
  class="alert alert-{variant}"
  role={variant === 'danger' ? 'alert' : 'status'}
  aria-live={variant === 'danger' ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  <span class="alert-body">{@render children?.()}</span>
  {#if onDismiss}
    <button type="button" class="alert-dismiss icon-btn" onclick={onDismiss} aria-label="Dismiss alert">
      <CloseIcon />
    </button>
  {/if}
</div>
