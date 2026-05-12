<script module lang="ts">
  let counter = 0;
  export interface SplitButtonItem { id: string; label: string; disabled?: boolean; }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    label: string;
    variant?: 'primary' | 'ghost' | 'danger';
    disabled?: boolean;
    items?: SplitButtonItem[];
    onprimary?: () => void;
    onaction?: (payload: string) => void;
  }

  let {
    label,
    variant = 'ghost',
    disabled = false,
    items = [],
    onprimary,
    onaction,
  }: Props = $props();
  const uid = `dash-ui-spbtn-${++counter}`;
  const menuId = `${uid}-menu`;

  let open = $state(false);
  let activeIdx = $state(0);
  let caretEl = $state<HTMLButtonElement | undefined>(undefined);
  let wrapperEl = $state<HTMLDivElement | undefined>(undefined);

  function toggleMenu() {
    if (!open) activeIdx = 0;
    open = !open;
  }

  function activate(id: string) {
    onaction?.(id);
    open = false;
    caretEl?.focus();
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
    if (e.key === 'Escape') { e.preventDefault(); open = false; caretEl?.focus(); }
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

<div class="split-btn" bind:this={wrapperEl}>
  <button
    type="button"
    class="btn btn-{variant} split-btn-primary"
    {disabled}
    onclick={() => onprimary?.()}
  >{label}</button>
  <button
    bind:this={caretEl}
    type="button"
    class="btn btn-{variant} split-btn-caret"
    {disabled}
    aria-label="{label} options"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={open ? menuId : undefined}
    onclick={toggleMenu}
    onkeydown={onKeyDown}
  >
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 3 L5 7 L9 3" />
    </svg>
  </button>
  {#if open}
    <ul id={menuId} role="menu" aria-label="{label} options" class="action-menu">
      {#each items as item, idx (item.id)}
        <li
          role="menuitem"
          tabindex="-1"
          aria-disabled={item.disabled}
          data-active={idx === activeIdx ? 'true' : undefined}
          class="action-menu-item"
          onmouseenter={() => { activeIdx = idx; }}
          onmousedown={(e) => { e.preventDefault(); (() => { if (!item.disabled) activate(item.id); })(); }}
        >{item.label}</li>
      {/each}
    </ul>
  {/if}
</div>
