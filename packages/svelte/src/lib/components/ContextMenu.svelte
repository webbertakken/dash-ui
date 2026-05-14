<script lang="ts" module>
  export interface ContextMenuItem {
    id: string;
    label: string;
    danger?: boolean;
    disabled?: boolean;
  }
  export type ContextMenuEntry = ContextMenuItem | { separator: true };
</script>

<script lang="ts">
  import { onDestroy, tick } from 'svelte';

  interface Props {
    items?: ContextMenuEntry[];
    x?: number;
    y?: number;
    open?: boolean;
    label?: string;
    onclose?: () => void;
    onaction?: (payload: string) => void;
  }

  let {
    items = [],
    x = 0,
    y = 0,
    open = false,
    label = 'Context menu',
    onclose,
    onaction,
  }: Props = $props();
  let menuEl = $state<HTMLUListElement | undefined>(undefined);
  let activeIdx = $state(0);

  let actionItems = $derived(
    items.reduce<ContextMenuItem[]>((acc, e) => {
      if (!('separator' in e)) acc.push(e);
      return acc;
    }, []),
  );

  const menuW = 168;
  let menuH = $derived(items.length * 30 + 8);
  let cx = $derived(Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - menuW - 8));
  let cy = $derived(Math.min(y, (typeof window !== 'undefined' ? window.innerHeight : 800) - menuH - 8));

  function activate(id: string) {
    onaction?.(id);
    onclose?.();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); onclose?.(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, actionItems.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Home') { e.preventDefault(); activeIdx = 0; }
    else if (e.key === 'End') { e.preventDefault(); activeIdx = actionItems.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = actionItems[activeIdx];
      if (item && !item.disabled) activate(item.id);
    }
    else if (e.key === 'Tab') { onclose?.(); }
  }

  function handleOutside(e: MouseEvent) {
    if (!menuEl?.contains(e.target as Node)) onclose?.();
  }

  $effect(() => {
    if (open) {
      activeIdx = 0;
      tick().then(() => menuEl?.focus());
      document.addEventListener('mousedown', handleOutside);
    } else {
      document.removeEventListener('mousedown', handleOutside);
    }
  });

  onDestroy(() => {
    document.removeEventListener('mousedown', handleOutside);
  });

  function actionIndex(entry: ContextMenuEntry): number {
    if ('separator' in entry) return -1;
    return actionItems.indexOf(entry as ContextMenuItem);
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <ul
    bind:this={menuEl}
    role="menu"
    aria-label={label}
    tabindex={-1}
    class="fixed z-[9200] m-0 min-w-[168px] list-none rounded-lg border border-white/[0.12] bg-[#1a1a1c] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] focus:outline-none"
    style="left:{cx}px;top:{cy}px"
    onkeydown={handleKeyDown}
  >
    {#each items as entry, i (i)}
      {#if 'separator' in entry}
        <li role="separator" class="my-1 h-px bg-white/[0.08]"></li>
      {:else}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          role="menuitem"
          tabindex={-1}
          aria-disabled={entry.disabled || undefined}
          data-active={actionIndex(entry) === activeIdx ? 'true' : undefined}
          data-danger={entry.danger || undefined}
          class="flex cursor-pointer items-center whitespace-nowrap rounded-[5px] px-3 py-1.5 text-13 text-[#c8c9d0] outline-none hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-white/[0.06] data-[active=true]:text-white data-[danger=true]:text-status-danger data-[danger=true]:hover:bg-status-danger/10 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          onmouseenter={() => (activeIdx = actionIndex(entry))}
          onmousedown={(e) => { e.preventDefault(); (() => { if (!entry.disabled) activate(entry.id); })(); }}
        >{entry.label}</li>
      {/if}
    {/each}
  </ul>
{/if}
