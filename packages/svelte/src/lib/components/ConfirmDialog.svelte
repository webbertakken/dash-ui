<script lang="ts">
  import { onDestroy } from 'svelte';

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

  const VARIANT_CLASS: Record<string, string> = {
    danger: 'btn cd-confirm cd-confirm--danger',
    warning: 'btn cd-confirm cd-confirm--warning',
    info: 'btn cd-confirm cd-confirm--info',
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

  // Replaces the old `$: if (open) { ... }` + `afterUpdate` combo. `$effect`
  // runs after the DOM commits, so `dialogEl` is bound before we query it.
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
  class="backdrop {open ? 'show' : ''}"
  role="presentation"
  onclick={(e) => {
    if (e.target === e.currentTarget) onCancel();
  }}
>
  <div
    bind:this={dialogEl}
    class="modal cd-dialog"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="cd-title"
    aria-describedby={description ? 'cd-desc' : undefined}
    tabindex="-1"
  >
    <div class="modal-h">
      <h2 id="cd-title">{title}</h2>
    </div>
    {#if description}
      <div id="cd-desc" class="cd-body">{description}</div>
    {/if}
    <div class="modal-f">
      <button type="button" class="btn btn-ghost" onclick={onCancel}>{cancelLabel}</button>
      <button type="button" class={VARIANT_CLASS[variant]} onclick={onConfirm}>{confirmLabel}</button>
    </div>
  </div>
</div>
