<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';
  import IconButton from './IconButton.svelte';

  interface Props {
    variant?: 'success' | 'warn' | 'danger' | 'info';
    onDismiss?: (() => void) | undefined;
    children?: import('svelte').Snippet;
  }

  let { variant = 'info', onDismiss = undefined, children }: Props = $props();

  // Variant strings statically composed so Tailwind's scanner picks them
  // up. Values match dashboard.css exactly: 10% bg tint + left-border in
  // the variant base colour + hand-tuned readable text colour.
  const VARIANT: Record<NonNullable<Props['variant']>, string> = {
    success: 'bg-status-success/10 border-l-status-success text-status-success',
    warn: 'bg-status-warning/10 border-l-status-warning text-status-warning',
    danger: 'bg-status-danger/10 border-l-status-danger text-status-danger',
    info: 'bg-status-info/10 border-l-brand-05 text-status-info',
  };
</script>

<div
  class="flex items-center gap-2.5 rounded-lg border-l-[3px] px-3.5 py-2.5 text-13 leading-[1.4]
    {VARIANT[variant]}"
  role={variant === 'danger' ? 'alert' : 'status'}
  aria-live={variant === 'danger' ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  <span class="flex-1">{@render children?.()}</span>
  {#if onDismiss}
    <IconButton
      title="Dismiss alert"
      onclick={onDismiss}
      class="ml-auto h-6 w-6 shrink-0"
      aria-label="Dismiss alert"
    >
      <CloseIcon />
    </IconButton>
  {/if}
</div>
