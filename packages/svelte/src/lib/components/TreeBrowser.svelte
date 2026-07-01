<script module lang="ts">
  export type {
    TreeBrowserCollection,
    TreeBrowserItem,
    TreeBrowserData,
    TreeBrowserNodeType,
    FlatNode,
  } from './tree-browser-model.ts'
  export { topLevelIds } from './tree-browser-model.ts'
  export type { TreeBrowserRowContext } from './TreeBrowserNode.svelte'
</script>

<!--
  TreeBrowser - a folder/file tree modelled on instructure-ui's
  `ui-tree-browser` (TreeBrowser v2), medium size, `folderTree` variant.

  ## Data model
  instructure-ui shape: id-keyed `collections` (folders) + id-keyed
  `items` (leaves) + a `rootId`. The root collection is structural (its
  own row is never drawn); its `collections` then `items` become the
  top-level rows. Folders always render before items within a level.

  ## Visual mapping (instructure medium/folderTree -> @w5-ui/tokens)
  Both motifs (dark + light) resolve through the token variables below,
  so the component needs no motif branching.

  | instructure-ui (medium/folderTree) | @w5-ui token / utility            |
  | ---------------------------------- | --------------------------------- |
  | `baseSpacingMedium` row indent     | nested `ul` `pl-3` (12px = space-3)|
  | row min height                     | `min-h-8` (32px)                  |
  | row horizontal padding             | `px-2` (8px = space-2)            |
  | `iconsMarginRightMedium`           | `gap-2` (8px = space-2)           |
  | name font size (medium)            | `text-13` (--fs-13)               |
  | descriptor font size               | `text-11` (--fs-11), `text-text-4`|
  | folderTree `before` connector      | nested `ul` `border-l border-border-2` |
  | text colour (resting / selected)   | `text-text-2` / `text-text-1`     |
  | hover state                        | `bg-row-hover`                    |
  | selected state                     | `bg-brand-05/[0.18]`              |
  | focus ring                         | `--focus-ring` (`:focus-visible`) |

  ## Expansion
  Uncontrolled via `defaultExpanded`, or controlled via `expanded` +
  `ontoggle`. `topLevelIds(collections, rootId)` (exported) lets a
  consumer expand only the top level in one line.

  ## Accessibility
  `role="tree"` on the list, `role="treeitem"` / `role="group"` on rows
  and nested lists, `aria-expanded` / `aria-selected`, roving tabindex,
  and full Arrow/Home/End/Enter/Space keyboard navigation. Fixed row
  heights keep expansion CLS-free; the caret rotation respects
  `prefers-reduced-motion`.
-->
<script lang="ts">
  import { tick, type Snippet } from 'svelte'
  import TreeBrowserNode, { type TreeBrowserRowContext } from './TreeBrowserNode.svelte'
  import {
    childIds,
    flattenVisible,
    hasChildren,
    type TreeBrowserCollection,
    type TreeBrowserItem,
    type TreeBrowserNodeType,
  } from './tree-browser-model.ts'

  interface Props {
    collections?: Record<string, TreeBrowserCollection>;
    items?: Record<string, TreeBrowserItem>;
    rootId?: string;
    /** Uncontrolled initial expansion. Ignored when `expanded` is set. */
    defaultExpanded?: string[];
    /** Controlled expansion set. When provided, pair with `ontoggle`. */
    expanded?: string[] | undefined;
    ontoggle?: ((id: string) => void) | undefined;
    selected?: string | undefined;
    onselect?: ((id: string, type: TreeBrowserNodeType) => void) | undefined;
    /** Reserved for future small/large sizes. Only medium is implemented. */
    size?: 'medium';
    variant?: 'folderTree' | 'indent';
    label?: string | undefined;
    /** Per-row leading icon that overrides the built-in folder/file glyphs. */
    itemIcon?: Snippet<[TreeBrowserRowContext]>;
    /** Trailing badge (missing-file marker, count, etc.). */
    badge?: Snippet<[TreeBrowserRowContext]>;
    className?: string;
  }

  let {
    collections = {},
    items = {},
    rootId = 'root',
    defaultExpanded = [],
    expanded = undefined,
    ontoggle = undefined,
    selected = $bindable(undefined),
    onselect = undefined,
    size: _size = 'medium',
    variant = 'folderTree',
    label = undefined,
    itemIcon = undefined,
    badge = undefined,
    className = '',
  }: Props = $props()

  const isControlled = $derived(expanded !== undefined)

  // svelte-ignore state_referenced_locally
  let internalExpanded = $state(new Set<string>(defaultExpanded))
  let expandedSet = $derived(isControlled ? new Set(expanded) : internalExpanded)

  let data = $derived({ collections, items, rootId })
  let rootChildren = $derived(childIds(collections, rootId))
  let flat = $derived(flattenVisible(data, expandedSet))

  // svelte-ignore state_referenced_locally
  let focusedId = $state(flattenVisible({ collections, items, rootId }, new Set(defaultExpanded))[0]?.id ?? '')
  let rootEl = $state<HTMLUListElement | undefined>(undefined)

  function setExpanded(id: string, next: boolean) {
    if (isControlled) {
      ontoggle?.(id)
      return
    }
    if (next) internalExpanded.add(id)
    else internalExpanded.delete(id)
    internalExpanded = new Set(internalExpanded)
  }

  function toggle(id: string) {
    setExpanded(id, !expandedSet.has(id))
  }

  function select(id: string, type: TreeBrowserNodeType) {
    selected = id
    focusedId = id
    onselect?.(id, type)
  }

  async function moveFocus(id: string) {
    focusedId = id
    await tick()
    rootEl?.querySelector<HTMLElement>(`[data-tree-id="${cssEscape(id)}"]`)?.focus()
  }

  function cssEscape(value: string): string {
    return typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(value) : value.replace(/"/g, '\\"')
  }

  function nodeType(el: Element): TreeBrowserNodeType {
    return el.getAttribute('data-type') === 'collection' ? 'collection' : 'item'
  }

  function handleFocusin(e: FocusEvent) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]')
    if (el) focusedId = el.getAttribute('data-tree-id') ?? focusedId
  }

  function handleClick(e: MouseEvent) {
    const row = (e.target as HTMLElement).closest('.w5-tb__row')
    if (!row) return
    const el = row.closest('[data-tree-id]')
    if (!el) return
    const id = el.getAttribute('data-tree-id')
    if (!id) return
    const type = nodeType(el)
    select(id, type)
    if (type === 'collection' && hasChildren(collections, id)) toggle(id)
  }

  function handleKeydown(e: KeyboardEvent) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]')
    if (!el) return
    const id = el.getAttribute('data-tree-id')
    if (!id) return
    const type = nodeType(el)

    const idx = flat.findIndex((n) => n.id === id)
    const current = flat[idx]
    const nodeHasChildren = !!current?.hasChildren
    const isNodeExpanded = expandedSet.has(id)

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const next = flat[idx + 1]
        if (next) moveFocus(next.id)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev = flat[idx - 1]
        if (prev) moveFocus(prev.id)
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        if (nodeHasChildren && !isNodeExpanded) toggle(id)
        else if (nodeHasChildren && isNodeExpanded) {
          const first = firstChildId(id)
          if (first) moveFocus(first)
        }
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (nodeHasChildren && isNodeExpanded) toggle(id)
        else if (current?.parentId && current.parentId !== rootId) moveFocus(current.parentId)
        break
      }
      case 'Home': {
        e.preventDefault()
        if (flat[0]) moveFocus(flat[0].id)
        break
      }
      case 'End': {
        e.preventDefault()
        const last = flat[flat.length - 1]
        if (last) moveFocus(last.id)
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        select(id, type)
        if (type === 'collection' && nodeHasChildren) toggle(id)
        break
      }
    }
  }

  function firstChildId(id: string): string | undefined {
    const { collections: c, items: i } = childIds(collections, id)
    return c[0] ?? i[0]
  }
</script>

<ul
  bind:this={rootEl}
  role="tree"
  aria-label={label}
  data-variant={variant}
  class={`w5-tb m-0 list-none p-0 text-text-2 ${className}`}
  onkeydown={handleKeydown}
  onfocusin={handleFocusin}
  onclick={handleClick}
>
  {#each rootChildren.collections as id (id)}
    <TreeBrowserNode
      {id}
      type="collection"
      {data}
      expanded={expandedSet}
      {selected}
      {focusedId}
      {variant}
      {itemIcon}
      {badge}
    />
  {/each}
  {#each rootChildren.items as id (id)}
    <TreeBrowserNode
      {id}
      type="item"
      {data}
      expanded={expandedSet}
      {selected}
      {focusedId}
      {variant}
      {itemIcon}
      {badge}
    />
  {/each}
</ul>
<!--
  NOTE: This component is intentionally STYLE-LESS (Tailwind utilities
  only, no `<style>` block). The assistant dashboard serves
  `@w5-ui/svelte` as raw source (not prebundled); a `<style>` block
  there emits a `?type=style` virtual module that `@tailwindcss/vite`
  mis-parses ("Invalid declaration"). The focus ring is therefore
  expressed via the `group-focus-visible/tb` utilities in
  TreeBrowserNode instead of a scoped `:global` rule.
-->
