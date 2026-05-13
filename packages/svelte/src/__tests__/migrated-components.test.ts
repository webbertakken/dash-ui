/**
 * Tailwind-migration regression tests for the components moved off
 * dashboard.css in dash-ui PR #N. Each test asserts the new utility
 * class strings (which is what the consumer's Tailwind compiler picks
 * up) plus the component's documented public-API behaviour.
 */
import { cleanup, render, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, afterEach, vi } from 'vitest'
import Avatar from '../lib/components/Avatar.svelte'
import AvatarGroup from '../lib/components/AvatarGroup.svelte'
import IconButton from '../lib/components/IconButton.svelte'
import Pill from '../lib/components/Pill.svelte'
import Sidebar, { type SidebarSectionDef } from '../lib/components/Sidebar.svelte'

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
      ['neutral', 'bg-white'],
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
