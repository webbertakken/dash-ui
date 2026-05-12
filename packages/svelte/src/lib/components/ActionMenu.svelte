<script module lang="ts">
  let counter = 0;
  export interface ActionMenuItem { id: string; label: string; danger?: boolean; disabled?: boolean; }
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  interface Props {
    items?: ActionMenuItem[];
    label?: string;
  }

  let { items = [], label = 'Actions' }: Props = $props();

  const dispatch = createEventDispatcher<{ action: string }>();
  const uid = `dash-ui-am-${++counter}`;
  const menuId = `${uid}-menu`;

  let open = $state(false);
  let activeIdx = $state(0);
  let triggerEl: HTMLButtonElement = $state();
  let wrapperEl: HTMLDivElement = $state();

  function toggle() {
    if (!open) activeIdx = 0;
    open = !open;
  }

  function activate(id: string) {
    dispatch('action', id);
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

<div class="action-menu-root" bind:this={wrapperEl}>
  <button
    bind:this={triggerEl}
    type="button"
    class="icon-btn action-menu-trigger"
    aria-label={label}
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={open ? menuId : undefined}
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
    <ul id={menuId} role="menu" aria-label={label} class="action-menu">
      {#each items as item, idx (item.id)}
        <li
          role="menuitem"
          tabindex="-1"
          aria-disabled={item.disabled}
          data-active={idx === activeIdx ? 'true' : undefined}
          data-danger={item.danger ? 'true' : undefined}
          class="action-menu-item"
          onmouseenter={() => { activeIdx = idx; }}
          onmousedown={(e) => { e.preventDefault(); (() => { if (!item.disabled) activate(item.id); })(e); }}
        >{item.label}</li>
      {/each}
    </ul>
  {/if}
</div>
