<script lang="ts">
  export interface TreeNode {
    id: string;
    label: string;
    meta?: string;
    children?: TreeNode[];
  }

  export let node: TreeNode;
  export let expanded: Set<string>;
  export let selected: string | undefined;
  export let focusedId: string;

  $: hasChildren = !!node.children?.length;
  $: isExpanded = expanded.has(node.id);
  $: isSelected = selected === node.id;
</script>

<li
  role="treeitem"
  aria-expanded={hasChildren ? isExpanded : undefined}
  aria-selected={isSelected}
  tabindex={focusedId === node.id ? 0 : -1}
  data-tree-id={node.id}
  class="tree__item"
>
  <div class="tree__row{isSelected ? ' tree__row--selected' : ''}">
    {#if hasChildren}
      <svg
        class="tree__chevron{isExpanded ? ' tree__chevron--open' : ''}"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
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
      <span class="tree__indent" aria-hidden="true"></span>
    {/if}
    <span class="tree__label">{node.label}</span>
    {#if node.meta}<span class="tree__meta">{node.meta}</span>{/if}
  </div>
  {#if hasChildren && isExpanded}
    <ul role="group" class="tree__group">
      {#each node.children as child (child.id)}
        <svelte:self
          node={child}
          {expanded}
          {selected}
          {focusedId}
        />
      {/each}
    </ul>
  {/if}
</li>
