<script context="module" lang="ts">
  let counter = 0;
  export interface MenubarItem { id: string; label: string; disabled?: boolean; separator?: boolean; }
  export interface MenubarMenu { id: string; label: string; items: MenubarItem[]; }
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let menus: MenubarMenu[] = [];
  export let label: string = 'Menu';
  let klass = '';
  export { klass as class };

  const dispatch = createEventDispatcher<{ action: { menuId: string; itemId: string } }>();
  const uid = `dash-ui-mb-${++counter}`;

  let openIdx: number | null = null;
  let activeItemIdx = 0;
  let triggerEls: HTMLButtonElement[] = [];
  let rootEl: HTMLDivElement;

  $: currentEligible = openIdx !== null
    ? menus[openIdx].items.filter((i) => !i.separator && !i.disabled)
    : [];

  function openMenu(idx: number, focusLast = false) {
    const items = menus[idx].items.filter((i) => !i.separator && !i.disabled);
    activeItemIdx = focusLast ? items.length - 1 : 0;
    openIdx = idx;
  }

  function closeMenu() { openIdx = null; }

  function activate(menuId: string, itemId: string) {
    dispatch('action', { menuId, itemId });
    openIdx = null;
  }

  function handleTriggerKeyDown(e: KeyboardEvent, idx: number) {
    const count = menus.length;
    if (openIdx === null) {
      if (e.key === 'ArrowRight') { e.preventDefault(); triggerEls[(idx + 1) % count]?.focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); triggerEls[(idx - 1 + count) % count]?.focus(); }
      else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMenu(idx, false); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); openMenu(idx, true); }
      else if (e.key === 'Home') { e.preventDefault(); triggerEls[0]?.focus(); }
      else if (e.key === 'End') { e.preventDefault(); triggerEls[count - 1]?.focus(); }
    } else {
      const savedIdx = openIdx;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); triggerEls[savedIdx]?.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); activeItemIdx = Math.min(activeItemIdx + 1, currentEligible.length - 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeItemIdx = Math.max(activeItemIdx - 1, 0); }
      else if (e.key === 'Home') { e.preventDefault(); activeItemIdx = 0; }
      else if (e.key === 'End') { e.preventDefault(); activeItemIdx = currentEligible.length - 1; }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const item = currentEligible[activeItemIdx];
        if (item) activate(menus[savedIdx].id, item.id);
      }
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (savedIdx + 1) % count;
        openMenu(nextIdx, false);
        triggerEls[nextIdx]?.focus();
      }
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (savedIdx - 1 + count) % count;
        openMenu(prevIdx, false);
        triggerEls[prevIdx]?.focus();
      }
      else if (e.key === 'Tab') { closeMenu(); }
    }
  }

  function handleOutside(e: MouseEvent) {
    if (openIdx !== null && !rootEl?.contains(e.target as Node)) openIdx = null;
  }

  onMount(() => document.addEventListener('mousedown', handleOutside));
  onDestroy(() => document.removeEventListener('mousedown', handleOutside));
</script>

<div
  bind:this={rootEl}
  role="menubar"
  aria-label={label}
  class={`menubar${klass ? ' ' + klass : ''}`}
>
  {#each menus as menu, idx (menu.id)}
    {@const isOpen = openIdx === idx}
    {@const menuId = `${uid}-menu-${idx}`}
    {@const elig = menu.items.filter((i) => !i.separator && !i.disabled)}
    <div class="menubar-menu">
      <button
        bind:this={triggerEls[idx]}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        class={`menubar-trigger${isOpen ? ' is-open' : ''}`}
        on:click={() => { if (isOpen) closeMenu(); else openMenu(idx); }}
        on:keydown={(e) => handleTriggerKeyDown(e, idx)}
      >
        {menu.label}
      </button>
      {#if isOpen}
        <ul id={menuId} role="menu" aria-label={menu.label} class="menubar-dropdown">
          {#each menu.items as item (item.id)}
            {#if item.separator}
              <li role="separator" class="menubar-sep" aria-hidden="true" />
            {:else}
              {@const eligIdx = elig.indexOf(item)}
              <li
                role="menuitem"
                tabindex="-1"
                aria-disabled={item.disabled}
                data-active={eligIdx === activeItemIdx && !item.disabled ? 'true' : undefined}
                class="menubar-item"
                on:mouseenter={() => { if (!item.disabled) activeItemIdx = eligIdx; }}
                on:mousedown|preventDefault={() => { if (!item.disabled) activate(menu.id, item.id); }}
              >{item.label}</li>
            {/if}
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
</div>
