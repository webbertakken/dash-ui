<script module lang="ts">
  export interface TreeNode {
    id: string;
    label: string;
    meta?: string;
    children?: TreeNode[];
  }
</script>

<script lang="ts">
  import TreeItem from './TreeItem.svelte';

  interface Props {
    node: TreeNode;
    expanded: Set<string>;
    selected: string | undefined;
    focusedId: string;
  }

  let { node, expanded, selected, focusedId }: Props = $props();

  let hasChildren = $derived(!!node.children?.length);
  let isExpanded = $derived(expanded.has(node.id));
  let isSelected = $derived(selected === node.id);
</script>

<li
  role="treeitem"
  aria-expanded={hasChildren ? isExpanded : undefined}
  aria-selected={isSelected}
  tabindex={focusedId === node.id ? 0 : -1}
  data-tree-id={node.id}
  class="list-none"
>
  <div
    data-selected={isSelected ? 'true' : undefined}
    class="flex items-center gap-2 rounded px-2 py-1 text-13 text-text-2 hover:bg-row-hover data-[selected=true]:bg-brand-05/[0.18] data-[selected=true]:text-text-1"
  >
    {#if hasChildren}
      <svg
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        class="h-3 w-3 shrink-0 text-text-4 transition-transform duration-100 motion-reduce:transition-none {isExpanded ? 'rotate-90' : ''}"
      >
        <path
          d="M4 2l4 4-4 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {:else}
      <span class="inline-block w-3 shrink-0" aria-hidden="true"></span>
    {/if}
    <span class="flex-1 truncate">{node.label}</span>
    {#if node.meta}<span class="text-11 text-text-4">{node.meta}</span>{/if}
  </div>
  {#if hasChildren && isExpanded && node.children}
    <ul role="group" class="m-0 list-none pl-4">
      {#each node.children as child (child.id)}
        <TreeItem
          node={child}
          {expanded}
          {selected}
          {focusedId}
        />
      {/each}
    </ul>
  {/if}
</li>
