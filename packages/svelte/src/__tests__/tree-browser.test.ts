import { cleanup, render, fireEvent } from '@testing-library/svelte'
import { mount, unmount } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  childIds,
  flattenVisible,
  hasChildren,
  topLevelIds,
  type TreeBrowserCollection,
  type TreeBrowserItem,
} from '../lib/components/tree-browser-model.ts'
import TreeBrowser from '../lib/components/TreeBrowser.svelte'

afterEach(() => {
  cleanup()
})

// A small blueprint-flavoured tree:
//   root
//     ▸ game-types (folder, "2 types")
//         classic
//         mini
//     RULES
//     INTERFACE
const collections: Record<string, TreeBrowserCollection> = {
  root: { id: 'root', name: '', collections: ['game-types'], items: ['rules', 'interface'] },
  'game-types': {
    id: 'game-types',
    name: 'game-types',
    descriptor: '2 types',
    items: ['classic', 'mini'],
  },
}
const items: Record<string, TreeBrowserItem> = {
  rules: { id: 'rules', name: 'RULES', descriptor: 'spec' },
  interface: { id: 'interface', name: 'INTERFACE' },
  classic: { id: 'classic', name: 'classic' },
  mini: { id: 'mini', name: 'mini' },
}

const baseProps = () => ({ collections, items, rootId: 'root', label: 'Files' })

describe('tree-browser-model', () => {
  it('topLevelIds returns the root collection children (folders then items)', () => {
    expect(topLevelIds(collections, 'root')).toEqual(['game-types', 'rules', 'interface'])
  })

  it('topLevelIds is empty for an unknown root', () => {
    expect(topLevelIds(collections, 'nope')).toEqual([])
  })

  it('childIds and hasChildren reflect a collection contents', () => {
    expect(childIds(collections, 'game-types')).toEqual({
      collections: [],
      items: ['classic', 'mini'],
    })
    expect(hasChildren(collections, 'game-types')).toBe(true)
    expect(hasChildren(collections, 'rules')).toBe(false)
  })

  it('flattenVisible hides collapsed descendants', () => {
    const collapsed = flattenVisible({ collections, items, rootId: 'root' }, new Set())
    expect(collapsed.map((n) => n.id)).toEqual(['game-types', 'rules', 'interface'])

    const expanded = flattenVisible({ collections, items, rootId: 'root' }, new Set(['game-types']))
    expect(expanded.map((n) => n.id)).toEqual([
      'game-types',
      'classic',
      'mini',
      'rules',
      'interface',
    ])
    expect(expanded.find((n) => n.id === 'classic')?.depth).toBe(1)
  })

  it('flattenVisible is cycle-safe when a collection references itself', () => {
    const looped: Record<string, TreeBrowserCollection> = {
      root: { id: 'root', name: '', collections: ['a'] },
      a: { id: 'a', name: 'a', collections: ['a'] },
    }
    const flat = flattenVisible({ collections: looped, rootId: 'root' }, new Set(['a']))
    expect(flat.map((n) => n.id)).toEqual(['a'])
  })
})

describe('TreeBrowser rendering', () => {
  it('renders top-level rows and hides collapsed children', () => {
    const { getByText, queryByText } = render(TreeBrowser, { props: baseProps() })
    expect(getByText('game-types')).toBeTruthy()
    expect(getByText('RULES')).toBeTruthy()
    expect(queryByText('classic')).toBeNull()
  })

  it('exposes the tree/treeitem/group roles', () => {
    const { getByRole, getAllByRole } = render(TreeBrowser, {
      props: { ...baseProps(), defaultExpanded: ['game-types'] },
    })
    expect(getByRole('tree', { name: 'Files' })).toBeTruthy()
    expect(getAllByRole('treeitem').length).toBe(5)
    expect(getAllByRole('group').length).toBe(1)
  })

  it('renders descriptors under the name', () => {
    const { getByText } = render(TreeBrowser, { props: baseProps() })
    const descriptor = getByText('2 types')
    expect(descriptor.className).toContain('w5-tb__descriptor')
  })

  it('marks a folder aria-expanded and toggles on click', async () => {
    const { getByText, queryByText } = render(TreeBrowser, { props: baseProps() })
    const folderRow = getByText('game-types').closest('[role="treeitem"]')!
    expect(folderRow.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.click(getByText('game-types'))
    expect(folderRow.getAttribute('aria-expanded')).toBe('true')
    expect(queryByText('classic')).toBeTruthy()
    await fireEvent.click(getByText('game-types'))
    expect(folderRow.getAttribute('aria-expanded')).toBe('false')
  })

  it('leaf rows carry no aria-expanded', () => {
    const { getByText } = render(TreeBrowser, { props: baseProps() })
    const leaf = getByText('RULES').closest('[role="treeitem"]')!
    expect(leaf.getAttribute('aria-expanded')).toBeNull()
  })

  it('fires onselect with id + type and marks aria-selected', async () => {
    const onselect = vi.fn()
    const { getByText } = render(TreeBrowser, { props: { ...baseProps(), onselect } })
    await fireEvent.click(getByText('RULES'))
    expect(onselect).toHaveBeenCalledWith('rules', 'item')
    const leaf = getByText('RULES').closest('[role="treeitem"]')!
    expect(leaf.getAttribute('aria-selected')).toBe('true')
  })

  it('draws the folderTree connector on nested groups', () => {
    const { getByRole } = render(TreeBrowser, {
      props: { ...baseProps(), defaultExpanded: ['game-types'] },
    })
    const group = getByRole('group')
    expect(group.className).toContain('border-l')
    expect(group.className).toContain('border-border-2')
  })

  it('omits the connector for the indent variant', () => {
    const { getByRole } = render(TreeBrowser, {
      props: { ...baseProps(), defaultExpanded: ['game-types'], variant: 'indent' },
    })
    expect(getByRole('group').className).not.toContain('border-l')
  })

  it('keeps fixed-height rows (zero CLS on expansion)', () => {
    const { getByText } = render(TreeBrowser, { props: baseProps() })
    const row = getByText('RULES').closest('.w5-tb__row')!
    expect(row.className).toContain('min-h-8')
  })
})

describe('TreeBrowser expansion contract', () => {
  it('defaultExpanded opens folders uncontrolled', () => {
    const { getByText } = render(TreeBrowser, {
      props: { ...baseProps(), defaultExpanded: ['game-types'] },
    })
    expect(getByText('classic')).toBeTruthy()
  })

  it('controlled expanded + ontoggle: parent owns the state', async () => {
    const ontoggle = vi.fn()
    const { getByText, queryByText } = render(TreeBrowser, {
      props: { ...baseProps(), expanded: [], ontoggle },
    })
    // Controlled + still collapsed -> child hidden and click only reports intent.
    expect(queryByText('classic')).toBeNull()
    await fireEvent.click(getByText('game-types'))
    expect(ontoggle).toHaveBeenCalledWith('game-types')
    // No internal expansion happened (parent didn't update the prop).
    expect(queryByText('classic')).toBeNull()
  })
})

describe('TreeBrowser keyboard navigation', () => {
  const renderExpanded = () =>
    render(TreeBrowser, { props: { ...baseProps(), defaultExpanded: ['game-types'] } })

  it('ArrowDown/ArrowUp move the roving focus through visible rows', async () => {
    const { getByText } = renderExpanded()
    const folder = getByText('game-types').closest('[role="treeitem"]') as HTMLElement
    folder.focus()
    await fireEvent.keyDown(folder, { key: 'ArrowDown' })
    const classic = getByText('classic').closest('[role="treeitem"]')!
    expect(document.activeElement).toBe(classic)
    await fireEvent.keyDown(classic, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(folder)
  })

  it('ArrowRight expands a collapsed folder then steps into it', async () => {
    const { getByText, queryByText } = render(TreeBrowser, { props: baseProps() })
    const folder = getByText('game-types').closest('[role="treeitem"]') as HTMLElement
    folder.focus()
    await fireEvent.keyDown(folder, { key: 'ArrowRight' })
    expect(queryByText('classic')).toBeTruthy()
    await fireEvent.keyDown(folder, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(getByText('classic').closest('[role="treeitem"]'))
  })

  it('ArrowLeft collapses an open folder then moves to the parent', async () => {
    const { getByText } = renderExpanded()
    const classic = getByText('classic').closest('[role="treeitem"]') as HTMLElement
    classic.focus()
    await fireEvent.keyDown(classic, { key: 'ArrowLeft' })
    const folder = getByText('game-types').closest('[role="treeitem"]')!
    expect(document.activeElement).toBe(folder)
    await fireEvent.keyDown(folder, { key: 'ArrowLeft' })
    expect(folder.getAttribute('aria-expanded')).toBe('false')
  })

  it('Home/End jump to the first/last visible row', async () => {
    const { getByText } = renderExpanded()
    const rules = getByText('RULES').closest('[role="treeitem"]') as HTMLElement
    rules.focus()
    await fireEvent.keyDown(rules, { key: 'Home' })
    expect(document.activeElement).toBe(getByText('game-types').closest('[role="treeitem"]'))
    await fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'End' })
    expect(document.activeElement).toBe(getByText('INTERFACE').closest('[role="treeitem"]'))
  })

  it('Enter selects a row (and toggles a folder)', async () => {
    const onselect = vi.fn()
    const { getByText } = render(TreeBrowser, { props: { ...baseProps(), onselect } })
    const folder = getByText('game-types').closest('[role="treeitem"]') as HTMLElement
    folder.focus()
    await fireEvent.keyDown(folder, { key: 'Enter' })
    expect(onselect).toHaveBeenCalledWith('game-types', 'collection')
    expect(folder.getAttribute('aria-expanded')).toBe('true')
  })

  it('gives exactly one row tabindex=0 (roving tabindex)', () => {
    const { container } = renderExpanded()
    const tabbable = container.querySelectorAll('[role="treeitem"][tabindex="0"]')
    expect(tabbable.length).toBe(1)
  })
})

describe('TreeBrowser snippets', () => {
  const mountHarness = () => {
    const host = document.createElement('div')
    document.body.append(host)
    return import('./fixtures/TreeBrowserSnippetHarness.svelte').then((m) => {
      const cmp = mount(m.default, {
        target: host,
        props: { collections, items, rootId: 'root', defaultExpanded: ['game-types'] },
      })
      return { host, cmp }
    })
  }

  it('renders a per-item icon snippet with row context', async () => {
    const { host, cmp } = await mountHarness()
    try {
      const icon = host.querySelector('[data-testid="icon-classic"]')
      expect(icon).toBeTruthy()
      expect(icon?.getAttribute('data-kind')).toBe('item')
      expect(host.querySelector('[data-testid="icon-game-types"]')?.getAttribute('data-kind')).toBe(
        'collection',
      )
    } finally {
      unmount(cmp)
      host.remove()
    }
  })

  it('renders a trailing badge snippet only where the consumer opts in', async () => {
    const { host, cmp } = await mountHarness()
    try {
      expect(host.querySelector('[data-testid="badge-rules"]')?.textContent).toBe('missing')
      expect(host.querySelector('[data-testid="badge-interface"]')).toBeNull()
    } finally {
      unmount(cmp)
      host.remove()
    }
  })
})
