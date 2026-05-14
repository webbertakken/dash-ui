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
    const from = items.findIndex((i) => i.id === fromId);
    const to = items.findIndex((i) => i.id === toId);
    const arr = [...items];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    items = arr;
    onChange(arr);
  }

  function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === id);
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

<ol class="m-0 flex list-none flex-col gap-1 p-0" aria-label={ariaLabel}>
  {#each items as item, idx (item.id)}
    <li
      data-grabbed={grabbed === item.id ? 'true' : undefined}
      data-dragover={dragOver === item.id ? 'true' : undefined}
      draggable="true"
      class="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 transition-colors duration-100 data-[grabbed=true]:border-brand-05 data-[grabbed=true]:bg-brand-05/[0.08] data-[dragover=true]:border-brand-05"
      ondragstart={(e) => { e.dataTransfer?.setData('text/plain', item.id); if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'; dragSrc = item.id; }}
      ondragend={() => { dragSrc = null; dragOver = null; }}
      ondragover={(e) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'; dragOver = item.id; }}
      ondragleave={() => { dragOver = null; }}
      ondrop={(e) => { e.preventDefault(); if (dragSrc) reorder(dragSrc, item.id); dragSrc = null; dragOver = null; }}
    >
      <button
        type="button"
        aria-label={`${grabbed === item.id ? 'Release' : 'Grab'} ${item.label}. Use arrow keys to reorder.`}
        aria-pressed={grabbed === item.id}
        class="flex h-6 w-6 cursor-grab items-center justify-center rounded border-0 bg-transparent p-0 text-[#6e7079] hover:bg-white/[0.04] hover:text-white active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
        onkeydown={(e) => handleKeyDown(e, item.id)}
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
      <span class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-13 text-white">{item.label}</span>
        {#if item.meta}
          <span class="truncate text-11 text-[#6e7079]">{item.meta}</span>
        {/if}
      </span>
      <span class="shrink-0 text-11 text-[#6e7079] tabular-nums" aria-hidden="true">{idx + 1}</span>
    </li>
  {/each}
</ol>
