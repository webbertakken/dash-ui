<script module lang="ts">
  export interface SortableItem {
    id: string;
    label: string;
    meta?: string;
  }
</script>

<script lang="ts">

  interface Props {
    items?: SortableItem[];
    onChange?: (items: SortableItem[]) => void;
    ariaLabel?: string | undefined;
  }

  let { items = $bindable([]), onChange = () => {}, ariaLabel = undefined }: Props = $props();

  let grabbed: string | null = $state(null);
  let dragSrc: string | null = $state(null);
  let dragOver: string | null = $state(null);

  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    const from = items.findIndex(i => i.id === fromId);
    const to = items.findIndex(i => i.id === toId);
    const arr = [...items];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    items = arr;
    onChange(arr);
  }

  function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex(i => i.id === id);
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    items = arr;
    onChange(arr);
  }

  function handleKeyDown(e: KeyboardEvent, id: string) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      grabbed = grabbed === id ? null : id;
    } else if (grabbed === id) {
      if (e.key === 'ArrowUp') { e.preventDefault(); move(id, -1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); move(id, 1); }
      else if (e.key === 'Escape') { grabbed = null; }
    }
  }
</script>

<ol class="sortable-list" aria-label={ariaLabel}>
  {#each items as item, idx (item.id)}
    <li
      class="sortable-list__item"
      class:is-grabbed={grabbed === item.id}
      class:is-drag-over={dragOver === item.id}
      draggable="true"
      ondragstart={e => { e.dataTransfer?.setData('text/plain', item.id); if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'; dragSrc = item.id; }}
      ondragend={() => { dragSrc = null; dragOver = null; }}
      ondragover={e => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'; dragOver = item.id; }}
      ondragleave={() => { dragOver = null; }}
      ondrop={e => { e.preventDefault(); if (dragSrc) reorder(dragSrc, item.id); dragSrc = null; dragOver = null; }}
    >
      <button
        type="button"
        class="sortable-list__handle"
        aria-label="{grabbed === item.id ? 'Release' : 'Grab'} {item.label}. Use arrow keys to reorder."
        aria-pressed={grabbed === item.id}
        onkeydown={e => handleKeyDown(e, item.id)}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" focusable="false">
          <rect x="3" y="2" width="2" height="2" rx="1" />
          <rect x="9" y="2" width="2" height="2" rx="1" />
          <rect x="3" y="6" width="2" height="2" rx="1" />
          <rect x="9" y="6" width="2" height="2" rx="1" />
          <rect x="3" y="10" width="2" height="2" rx="1" />
          <rect x="9" y="10" width="2" height="2" rx="1" />
        </svg>
      </button>
      <span class="sortable-list__content">
        <span class="sortable-list__label">{item.label}</span>
        {#if item.meta}
          <span class="sortable-list__meta">{item.meta}</span>
        {/if}
      </span>
      <span class="sortable-list__index" aria-hidden="true">{idx + 1}</span>
    </li>
  {/each}
</ol>
