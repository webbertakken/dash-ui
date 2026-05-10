<script context="module" lang="ts">
  export interface CommandItem {
    id: string;
    label: string;
    group?: string;
    shortcut?: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import Kbd from './Kbd.svelte';

  export let open: boolean = false;
  export let items: CommandItem[] = [];
  export let placeholder: string = 'Search pages and actions…';

  const dispatch = createEventDispatcher<{ select: string; close: void }>();

  let query = '';
  let activeIdx = 0;
  let inputEl: HTMLInputElement;
  const listboxId = `cp-list-${Math.random().toString(36).slice(2)}`;

  $: filtered =
    query.trim() === ''
      ? items
      : items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  $: grouped = filtered.reduce(
    (acc, item) => {
      const g = item.group ?? '';
      const found = acc.find((a: { group: string }) => a.group === g);
      if (found) found.items.push(item);
      else acc.push({ group: g, items: [item] });
      return acc;
    },
    [] as { group: string; items: CommandItem[] }[],
  );

  $: if (open) {
    query = '';
    activeIdx = 0;
    tick().then(() => inputEl?.focus());
  }

  $: if (query !== undefined) activeIdx = 0;

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
      dispatch('close');
    }
  }

  function commit(id: string) {
    dispatch('select', id);
    dispatch('close');
    query = '';
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) dispatch('close');
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div class="cp-backdrop" role="presentation" on:click={handleBackdrop} on:keydown={handleKey}>
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      class="cp-panel"
    >
      <div class="cp-search">
        <svg
          class="cp-search-icon"
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
          class="cp-input"
          type="text"
          role="combobox"
          aria-expanded={filtered.length > 0}
          aria-autocomplete="list"
          aria-controls={listboxId}
          {placeholder}
          bind:value={query}
          on:keydown={handleKey}
        />
        <span class="cp-kbd">Esc</span>
      </div>
      <ul id={listboxId} role="listbox" aria-label="Results" class="cp-list">
        {#if filtered.length === 0}
          <li class="cp-empty">No results for &ldquo;{query}&rdquo;</li>
        {:else}
          {#each grouped as { group, items: groupItems }}
            <li role="presentation">
              {#if group}
                <div class="cp-group-label">{group}</div>
              {/if}
              {#each groupItems as item}
                {@const idx = filtered.indexOf(item)}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  role="option"
                  tabindex="-1"
                  aria-selected={idx === activeIdx}
                  data-active={idx === activeIdx ? 'true' : undefined}
                  class="cp-item"
                  on:click={() => commit(item.id)}
                  on:mouseenter={() => (activeIdx = idx)}
                >
                  {item.label}
                  {#if item.shortcut}
                    <span class="cp-item-shortcut" aria-label={item.shortcut.replace(/\+/g, ' then ')}>
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
