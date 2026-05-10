<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';
  export let variant: 'success' | 'warn' | 'danger' | 'info' = 'info';
  export let onDismiss: (() => void) | undefined = undefined;
</script>

<div
  class="alert alert-{variant}"
  role={variant === 'danger' ? 'alert' : 'status'}
  aria-live={variant === 'danger' ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  <span class="alert-body"><slot /></span>
  {#if onDismiss}
    <button type="button" class="alert-dismiss icon-btn" on:click={onDismiss} aria-label="Dismiss alert">
      <CloseIcon />
    </button>
  {/if}
</div>
