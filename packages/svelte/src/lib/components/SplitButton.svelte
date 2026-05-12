<script module lang="ts">
  let counter = 0;
  export interface SplitButtonItem { id: string; label: string; disabled?: boolean; }
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  interface Props {
    label: string;
    variant?: 'primary' | 'ghost' | 'danger';
    disabled?: boolean;
    items?: SplitButtonItem[];
  }

  let {
    label,
    variant = 'ghost',
    disabled = false,
    items = []
  }: Props = $props();

  const dispatch = createEventDispatcher<{ primary: void; action: string }>();
  const uid = `dash-ui-spbtn-${++counter}`;
  const menuId = `${uid}-menu`;

  let open = $state(false);
  let activeIdx = $state(0);
  let caretEl: HTMLButtonElement = $state();
  let wrapperEl: HTMLDivElement = $state();

  function toggleMenu() {
    if (!open) activeIdx = 0;
    open = !open;
  }

  function activate(id: string) {
    dispatch('action', id);
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
    onclick={() => dispatch('primary')}
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
          onmousedown={(e) => { e.preventDefault(); (() => { if (!item.disabled) activate(item.id); })(e); }}
        >{item.label}</li>
      {/each}
    </ul>
  {/if}
</div>
