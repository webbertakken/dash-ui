<script lang="ts" module>
  export type ContextMenuPillVariant = 'success' | 'warn' | 'danger' | 'info' | 'neutral';
  /** Inline badge rendered where the label's `{pill}` placeholder sits. */
  export interface ContextMenuPill {
    text: string;
    variant?: ContextMenuPillVariant;
  }
  export interface ContextMenuItem {
    id: string;
    /** Item copy. May contain a single `{pill}` placeholder slot which is
     *  replaced by an inline {@link ContextMenuPill} when `pill` is set. */
    label: string;
    /** Inline badge substituted for the `{pill}` slot in `label`. */
    pill?: ContextMenuPill;
    /** Red tone (destructive). Mutually exclusive with `warning`. */
    danger?: boolean;
    /** Yellow tone (caution / heads-up). Mutually exclusive with `danger`. */
    warning?: boolean;
    /** Green tone (active / positive state). Mutually exclusive with `danger` + `warning`. */
    success?: boolean;
    disabled?: boolean;
  }
  export type ContextMenuEntry = ContextMenuItem | { separator: true };
</script>

<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import Pill from './Pill.svelte';

  const PILL_SLOT = '{pill}';

  /** Split a label around its first `{pill}` slot so the pill can be
   *  rendered inline between the surrounding copy. Returns null when the
   *  item has no pill or no slot, signalling a plain-text label. */
  function pillParts(entry: ContextMenuItem): { before: string; after: string } | null {
    if (entry.pill === undefined) return null;
    const idx = entry.label.indexOf(PILL_SLOT);
    if (idx === -1) return null;
    return {
      before: entry.label.slice(0, idx),
      after: entry.label.slice(idx + PILL_SLOT.length),
    };
  }

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
    class="fixed z-[9200] m-0 min-w-[168px] list-none rounded-lg border border-border-3 bg-bg-2 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] focus:outline-none"
    style="left:{cx}px;top:{cy}px"
    onkeydown={handleKeyDown}
  >
    {#each items as entry, i (i)}
      {#if 'separator' in entry}
        <li role="separator" class="my-1 h-px bg-row-active"></li>
      {:else}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          role="menuitem"
          tabindex={-1}
          aria-disabled={entry.disabled || undefined}
          data-active={actionIndex(entry) === activeIdx ? 'true' : undefined}
          data-danger={entry.danger || undefined}
          data-warning={entry.warning || undefined}
          data-success={entry.success || undefined}
          class="flex cursor-pointer items-center whitespace-nowrap rounded-[5px] px-3 py-1.5 text-13 text-text-2 outline-none hover:bg-row-active hover:text-text-1 data-[active=true]:bg-row-active data-[active=true]:text-text-1 data-[danger=true]:text-status-danger data-[danger=true]:hover:bg-status-danger/10 data-[warning=true]:text-status-warning data-[warning=true]:hover:bg-status-warning/10 data-[success=true]:text-status-success data-[success=true]:hover:bg-status-success/10 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          onmouseenter={() => (activeIdx = actionIndex(entry))}
          onmousedown={(e) => { e.preventDefault(); (() => { if (!entry.disabled) activate(entry.id); })(); }}
        >{#if pillParts(entry)}{@const parts = pillParts(entry)}{parts?.before}<Pill
            variant={entry.pill?.variant ?? 'neutral'}
            showDot={false}
            class="mx-0.5 !px-1.5 !py-0 text-[10px] font-semibold leading-[1]"
          >{entry.pill?.text}</Pill>{parts?.after}{:else}{entry.label}{/if}</li>
      {/if}
    {/each}
  </ul>
{/if}
