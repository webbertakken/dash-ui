/**
 * Pure data model + helpers for {@link TreeBrowser} (instructure-ui
 * `ui-tree-browser` shape). Kept framework-free so the React and Web
 * Component mirrors reuse the exact same walking / keyboard logic.
 *
 * A tree is an id-keyed map of `collections` (folders) plus an id-keyed
 * map of `items` (leaves) and a `rootId`. The root collection is a
 * structural container: its own row is never rendered, only its
 * children become the top-level rows.
 */

export interface TreeBrowserCollection {
  id: string
  name: string
  /** Small secondary line shown under the name (instructure descriptor). */
  descriptor?: string
  /** Child collection ids, in render order (folders render before items). */
  collections?: string[]
  /** Child item ids, in render order. */
  items?: string[]
}

export interface TreeBrowserItem {
  id: string
  name: string
  descriptor?: string
}

export type TreeBrowserNodeType = 'collection' | 'item'

/** A single visible (i.e. not hidden by a collapsed ancestor) row. */
export interface FlatNode {
  id: string
  type: TreeBrowserNodeType
  depth: number
  hasChildren: boolean
  parentId: string | undefined
}

export interface TreeBrowserData {
  collections: Record<string, TreeBrowserCollection>
  items?: Record<string, TreeBrowserItem>
  rootId: string
}

/**
 * The ids of the root collection's direct child collections + items -
 * exactly the rows a consumer expands to satisfy "top level only".
 */
export function topLevelIds(
  collections: Record<string, TreeBrowserCollection>,
  rootId: string,
): string[] {
  const root = collections[rootId]
  if (!root) return []
  return [...(root.collections ?? []), ...(root.items ?? [])]
}

/** Ordered child ids of a collection: nested folders first, then items. */
export function childIds(
  collections: Record<string, TreeBrowserCollection>,
  id: string,
): { collections: string[]; items: string[] } {
  const node = collections[id]
  return { collections: node?.collections ?? [], items: node?.items ?? [] }
}

/** Whether a collection has any children (folders or items). */
export function hasChildren(
  collections: Record<string, TreeBrowserCollection>,
  id: string,
): boolean {
  const { collections: c, items } = childIds(collections, id)
  return c.length > 0 || items.length > 0
}

/**
 * Depth-first flatten of the currently VISIBLE rows, honouring the
 * `expanded` set. Cycle-safe (a collection referenced twice, or a
 * self/loop reference, is visited once). Used for roving-tabindex
 * keyboard navigation.
 */
export function flattenVisible(data: TreeBrowserData, expanded: ReadonlySet<string>): FlatNode[] {
  const out: FlatNode[] = []
  const seen = new Set<string>([data.rootId])

  const walk = (collectionId: string, depth: number): void => {
    const { collections, items } = childIds(data.collections, collectionId)
    for (const childId of collections) {
      if (seen.has(childId)) continue
      seen.add(childId)
      const childHasChildren = hasChildren(data.collections, childId)
      out.push({
        id: childId,
        type: 'collection',
        depth,
        hasChildren: childHasChildren,
        parentId: collectionId,
      })
      if (childHasChildren && expanded.has(childId)) walk(childId, depth + 1)
    }
    for (const itemId of items) {
      if (seen.has(itemId)) continue
      seen.add(itemId)
      out.push({ id: itemId, type: 'item', depth, hasChildren: false, parentId: collectionId })
    }
  }

  walk(data.rootId, 0)
  return out
}
