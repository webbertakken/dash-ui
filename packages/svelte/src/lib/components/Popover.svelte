<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import Button from './Button.svelte';
  import { portal } from '../actions/portal.ts';

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
  /** Top + left in viewport coordinates. Computed from the trigger's
   *  bounding rect every time the panel opens / window resizes /
   *  the user scrolls. The panel uses `position: fixed` so we never
   *  get clipped by an ancestor's `overflow: hidden`. */
  let panelTop = $state(0);
  let panelLeft = $state(0);

  /** Recompute the panel's viewport coords. The panel itself must be
   *  rendered (size > 0) for accurate measurement; call after the
   *  open + tick + paint. */
  function recomputePosition() {
    if (!triggerEl || !panelEl) return;
    const tr = triggerEl.getBoundingClientRect();
    const margin = 8;
    const offset = 6; // gap between trigger bottom and panel top
    const panelWidth = panelEl.offsetWidth;
    let left: number;
    if (placement === 'bottom-start') left = tr.left;
    else if (placement === 'bottom-end') left = tr.right - panelWidth;
    else left = tr.left + tr.width / 2 - panelWidth / 2; // 'bottom'
    // Clamp into the visible viewport with the configured gutter.
    left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin));
    panelLeft = left;
    panelTop = tr.bottom + offset;
  }

  async function toggle() {
    if (!open) {
      open = true;
      await tick();
      recomputePosition();
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
    if (!open) return;
    const target = e.target as Node;
    // The panel is portalled to <body> so it's no longer a descendant
    // of rootEl. Check both so clicks INSIDE the panel don't count as
    // outside-clicks and immediately close the popover.
    if (rootEl?.contains(target)) return;
    if (panelEl?.contains(target)) return;
    open = false;
  }

  function onResize() {
    if (open) recomputePosition();
  }

  function onScroll() {
    if (open) recomputePosition();
  }

  onMount(() => {
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    // Capture-phase scroll listener picks up scrolls in ANY ancestor
    // (the sidebar's own overflow, the page itself, etc.) so the
    // fixed-positioned panel tracks the trigger as it moves.
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('pointerdown', onPointer);
    triggerEl =
      rootEl?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]') ?? undefined;
  });
  onDestroy(() => {
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll, true);
    document.removeEventListener('pointerdown', onPointer);
  });
</script>

<div class="relative inline-flex items-center" bind:this={rootEl}>
  {#if trigger}
    {@render trigger({ toggle, open })}
  {:else}
    <Button {variant} aria-label={label} onclick={toggle}>
      {label}
    </Button>
  {/if}
  {#if open}
    <!--
      `position: fixed` so the panel can extend outside any ancestor
      with `overflow: hidden` (the sidebar's session-list scroll, the
      app's main grid columns, etc.). Coords are computed from the
      trigger's `getBoundingClientRect()` in `recomputePosition`.
    -->
    <div
      bind:this={panelEl}
      use:portal
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      class="fixed z-[9100] min-w-[200px] max-w-[320px] rounded-[10px] border border-border-3 bg-bg-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus:outline-none"
      style={`top: ${panelTop}px; left: ${panelLeft}px`}
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
