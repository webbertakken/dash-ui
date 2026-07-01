<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type {
    TreeBrowserData,
    TreeBrowserNodeType,
  } from './tree-browser-model.ts'

  export interface TreeBrowserRowContext {
    id: string
    type: TreeBrowserNodeType
    name: string
  }

  export interface TreeBrowserNodeProps {
    id: string
    type: TreeBrowserNodeType
    data: TreeBrowserData
    expanded: Set<string>
    selected: string | undefined
    focusedId: string
    variant: 'folderTree' | 'indent'
    itemIcon?: Snippet<[TreeBrowserRowContext]>
    badge?: Snippet<[TreeBrowserRowContext]>
  }
</script>

<script lang="ts">
  import TreeBrowserNode from './TreeBrowserNode.svelte'
  import { childIds, hasChildren } from './tree-browser-model.ts'

  let {
    id,
    type,
    data,
    expanded,
    selected,
    focusedId,
    variant,
    itemIcon,
    badge,
  }: TreeBrowserNodeProps = $props()

  let node = $derived(
    type === 'collection' ? data.collections[id] : data.items?.[id],
  )
  let name = $derived(node?.name ?? '')
  let descriptor = $derived(node?.descriptor)
  let isCollection = $derived(type === 'collection')
  let nodeHasChildren = $derived(isCollection && hasChildren(data.collections, id))
  let isExpanded = $derived(expanded.has(id))
  let isSelected = $derived(selected === id)
  let children = $derived(isCollection ? childIds(data.collections, id) : { collections: [], items: [] })
  let rowContext = $derived({ id, type, name } as TreeBrowserRowContext)
</script>

<li
  role="treeitem"
  aria-expanded={nodeHasChildren ? isExpanded : undefined}
  aria-selected={isSelected}
  tabindex={focusedId === id ? 0 : -1}
  data-tree-id={id}
  data-type={type}
  class="w5-tb__item group/tb list-none outline-none focus:outline-none focus-visible:outline-none"
>
  <div
    data-selected={isSelected ? 'true' : undefined}
    class="w5-tb__row flex min-h-8 cursor-pointer select-none items-center gap-2 rounded px-2 text-13 text-text-2 hover:bg-row-hover group-focus-visible/tb:[outline:var(--focus-ring)] group-focus-visible/tb:[outline-offset:-2px] data-[selected=true]:bg-brand-05/[0.18] data-[selected=true]:text-text-1"
  >
    {#if nodeHasChildren}
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

    <span class="w5-tb__icon flex h-4 w-4 shrink-0 items-center justify-center text-text-4">
      {#if itemIcon}
        {@render itemIcon(rowContext)}
      {:else if isCollection}
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4">
          {#if isExpanded}
            <path
              d="M1.5 5.5h13l-1.6 7A1 1 0 0 1 11.9 13H3.4a1 1 0 0 1-1-.8L1 4.2a1 1 0 0 1 1-1.2h3.2a1 1 0 0 1 .8.4l.9 1.2H13a1 1 0 0 1 1 1v.9"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linejoin="round"
            />
          {:else}
            <path
              d="M1.5 3.8a1 1 0 0 1 1-1h3.2a1 1 0 0 1 .8.4l.9 1.2h6.1a1 1 0 0 1 1 1v6.3a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V3.8Z"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linejoin="round"
            />
          {/if}
        </svg>
      {:else}
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4">
          <path
            d="M4 1.5h5L13 5.5v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linejoin="round"
          />
          <path d="M9 1.5v4h4" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
        </svg>
      {/if}
    </span>

    <span class="w5-tb__names flex min-w-0 flex-1 flex-col justify-center leading-tight">
      <span class="w5-tb__name truncate">{name}</span>
      {#if descriptor}
        <span class="w5-tb__descriptor truncate text-11 text-text-4">{descriptor}</span>
      {/if}
    </span>

    {#if badge}
      <span class="w5-tb__badge ml-auto shrink-0">{@render badge(rowContext)}</span>
    {/if}
  </div>

  {#if isCollection && nodeHasChildren && isExpanded}
    <ul
      role="group"
      class="w5-tb__group m-0 list-none pl-3 {variant === 'folderTree'
        ? 'ml-[11px] border-l border-border-2'
        : 'ml-2'}"
    >
      {#each children.collections as childId (childId)}
        <TreeBrowserNode
          id={childId}
          type="collection"
          {data}
          {expanded}
          {selected}
          {focusedId}
          {variant}
          {itemIcon}
          {badge}
        />
      {/each}
      {#each children.items as itemId (itemId)}
        <TreeBrowserNode
          id={itemId}
          type="item"
          {data}
          {expanded}
          {selected}
          {focusedId}
          {variant}
          {itemIcon}
          {badge}
        />
      {/each}
    </ul>
  {/if}
</li>
