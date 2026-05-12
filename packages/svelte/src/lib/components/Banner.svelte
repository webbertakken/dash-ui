<script module lang="ts">
  export type BannerVariant = 'info' | 'success' | 'warn' | 'danger';
  export interface BannerAction {
    label: string;
    onClick: () => void;
  }
</script>

<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';
  interface Props {
    variant?: BannerVariant;
    title?: string | undefined;
    action?: BannerAction | undefined;
    onDismiss?: (() => void) | undefined;
    children?: import('svelte').Snippet;
  }

  let {
    variant = 'info',
    title = undefined,
    action = undefined,
    onDismiss = undefined,
    children
  }: Props = $props();

  let isUrgent = $derived(variant === 'danger' || variant === 'warn');
</script>

<div
  class="banner banner--{variant}"
  role={isUrgent ? 'alert' : 'status'}
  aria-live={isUrgent ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  <div class="banner__body">
    {#if title}<span class="banner__title">{title}</span>{/if}
    <span>{@render children?.()}</span>
  </div>
  {#if action}
    <button type="button" class="banner__action" onclick={action.onClick}>{action.label}</button>
  {/if}
  {#if onDismiss}
    <button type="button" class="banner__dismiss icon-btn" onclick={onDismiss} aria-label="Dismiss banner">
      <CloseIcon />
    </button>
  {/if}
</div>
