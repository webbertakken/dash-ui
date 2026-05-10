<script context="module" lang="ts">
  export interface TreeNode {
    id: string;
    label: string;
    meta?: string;
    children?: TreeNode[];
  }
</script>

<script lang="ts">
  import { tick } from 'svelte';
  import TreeItem from './TreeItem.svelte';

  export let nodes: TreeNode[] = [];
  export let selected: string | undefined = undefined;
  export let defaultExpanded: string[] = [];
  export let label: string | undefined = undefined;
  export let className: string = '';

  let expanded = new Set<string>(defaultExpanded);
  let focusedId: string = nodes[0]?.id ?? '';
  let rootEl: HTMLUListElement;

  function visibleIds(list: TreeNode[]): string[] {
    const ids: string[] = [];
    function walk(ns: TreeNode[]) {
      for (const n of ns) {
        ids.push(n.id);
        if (n.children?.length && expanded.has(n.id)) walk(n.children);
      }
    }
    walk(list);
    return ids;
  }

  function findNode(id: string, list: TreeNode[]): TreeNode | undefined {
    for (const n of list) {
      if (n.id === id) return n;
      if (n.children) {
        const found = findNode(id, n.children);
        if (found) return found;
      }
    }
  }

  async function moveFocus(id: string) {
    focusedId = id;
    await tick();
    rootEl?.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)?.focus();
  }

  function toggle(id: string) {
    if (expanded.has(id)) expanded.delete(id);
    else expanded.add(id);
    expanded = expanded;
  }

  function handleFocusin(e: FocusEvent) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]');
    if (el) focusedId = el.getAttribute('data-tree-id') ?? focusedId;
  }

  function handleClick(e: MouseEvent) {
    const row = (e.target as HTMLElement).closest('.tree__row');
    if (!row) return;
    const item = row.closest('[data-tree-id]');
    if (!item) return;
    const id = item.getAttribute('data-tree-id');
    if (!id) return;
    selected = id;
    focusedId = id;
    const node = findNode(id, nodes);
    if (node?.children?.length) toggle(id);
  }

  function handleKeydown(e: KeyboardEvent) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]');
    if (!el) return;
    const id = el.getAttribute('data-tree-id');
    if (!id) return;

    const visible = visibleIds(nodes);
    const idx = visible.indexOf(id);
    const node = findNode(id, nodes);
    const hasChildren = !!node?.children?.length;
    const isNodeExpanded = expanded.has(id);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = visible[idx + 1];
      if (next) moveFocus(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = visible[idx - 1];
      if (prev) moveFocus(prev);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (hasChildren && !isNodeExpanded) toggle(id);
      else if (hasChildren && isNodeExpanded) moveFocus(node!.children![0]!.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (hasChildren && isNodeExpanded) toggle(id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (visible[0]) moveFocus(visible[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = visible[visible.length - 1];
      if (last) moveFocus(last);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selected = id;
      focusedId = id;
    }
  }
</script>

<ul
  bind:this={rootEl}
  role="tree"
  aria-label={label}
  class={`tree${className ? ' ' + className : ''}`}
  on:keydown={handleKeydown}
  on:focusin={handleFocusin}
  on:click={handleClick}
>
  {#each nodes as node (node.id)}
    <TreeItem {node} {expanded} {selected} {focusedId} />
  {/each}
</ul>
