<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import Button from './Button.svelte';

  interface Props {
    label: string;
    variant?: 'ghost' | 'primary';
    title?: string | undefined;
    placement?: 'bottom-start' | 'bottom-end' | 'bottom';
    children?: import('svelte').Snippet;
  }

  let {
    label,
    variant = 'ghost',
    title = undefined,
    placement = 'bottom-start',
    children,
  }: Props = $props();

  const uid = `dash-ui-pop-${++counter}`;
  const titleId = `${uid}-title`;

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  let open = $state(false);
  let rootEl = $state<HTMLDivElement | undefined>(undefined);
  let triggerEl = $state<HTMLElement | undefined>(undefined);
  let panelEl = $state<HTMLDivElement | undefined>(undefined);

  async function toggle() {
    if (!open) {
      open = true;
      await tick();
      const first = panelEl?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelEl)?.focus();
    } else {
      open = false;
    }
  }

  function onKey(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      open = false;
      triggerEl?.focus();
      return;
    }
    if (e.key === 'Tab' && panelEl) {
      const items = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    }
  }

  function onPointer(e: PointerEvent) {
    if (open && !rootEl?.contains(e.target as Node)) open = false;
  }

  onMount(() => {
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    triggerEl = rootEl?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]') ?? undefined;
  });
  onDestroy(() => {
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', onPointer);
  });

  // Placement -> Tailwind utility classes for the floating panel.
  const PLACEMENT: Record<NonNullable<Props['placement']>, string> = {
    'bottom-start': 'top-[calc(100%+6px)] left-0',
    'bottom-end': 'top-[calc(100%+6px)] right-0',
    bottom: 'top-[calc(100%+6px)] left-1/2 -translate-x-1/2',
  };
</script>

<div class="relative inline-block" bind:this={rootEl}>
  <Button {variant} aria-label={label} onclick={toggle}>
    {label}
  </Button>
  {#if open}
    <div
      bind:this={panelEl}
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      class="absolute z-[9100] min-w-[200px] max-w-[320px] rounded-[10px] border border-white/[0.12] bg-[#1a1a1c] shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus:outline-none {PLACEMENT[placement]}"
      tabindex={-1}
    >
      {#if title}
        <div id={titleId} class="border-b border-white/[0.06] px-3.5 pb-2 pt-2.5 text-11 font-semibold uppercase tracking-[0.06em] text-[#6e7079]">
          {title}
        </div>
      {/if}
      <div class="flex flex-col gap-2.5 px-3.5 py-3">{@render children?.()}</div>
    </div>
  {/if}
</div>
