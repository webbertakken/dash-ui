<script module lang="ts">
  export type NotifType = 'alarm' | 'system' | 'update';
  export type NotifSeverity = 'danger' | 'warn' | 'info' | 'success';
  export interface Notification {
    id: string;
    type: NotifType;
    severity?: NotifSeverity;
    title: string;
    description?: string;
    time: string;
    read: boolean;
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    open?: boolean;
    notifications?: Notification[];
    onClose?: () => void;
    onMarkRead?: ((id: string) => void) | undefined;
    onMarkAllRead?: (() => void) | undefined;
  }

  let {
    open = $bindable(false),
    notifications = [],
    onClose = () => {},
    onMarkRead = undefined,
    onMarkAllRead = undefined,
  }: Props = $props();

  let filter: 'all' | NotifType = $state('all');
  let panelEl = $state<HTMLDivElement | undefined>(undefined);
  let prevFocus: HTMLElement | null = $state(null);

  const SEV_COLOR: Record<string, string> = {
    danger: '#F03A3A',
    warn: '#F5A623',
    info: '#006FFF',
    success: '#00B070',
  };

  const TYPE_LABEL: Record<string, string> = {
    all: 'All',
    alarm: 'Alarm',
    system: 'System',
    update: 'Update',
  };

  function setFilter(f: string) {
    filter = f as 'all' | NotifType;
  }

  let unread = $derived(notifications.filter((n) => !n.read).length);
  let filtered = $derived(filter === 'all' ? notifications : notifications.filter((n) => n.type === filter));

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function trapFocus(e: KeyboardEvent) {
    if (!panelEl) return;
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const items = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) { e.preventDefault(); return; }
    const f = items[0]!, l = items[items.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && active === f) { e.preventDefault(); l.focus(); }
    else if (!e.shiftKey && active === l) { e.preventDefault(); f.focus(); }
  }

  $effect(() => {
    if (open) {
      prevFocus = document.activeElement as HTMLElement | null;
      setTimeout(() => {
        if (!panelEl) return;
        const first = panelEl.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? panelEl)?.focus();
      }, 0);
      window.addEventListener('keydown', trapFocus);
    } else {
      window.removeEventListener('keydown', trapFocus);
      prevFocus?.focus?.();
    }
  });

  onDestroy(() => {
    window.removeEventListener('keydown', trapFocus);
  });

  let titleId = 'np-title-' + Math.random().toString(36).slice(2);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  data-open={open ? 'true' : undefined}
  class="fixed inset-0 z-[9100] hidden bg-black/45 backdrop-blur-sm data-[open=true]:block"
  onclick={onClose}
  aria-hidden="true"
></div>
<div
  bind:this={panelEl}
  data-open={open ? 'true' : undefined}
  class="fixed right-0 top-0 z-[9200] flex h-full w-[380px] max-w-[90vw] translate-x-full flex-col overflow-hidden border-l border-border-1 bg-bg-1 shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-transform duration-200 data-[open=true]:translate-x-0 motion-reduce:transition-none"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  tabindex={-1}
>
  <div class="border-b border-border-1 px-4 py-3">
    <div class="flex items-center justify-between gap-2">
      <h2 id={titleId} class="m-0 flex items-center gap-2 text-15 font-semibold text-text-1">
        Notifications
        {#if unread > 0}
          <span class="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-05 px-1.5 text-11 font-bold text-white tabular-nums" aria-label={`${unread} unread`}>{unread}</span>
        {/if}
      </h2>
      <div class="flex items-center gap-1.5">
        {#if unread > 0 && onMarkAllRead}
          <button
            type="button"
            class="cursor-pointer rounded border-0 bg-transparent px-1.5 py-0.5 text-11 text-brand-05 hover:text-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
            onclick={onMarkAllRead}
          >Mark all read</button>
        {/if}
        <button
          type="button"
          aria-label="Close notifications"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-text-4 hover:bg-row-hover hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
          onclick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="mt-2 flex gap-1" role="tablist" aria-label="Filter by type">
      {#each ['all', 'alarm', 'system', 'update'] as f}
        <button
          type="button"
          role="tab"
          aria-selected={filter === f}
          data-active={filter === f ? 'true' : undefined}
          class="cursor-pointer rounded border border-border-2 bg-transparent px-2.5 py-0.5 text-11 text-text-3 hover:bg-row-hover hover:text-text-1 data-[active=true]:border-brand-05 data-[active=true]:bg-brand-05/[0.10] data-[active=true]:text-brand-05 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
          onclick={() => setFilter(f)}
        >
          {TYPE_LABEL[f] ?? f}
        </button>
      {/each}
    </div>
  </div>
  <div
    class="flex-1 overflow-y-auto"
    role="log"
    aria-live="polite"
    aria-label="Notifications"
    aria-relevant="additions"
  >
    {#if filtered.length === 0}
      <div class="p-6 text-center text-13 text-text-4">No notifications</div>
    {:else}
      {#each filtered as n (n.id)}
        <div
          data-read={n.read ? 'true' : undefined}
          class="flex items-start gap-2 border-b border-border-1 px-4 py-3 last:border-b-0 data-[read=true]:opacity-60"
        >
          <span
            class="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
            style="background:{SEV_COLOR[n.severity ?? 'info']};"
            aria-hidden="true"
          ></span>
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline justify-between gap-2">
              <span class="truncate text-13 font-medium text-text-1">{n.title}</span>
              <span class="shrink-0 text-11 text-text-4 tabular-nums">{n.time}</span>
            </div>
            {#if n.description}
              <p class="m-0 mt-0.5 text-12 text-text-3">{n.description}</p>
            {/if}
            <span class="mt-1 inline-block rounded bg-row-active px-1.5 py-0.5 text-[10px] uppercase tracking-[0.05em] text-text-4">{TYPE_LABEL[n.type]}</span>
          </div>
          {#if !n.read && onMarkRead}
            <button
              type="button"
              aria-label={`Mark as read: ${n.title}`}
              title="Mark as read"
              class="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-status-success hover:bg-status-success/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
              onclick={() => onMarkRead?.(n.id)}
            >&#10003;</button>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
