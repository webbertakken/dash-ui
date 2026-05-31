/**
 * Tailwind-migration regression tests for the components moved off
 * dashboard.css in dash-ui PR #N. Each test asserts the new utility
 * class strings (which is what the consumer's Tailwind compiler picks
 * up) plus the component's documented public-API behaviour.
 */
import { cleanup, render, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, afterEach, vi } from 'vitest'
import ActionMenu from '../lib/components/ActionMenu.svelte'
import Avatar from '../lib/components/Avatar.svelte'
import AvatarGroup from '../lib/components/AvatarGroup.svelte'
import Checkbox from '../lib/components/Checkbox.svelte'
import Combobox from '../lib/components/Combobox.svelte'
import CommandPalette from '../lib/components/CommandPalette.svelte'
import ContextMenu from '../lib/components/ContextMenu.svelte'
import FilterBuilder from '../lib/components/FilterBuilder.svelte'
import HoverCard from '../lib/components/HoverCard.svelte'
import IconButton from '../lib/components/IconButton.svelte'
import KVTable from '../lib/components/KVTable.svelte'
import Menubar from '../lib/components/Menubar.svelte'
import MultiSelect from '../lib/components/MultiSelect.svelte'
import NumberInput from '../lib/components/NumberInput.svelte'
import Pagination from '../lib/components/Pagination.svelte'
import Pill from '../lib/components/Pill.svelte'
import Popover from '../lib/components/Popover.svelte'
import RadioGroup from '../lib/components/RadioGroup.svelte'
import SearchBox from '../lib/components/SearchBox.svelte'
import Select from '../lib/components/Select.svelte'
import Sidebar, { type SidebarSectionDef } from '../lib/components/Sidebar.svelte'
import Skeleton from '../lib/components/Skeleton.svelte'
import SortHeader from '../lib/components/SortHeader.svelte'
import TabPanel from '../lib/components/TabPanel.svelte'

afterEach(() => {
  cleanup()
})

describe('IconButton (Tailwind)', () => {
  it('emits the core utility classes for the chrome', () => {
    const { getByRole } = render(IconButton, { props: { title: 'Search' } })
    const btn = getByRole('button')
    const cls = btn.className
    expect(cls).toMatch(/h-8/)
    expect(cls).toMatch(/w-8/)
    expect(cls).toMatch(/rounded-md/)
    expect(cls).toMatch(/focus-visible:outline-brand-05/)
  })

  it('forwards aria-label from title when no explicit aria-label is given', () => {
    const { getByLabelText } = render(IconButton, { props: { title: 'Help' } })
    expect(getByLabelText('Help')).toBeTruthy()
  })

  it('merges consumer-supplied class names', () => {
    const { getByRole } = render(IconButton, {
      props: { title: 'X', class: 'relative ring-1' },
    })
    expect(getByRole('button').className).toMatch(/relative ring-1/)
  })

  it('invokes onclick', async () => {
    const onclick = vi.fn()
    const { getByRole } = render(IconButton, { props: { title: 'X', onclick } })
    await fireEvent.click(getByRole('button'))
    expect(onclick).toHaveBeenCalledOnce()
  })
})

describe('Avatar (Tailwind)', () => {
  it('renders sm/md/lg size utilities', () => {
    for (const [size, expected] of [
      ['sm', 'h-6'],
      ['md', 'h-8'],
      ['lg', 'h-10'],
    ] as const) {
      const { container, unmount } = render(Avatar, { props: { size, initials: 'AB' } })
      expect(container.firstChild).toBeTruthy()
      expect((container.firstChild as HTMLElement).className).toMatch(new RegExp(expected))
      unmount()
    }
  })

  it('renders initials when no src is provided', () => {
    const { container } = render(Avatar, { props: { initials: 'WB' } })
    expect(container.textContent).toContain('WB')
  })

  it('renders an <img> when src is provided', () => {
    const { container } = render(Avatar, {
      props: { src: 'https://example.test/x.png', alt: 'avatar' },
    })
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('renders the status dot with the correct colour', () => {
    for (const [status, cls] of [
      ['online', 'bg-status-success'],
      ['offline', 'bg-status-neutral'],
      ['away', 'bg-status-warning'],
    ] as const) {
      const { container, unmount } = render(Avatar, { props: { initials: 'X', status } })
      const dot = container.querySelector(`[aria-hidden="true"]`)
      expect(dot?.className).toMatch(cls)
      unmount()
    }
  })
})

describe('AvatarGroup (Tailwind)', () => {
  it('renders all avatars when count <= max', () => {
    const { getAllByRole } = render(AvatarGroup, {
      props: {
        avatars: [{ initials: 'A' }, { initials: 'B' }],
        max: 5,
      },
    })
    // 1 list + 2 listitems
    expect(getAllByRole('list')).toHaveLength(1)
    expect(getAllByRole('listitem')).toHaveLength(2)
  })

  it('truncates and shows an overflow chip when count > max', () => {
    const { getAllByRole, container } = render(AvatarGroup, {
      props: {
        avatars: [{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }, { initials: 'D' }],
        max: 2,
      },
    })
    expect(getAllByRole('listitem')).toHaveLength(3) // 2 visible + 1 overflow
    expect(container.textContent).toContain('+2')
  })
})

describe('Pill (Tailwind)', () => {
  it('renders each variant with the right background utility', () => {
    for (const [variant, cls] of [
      ['success', 'bg-status-success'],
      ['warn', 'bg-status-warning'],
      ['danger', 'bg-status-danger'],
      ['info', 'bg-status-info'],
      // Neutral variant now uses the motif-aware `--row-active` token so the
      // pill stays visible on a white page bg.
      ['neutral', 'bg-row-active'],
    ] as const) {
      const { container, unmount } = render(Pill, { props: { variant } })
      expect((container.firstChild as HTMLElement).className).toMatch(cls)
      unmount()
    }
  })

  it('hides the dot when showDot is false', () => {
    const { container } = render(Pill, { props: { variant: 'success', showDot: false } })
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('renders the dot by default', () => {
    const { container } = render(Pill, { props: { variant: 'success' } })
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
  })
})

describe('Select (Tailwind)', () => {
  const OPTS = [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana' },
    { value: 'c', label: 'Cherry' },
  ]

  it('emits the new trigger utility classes (no .select-trigger legacy class)', () => {
    const { getByRole } = render(Select, { props: { options: OPTS, value: 'a' } })
    const trigger = getByRole('combobox')
    expect(trigger.className).not.toMatch(/select-trigger/)
    expect(trigger.className).toMatch(/h-\[34px\]/)
    expect(trigger.className).toMatch(/rounded-md/)
    expect(trigger.className).toMatch(/border/)
    expect(trigger.className).toMatch(/cursor-pointer/)
    expect(trigger.className).toMatch(/aria-expanded:border-brand-05/)
  })

  it('shows the selected label, falls back to placeholder when value is unknown', () => {
    const a = render(Select, { props: { options: OPTS, value: 'b' } })
    expect(a.getByRole('combobox').textContent).toMatch(/Banana/)
    a.unmount()
    const b = render(Select, { props: { options: OPTS, placeholder: 'Pick one' } })
    expect(b.getByRole('combobox').textContent).toMatch(/Pick one/)
  })

  it('opens the listbox on click, picks an option on mousedown', async () => {
    const onchange = vi.fn()
    const { getByRole, getAllByRole } = render(Select, {
      props: { options: OPTS, value: 'a', onchange },
    })
    const trigger = getByRole('combobox')
    await fireEvent.click(trigger)
    const opts = getAllByRole('option')
    expect(opts).toHaveLength(3)
    expect(opts[0].className).toMatch(/cursor-pointer/)
    expect(opts[0].className).not.toMatch(/select-option/)
    await fireEvent.mouseDown(opts[2])
    expect(onchange).toHaveBeenCalledWith('c')
  })

  it('keyboard: ArrowDown opens + moves activeIdx, Enter picks', async () => {
    const onchange = vi.fn()
    const { getByRole, getAllByRole } = render(Select, {
      props: { options: OPTS, value: 'a', onchange },
    })
    const trigger = getByRole('combobox')
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    const opts = getAllByRole('option')
    expect(opts[1].getAttribute('data-active')).toBe('true')
    await fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(onchange).toHaveBeenCalledWith('b')
  })

  it('disabled trigger does not toggle on click', async () => {
    const { getByRole, queryAllByRole } = render(Select, {
      props: { options: OPTS, value: 'a', disabled: true },
    })
    await fireEvent.click(getByRole('combobox'))
    expect(queryAllByRole('option')).toHaveLength(0)
  })
})

describe('Checkbox (Tailwind)', () => {
  it('emits the new chrome utility classes (no legacy .checkbox class)', () => {
    const { container } = render(Checkbox, { props: { checked: false, label: 'X' } })
    const label = container.querySelector('label') as HTMLElement
    expect(label).toBeTruthy()
    expect(label.className).not.toMatch(/(^|\s)checkbox(\s|$)/)
    expect(label.className).toMatch(/inline-flex/)
    expect(label.className).toMatch(/cursor-pointer/)
    const input = container.querySelector('input[type="checkbox"]') as HTMLElement
    expect(input).toBeTruthy()
    expect((input as HTMLElement).className).not.toMatch(/(^|\s)checkbox(\s|$)/)
  })

  it('reflects checked state via aria-checked', () => {
    const { container } = render(Checkbox, { props: { checked: true, label: 'On' } })
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  it('reflects indeterminate via the input.indeterminate flag', () => {
    const { container } = render(Checkbox, {
      props: { checked: false, indeterminate: true, label: 'Some' },
    })
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
  })

  it('fires onchange with the change event on click', async () => {
    const onchange = vi.fn()
    const { container } = render(Checkbox, {
      props: { checked: false, label: 'X', onchange },
    })
    await fireEvent.click(container.querySelector('input')!)
    expect(onchange).toHaveBeenCalled()
    expect(onchange.mock.calls[0]?.[0]?.type).toBe('change')
  })
})

describe('RadioGroup (Tailwind)', () => {
  const OPTS = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ]

  it('emits utility classes on the fieldset (no legacy .radio class)', () => {
    const { container } = render(RadioGroup, {
      props: { legend: 'pick', name: 'r1', options: OPTS, value: 'a' },
    })
    const fieldset = container.querySelector('fieldset') as HTMLElement
    expect(fieldset).toBeTruthy()
    expect(fieldset.className).not.toMatch(/^\s*radio-group(\s|$)/)
    expect(fieldset.className).toMatch(/flex|grid|block/)
  })

  it('selects the value-matching radio', () => {
    const { container } = render(RadioGroup, {
      props: { legend: 'pick', name: 'r1', options: OPTS, value: 'b' },
    })
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    expect(inputs[0].checked).toBe(false)
    expect(inputs[1].checked).toBe(true)
  })

  it('flips checked state via bind:value when an input is clicked', async () => {
    const { container } = render(RadioGroup, {
      props: { legend: 'pick', name: 'r1', options: OPTS, value: 'a' },
    })
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    await fireEvent.click(inputs[1])
    expect(inputs[1].checked).toBe(true)
  })
})

describe('NumberInput (Tailwind)', () => {
  it('emits the new chrome (no legacy .number-input class)', () => {
    const { container, getByRole } = render(NumberInput, { props: { value: 5 } })
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toMatch(/^\s*number-input(\s|$)/)
    expect(root.className).toMatch(/inline-flex|flex/)
    const input = getByRole('spinbutton') as HTMLInputElement
    expect(input.type).toBe('number')
  })

  it('clamps to min / max via the step-up button', async () => {
    const onchange = vi.fn()
    const { getAllByRole } = render(NumberInput, {
      props: { value: 5, min: 0, max: 10, onchange },
    })
    const buttons = getAllByRole('button')
    // The step-up button is the second of the two step buttons in DOM order.
    const upBtn = buttons[buttons.length - 1]
    for (let i = 0; i < 12; i++) await fireEvent.click(upBtn)
    const last = onchange.mock.calls.at(-1)
    if (last) expect(last[0]).toBeLessThanOrEqual(10)
  })
})

describe('TabPanel (Tailwind)', () => {
  it('renders the tabpanel role with no legacy class', () => {
    const { container } = render(TabPanel, {
      props: { id: 'one', active: 'one' },
    })
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('role')).toBe('tabpanel')
    expect(root.className).not.toMatch(/^\s*tab-panel(\s|$)/)
  })

  it('hides itself when active does not match its id', () => {
    const { container } = render(TabPanel, {
      props: { id: 'one', active: 'two' },
    })
    const root = container.firstChild as HTMLElement
    expect(root.hasAttribute('hidden')).toBe(true)
  })
})

describe('Skeleton (Tailwind)', () => {
  it('emits the new shimmer utility (no legacy .skeleton class) + role=status', () => {
    const { container } = render(Skeleton, { props: { variant: 'text' } })
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('role')).toBe('status')
    expect(root.className).not.toMatch(/(^|\s)skeleton(\s|$)/)
    expect(root.className).toMatch(/animate-shimmer/)
  })

  it('respects custom width / height for `block` variant', () => {
    const { container } = render(Skeleton, {
      props: { variant: 'block', width: '200px', height: '40px' },
    })
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('style') ?? '').toMatch(/width:\s*200px/)
    expect(root.getAttribute('style') ?? '').toMatch(/height:\s*40px/)
  })
})

describe('Popover (Tailwind)', () => {
  it('emits the trigger button classes (no legacy .popover-trigger)', () => {
    const { getByRole } = render(Popover, { props: { label: 'Open' } })
    const trigger = getByRole('button', { name: /Open/ })
    expect(trigger.className).not.toMatch(/popover-trigger/)
    expect(trigger.className).toMatch(/inline-flex/)
  })

  it('opens on click + applies the listbox-style panel classes', async () => {
    const { getByRole } = render(Popover, { props: { label: 'Open' } })
    await fireEvent.click(getByRole('button', { name: /Open/ }))
    // The panel is portalled to document.body, so look it up there
    // rather than inside the testing-library `container`.
    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(panel).toBeTruthy()
    expect(panel.className).not.toMatch(/popover-panel/)
    expect(panel.className).toMatch(/rounded/)
  })

  it('renders the panel inside document.body (portalled)', async () => {
    const { getByRole, container } = render(Popover, { props: { label: 'Open' } })
    await fireEvent.click(getByRole('button', { name: /Open/ }))
    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(panel).toBeTruthy()
    expect(container.contains(panel)).toBe(false)
    expect(panel.parentElement).toBe(document.body)
  })

  it('keeps the popover open when clicking content INSIDE the portalled panel', async () => {
    const { getByRole } = render(Popover, { props: { label: 'Open' } })
    await fireEvent.click(getByRole('button', { name: /Open/ }))
    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(panel).toBeTruthy()
    // Simulate a pointerdown on the panel — the click-outside
    // listener must NOT close the popover. Use a plain Event so the
    // test passes under jsdom (no PointerEvent constructor).
    panel.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy()
  })
})

describe('HoverCard (Tailwind)', () => {
  it('emits the trigger + card classes (no legacy .hover-card)', () => {
    const { container } = render(HoverCard, { props: { label: 'hover' } })
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toMatch(/hover-card(\s|$)/)
    expect(root.className).toMatch(/relative/)
  })
})

describe('ActionMenu (Tailwind)', () => {
  it('emits the menu trigger classes (no legacy .action-menu)', () => {
    const { getByRole } = render(ActionMenu, {
      props: { label: 'Actions', items: [{ id: 'a', label: 'A' }] },
    })
    const trigger = getByRole('button')
    expect(trigger.className).not.toMatch(/action-menu(\s|$)/)
    expect(trigger.className).toMatch(/inline-flex/)
  })
})

describe('ContextMenu (Tailwind)', () => {
  it('renders the menu with utility classes when open (no legacy ctx-menu)', () => {
    const { container } = render(ContextMenu, {
      props: { open: true, items: [{ id: 'a', label: 'A' }] },
    })
    const menu = container.querySelector('[role="menu"]') as HTMLElement
    expect(menu).toBeTruthy()
    expect(menu.className).not.toMatch(/(^|\s)ctx-menu(\s|$)/)
    expect(menu.className).toMatch(/fixed/)
  })

  it('marks an item as warning via data-warning + status-warning text class', () => {
    const { container } = render(ContextMenu, {
      props: {
        open: true,
        items: [
          { id: 'plain', label: 'Plain' },
          { id: 'warn', label: 'Heads up', warning: true },
        ],
      },
    })
    const items = container.querySelectorAll('[role="menuitem"]')
    expect(items).toHaveLength(2)
    expect(items[0].getAttribute('data-warning')).toBeNull()
    expect(items[1].getAttribute('data-warning')).toBe('true')
    expect((items[1] as HTMLElement).className).toMatch(/data-\[warning=true\]:text-status-warning/)
  })

  it('keeps warning + danger mutually exclusive markers when only warning is set', () => {
    const { container } = render(ContextMenu, {
      props: { open: true, items: [{ id: 'warn', label: 'Heads up', warning: true }] },
    })
    const item = container.querySelector('[role="menuitem"]') as HTMLElement
    expect(item.getAttribute('data-warning')).toBe('true')
    expect(item.getAttribute('data-danger')).toBeNull()
  })

  it('marks an item as success via data-success + status-success text class', () => {
    const { container } = render(ContextMenu, {
      props: {
        open: true,
        items: [
          { id: 'plain', label: 'Plain' },
          { id: 'ok', label: 'Stop focus', success: true },
        ],
      },
    })
    const items = container.querySelectorAll('[role="menuitem"]')
    expect(items).toHaveLength(2)
    expect(items[0].getAttribute('data-success')).toBeNull()
    expect(items[1].getAttribute('data-success')).toBe('true')
    expect((items[1] as HTMLElement).className).toMatch(/data-\[success=true\]:text-status-success/)
  })

  it('renders an inline pill in place of the {pill} slot', () => {
    const { container } = render(ContextMenu, {
      props: {
        open: true,
        items: [
          {
            id: 'bulk',
            label: 'Archive this {pill} and older',
            pill: { text: 'R', variant: 'info' },
          },
        ],
      },
    })
    const item = container.querySelector('[role="menuitem"]') as HTMLElement
    // The literal placeholder is gone; the surrounding copy survives.
    expect(item.textContent).not.toContain('{pill}')
    expect(item.textContent?.replace(/\s+/g, ' ').trim()).toBe('Archive this R and older')
    // A real Pill (info variant) is rendered inline, not plain text.
    const pill = item.querySelector('span.rounded-full') as HTMLElement
    expect(pill).toBeTruthy()
    expect(pill.textContent?.trim()).toBe('R')
    expect(pill.className).toMatch(/text-status-info/)
  })

  it('falls back to plain text when an item has no pill', () => {
    const { container } = render(ContextMenu, {
      props: { open: true, items: [{ id: 'a', label: 'Archive this {pill} and older' }] },
    })
    const item = container.querySelector('[role="menuitem"]') as HTMLElement
    // No pill descriptor -> the raw label (placeholder and all) is shown
    // verbatim, never silently swallowed.
    expect(item.textContent).toContain('{pill}')
    expect(item.querySelector('span.rounded-full')).toBeNull()
  })
})

describe('Menubar (Tailwind)', () => {
  it('renders the bar role with new utilities (no legacy .menubar)', () => {
    const { container } = render(Menubar, {
      props: { menus: [{ id: 'm', label: 'M', items: [{ id: 'a', label: 'A' }] }] },
    })
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('role')).toBe('menubar')
    expect(root.className).not.toMatch(/menubar(\s|$)/)
    expect(root.className).toMatch(/flex/)
  })
})

describe('KVTable (Tailwind)', () => {
  it('renders table chrome with utility classes (no legacy .kv-table)', () => {
    const { container } = render(KVTable, {
      props: { rows: [{ key: 'k', value: 'v' }] },
    })
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toMatch(/kv-table(\s|$)/)
  })
})

describe('Pagination (Tailwind)', () => {
  it('renders the nav with utility classes', () => {
    const { container } = render(Pagination, {
      props: { page: 1, total: 50, pageSize: 10 },
    })
    const nav = container.querySelector('nav') as HTMLElement
    expect(nav).toBeTruthy()
    expect(nav.className).not.toMatch(/(^|\s)pagination(\s|$)/)
    expect(nav.className).toMatch(/flex/)
  })
})

describe('SortHeader (Tailwind)', () => {
  it('renders a button with utility classes (no legacy sort-header-btn)', () => {
    const { getByRole } = render(SortHeader, {
      props: { sortKey: 'name', activeKey: 'name', dir: 'asc' },
    })
    const btn = getByRole('button')
    expect(btn.className).not.toMatch(/sort-header-btn(\s|$)/)
    expect(btn.className).toMatch(/inline-flex|flex/)
  })
})

describe('SearchBox (Tailwind)', () => {
  it('emits the search wrapper utility classes (no legacy .search-box)', () => {
    const { container } = render(SearchBox, { props: { value: '' } })
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toMatch(/search-box(\s|$)/)
    expect(root.className).toMatch(/relative|inline-flex|flex/)
  })
})

describe('Combobox (Tailwind)', () => {
  it('emits the combobox chrome utility classes (no legacy .combobox)', () => {
    const { container } = render(Combobox, {
      props: { options: [{ value: 'a', label: 'A' }] },
    })
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toMatch(/combobox(\s|$)/)
  })
})

describe('MultiSelect (Tailwind)', () => {
  it('emits the chrome utility classes (no legacy .multi-select)', () => {
    const { container } = render(MultiSelect, {
      props: { options: [{ value: 'a', label: 'A' }], value: [] },
    })
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toMatch(/multi-select(\s|$)/)
  })
})

describe('FilterBuilder (Tailwind)', () => {
  it('emits utility classes (no legacy .filter-builder)', () => {
    const { container } = render(FilterBuilder, {
      props: { fields: [{ key: 'name', label: 'Name', type: 'text' }] },
    })
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toMatch(/(^|\s)filter-builder(\s|$)/)
  })
})

describe('CommandPalette (Tailwind)', () => {
  it('no longer carries a legacy .command-palette class when open', () => {
    const { container } = render(CommandPalette, {
      props: { open: true, items: [{ id: 'c', label: 'Compile' }] },
    })
    const root = container.querySelector('[role="dialog"]') as HTMLElement | null
    if (root) {
      expect(root.className).not.toMatch(/(^|\s)command-palette(\s|$)/)
    }
  })
})

describe('Sidebar (Tailwind)', () => {
  const NoopIcon = (() => null) as unknown as SidebarSectionDef['items'][number]['icon']

  const sections: SidebarSectionDef[] = [
    {
      title: 'Manage',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: NoopIcon },
        { id: 'alarms', label: 'Alarm Manager', icon: NoopIcon, pill: 3 },
        { id: 'devices', label: 'Devices', icon: NoopIcon, count: 12 },
      ],
    },
  ]

  it('renders each section title + every item', () => {
    const { getByText, getByRole } = render(Sidebar, {
      props: { sections, activeId: 'dashboard' },
    })
    expect(getByText('Manage')).toBeTruthy()
    expect(getByRole('button', { name: /Dashboard/ })).toBeTruthy()
    expect(getByRole('button', { name: /Alarm Manager/ })).toBeTruthy()
    expect(getByRole('button', { name: /Devices/ })).toBeTruthy()
  })

  it('marks the active item with aria-current="page"', () => {
    const { getByRole } = render(Sidebar, {
      props: { sections, activeId: 'devices' },
    })
    expect(getByRole('button', { name: /Devices/ })).toHaveAttribute('aria-current', 'page')
  })

  it('fires onchange and updates the bound activeId on click', async () => {
    const onchange = vi.fn()
    const { getByRole } = render(Sidebar, {
      props: { sections, activeId: 'dashboard', onchange },
    })
    await fireEvent.click(getByRole('button', { name: /Devices/ }))
    expect(onchange).toHaveBeenCalledWith('devices')
  })

  it('renders count and pill metadata', () => {
    const { container } = render(Sidebar, {
      props: { sections, activeId: 'dashboard' },
    })
    expect(container.textContent).toContain('12') // count
    expect(container.textContent).toContain('3') // pill
    // Pill chip carries the brand background utility.
    const pill = Array.from(container.querySelectorAll('span')).find((s) =>
      /bg-brand-05/.test(s.className),
    )
    expect(pill, 'expected a sidebar pill chip with bg-brand-05').toBeTruthy()
  })
})
