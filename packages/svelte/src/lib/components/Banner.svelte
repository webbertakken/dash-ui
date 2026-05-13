<script module lang="ts">
  export type BannerVariant = 'info' | 'success' | 'warn' | 'danger';
  export interface BannerAction {
    label: string;
    onClick: () => void;
  }
</script>

<script lang="ts">
  import CloseIcon from '../icons/CloseIcon.svelte';
  import IconButton from './IconButton.svelte';

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
    children,
  }: Props = $props();

  let isUrgent = $derived(variant === 'danger' || variant === 'warn');

  // Pre-composed variant pairs (banner + title tint). Backgrounds at 10%,
  // top border solid in the base colour, both matching dashboard.css.
  const BANNER: Record<BannerVariant, string> = {
    info: 'bg-status-info/10 border-t-brand-05 text-[#7fb6ff]',
    success: 'bg-status-success/10 border-t-status-success text-[#5ddb9f]',
    warn: 'bg-status-warning/10 border-t-status-warning text-[#f5c26b]',
    danger: 'bg-status-danger/10 border-t-status-danger text-[#ff7b7b]',
  };
  const TITLE: Record<BannerVariant, string> = {
    info: 'text-[#b8dbff]',
    success: 'text-[#a0edd0]',
    warn: 'text-[#f5e1a8]',
    danger: 'text-[#ffb8b8]',
  };
</script>

<div
  class="box-border flex w-full items-center gap-2.5 border-t-[3px] px-4 py-2.5 text-13 leading-[1.4]
    {BANNER[variant]}"
  role={isUrgent ? 'alert' : 'status'}
  aria-live={isUrgent ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  <div class="flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
    {#if title}
      <span class="mr-0.5 font-semibold {TITLE[variant]}">{title}</span>
    {/if}
    <span>{@render children?.()}</span>
  </div>
  {#if action}
    <button
      type="button"
      class="h-6 shrink-0 cursor-pointer rounded border border-current bg-transparent px-2.5 text-12 text-[inherit] opacity-85 hover:opacity-100"
      onclick={action.onClick}
    >{action.label}</button>
  {/if}
  {#if onDismiss}
    <IconButton
      title="Dismiss banner"
      onclick={onDismiss}
      class="ml-1 h-6 w-6 shrink-0"
      aria-label="Dismiss banner"
    >
      <CloseIcon />
    </IconButton>
  {/if}
</div>
