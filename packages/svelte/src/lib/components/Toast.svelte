<script module lang="ts">
  import { writable } from 'svelte/store';

  export type ToastVariant = 'success' | 'info' | 'warn' | 'danger';

  interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
  }

  const store = writable<ToastItem[]>([]);
  let seq = 0;

  function dismiss(id: string) {
    store.update((prev) => prev.filter((t) => t.id !== id));
  }

  export const toast = {
    show(message: string, variant: ToastVariant = 'info') {
      const id = String(++seq);
      store.update((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    success: (msg: string) => toast.show(msg, 'success'),
    warn: (msg: string) => toast.show(msg, 'warn'),
    danger: (msg: string) => toast.show(msg, 'danger'),
    info: (msg: string) => toast.show(msg, 'info'),
  };
</script>

<script lang="ts">
  // store + dismiss live in module scope; template uses $store
  // Pre-composed variant classes for Tailwind's static scanner.
  // Backgrounds at 16% (matches dashboard.css), left border solid, text
  // colour the legibility-tuned literal hue.
  const TOAST: Record<ToastVariant, string> = {
    success: 'bg-status-success/16 border-l-status-success text-[#5ddb9f]',
    warn: 'bg-status-warning/16 border-l-status-warning text-[#f5c26b]',
    danger: 'bg-status-danger/16 border-l-status-danger text-[#ff7b7b]',
    info: 'bg-status-info/16 border-l-brand-05 text-[#7fb6ff]',
  };
</script>

<div
  class="pointer-events-none fixed bottom-6 right-6 z-[9900] flex min-w-[240px] max-w-[360px] flex-col gap-2"
  role="log"
  aria-label="Notifications"
  aria-live="polite"
  aria-atomic="false"
>
  {#each $store as item (item.id)}
    <div
      class="pointer-events-auto flex items-center gap-2.5 rounded-lg border-l-[3px] px-3.5 py-2.5 text-13 leading-[1.4] [animation:toast-in_150ms_ease] [box-shadow:0_4px_16px_rgba(0,0,0,0.5)]
        {TOAST[item.variant]}"
      role={item.variant === 'danger' ? 'alert' : 'status'}
    >
      <span class="flex-1">{item.message}</span>
      <button
        type="button"
        class="ml-auto inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-current hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
        onclick={() => dismiss(item.id)}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" focusable="false">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  {/each}
</div>
