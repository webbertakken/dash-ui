<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  interface Props {
    label: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    label,
    placement = 'top',
    class: className = '',
    children,
  }: Props = $props();

  const id = `dash-ui-tooltip-${++counter}`;

  // Pre-composed placement strings so Tailwind's scanner picks each up.
  // The wrapper carries `group` so the content shows on group-hover or
  // group-focus-within (replaces dashboard.css's `:hover .tooltip-content`).
  const PLACEMENT: Record<NonNullable<Props['placement']>, string> = {
    top: 'bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2',
    bottom: 'top-[calc(100%+6px)] left-1/2 -translate-x-1/2',
    left: 'right-[calc(100%+6px)] top-1/2 -translate-y-1/2',
    right: 'left-[calc(100%+6px)] top-1/2 -translate-y-1/2',
  };
</script>

<span class="group relative inline-flex {className}">
  <span class="inline-flex" aria-describedby={id}>{@render children?.()}</span>
  <span
    {id}
    role="tooltip"
    class="pointer-events-none absolute z-[9999] whitespace-nowrap rounded border border-white/[0.08] bg-[#1e2028] px-2 py-1 text-[11px] leading-[1.3] text-[#c8c9d0] opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none
      {PLACEMENT[placement]}"
  >{label}</span>
</span>
