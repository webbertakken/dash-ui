<script lang="ts">
  import type { Snippet } from 'svelte';

  export type PillVariant = 'success' | 'warn' | 'danger' | 'info' | 'neutral';

  interface Props {
    variant?: PillVariant;
    showDot?: boolean;
    class?: string;
    style?: string;
    children?: Snippet;
  }

  let {
    variant = 'neutral',
    showDot = true,
    class: className = '',
    style = '',
    children,
  }: Props = $props();

  // Pre-compose so Tailwind's static scanner picks up every variant.
  const PILL: Record<PillVariant, string> = {
    success: 'bg-status-success/15 text-[#5ddb9f]',
    warn: 'bg-status-warning/15 text-[#f5c26b]',
    danger: 'bg-status-danger/15 text-[#ff7b7b]',
    info: 'bg-status-info/15 text-[#7fb6ff]',
    neutral: 'bg-white/[0.06] text-text-3',
  };
  const DOT: Record<PillVariant, string> = {
    success: 'bg-status-success',
    warn: 'bg-status-warning',
    danger: 'bg-status-danger',
    info: 'bg-status-info',
    neutral: 'bg-status-neutral',
  };

  let pillClass = $derived(
    `inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium leading-[1.4] ${PILL[variant]} ${className}`,
  );
</script>

<span class={pillClass} {style}>
  {#if showDot}<span class="h-1.5 w-1.5 rounded-full {DOT[variant]}" aria-hidden="true"></span>{/if}
  {@render children?.()}
</span>
