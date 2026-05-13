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
  class="fixed inset-0 z-[60] bg-black/40 {open ? 'block' : 'hidden'}"
  onclick={() => (open = false)}
  aria-hidden="true"
  role="presentation"
></div>
<div
  bind:this={panelEl}
  class="fixed right-0 top-0 z-[61] flex h-full w-[380px] max-w-[90vw] flex-col border-l border-white/10 bg-neutral-09 transition-transform duration-200 ease-out [box-shadow:-24px_0_64px_rgba(0,0,0,0.6)]
    {open ? 'translate-x-0' : 'translate-x-full'}"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  tabindex="-1"
>
  <div class="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
    <h2 id={titleId} class="m-0 text-16 font-semibold">{title}</h2>
    <IconButton title="Close" onclick={() => (open = false)}>
      <CloseIcon />
    </IconButton>
  </div>
  <div class="flex-1 overflow-y-auto px-5 py-4">{@render children?.()}</div>
</div>
