import { useCallback, useRef, useState } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'

/**
 * TreeBrowser - React mirror of the Svelte `@w5-ui/svelte` component
 * (instructure-ui `ui-tree-browser`, medium size, `folderTree` variant).
 * Styling lives in `@w5-ui/tokens/dashboard.css` under `.tree-browser*`;
 * see the Svelte source for the token mapping. API mirrors 1:1.
 */

export interface TreeBrowserCollection {
  id: string
  name: string
  descriptor?: string
  collections?: string[]
  items?: string[]
}

export interface TreeBrowserItem {
  id: string
  name: string
  descriptor?: string
}

export type TreeBrowserNodeType = 'collection' | 'item'

export interface TreeBrowserRowContext {
  id: string
  type: TreeBrowserNodeType
  name: string
}

export interface TreeBrowserProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  collections: Record<string, TreeBrowserCollection>
  items?: Record<string, TreeBrowserItem>
  rootId: string
  /** Uncontrolled initial expansion. Ignored when `expanded` is set. */
  defaultExpanded?: string[]
  /** Controlled expansion set. Pair with `onToggle`. */
  expanded?: string[]
  onToggle?: (id: string) => void
  selected?: string
  onSelect?: (id: string, type: TreeBrowserNodeType) => void
  size?: 'medium'
  variant?: 'folderTree' | 'indent'
  label?: string
  /** Per-row leading icon; overrides the built-in folder/file glyphs. */
  renderIcon?: (ctx: TreeBrowserRowContext) => ReactNode
  /** Trailing badge (missing-file marker, count, etc.). */
  renderBadge?: (ctx: TreeBrowserRowContext) => ReactNode
}

interface FlatNode {
  id: string
  type: TreeBrowserNodeType
  hasChildren: boolean
  parentId: string | undefined
}

function childIds(
  collections: Record<string, TreeBrowserCollection>,
  id: string,
): { collections: string[]; items: string[] } {
  const node = collections[id]
  return { collections: node?.collections ?? [], items: node?.items ?? [] }
}

function hasChildren(collections: Record<string, TreeBrowserCollection>, id: string): boolean {
  const { collections: c, items } = childIds(collections, id)
  return c.length > 0 || items.length > 0
}

/** Root collection's direct children (folders then items). */
export function topLevelIds(
  collections: Record<string, TreeBrowserCollection>,
  rootId: string,
): string[] {
  const root = collections[rootId]
  if (!root) return []
  return [...(root.collections ?? []), ...(root.items ?? [])]
}

function flattenVisible(
  collections: Record<string, TreeBrowserCollection>,
  rootId: string,
  expanded: Set<string>,
): FlatNode[] {
  const out: FlatNode[] = []
  const seen = new Set<string>([rootId])
  const walk = (collectionId: string): void => {
    const { collections: cols, items } = childIds(collections, collectionId)
    for (const childId of cols) {
      if (seen.has(childId)) continue
      seen.add(childId)
      const childHasChildren = hasChildren(collections, childId)
      out.push({
        id: childId,
        type: 'collection',
        hasChildren: childHasChildren,
        parentId: collectionId,
      })
      if (childHasChildren && expanded.has(childId)) walk(childId)
    }
    for (const itemId of items) {
      if (seen.has(itemId)) continue
      seen.add(itemId)
      out.push({ id: itemId, type: 'item', hasChildren: false, parentId: collectionId })
    }
  }
  walk(rootId)
  return out
}

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
      {open ? (
        <path
          d="M1.5 5.5h13l-1.6 7A1 1 0 0 1 11.9 13H3.4a1 1 0 0 1-1-.8L1 4.2a1 1 0 0 1 1-1.2h3.2a1 1 0 0 1 .8.4l.9 1.2H13a1 1 0 0 1 1 1v.9"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M1.5 3.8a1 1 0 0 1 1-1h3.2a1 1 0 0 1 .8.4l.9 1.2h6.1a1 1 0 0 1 1 1v6.3a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V3.8Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
      <path
        d="M4 1.5h5L13 5.5v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M9 1.5v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

interface NodeProps {
  id: string
  type: TreeBrowserNodeType
  collections: Record<string, TreeBrowserCollection>
  items: Record<string, TreeBrowserItem>
  expanded: Set<string>
  selected: string | undefined
  focusedId: string
  variant: 'folderTree' | 'indent'
  renderIcon?: (ctx: TreeBrowserRowContext) => ReactNode
  renderBadge?: (ctx: TreeBrowserRowContext) => ReactNode
}

function TreeBrowserNode(props: NodeProps) {
  const { id, type, collections, items, expanded, selected, focusedId, renderIcon, renderBadge } =
    props
  const isCollection = type === 'collection'
  const node = isCollection ? collections[id] : items[id]
  const name = node?.name ?? ''
  const descriptor = node?.descriptor
  const nodeHasChildren = isCollection && hasChildren(collections, id)
  const isExpanded = expanded.has(id)
  const isSelected = selected === id
  const children = isCollection ? childIds(collections, id) : { collections: [], items: [] }
  const ctx: TreeBrowserRowContext = { id, type, name }

  return (
    <li
      role="treeitem"
      aria-expanded={nodeHasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={focusedId === id ? 0 : -1}
      data-tree-id={id}
      data-type={type}
      className="tree-browser__item"
    >
      <div className={`tree-browser__row${isSelected ? ' tree-browser__row--selected' : ''}`}>
        {nodeHasChildren ? (
          <svg
            className={`tree-browser__chevron${isExpanded ? ' tree-browser__chevron--open' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="tree-browser__indent" aria-hidden="true" />
        )}
        <span className="tree-browser__icon" aria-hidden="true">
          {renderIcon ? (
            renderIcon(ctx)
          ) : isCollection ? (
            <FolderIcon open={isExpanded} />
          ) : (
            <FileIcon />
          )}
        </span>
        <span className="tree-browser__names">
          <span className="tree-browser__name">{name}</span>
          {descriptor && <span className="tree-browser__descriptor">{descriptor}</span>}
        </span>
        {renderBadge && <span className="tree-browser__badge">{renderBadge(ctx)}</span>}
      </div>
      {isCollection && nodeHasChildren && isExpanded && (
        <ul role="group" className="tree-browser__group">
          {children.collections.map((childId) => (
            <TreeBrowserNode key={childId} {...props} id={childId} type="collection" />
          ))}
          {children.items.map((itemId) => (
            <TreeBrowserNode key={itemId} {...props} id={itemId} type="item" />
          ))}
        </ul>
      )}
    </li>
  )
}

export function TreeBrowser({
  collections,
  items = {},
  rootId,
  defaultExpanded = [],
  expanded,
  onToggle,
  selected,
  onSelect,
  size: _size = 'medium',
  variant = 'folderTree',
  label,
  renderIcon,
  renderBadge,
  className = '',
  ...rest
}: TreeBrowserProps) {
  const isControlled = expanded !== undefined
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  )
  const expandedSet = isControlled ? new Set(expanded) : internalExpanded
  // Selection: controlled via `selected` when provided, otherwise tracked
  // internally so a click marks the row (parity with the Svelte bindable).
  const [internalSelected, setInternalSelected] = useState<string | undefined>(selected)
  const effectiveSelected = selected !== undefined ? selected : internalSelected
  const [focusedId, setFocusedId] = useState<string>(
    () => flattenVisible(collections, rootId, new Set(defaultExpanded))[0]?.id ?? '',
  )
  const rootRef = useRef<HTMLUListElement>(null)

  const toggle = useCallback(
    (id: string) => {
      if (isControlled) {
        onToggle?.(id)
        return
      }
      setInternalExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    },
    [isControlled, onToggle],
  )

  function moveFocus(id: string) {
    setFocusedId(id)
    requestAnimationFrame(() => {
      const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id
      rootRef.current?.querySelector<HTMLElement>(`[data-tree-id="${escaped}"]`)?.focus()
    })
  }

  function select(id: string, type: TreeBrowserNodeType) {
    setFocusedId(id)
    setInternalSelected(id)
    onSelect?.(id, type)
  }

  function nodeType(el: Element): TreeBrowserNodeType {
    return el.getAttribute('data-type') === 'collection' ? 'collection' : 'item'
  }

  function handleFocus(e: React.FocusEvent<HTMLUListElement>) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]')
    if (el) setFocusedId(el.getAttribute('data-tree-id') ?? focusedId)
  }

  function handleClick(e: React.MouseEvent<HTMLUListElement>) {
    const row = (e.target as HTMLElement).closest('.tree-browser__row')
    if (!row) return
    const el = row.closest('[data-tree-id]')
    if (!el) return
    const id = el.getAttribute('data-tree-id')
    if (!id) return
    const type = nodeType(el)
    select(id, type)
    if (type === 'collection' && hasChildren(collections, id)) toggle(id)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]')
    if (!el) return
    const id = el.getAttribute('data-tree-id')
    if (!id) return
    const type = nodeType(el)

    const flat = flattenVisible(collections, rootId, expandedSet)
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
          const { collections: c, items: i } = childIds(collections, id)
          const first = c[0] ?? i[0]
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

  const rootChildren = childIds(collections, rootId)

  return (
    <ul
      ref={rootRef}
      role="tree"
      aria-label={label}
      data-variant={variant}
      className={`tree-browser ${className}`.trim()}
      onFocus={handleFocus}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {rootChildren.collections.map((id) => (
        <TreeBrowserNode
          key={id}
          id={id}
          type="collection"
          collections={collections}
          items={items}
          expanded={expandedSet}
          selected={effectiveSelected}
          focusedId={focusedId}
          variant={variant}
          renderIcon={renderIcon}
          renderBadge={renderBadge}
        />
      ))}
      {rootChildren.items.map((id) => (
        <TreeBrowserNode
          key={id}
          id={id}
          type="item"
          collections={collections}
          items={items}
          expanded={expandedSet}
          selected={effectiveSelected}
          focusedId={focusedId}
          variant={variant}
          renderIcon={renderIcon}
          renderBadge={renderBadge}
        />
      ))}
    </ul>
  )
}
