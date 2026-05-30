<script module lang="ts">
  export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
</script>

<script lang="ts">
  import { tick } from 'svelte';
  import IconButton from './IconButton.svelte';
  import CloseIcon from '../icons/CloseIcon.svelte';
  interface Props {
    open?: boolean;
    title: string;
    /** Panel width. `md` (520px) is the default; larger sizes suit
     *  data-dense or editor-style dialogs. Always capped at 90vw. */
    size?: ModalSize;
    children?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }

  let {
    open = $bindable(false),
    title,
    size = 'md',
    children,
    footer
  }: Props = $props();

  // Pre-composed width utilities so Tailwind's static scanner keeps
  // each class in the build. The React sibling expresses the same
  // scale via `.modal--*` rules in dashboard.css.
  const SIZE: Record<ModalSize, string> = {
    sm: 'w-[400px]',
    md: 'w-[520px]',
    lg: 'w-[720px]',
    xl: 'w-[960px]',
    '2xl': 'w-[1200px]'
  };
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

<!--
  Modal chrome matches dashboard.css literal values for cross-motif
  consistency: backdrop is solid 55% black with 8px blur, modal panel is
  bg #141415 (neutral-09) with rgba(255,255,255,0.1) border, header +
  footer separators at rgba(255,255,255,0.06), footer surface at #0f0f10.
-->
<div
  class="fixed inset-0 z-[60] items-center justify-center bg-black/55 backdrop-blur-lg
    {open ? 'flex' : 'hidden'}"
  onmousedown={(e) => (downOnBackdrop = e.target === e.currentTarget)}
  onclick={(e) => {
    if (downOnBackdrop && e.target === e.currentTarget) open = false;
    downOnBackdrop = false;
  }}
  role="presentation"
>
  <div
    bind:this={modalEl}
    class="{SIZE[size]} max-w-[90vw] overflow-hidden rounded-xl border border-border-2 bg-bg-1 shadow-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby={titleId}
    tabindex="-1"
  >
    <div class="flex items-center justify-between border-b border-border-1 px-5 py-4">
      <h2 id={titleId} class="m-0 text-16 font-semibold">{title}</h2>
      <IconButton title="Close" onclick={() => (open = false)}>
        <CloseIcon />
      </IconButton>
    </div>
    <div class="px-5 py-4">{@render children?.()}</div>
    {#if footer}
      <div
        class="flex justify-end gap-2 border-t border-border-1 bg-bg-0 px-5 py-3.5"
      >{@render footer?.()}</div>
    {/if}
  </div>
</div>
