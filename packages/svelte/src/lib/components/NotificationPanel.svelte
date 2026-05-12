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
    onMarkAllRead = undefined
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

  function setFilter(f: string) { filter = f as 'all' | NotifType; }

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
  class="np-overlay{open ? ' np-overlay--show' : ''}"
  onclick={onClose}
  aria-hidden="true"
></div>
<div
  bind:this={panelEl}
  class="np-panel{open ? ' np-panel--show' : ''}"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  tabindex="-1"
>
  <div class="np-header">
    <div class="np-title-row">
      <h2 id={titleId} class="np-title">
        Notifications
        {#if unread > 0}
          <span class="np-badge" aria-label="{unread} unread">{unread}</span>
        {/if}
      </h2>
      <div class="np-header-actions">
        {#if unread > 0 && onMarkAllRead}
          <button type="button" class="np-mark-all" onclick={onMarkAllRead}>
            Mark all read
          </button>
        {/if}
        <button type="button" class="icon-btn" onclick={onClose} aria-label="Close notifications">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="np-filters" role="tablist" aria-label="Filter by type">
      {#each ['all', 'alarm', 'system', 'update'] as f}
        <button
          type="button"
          role="tab"
          aria-selected={filter === f}
          class="np-filter{filter === f ? ' np-filter--active' : ''}"
          onclick={() => setFilter(f)}
        >
          {TYPE_LABEL[f] ?? f}
        </button>
      {/each}
    </div>
  </div>
  <div
    class="np-list"
    role="log"
    aria-live="polite"
    aria-label="Notifications"
    aria-relevant="additions"
  >
    {#if filtered.length === 0}
      <div class="np-empty">No notifications</div>
    {:else}
      {#each filtered as n (n.id)}
        <div class="np-item{n.read ? ' np-item--read' : ''}">
          <span
            class="np-dot"
            style="background:{SEV_COLOR[n.severity ?? 'info']};"
            aria-hidden="true"
          ></span>
          <div class="np-item-body">
            <div class="np-item-top">
              <span class="np-item-title">{n.title}</span>
              <span class="np-item-time">{n.time}</span>
            </div>
            {#if n.description}
              <p class="np-item-desc">{n.description}</p>
            {/if}
            <span class="np-type-badge">{TYPE_LABEL[n.type]}</span>
          </div>
          {#if !n.read && onMarkRead}
            <button
              type="button"
              class="np-read-btn"
              onclick={() => onMarkRead?.(n.id)}
              aria-label="Mark as read: {n.title}"
              title="Mark as read"
            >&#10003;</button>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
