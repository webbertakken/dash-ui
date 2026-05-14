<script lang="ts">
  import { onDestroy } from 'svelte';
  import Button from './Button.svelte';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string | undefined;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm?: () => void;
    onCancel?: () => void;
  }

  let {
    open = false,
    title = '',
    description = undefined,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'info',
    onConfirm = () => {},
    onCancel = () => {},
  }: Props = $props();

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  // Map confirm-variant to the migrated `Button` variants. `warning` doesn't
  // exist on `Button`, so we mark it as primary + override colours inline.
  const CONFIRM_VARIANT: Record<NonNullable<Props['variant']>, 'primary' | 'danger'> = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary',
  };
  const CONFIRM_EXTRA: Record<NonNullable<Props['variant']>, string> = {
    danger: '!bg-status-danger !text-white hover:!bg-[#ff5e5e] !border-status-danger',
    warning: '!bg-status-warning !text-neutral-00 hover:!bg-[#ffba42] !border-status-warning',
    info: '',
  };

  let dialogEl = $state<HTMLDivElement | undefined>(undefined);
  let prev: HTMLElement | null = null;
  let prevOverflow = '';

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onCancel();
      return;
    }
    if (e.key !== 'Tab' || !dialogEl) return;
    const els = Array.from(dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!els.length) {
      e.preventDefault();
      return;
    }
    const first = els[0]!;
    const last = els[els.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  $effect(() => {
    if (open) {
      prev = document.activeElement as HTMLElement | null;
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
      if (dialogEl) {
        const firstFocusable = dialogEl.querySelector<HTMLElement>(FOCUSABLE);
        (firstFocusable ?? dialogEl).focus();
      }
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = prevOverflow;
        prev?.focus?.();
      };
    }
  });

  onDestroy(() => {
    window.removeEventListener('keydown', onKey);
    document.body.style.overflow = prevOverflow;
  });
</script>

<div
  class="fixed inset-0 z-[60] items-center justify-center bg-black/55 backdrop-blur-lg {open ? 'flex' : 'hidden'}"
  role="presentation"
  onclick={(e) => {
    if (e.target === e.currentTarget) onCancel();
  }}
>
  <div
    bind:this={dialogEl}
    class="w-[400px] max-w-[90vw] overflow-hidden rounded-xl border border-white/10 bg-neutral-09 shadow-modal"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="cd-title"
    aria-describedby={description ? 'cd-desc' : undefined}
    tabindex={-1}
  >
    <div class="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
      <h2 id="cd-title" class="m-0 text-16 font-semibold">{title}</h2>
    </div>
    {#if description}
      <div id="cd-desc" class="px-5 py-3.5 text-13 leading-[1.5] text-text-3">{description}</div>
    {/if}
    <div class="flex justify-end gap-2 border-t border-white/[0.06] bg-[#0f0f10] px-5 py-3.5">
      <Button variant="ghost" onclick={onCancel}>{cancelLabel}</Button>
      <Button variant={CONFIRM_VARIANT[variant]} class={CONFIRM_EXTRA[variant]} onclick={onConfirm}>{confirmLabel}</Button>
    </div>
  </div>
</div>
