import { useState, useRef, useCallback } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'

export interface TreeNode {
  id: string
  label: string
  icon?: ReactNode
  meta?: string
  children?: TreeNode[]
}

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  nodes: TreeNode[]
  selected?: string
  onSelect?: (id: string) => void
  defaultExpanded?: string[]
  label?: string
}

function visibleIds(nodes: TreeNode[], expanded: Set<string>): string[] {
  const ids: string[] = []
  function walk(list: TreeNode[]) {
    for (const n of list) {
      ids.push(n.id)
      if (n.children?.length && expanded.has(n.id)) walk(n.children)
    }
  }
  walk(nodes)
  return ids
}

function findNode(id: string, list: TreeNode[]): TreeNode | undefined {
  for (const n of list) {
    if (n.id === id) return n
    if (n.children) {
      const found = findNode(id, n.children)
      if (found) return found
    }
  }
}

function TreeItem({
  node,
  selected,
  focusedId,
  expanded,
}: {
  node: TreeNode
  selected: string | undefined
  focusedId: string
  expanded: Set<string>
}) {
  const hasChildren = !!node.children?.length
  const isExpanded = expanded.has(node.id)
  const isSelected = selected === node.id

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={focusedId === node.id ? 0 : -1}
      data-tree-id={node.id}
      className="tree__item"
    >
      <div className={`tree__row${isSelected ? ' tree__row--selected' : ''}`}>
        {hasChildren ? (
          <svg
            className={`tree__chevron${isExpanded ? ' tree__chevron--open' : ''}`}
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
          <span className="tree__indent" aria-hidden="true" />
        )}
        {node.icon && (
          <span className="tree__icon" aria-hidden="true">
            {node.icon}
          </span>
        )}
        <span className="tree__label">{node.label}</span>
        {node.meta && <span className="tree__meta">{node.meta}</span>}
      </div>
      {hasChildren && isExpanded && (
        <ul role="group" className="tree__group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selected={selected}
              focusedId={focusedId}
              expanded={expanded}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function TreeView({
  nodes,
  selected,
  onSelect,
  defaultExpanded = [],
  label,
  className = '',
  ...rest
}: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded))
  const [focusedId, setFocusedId] = useState<string>(() => nodes[0]?.id ?? '')
  const rootRef = useRef<HTMLUListElement>(null)

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  function moveFocus(id: string) {
    setFocusedId(id)
    requestAnimationFrame(() => {
      rootRef.current?.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)?.focus()
    })
  }

  function handleFocus(e: React.FocusEvent<HTMLUListElement>) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]')
    if (el) setFocusedId(el.getAttribute('data-tree-id') ?? focusedId)
  }

  function handleClick(e: React.MouseEvent<HTMLUListElement>) {
    const row = (e.target as HTMLElement).closest('.tree__row')
    if (!row) return
    const item = row.closest('[data-tree-id]')
    if (!item) return
    const id = item.getAttribute('data-tree-id')
    if (!id) return
    onSelect?.(id)
    setFocusedId(id)
    moveFocus(id)
    const node = findNode(id, nodes)
    if (node?.children?.length) toggle(id)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const el = (e.target as HTMLElement).closest('[data-tree-id]')
    if (!el) return
    const id = el.getAttribute('data-tree-id')
    if (!id) return

    const visible = visibleIds(nodes, expanded)
    const idx = visible.indexOf(id)
    const node = findNode(id, nodes)
    const hasChildren = !!node?.children?.length
    const isNodeExpanded = expanded.has(id)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = visible[idx + 1]
      if (next) moveFocus(next)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = visible[idx - 1]
      if (prev) moveFocus(prev)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (hasChildren && !isNodeExpanded) toggle(id)
      else if (hasChildren && isNodeExpanded) moveFocus(node!.children![0]!.id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (hasChildren && isNodeExpanded) toggle(id)
    } else if (e.key === 'Home') {
      e.preventDefault()
      if (visible[0]) moveFocus(visible[0])
    } else if (e.key === 'End') {
      e.preventDefault()
      const last = visible[visible.length - 1]
      if (last) moveFocus(last)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(id)
      setFocusedId(id)
    }
  }

  return (
    <ul
      ref={rootRef}
      role="tree"
      aria-label={label}
      className={`tree ${className}`.trim()}
      onFocus={handleFocus}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          selected={selected}
          focusedId={focusedId}
          expanded={expanded}
        />
      ))}
    </ul>
  )
}
