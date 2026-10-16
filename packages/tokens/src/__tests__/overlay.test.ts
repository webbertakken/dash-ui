import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createOverlayTrigger,
  ensureAccessibleName,
  isFocusVisible,
  overlay,
  type OverlayTriggerOptions,
} from '../tokens.js'

function setup(options: Partial<OverlayTriggerOptions> = {}) {
  const changes: boolean[] = []
  const trigger = createOverlayTrigger({
    openDelayMs: overlay.tooltipOpenDelayMs,
    closeOnPress: true,
    longPressMs: overlay.longPressMs,
    onOpenChange: (open) => changes.push(open),
    ...options,
  })
  return { trigger, changes }
}

describe('overlay timing tokens', () => {
  it('encodes the canonical tooltip, hover card and transition timings', () => {
    expect(overlay).toEqual({
      tooltipOpenDelayMs: 1000,
      hoverCardOpenDelayMs: 0,
      closeGraceMs: 100,
      longPressMs: 500,
      touchDismissMs: 1500,
      fadeMs: 150,
    })
  })
})

describe('createOverlayTrigger', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('tooltip timing (1 s hover, instant keyboard focus)', () => {
    it('opens only after the full hover delay', () => {
      const { trigger, changes } = setup()
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(999)
      expect(trigger.open).toBe(false)
      vi.advanceTimersByTime(1)
      expect(trigger.open).toBe(true)
      expect(changes).toEqual([true])
    })

    it('treats an unknown pointer type as a mouse', () => {
      const { trigger } = setup()
      trigger.pointerEnter(undefined)
      vi.advanceTimersByTime(1000)
      expect(trigger.open).toBe(true)
    })

    it('cancels the pending open when the pointer leaves early', () => {
      const { trigger, changes } = setup()
      trigger.pointerEnter('pen')
      vi.advanceTimersByTime(600)
      trigger.pointerLeave('pen')
      vi.advanceTimersByTime(2000)
      expect(trigger.open).toBe(false)
      expect(changes).toEqual([])
    })

    it('opens instantly on keyboard focus', () => {
      const { trigger } = setup()
      trigger.focus(true)
      expect(trigger.open).toBe(true)
    })

    it('does not open instantly on pointer-initiated focus', () => {
      const { trigger } = setup()
      trigger.focus(false)
      expect(trigger.open).toBe(false)
    })

    it('closes on blur when the pointer is elsewhere', () => {
      const { trigger, changes } = setup()
      trigger.focus(true)
      trigger.blur()
      expect(trigger.open).toBe(false)
      expect(changes).toEqual([true, false])
    })

    it('stays open on blur while the pointer still hovers', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      trigger.focus(true)
      trigger.blur()
      expect(trigger.open).toBe(true)
    })

    it('adopts a new hover delay', () => {
      const { trigger } = setup()
      trigger.setOpenDelay(200)
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(200)
      expect(trigger.open).toBe(true)
    })
  })

  describe('WCAG 1.4.13: hoverable, dismissible, persistent', () => {
    it('stays open while the pointer crosses the gap onto the surface', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      trigger.pointerLeave('mouse')
      vi.advanceTimersByTime(overlay.closeGraceMs - 1)
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(overlay.closeGraceMs * 2)
      expect(trigger.open).toBe(true)
    })

    it('closes once the grace period after leaving has passed', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      trigger.pointerLeave('mouse')
      vi.advanceTimersByTime(overlay.closeGraceMs)
      expect(trigger.open).toBe(false)
    })

    it('closes immediately on leave when the grace is zero', () => {
      const { trigger } = setup({ closeGraceMs: 0 })
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      trigger.pointerLeave('mouse')
      expect(trigger.open).toBe(false)
    })

    it('stays open after the pointer leaves while keyboard focus remains', () => {
      const { trigger } = setup()
      trigger.focus(true)
      trigger.pointerEnter('mouse')
      trigger.pointerLeave('mouse')
      vi.advanceTimersByTime(overlay.closeGraceMs)
      expect(trigger.open).toBe(true)
    })

    it('dismisses on Escape without moving the pointer or focus', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      expect(trigger.escape()).toBe(true)
      expect(trigger.open).toBe(false)
    })

    it('stays dismissed while still hovered, until the pointer leaves and returns', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      trigger.escape()
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      expect(trigger.open).toBe(false)
      trigger.pointerLeave('mouse')
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      expect(trigger.open).toBe(true)
    })

    it('stays dismissed while still focused, until focus leaves and returns', () => {
      const { trigger } = setup()
      trigger.focus(true)
      trigger.escape()
      trigger.focus(true)
      expect(trigger.open).toBe(false)
      trigger.blur()
      trigger.focus(true)
      expect(trigger.open).toBe(true)
    })

    it('cancels a pending open on Escape and reports nothing was open', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      expect(trigger.escape()).toBe(false)
      vi.advanceTimersByTime(1000)
      expect(trigger.open).toBe(false)
    })
  })

  describe('pressing the trigger', () => {
    it('closes a tooltip and keeps it closed until the pointer leaves', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      vi.advanceTimersByTime(1000)
      trigger.pointerDown('mouse')
      expect(trigger.open).toBe(false)
      vi.advanceTimersByTime(2000)
      expect(trigger.open).toBe(false)
    })

    it('cancels a pending tooltip open', () => {
      const { trigger } = setup()
      trigger.pointerEnter('mouse')
      trigger.pointerDown('mouse')
      vi.advanceTimersByTime(2000)
      expect(trigger.open).toBe(false)
    })

    it('leaves a hover card open', () => {
      const { trigger } = setup({ openDelayMs: 0, closeOnPress: false })
      trigger.pointerEnter('mouse')
      trigger.pointerDown('mouse')
      expect(trigger.open).toBe(true)
    })
  })

  describe('touch', () => {
    it('ignores touch hover emulation', () => {
      const { trigger } = setup()
      trigger.pointerEnter('touch')
      vi.advanceTimersByTime(2000)
      trigger.pointerLeave('touch')
      expect(trigger.open).toBe(false)
    })

    it('opens a tooltip on long-press', () => {
      const { trigger } = setup()
      trigger.pointerDown('touch')
      vi.advanceTimersByTime(overlay.longPressMs - 1)
      expect(trigger.open).toBe(false)
      vi.advanceTimersByTime(1)
      expect(trigger.open).toBe(true)
    })

    it('does not open on a short tap', () => {
      const { trigger } = setup()
      trigger.pointerDown('touch')
      vi.advanceTimersByTime(200)
      trigger.pointerUp('touch')
      vi.advanceTimersByTime(2000)
      expect(trigger.open).toBe(false)
    })

    it('dismisses a long-press tooltip a moment after release', () => {
      const { trigger } = setup()
      trigger.pointerDown('touch')
      vi.advanceTimersByTime(overlay.longPressMs)
      trigger.pointerUp('touch')
      vi.advanceTimersByTime(overlay.touchDismissMs - 1)
      expect(trigger.open).toBe(true)
      vi.advanceTimersByTime(1)
      expect(trigger.open).toBe(false)
    })

    it('ignores mouse release', () => {
      const { trigger } = setup()
      trigger.focus(true)
      trigger.pointerUp('mouse')
      vi.advanceTimersByTime(5000)
      expect(trigger.open).toBe(true)
    })

    it('never long-presses when long-press is disabled', () => {
      const { trigger } = setup({ longPressMs: null })
      trigger.pointerDown('touch')
      vi.advanceTimersByTime(5000)
      expect(trigger.open).toBe(false)
    })
  })

  describe('hover card timing (instant hover and focus)', () => {
    it('opens synchronously on hover', () => {
      const { trigger } = setup({ openDelayMs: overlay.hoverCardOpenDelayMs, closeOnPress: false })
      trigger.pointerEnter('mouse')
      expect(trigger.open).toBe(true)
    })
  })

  it('reports each change once', () => {
    const { trigger, changes } = setup({ openDelayMs: 0 })
    trigger.pointerEnter('mouse')
    trigger.pointerEnter('mouse')
    trigger.focus(true)
    expect(changes).toEqual([true])
  })

  it('clears pending timers on destroy', () => {
    const { trigger, changes } = setup()
    trigger.pointerEnter('mouse')
    trigger.destroy()
    vi.advanceTimersByTime(5000)
    expect(changes).toEqual([])
  })
})

describe('isFocusVisible', () => {
  it('reports true when the element matches :focus-visible', () => {
    const el = { matches: (s: string) => s === ':focus-visible' } as unknown as Element
    expect(isFocusVisible(el)).toBe(true)
  })

  it('reports false when the element does not match', () => {
    const el = { matches: () => false } as unknown as Element
    expect(isFocusVisible(el)).toBe(false)
  })

  it('falls back to true when the engine cannot evaluate :focus-visible', () => {
    const el = {
      matches: () => {
        throw new SyntaxError('unsupported')
      },
    } as unknown as Element
    expect(isFocusVisible(el)).toBe(true)
  })

  it('reports false for non-element targets', () => {
    expect(isFocusVisible(null)).toBe(false)
  })
})

describe('ensureAccessibleName', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  function mount(html: string): HTMLElement {
    const root = document.createElement('span')
    root.innerHTML = html
    document.body.append(root)
    return root
  }

  it('names an icon-only control after the tooltip', () => {
    const root = mount('<button><svg></svg></button>')
    ensureAccessibleName(root, 'Zoom in')
    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Zoom in')
  })

  it('finds a nested control', () => {
    const root = mount('<span><a href="#x"><svg></svg></a></span>')
    ensureAccessibleName(root, 'Open')
    expect(root.querySelector('a')?.getAttribute('aria-label')).toBe('Open')
  })

  it('keeps an existing aria-label', () => {
    const root = mount('<button aria-label="Mine"><svg></svg></button>')
    ensureAccessibleName(root, 'Zoom in')
    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Mine')
  })

  it('keeps an existing aria-labelledby', () => {
    const root = mount('<button aria-labelledby="n"><svg></svg></button>')
    ensureAccessibleName(root, 'Zoom in')
    expect(root.querySelector('button')?.hasAttribute('aria-label')).toBe(false)
  })

  it('leaves visible text as the name', () => {
    const root = mount('<button>Save</button>')
    ensureAccessibleName(root, 'Save')
    expect(root.querySelector('button')?.hasAttribute('aria-label')).toBe(false)
  })

  it('updates a label it set itself when the tooltip changes', () => {
    const root = mount('<button><svg></svg></button>')
    ensureAccessibleName(root, 'Map view')
    ensureAccessibleName(root, 'List view')
    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('List view')
  })

  it('ignores non-interactive content', () => {
    const root = mount('<span><svg></svg></span>')
    ensureAccessibleName(root, 'Icon')
    expect(root.querySelector('span')?.hasAttribute('aria-label')).toBe(false)
  })

  it('looks through a slot into its assigned elements', () => {
    const host = document.createElement('div')
    document.body.append(host)
    host.innerHTML = '<button><svg></svg></button>'
    const shadow = host.attachShadow({ mode: 'open' })
    shadow.innerHTML = '<span><slot></slot></span>'
    ensureAccessibleName(shadow.querySelector('span')!, 'Help')
    expect(host.querySelector('button')?.getAttribute('aria-label')).toBe('Help')
  })

  it('reaches into a slotted custom element’s open shadow root', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const iconButton = document.createElement('x-icon-button')
    host.append(iconButton)
    iconButton.attachShadow({ mode: 'open' }).innerHTML = '<button><svg></svg></button>'
    const shadow = host.attachShadow({ mode: 'open' })
    shadow.innerHTML = '<span><slot></slot></span>'
    ensureAccessibleName(shadow.querySelector('span')!, 'Zoom in')
    expect(iconButton.shadowRoot!.querySelector('button')?.getAttribute('aria-label')).toBe(
      'Zoom in',
    )
  })

  it('tolerates a missing root', () => {
    expect(() => ensureAccessibleName(null, 'x')).not.toThrow()
  })
})
