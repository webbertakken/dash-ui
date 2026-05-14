<script module lang="ts">
  let counter = 0;
  export interface MenubarItem {
    id: string;
    label: string;
    disabled?: boolean;
    separator?: boolean;
  }
  export interface MenubarMenu {
    id: string;
    label: string;
    items: MenubarItem[];
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    menus?: MenubarMenu[];
    label?: string;
    class?: string;
    onaction?: (payload: { menuId: string; itemId: string }) => void;
  }

  let {
    menus = [],
    label = 'Menu',
    class: klass = '',
    onaction,
  }: Props = $props();
  const uid = `dash-ui-mb-${++counter}`;

  let openIdx: number | null = $state(null);
  let activeItemIdx = $state(0);
  let triggerEls: HTMLButtonElement[] = $state([]);
  let rootEl = $state<HTMLDivElement | undefined>(undefined);

  let currentEligible = $derived(
    openIdx !== null ? menus[openIdx].items.filter((i) => !i.separator && !i.disabled) : [],
  );

  function openMenu(idx: number, focusLast = false) {
    const items = menus[idx].items.filter((i) => !i.separator && !i.disabled);
    activeItemIdx = focusLast ? items.length - 1 : 0;
    openIdx = idx;
  }

  function closeMenu() {
    openIdx = null;
  }

  function activate(menuId: string, itemId: string) {
    onaction?.({ menuId, itemId });
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
  class="inline-flex items-center gap-0.5 rounded-md border border-white/[0.08] bg-white/[0.03] p-0.5 {klass}"
>
  {#each menus as menu, idx (menu.id)}
    {@const isOpen = openIdx === idx}
    {@const menuId = `${uid}-menu-${idx}`}
    {@const elig = menu.items.filter((i) => !i.separator && !i.disabled)}
    <div class="relative">
      <button
        bind:this={triggerEls[idx]}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        data-open={isOpen ? 'true' : undefined}
        class="inline-flex cursor-pointer items-center rounded border-0 bg-transparent px-2.5 py-1.5 text-13 leading-none text-text-3 transition-[background-color,color] duration-100 hover:bg-white/[0.07] hover:text-[#e1e2e8] focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-brand-05 data-[open=true]:bg-white/[0.07] data-[open=true]:text-[#e1e2e8]"
        onclick={() => { if (isOpen) closeMenu(); else openMenu(idx); }}
        onkeydown={(e) => handleTriggerKeyDown(e, idx)}
      >
        {menu.label}
      </button>
      {#if isOpen}
        <ul
          id={menuId}
          role="menu"
          aria-label={menu.label}
          class="absolute left-0 top-[calc(100%+2px)] z-[200] m-0 min-w-[180px] list-none rounded-md border border-white/[0.12] bg-[#1f2329] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {#each menu.items as item (item.id)}
            {#if item.separator}
              <li role="separator" aria-hidden="true" class="my-[3px] h-px list-none bg-white/[0.08]"></li>
            {:else}
              {@const eligIdx = elig.indexOf(item)}
              <li
                role="menuitem"
                tabindex={-1}
                aria-disabled={item.disabled}
                data-active={eligIdx === activeItemIdx && !item.disabled ? 'true' : undefined}
                class="flex cursor-pointer select-none items-center whitespace-nowrap rounded px-2.5 py-1.5 text-13 text-text-3 transition-colors duration-75 hover:bg-white/[0.07] hover:text-[#e1e2e8] data-[active=true]:bg-white/[0.07] data-[active=true]:text-[#e1e2e8] aria-disabled:cursor-default aria-disabled:text-white/25 aria-disabled:pointer-events-none"
                onmouseenter={() => { if (!item.disabled) activeItemIdx = eligIdx; }}
                onmousedown={(e) => { e.preventDefault(); (() => { if (!item.disabled) activate(menu.id, item.id); })(); }}
              >{item.label}</li>
            {/if}
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
</div>
