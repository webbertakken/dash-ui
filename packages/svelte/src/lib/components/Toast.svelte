<script context="module" lang="ts">
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
  // store and dismiss are in module scope — accessible in template via $store
</script>

<div class="toaster" role="log" aria-label="Notifications" aria-live="polite" aria-atomic="false">
  {#each $store as item (item.id)}
    <div class="toast toast-{item.variant}" role={item.variant === 'danger' ? 'alert' : 'status'}>
      <span class="toast-msg">{item.message}</span>
      <button
        type="button"
        class="toast-dismiss icon-btn"
        on:click={() => dismiss(item.id)}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" focusable="false">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  {/each}
</div>
