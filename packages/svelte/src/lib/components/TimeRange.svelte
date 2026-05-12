<script module lang="ts">
  let counter = 0;
  export type TimeRangeId = '1h' | '6h' | '24h' | '7d' | '30d';
  const PRESETS: { id: TimeRangeId; label: string; short: string }[] = [
    { id: '1h', label: 'Last 1 hour', short: 'Last 1 h' },
    { id: '6h', label: 'Last 6 hours', short: 'Last 6 h' },
    { id: '24h', label: 'Last 24 hours', short: 'Last 24 h' },
    { id: '7d', label: 'Last 7 days', short: 'Last 7 d' },
    { id: '30d', label: 'Last 30 days', short: 'Last 30 d' },
  ];
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    value?: TimeRangeId;
    onchange?: (payload: TimeRangeId) => void;
  }

  let { value = '1h',
    onchange,
  }: Props = $props();
  const uid = `dash-ui-tr-${++counter}`;
  const listId = `${uid}-list`;

  let open = $state(false);
  let activeIdx = $state(0);
  let triggerEl: HTMLButtonElement = $state();
  let wrapperEl: HTMLDivElement = $state();

  let selected = $derived(PRESETS.find((p) => p.id === value) ?? PRESETS[0]);

  function toggle() {
    if (!open) activeIdx = PRESETS.findIndex((p) => p.id === value);
    open = !open;
  }

  function select(id: TimeRangeId) {
    onchange?.(id);
    open = false;
    triggerEl?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        activeIdx = PRESETS.findIndex((p) => p.id === value);
        open = true;
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); open = false; triggerEl?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, PRESETS.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = PRESETS.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(PRESETS[activeIdx].id); }
    else if (e.key === 'Tab') { open = false; }
  }

  function handleOutside(e: MouseEvent) {
    if (open && !wrapperEl?.contains(e.target as Node)) open = false;
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));
</script>

<div class="time-range-root" bind:this={wrapperEl}>
  <button
    bind:this={triggerEl}
    type="button"
    class="btn time-range-trigger"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={open ? listId : undefined}
    onclick={toggle}
    onkeydown={onKeyDown}
  >
    {selected.short}
    <svg class="time-range-chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 1l4 4 4-4" />
    </svg>
  </button>
  {#if open}
    <ul id={listId} role="listbox" aria-label="Time range" class="time-range-list">
      {#each PRESETS as p, idx (p.id)}
        <li
          role="option"
          aria-selected={p.id === value}
          tabindex="-1"
          data-active={idx === activeIdx ? 'true' : undefined}
          class="time-range-option"
          onmouseenter={() => { activeIdx = idx; }}
          onmousedown={(e) => { e.preventDefault(); (() => select(p.id))(e); }}
        >
          {p.label}
          {#if p.id === value}
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 6l3 3 5-5" />
            </svg>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
