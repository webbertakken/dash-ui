<script lang="ts" context="module">
  export interface ContextMenuItem {
    id: string;
    label: string;
    danger?: boolean;
    disabled?: boolean;
  }
  export type ContextMenuEntry = ContextMenuItem | { separator: true };
</script>

<script lang="ts">
  import { onDestroy, tick, createEventDispatcher } from 'svelte';

  export let items: ContextMenuEntry[] = [];
  export let x = 0;
  export let y = 0;
  export let open = false;
  export let label = 'Context menu';

  const dispatch = createEventDispatcher<{ close: void; action: string }>();

  let menuEl: HTMLUListElement;
  let activeIdx = 0;

  $: actionItems = items.reduce<ContextMenuItem[]>((acc, e) => {
    if (!('separator' in e)) acc.push(e);
    return acc;
  }, []);

  const menuW = 168;
  $: menuH = items.length * 30 + 8;
  $: cx = Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - menuW - 8);
  $: cy = Math.min(y, (typeof window !== 'undefined' ? window.innerHeight : 800) - menuH - 8);

  function activate(id: string) {
    dispatch('action', id);
    dispatch('close');
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); dispatch('close'); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, actionItems.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = actionItems.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = actionItems[activeIdx];
      if (item && !item.disabled) activate(item.id);
    }
    else if (e.key === 'Tab') { dispatch('close'); }
  }

  function handleOutside(e: MouseEvent) {
    if (!menuEl?.contains(e.target as Node)) dispatch('close');
  }

  $: if (open) {
    activeIdx = 0;
    tick().then(() => menuEl?.focus());
    document.addEventListener('mousedown', handleOutside);
  } else {
    document.removeEventListener('mousedown', handleOutside);
  }

  onDestroy(() => {
    document.removeEventListener('mousedown', handleOutside);
  });

  function actionIndex(entry: ContextMenuEntry): number {
    if ('separator' in entry) return -1;
    return actionItems.indexOf(entry as ContextMenuItem);
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <ul
    bind:this={menuEl}
    role="menu"
    aria-label={label}
    tabindex="-1"
    class="ctx-menu"
    style="left:{cx}px;top:{cy}px"
    on:keydown={handleKeyDown}
  >
    {#each items as entry, i (i)}
      {#if 'separator' in entry}
        <li role="separator" class="ctx-menu-sep"></li>
      {:else}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          role="menuitem"
          tabindex="-1"
          aria-disabled={entry.disabled || undefined}
          data-active={actionIndex(entry) === activeIdx ? 'true' : undefined}
          data-danger={entry.danger || undefined}
          class="ctx-menu-item"
          on:mouseenter={() => (activeIdx = actionIndex(entry))}
          on:mousedown|preventDefault={() => { if (!entry.disabled) activate(entry.id); }}
        >
          {entry.label}
        </li>
      {/if}
    {/each}
  </ul>
{/if}
