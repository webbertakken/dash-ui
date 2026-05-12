<script lang="ts">
  import { tick } from 'svelte';
  import IconButton from './IconButton.svelte';
  import CloseIcon from '../icons/CloseIcon.svelte';
  interface Props {
    open?: boolean;
    title: string;
    children?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }

  let {
    open = $bindable(false),
    title,
    children,
    footer
  }: Props = $props();
  const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;
  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  let modalEl = $state<HTMLDivElement | undefined>(undefined);
  let previouslyFocused: HTMLElement | null = $state(null);
  let prevOverflow = $state('');
  let wasOpen = $state(false);
  let downOnBackdrop = $state(false);
  $effect(() => {
    if (open && !wasOpen) {
      previouslyFocused = (typeof document !== 'undefined'
        ? (document.activeElement as HTMLElement | null)
        : null);
      if (typeof document !== 'undefined') {
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      wasOpen = true;
      tick().then(() => {
        const first = modalEl?.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? modalEl)?.focus();
      });
    } else if (!open && wasOpen) {
      wasOpen = false;
      if (typeof document !== 'undefined') {
        document.body.style.overflow = prevOverflow;
      }
      previouslyFocused?.focus?.();
    }
  });
  function onKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') {
      open = false;
      return;
    }
    if (e.key !== 'Tab' || !modalEl) return;
    const items = Array.from(modalEl.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const f = items[0]!;
    const l = items[items.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && active === f) {
      e.preventDefault();
      l.focus();
    } else if (!e.shiftKey && active === l) {
      e.preventDefault();
      f.focus();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div
  class="backdrop {open ? 'show' : ''}"
  onmousedown={(e) => (downOnBackdrop = e.target === e.currentTarget)}
  onclick={(e) => {
    if (downOnBackdrop && e.target === e.currentTarget) open = false;
    downOnBackdrop = false;
  }}
  role="presentation"
>
  <div
    bind:this={modalEl}
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby={titleId}
    tabindex="-1"
  >
    <div class="modal-h">
      <h2 id={titleId}>{title}</h2>
      <IconButton title="Close" onclick={() => (open = false)}>
        <CloseIcon />
      </IconButton>
    </div>
    <div class="modal-b">{@render children?.()}</div>
    {#if footer}
      <div class="modal-f">{@render footer?.()}</div>
    {/if}
  </div>
</div>
