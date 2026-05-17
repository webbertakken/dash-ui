<script module lang="ts">
  export interface TransferListItem {
    id: string;
    label: string;
    description?: string;
  }
</script>

<script lang="ts">
  interface Props {
    sourceLabel?: string;
    targetLabel?: string;
    source?: TransferListItem[];
    target?: TransferListItem[];
    class?: string;
    onchange?: (payload: { source: TransferListItem[]; target: TransferListItem[] }) => void;
  }

  let {
    sourceLabel = 'Available',
    targetLabel = 'Selected',
    source = $bindable([]),
    target = $bindable([]),
    class: className = '',
    onchange,
  }: Props = $props();

  let selSrc = $state(new Set<string>());
  let selTgt = $state(new Set<string>());
  let focSrc = $state(0);
  let focTgt = $state(0);
  let srcEls: (HTMLLIElement | null)[] = $state([]);
  let tgtEls: (HTMLLIElement | null)[] = $state([]);

  function commit() {
    onchange?.({ source, target });
  }

  function moveRight(ids: Set<string>) {
    if (!ids.size) return;
    const moving = source.filter((i) => ids.has(i.id));
    source = source.filter((i) => !ids.has(i.id));
    target = [...target, ...moving];
    selSrc = new Set();
    focSrc = 0;
    commit();
  }

  function moveLeft(ids: Set<string>) {
    if (!ids.size) return;
    const moving = target.filter((i) => ids.has(i.id));
    target = target.filter((i) => !ids.has(i.id));
    source = [...source, ...moving];
    selTgt = new Set();
    focTgt = 0;
    commit();
  }

  function toggleSrc(id: string) {
    const n = new Set(selSrc);
    n.has(id) ? n.delete(id) : n.add(id);
    selSrc = n;
  }

  function toggleTgt(id: string) {
    const n = new Set(selTgt);
    n.has(id) ? n.delete(id) : n.add(id);
    selTgt = n;
  }

  function srcKey(e: KeyboardEvent) {
    if (!source.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focSrc = Math.min(focSrc + 1, source.length - 1);
      srcEls[focSrc]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focSrc = Math.max(focSrc - 1, 0);
      srcEls[focSrc]?.focus();
    } else if (e.key === ' ') {
      e.preventDefault();
      const item = source[focSrc];
      if (item) toggleSrc(item.id);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      moveRight(selSrc);
    }
  }

  function tgtKey(e: KeyboardEvent) {
    if (!target.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focTgt = Math.min(focTgt + 1, target.length - 1);
      tgtEls[focTgt]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focTgt = Math.max(focTgt - 1, 0);
      tgtEls[focTgt]?.focus();
    } else if (e.key === ' ') {
      e.preventDefault();
      const item = target[focTgt];
      if (item) toggleTgt(item.id);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      moveLeft(selTgt);
    }
  }

  const PANEL_CLS = 'flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border border-border-1 bg-divider p-2';
  const HEADER_CLS = 'flex items-center justify-between px-1 text-12 font-semibold uppercase tracking-[0.05em] text-text-3';
  const COUNT_CLS = 'rounded bg-row-active px-1.5 py-0.5 text-11 text-text-4 tabular-nums';
  const LIST_CLS = 'm-0 flex max-h-[240px] list-none flex-col gap-0.5 overflow-y-auto p-0 focus:outline-none';
  const ITEM_CLS = 'flex cursor-pointer flex-col items-start gap-0 rounded px-2 py-1.5 text-13 text-text-2 hover:bg-row-hover aria-selected:bg-brand-05/[0.18] aria-selected:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05';
  const EMPTY_CLS = 'rounded px-2 py-3 text-center text-11 text-text-4';
  const BTN_CLS = 'inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-border-2 bg-transparent text-13 text-text-3 hover:bg-row-hover hover:text-text-1 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05';
</script>

<div class="flex items-start gap-3 {className}">
  <div class={PANEL_CLS}>
    <div class={HEADER_CLS}>
      {sourceLabel} <span class={COUNT_CLS}>{source.length}</span>
    </div>
    <ul
      role="listbox"
      aria-label={sourceLabel}
      aria-multiselectable="true"
      class={LIST_CLS}
      onkeydown={srcKey}
    >
      {#if source.length === 0}
        <li class={EMPTY_CLS} role="option" aria-selected="false" aria-disabled="true">Empty</li>
      {:else}
        {#each source as item, i (item.id)}
          <li
            bind:this={srcEls[i]}
            role="option"
            aria-selected={selSrc.has(item.id)}
            tabindex={i === focSrc ? 0 : -1}
            class={ITEM_CLS}
            onclick={() => { focSrc = i; toggleSrc(item.id); }}
            onkeydown={(e) => { if (e.key === ' ') { e.preventDefault(); focSrc = i; toggleSrc(item.id); } }}
          >
            <span>{item.label}</span>
            {#if item.description}<span class="text-11 text-text-4">{item.description}</span>{/if}
          </li>
        {/each}
      {/if}
    </ul>
  </div>

  <div class="flex flex-col items-center gap-1 pt-7" role="group" aria-label="Transfer controls">
    <button type="button" class={BTN_CLS} aria-label={`Move all to ${targetLabel}`}
      disabled={source.length === 0}
      onclick={() => moveRight(new Set(source.map((i) => i.id)))}>»</button>
    <button type="button" class={BTN_CLS} aria-label={`Move selected to ${targetLabel}`}
      disabled={selSrc.size === 0}
      onclick={() => moveRight(selSrc)}>›</button>
    <button type="button" class={BTN_CLS} aria-label={`Move selected back to ${sourceLabel}`}
      disabled={selTgt.size === 0}
      onclick={() => moveLeft(selTgt)}>‹</button>
    <button type="button" class={BTN_CLS} aria-label={`Move all back to ${sourceLabel}`}
      disabled={target.length === 0}
      onclick={() => moveLeft(new Set(target.map((i) => i.id)))}>«</button>
  </div>

  <div class={PANEL_CLS}>
    <div class={HEADER_CLS}>
      {targetLabel} <span class={COUNT_CLS}>{target.length}</span>
    </div>
    <ul
      role="listbox"
      aria-label={targetLabel}
      aria-multiselectable="true"
      class={LIST_CLS}
      onkeydown={tgtKey}
    >
      {#if target.length === 0}
        <li class={EMPTY_CLS} role="option" aria-selected="false" aria-disabled="true">Empty</li>
      {:else}
        {#each target as item, i (item.id)}
          <li
            bind:this={tgtEls[i]}
            role="option"
            aria-selected={selTgt.has(item.id)}
            tabindex={i === focTgt ? 0 : -1}
            class={ITEM_CLS}
            onclick={() => { focTgt = i; toggleTgt(item.id); }}
            onkeydown={(e) => { if (e.key === ' ') { e.preventDefault(); focTgt = i; toggleTgt(item.id); } }}
          >
            <span>{item.label}</span>
            {#if item.description}<span class="text-11 text-text-4">{item.description}</span>{/if}
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
