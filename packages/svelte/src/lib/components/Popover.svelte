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
    /**
     * Controlled open state. Default uncontrolled (`$bindable(false)`):
     * the trigger button toggles it and outside-clicks close it.
     * Callers can `bind:open` to drive it programmatically (e.g. close
     * the popover after a form submit) or to coordinate with other
     * UI. When the trigger button is used, the bound variable updates
     * automatically.
     */
    open?: boolean;
    /**
     * Optional custom trigger snippet. When provided, renders inline
     * with the rest of the popover root and receives a `toggle` fn so
     * the snippet can drive open/close. The default `label`-Button
     * trigger renders only when no `trigger` snippet is passed.
     *
     * Use for icon-only triggers (eye-icon view-options menus, gear
     * icons, etc.) where the upstream `<Button label>` chrome doesn't
     * fit the surrounding UI.
     */
    trigger?: import('svelte').Snippet<[{ toggle: () => void; open: boolean }]>;
    children?: import('svelte').Snippet;
  }

  let {
    label,
    variant = 'ghost',
    title = undefined,
    placement = 'bottom-start',
    open = $bindable(false),
    trigger,
    children,
  }: Props = $props();

  const uid = `dash-ui-pop-${++counter}`;
  const titleId = `${uid}-title`;

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  let rootEl = $state<HTMLDivElement | undefined>(undefined);
  let triggerEl = $state<HTMLElement | undefined>(undefined);
  let panelEl = $state<HTMLDivElement | undefined>(undefined);
  /** Horizontal correction applied to nudge the panel back inside the
   *  viewport when its natural placement spills past either edge.
   *  Recomputed every time the panel opens + on window resize. */
  let viewportOffsetX = $state(0);

  /** Measure the panel's bounding rect against the viewport and adjust
   *  `viewportOffsetX` so it sits inside an 8-px gutter on either side.
   *  Called after open and on resize. */
  function clampToViewport() {
    if (!panelEl) return;
    viewportOffsetX = 0;
    // Force layout flush so we measure the already-positioned panel
    // before applying the offset.
    const rect = panelEl.getBoundingClientRect();
    const margin = 8;
    const overflowLeft = margin - rect.left;
    const overflowRight = rect.right - (window.innerWidth - margin);
    if (overflowLeft > 0) {
      viewportOffsetX = overflowLeft;
    } else if (overflowRight > 0) {
      viewportOffsetX = -overflowRight;
    }
  }

  async function toggle() {
    if (!open) {
      open = true;
      await tick();
      clampToViewport();
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

  function onResize() {
    if (open) clampToViewport();
  }

  onMount(() => {
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.addEventListener('pointerdown', onPointer);
    triggerEl = rootEl?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]') ?? undefined;
  });
  onDestroy(() => {
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
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
  {#if trigger}
    {@render trigger({ toggle, open })}
  {:else}
    <Button {variant} aria-label={label} onclick={toggle}>
      {label}
    </Button>
  {/if}
  {#if open}
    <div
      bind:this={panelEl}
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      class="absolute z-[9100] min-w-[200px] max-w-[320px] rounded-[10px] border border-border-3 bg-bg-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus:outline-none {PLACEMENT[placement]}"
      style={viewportOffsetX === 0 ? '' : `margin-left: ${viewportOffsetX}px`}
      tabindex={-1}
    >
      {#if title}
        <div id={titleId} class="border-b border-border-1 px-3.5 pb-2 pt-2.5 text-11 font-semibold uppercase tracking-[0.06em] text-text-4">
          {title}
        </div>
      {/if}
      <div class="flex flex-col gap-2.5 px-3.5 py-3">{@render children?.()}</div>
    </div>
  {/if}
</div>
