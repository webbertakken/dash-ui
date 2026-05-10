<script context="module" lang="ts">
  export type BannerVariant = 'info' | 'success' | 'warn' | 'danger';
  export interface BannerAction {
    label: string;
    onClick: () => void;
  }
</script>

<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';
  export let variant: BannerVariant = 'info';
  export let title: string | undefined = undefined;
  export let action: BannerAction | undefined = undefined;
  export let onDismiss: (() => void) | undefined = undefined;

  $: isUrgent = variant === 'danger' || variant === 'warn';
</script>

<div
  class="banner banner--{variant}"
  role={isUrgent ? 'alert' : 'status'}
  aria-live={isUrgent ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  <div class="banner__body">
    {#if title}<span class="banner__title">{title}</span>{/if}
    <span><slot /></span>
  </div>
  {#if action}
    <button type="button" class="banner__action" on:click={action.onClick}>{action.label}</button>
  {/if}
  {#if onDismiss}
    <button type="button" class="banner__dismiss icon-btn" on:click={onDismiss} aria-label="Dismiss banner">
      <CloseIcon />
    </button>
  {/if}
</div>
