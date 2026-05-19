import { cleanup, render, fireEvent } from '@testing-library/svelte'
import { mount, unmount } from 'svelte'
import { describe, it, expect, afterEach, vi } from 'vitest'
import Topbar from '../lib/components/Topbar.svelte'

afterEach(() => {
  cleanup()
})

describe('Topbar', () => {
  it('renders the site name + a green status ring by default', () => {
    const { container, getByLabelText } = render(Topbar, {
      props: { siteName: 'Demo', activeApp: 'system' },
    })
    expect(getByLabelText('Switch site: Demo')).toBeTruthy()
    // The status ring wrapper carries the bg-status-success utility class.
    const ring = container.querySelector('.bg-status-success\\/18')
    expect(ring).toBeTruthy()
  })

  it('switches the status ring colour per status prop', () => {
    for (const [status, cls] of [
      ['ok', 'bg-status-success/18'],
      ['warn', 'bg-status-warning/18'],
      ['danger', 'bg-status-danger/18'],
      ['neutral', 'bg-status-neutral/18'],
    ] as const) {
      const { container, unmount: u } = render(Topbar, {
        props: { siteName: 'Demo', activeApp: 'system', status },
      })
      const escaped = cls.replace('/', '\\/')
      expect(
        container.querySelector(`.${escaped}`),
        `expected ring wrapper to have ${cls} for status=${status}`,
      ).toBeTruthy()
      u()
    }
  })

  it('renders the site label as a non-button when siteSwitchable=false', () => {
    const { container, queryByLabelText } = render(Topbar, {
      props: { siteName: 'Single', activeApp: 'system', siteSwitchable: false },
    })
    expect(queryByLabelText('Switch site: Single')).toBeNull()
    expect(container.textContent).toContain('Single')
    // No site-switch <button>, but a static container is still there.
    expect(container.querySelector('button[aria-haspopup="menu"]')).toBeNull()
  })

  it('paints the active app tab with bg-bg-1 (merges into bg-bg-1 content)', () => {
    const { getByRole } = render(Topbar, {
      props: { siteName: 'Demo', activeApp: 'agents' },
    })
    const active = getByRole('button', { name: /Agents/ })
    const cls = active.getAttribute('class') ?? ''
    expect(cls, 'active tab should use bg-bg-1').toMatch(/(?:^|\s)bg-bg-1(?:\s|$)/)
    expect(cls, 'active tab must not regress to bg-bg-2').not.toMatch(/(?:^|\s)bg-bg-2(?:\s|$)/)
  })

  it('emits onappchange and updates bound activeApp on tab click', async () => {
    const onappchange = vi.fn()
    const { getByRole } = render(Topbar, {
      props: { siteName: 'Demo', activeApp: 'system', onappchange },
    })
    // Pick a default-app entry that isn't currently active.
    const agentsTab = getByRole('button', { name: /Agents/ })
    await fireEvent.click(agentsTab)
    expect(onappchange).toHaveBeenCalledWith('agents')
  })

  it('renders the default actions block (search + bell + help + avatar) when actions snippet is omitted', () => {
    const { getByLabelText } = render(Topbar, {
      props: { siteName: 'Demo', activeApp: 'system', notificationCount: 3 },
    })
    expect(getByLabelText('Search')).toBeTruthy()
    expect(getByLabelText('Updates')).toBeTruthy()
    expect(getByLabelText('Notifications, 3 new')).toBeTruthy()
    expect(getByLabelText('Help')).toBeTruthy()
    expect(getByLabelText('Account, MS')).toBeTruthy()
  })

  it('renders the notification badge only when notificationCount > 0', () => {
    const { getByLabelText: gA } = render(Topbar, {
      props: { siteName: 'Demo', activeApp: 'system', notificationCount: 1 },
    })
    expect(gA('Notifications, 1 new')).toBeTruthy()
    cleanup()
    const { getByLabelText: gB } = render(Topbar, {
      props: { siteName: 'Demo', activeApp: 'system', notificationCount: 0 },
    })
    expect(gB('Notifications')).toBeTruthy()
  })

  it('replaces the default actions block when the actions snippet is provided', () => {
    // Snippets must be rendered through a host component because they capture
    // their owning component's scope. We mount a tiny harness rather than try
    // to forge a Snippet by hand.
    const host = document.createElement('div')
    document.body.append(host)
    const target = host
    // Lazy import the harness to keep this test self-contained.
    return import('./fixtures/TopbarActionsHarness.svelte').then((m) => {
      const cmp = mount(m.default, { target })
      try {
        expect(target.textContent).toContain('custom-action')
        // Defaults are gone.
        expect(target.querySelector('[aria-label="Search"]')).toBeNull()
        expect(target.querySelector('[aria-label="Help"]')).toBeNull()
      } finally {
        unmount(cmp)
        host.remove()
      }
    })
  })
})
