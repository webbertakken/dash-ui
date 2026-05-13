<script module lang="ts">
  export type BadgeColor = 'danger' | 'warn' | 'info' | 'success' | 'neutral';
</script>

<script lang="ts">
  interface Props {
    count?: number | undefined;
    dot?: boolean;
    max?: number;
    showZero?: boolean;
    color?: BadgeColor;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    count = undefined,
    dot = false,
    max = 99,
    showZero = false,
    color = 'danger',
    class: klass = '',
    children,
  }: Props = $props();

  let show = $derived(dot || (count !== undefined && (showZero || count > 0)));
  let label = $derived(count !== undefined ? (count > max ? `${max}+` : String(count)) : '');

  // Variant strings pre-composed for Tailwind's static scanner. Warn keeps
  // dashboard.css's `color: #111` (legible on the orange chip).
  const COLOR: Record<BadgeColor, string> = {
    danger: 'bg-status-danger text-white',
    warn: 'bg-status-warning text-[#111]',
    info: 'bg-brand-05 text-white',
    success: 'bg-status-success text-white',
    neutral: 'bg-status-neutral text-white',
  };
</script>

<span class="relative inline-flex {klass}">
  {@render children?.()}
  {#if show}
    <span
      class="pointer-events-none absolute z-10 flex items-center justify-center whitespace-nowrap rounded-lg border-[1.5px] border-neutral-10 text-[10px] font-bold leading-none
        {COLOR[color]}
        {dot
          ? '-right-0.5 -top-0.5 h-2 w-2 min-w-2 p-0'
          : '-right-1.5 -top-1 h-4 min-w-4 px-1'}"
      aria-hidden="true"
    >{#if !dot}{label}{/if}</span>
  {/if}
</span>
