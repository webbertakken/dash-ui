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
  // Backgrounds use the literal 14% opacity from `dashboard.css`; text
  // colours resolve to the semantic status tokens so they stay legible
  // against the 14% tinted background in both motifs. The neutral variant
  // sits on `--row-active` (brand-blue tint) so it stays visible on a
  // white page bg.
  const PILL: Record<PillVariant, string> = {
    success: 'bg-status-success/14 text-status-success',
    warn: 'bg-status-warning/14 text-status-warning',
    danger: 'bg-status-danger/14 text-status-danger',
    info: 'bg-status-info/14 text-status-info',
    neutral: 'bg-row-active text-text-2',
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
