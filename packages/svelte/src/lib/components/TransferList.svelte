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
</script>

<div class="tl {className}">
  <div class="tl__panel">
    <div class="tl__header">
      {sourceLabel} <span class="tl__count">{source.length}</span>
    </div>
    <ul
      role="listbox"
      aria-label={sourceLabel}
      aria-multiselectable="true"
      class="tl__list"
      onkeydown={srcKey}
    >
      {#if source.length === 0}
        <li class="tl__empty" role="option" aria-selected="false" aria-disabled="true">Empty</li>
      {:else}
        {#each source as item, i (item.id)}
          <li
            bind:this={srcEls[i]}
            role="option"
            aria-selected={selSrc.has(item.id)}
            tabindex={i === focSrc ? 0 : -1}
            class="tl__item{selSrc.has(item.id) ? ' tl__item--sel' : ''}"
            onclick={() => { focSrc = i; toggleSrc(item.id); }}
            onkeydown={(e) => { if (e.key === ' ') { e.preventDefault(); focSrc = i; toggleSrc(item.id); } }}
          >
            <span class="tl__item-label">{item.label}</span>
            {#if item.description}<span class="tl__item-desc">{item.description}</span>{/if}
          </li>
        {/each}
      {/if}
    </ul>
  </div>

  <div class="tl__controls" role="group" aria-label="Transfer controls">
    <button type="button" class="tl__btn" aria-label="Move all to {targetLabel}"
      disabled={source.length === 0}
      onclick={() => moveRight(new Set(source.map((i) => i.id)))}>»</button>
    <button type="button" class="tl__btn" aria-label="Move selected to {targetLabel}"
      disabled={selSrc.size === 0}
      onclick={() => moveRight(selSrc)}>›</button>
    <button type="button" class="tl__btn" aria-label="Move selected back to {sourceLabel}"
      disabled={selTgt.size === 0}
      onclick={() => moveLeft(selTgt)}>‹</button>
    <button type="button" class="tl__btn" aria-label="Move all back to {sourceLabel}"
      disabled={target.length === 0}
      onclick={() => moveLeft(new Set(target.map((i) => i.id)))}>«</button>
  </div>

  <div class="tl__panel">
    <div class="tl__header">
      {targetLabel} <span class="tl__count">{target.length}</span>
    </div>
    <ul
      role="listbox"
      aria-label={targetLabel}
      aria-multiselectable="true"
      class="tl__list"
      onkeydown={tgtKey}
    >
      {#if target.length === 0}
        <li class="tl__empty" role="option" aria-selected="false" aria-disabled="true">Empty</li>
      {:else}
        {#each target as item, i (item.id)}
          <li
            bind:this={tgtEls[i]}
            role="option"
            aria-selected={selTgt.has(item.id)}
            tabindex={i === focTgt ? 0 : -1}
            class="tl__item{selTgt.has(item.id) ? ' tl__item--sel' : ''}"
            onclick={() => { focTgt = i; toggleTgt(item.id); }}
            onkeydown={(e) => { if (e.key === ' ') { e.preventDefault(); focTgt = i; toggleTgt(item.id); } }}
          >
            <span class="tl__item-label">{item.label}</span>
            {#if item.description}<span class="tl__item-desc">{item.description}</span>{/if}
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
