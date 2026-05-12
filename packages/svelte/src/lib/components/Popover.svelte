<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';

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
    children
  }: Props = $props();

  const uid = `dash-ui-pop-${++counter}`;
  const titleId = `${uid}-title`;

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  let open = $state(false);
  let rootEl = $state<HTMLDivElement | undefined>(undefined);
  let triggerEl = $state<HTMLButtonElement | undefined>(undefined);
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
  });
  onDestroy(() => {
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', onPointer);
  });
</script>

<div class="popover-root" bind:this={rootEl}>
  <button
    bind:this={triggerEl}
    type="button"
    class="btn btn-{variant}"
    aria-haspopup="dialog"
    aria-expanded={open}
    onclick={toggle}
  >{label}</button>
  {#if open}
    <div
      bind:this={panelEl}
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      class="popover popover-{placement}"
      tabindex="-1"
    >
      {#if title}<div id={titleId} class="popover-h">{title}</div>{/if}
      <div class="popover-b">{@render children?.()}</div>
    </div>
  {/if}
</div>
