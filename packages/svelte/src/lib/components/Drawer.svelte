<script lang="ts">
  import { tick } from 'svelte';
  import IconButton from './IconButton.svelte';
  import CloseIcon from '../icons/CloseIcon.svelte';
  interface Props {
    open?: boolean;
    title: string;
    children?: import('svelte').Snippet;
  }

  let { open = $bindable(false), title, children }: Props = $props();
  const titleId = `drawer-title-${Math.random().toString(36).slice(2, 9)}`;
  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  let panelEl = $state<HTMLDivElement | undefined>(undefined);
  let prev: HTMLElement | null = $state(null);
  let wasOpen = $state(false);
  $effect(() => {
    if (open && !wasOpen) {
      prev = typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;
      wasOpen = true;
      tick().then(() => {
        const first = panelEl?.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? panelEl)?.focus();
      });
    } else if (!open && wasOpen) {
      wasOpen = false;
      prev?.focus?.();
    }
  });
  function onKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') { open = false; return; }
    if (e.key !== 'Tab' || !panelEl) return;
    const items = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) { e.preventDefault(); return; }
    const f = items[0]!, l = items[items.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && active === f) { e.preventDefault(); l.focus(); }
    else if (!e.shiftKey && active === l) { e.preventDefault(); f.focus(); }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div
  class="drawer-overlay {open ? 'show' : ''}"
  onclick={() => (open = false)}
  aria-hidden="true"
  role="presentation"
></div>
<div
  bind:this={panelEl}
  class="drawer-panel {open ? 'show' : ''}"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  tabindex="-1"
>
  <div class="drawer-h">
    <h2 id={titleId}>{title}</h2>
    <IconButton title="Close" onclick={() => (open = false)}>
      <CloseIcon />
    </IconButton>
  </div>
  <div class="drawer-b">{@render children?.()}</div>
</div>
