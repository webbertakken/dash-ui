<script module lang="ts">
  export interface CommandItem {
    id: string;
    label: string;
    group?: string;
    shortcut?: string;
  }
</script>

<script lang="ts">
  import { tick } from 'svelte';
  import Kbd from './Kbd.svelte';

  interface Props {
    open?: boolean;
    items?: CommandItem[];
    placeholder?: string;
    onselect?: (payload: string) => void;
    onclose?: () => void;
  }

  let {
    open = false,
    items = [],
    placeholder = 'Search pages and actions…',
    onselect,
    onclose,
  }: Props = $props();
  let query = $state('');
  let activeIdx = $state(0);
  let inputEl = $state<HTMLInputElement | undefined>(undefined);
  const listboxId = `cp-list-${Math.random().toString(36).slice(2)}`;

  let filtered = $derived(
    query.trim() === ''
      ? items
      : items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())),
  );

  let grouped = $derived(
    filtered.reduce(
      (acc, item) => {
        const g = item.group ?? '';
        const found = acc.find((a: { group: string }) => a.group === g);
        if (found) found.items.push(item);
        else acc.push({ group: g, items: [item] });
        return acc;
      },
      [] as { group: string; items: CommandItem[] }[],
    ),
  );

  $effect(() => {
    if (open) {
      query = '';
      activeIdx = 0;
      tick().then(() => inputEl?.focus());
    }
  });

  $effect(() => {
    if (query !== undefined) activeIdx = 0;
  });

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIdx];
      if (item) commit(item.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onclose?.();
    }
  }

  function commit(id: string) {
    onselect?.(id);
    onclose?.();
    query = '';
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onclose?.();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="fixed inset-0 z-[9300] flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-md"
    role="presentation"
    onclick={handleBackdrop}
    onkeydown={handleKey}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      class="w-[520px] max-w-[90vw] overflow-hidden rounded-xl border border-border-3 bg-bg-1 shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
    >
      <div class="flex items-center gap-2.5 border-b border-border-1 px-4 py-3">
        <svg
          class="shrink-0 text-text-4"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <path d="M10.5 10.5l3 3" />
        </svg>
        <input
          bind:this={inputEl}
          type="text"
          role="combobox"
          aria-expanded={filtered.length > 0}
          aria-autocomplete="list"
          aria-controls={listboxId}
          {placeholder}
          bind:value={query}
          onkeydown={handleKey}
          class="min-w-0 flex-1 border-0 bg-transparent text-[15px] leading-none text-text-1 outline-none placeholder:text-text-4"
        />
        <span class="shrink-0 whitespace-nowrap rounded border border-border-2 bg-row-active px-1.5 py-0.5 text-[10px] text-text-4">Esc</span>
      </div>
      <ul
        id={listboxId}
        role="listbox"
        aria-label="Results"
        class="m-0 max-h-[360px] list-none overflow-y-auto p-1.5"
      >
        {#if filtered.length === 0}
          <li class="list-none p-6 text-center text-13 text-text-4">No results for &ldquo;{query}&rdquo;</li>
        {:else}
          {#each grouped as { group, items: groupItems }}
            <li role="presentation">
              {#if group}
                <div class="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-text-4">{group}</div>
              {/if}
              {#each groupItems as item}
                {@const idx = filtered.indexOf(item)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                  role="option"
                  tabindex={-1}
                  aria-selected={idx === activeIdx}
                  data-active={idx === activeIdx ? 'true' : undefined}
                  class="flex cursor-pointer list-none items-center gap-2.5 rounded-md px-2.5 py-2 text-13 text-text-2 outline-none data-[active=true]:bg-brand-05/15 data-[active=true]:text-text-1"
                  onclick={() => commit(item.id)}
                  onmouseenter={() => (activeIdx = idx)}
                >
                  {item.label}
                  {#if item.shortcut}
                    <span class="ml-auto shrink-0" aria-label={item.shortcut.replace(/\+/g, ' then ')}>
                      <Kbd keys={item.shortcut} />
                    </span>
                  {/if}
                </div>
              {/each}
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  </div>
{/if}
