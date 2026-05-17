<script module lang="ts">
  let counter = 0;
  export interface ActionMenuItem {
    id: string;
    label: string;
    danger?: boolean;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    items?: ActionMenuItem[];
    label?: string;
    onaction?: (payload: string) => void;
  }

  let { items = [], label = 'Actions', onaction }: Props = $props();
  const uid = `dash-ui-am-${++counter}`;
  const menuId = `${uid}-menu`;

  let open = $state(false);
  let activeIdx = $state(0);
  let triggerEl = $state<HTMLButtonElement | undefined>(undefined);
  let wrapperEl = $state<HTMLDivElement | undefined>(undefined);

  function toggle() {
    if (!open) activeIdx = 0;
    open = !open;
  }

  function activate(id: string) {
    onaction?.(id);
    open = false;
    triggerEl?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        activeIdx = 0;
        open = true;
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); open = false; triggerEl?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = items.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[activeIdx];
      if (item && !item.disabled) activate(item.id);
    }
    else if (e.key === 'Tab') { open = false; }
  }

  function handleOutside(e: MouseEvent) {
    if (open && !wrapperEl?.contains(e.target as Node)) open = false;
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));
</script>

<div class="group/am relative inline-block" bind:this={wrapperEl}>
  <button
    bind:this={triggerEl}
    type="button"
    aria-label={label}
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={open ? menuId : undefined}
    class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-text-3 opacity-0 transition-opacity duration-100 hover:bg-row-hover hover:text-text-1 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05 aria-expanded:opacity-100 group-hover/am:opacity-100 motion-reduce:transition-none"
    onclick={toggle}
    onkeydown={onKeyDown}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false" fill="currentColor">
      <circle cx="7" cy="2.5" r="1.2" />
      <circle cx="7" cy="7" r="1.2" />
      <circle cx="7" cy="11.5" r="1.2" />
    </svg>
  </button>
  {#if open}
    <ul
      id={menuId}
      role="menu"
      aria-label={label}
      class="absolute right-0 top-[calc(100%+4px)] z-[9100] m-0 min-w-[148px] list-none rounded-lg border border-border-3 bg-bg-2 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
    >
      {#each items as item, idx (item.id)}
        <li
          role="menuitem"
          tabindex={-1}
          aria-disabled={item.disabled}
          data-active={idx === activeIdx ? 'true' : undefined}
          data-danger={item.danger ? 'true' : undefined}
          class="flex cursor-pointer items-center whitespace-nowrap rounded-[5px] px-2.5 py-1.5 text-13 text-text-2 outline-none hover:bg-row-active hover:text-text-1 data-[active=true]:bg-row-active data-[active=true]:text-text-1 data-[danger=true]:text-status-danger data-[danger=true]:hover:bg-status-danger/10 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          onmouseenter={() => { activeIdx = idx; }}
          onmousedown={(e) => { e.preventDefault(); (() => { if (!item.disabled) activate(item.id); })(); }}
        >{item.label}</li>
      {/each}
    </ul>
  {/if}
</div>
