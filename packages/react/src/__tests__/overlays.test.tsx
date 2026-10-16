// Tooltip vs hover card: the canonical timings and WCAG 1.4.13 behaviour.
// The Svelte (`packages/svelte/src/__tests__/overlays.test.ts`) and Web
// Components (`packages/wc/src/__tests__/overlays.test.ts`) suites assert the
// same cases, so the three builds stay behaviourally identical.

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { overlay } from '@w5-ui/tokens'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as U from '../index.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

function renderTooltip(props: Partial<U.TooltipProps> = {}) {
  render(
    <U.Tooltip label="Zoom in" {...props}>
      <U.IconButton>
        <U.PlusIcon />
      </U.IconButton>
    </U.Tooltip>,
  )
  const tooltip = screen.getByRole('tooltip', { hidden: true })
  const wrapper = tooltip.parentElement as HTMLElement
  const button = screen.getByRole('button')
  const isOpen = () => wrapper.getAttribute('data-state') === 'open'
  return { tooltip, wrapper, button, isOpen }
}

describe('Tooltip', () => {
  it('names an icon-only control after its label', () => {
    const { button } = renderTooltip()
    expect(button).toHaveAccessibleName('Zoom in')
  })

  it('keeps the control’s own name', () => {
    render(
      <U.Tooltip label="Save">
        <button type="button">Save</button>
      </U.Tooltip>,
    )
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-label')
    expect(screen.getByRole('button')).toHaveAccessibleName('Save')
  })

  it('is not wired as a description (the tooltip is the name)', () => {
    const { button, wrapper } = renderTooltip()
    expect(button).not.toHaveAttribute('aria-describedby')
    expect(wrapper.querySelector('[aria-describedby]')).toBeNull()
  })

  it('starts closed', () => {
    const { isOpen } = renderTooltip()
    expect(isOpen()).toBe(false)
  })

  it('opens after 1 s of hover', () => {
    const { wrapper, isOpen } = renderTooltip()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    advance(overlay.tooltipOpenDelayMs - 1)
    expect(isOpen()).toBe(false)
    advance(1)
    expect(isOpen()).toBe(true)
  })

  it('honours a custom hover delay', () => {
    const { wrapper, isOpen } = renderTooltip({ delay: 200 })
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    advance(200)
    expect(isOpen()).toBe(true)
  })

  it('opens instantly on keyboard focus and closes on blur', () => {
    const { button, isOpen } = renderTooltip()
    act(() => button.focus())
    expect(isOpen()).toBe(true)
    act(() => button.blur())
    expect(isOpen()).toBe(false)
  })

  it('stays open while the pointer moves onto the bubble (hoverable)', () => {
    const { wrapper, tooltip, isOpen } = renderTooltip()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    advance(overlay.tooltipOpenDelayMs)
    fireEvent.pointerLeave(wrapper, { pointerType: 'mouse' })
    fireEvent.pointerEnter(tooltip, { pointerType: 'mouse' })
    advance(overlay.closeGraceMs * 2)
    expect(isOpen()).toBe(true)
  })

  it('closes after the pointer leaves', () => {
    const { wrapper, isOpen } = renderTooltip()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    advance(overlay.tooltipOpenDelayMs)
    fireEvent.pointerLeave(wrapper, { pointerType: 'mouse' })
    advance(overlay.closeGraceMs)
    expect(isOpen()).toBe(false)
  })

  it('is dismissed with Escape', () => {
    const { button, isOpen } = renderTooltip()
    act(() => button.focus())
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(isOpen()).toBe(false)
  })

  it('ignores other keys', () => {
    const { button, isOpen } = renderTooltip()
    act(() => button.focus())
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(isOpen()).toBe(true)
  })

  it('closes when the control is pressed', () => {
    const { wrapper, button, isOpen } = renderTooltip()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    advance(overlay.tooltipOpenDelayMs)
    fireEvent.pointerDown(button, { pointerType: 'mouse' })
    expect(isOpen()).toBe(false)
  })

  it('opens on touch long-press and lingers briefly after release', () => {
    const { button, isOpen } = renderTooltip()
    fireEvent.pointerDown(button, { pointerType: 'touch' })
    advance(overlay.longPressMs)
    expect(isOpen()).toBe(true)
    fireEvent.pointerUp(button, { pointerType: 'touch' })
    advance(overlay.touchDismissMs)
    expect(isOpen()).toBe(false)
  })

  it('treats a cancelled touch as a release', () => {
    const { button, isOpen } = renderTooltip()
    fireEvent.pointerDown(button, { pointerType: 'touch' })
    fireEvent.pointerCancel(button, { pointerType: 'touch' })
    advance(overlay.longPressMs)
    expect(isOpen()).toBe(false)
  })

  it('stays open when focus moves within the trigger', () => {
    render(
      <U.Tooltip label="Pair">
        <span>
          <button type="button">A</button>
          <button type="button">B</button>
        </span>
      </U.Tooltip>,
    )
    const [a, b] = screen.getAllByRole('button')
    const wrapper = screen.getByRole('tooltip', { hidden: true }).parentElement!
    act(() => a!.focus())
    act(() => b!.focus())
    expect(wrapper).toHaveAttribute('data-state', 'open')
  })

  it('renders every placement', () => {
    for (const placement of ['top', 'bottom', 'left', 'right'] as const) {
      const { container, unmount } = render(
        <U.Tooltip label="t" placement={placement} className="extra">
          x
        </U.Tooltip>,
      )
      expect(container.firstElementChild).toHaveClass(`tooltip-${placement}`, 'extra')
      unmount()
    }
  })
})

function renderHoverCard(props: Partial<U.HoverCardProps> = {}) {
  render(
    <U.HoverCard heading="gw-hq" description="Gateway, 99.98% uptime" {...props}>
      <a href="#gw">gw-hq</a>
    </U.HoverCard>,
  )
  const link = screen.getByRole('link')
  const wrapper = link.closest('.hovercard-wrapper') as HTMLElement
  const card = wrapper.querySelector('.hovercard') as HTMLElement
  const isOpen = () => wrapper.getAttribute('data-state') === 'open'
  return { link, wrapper, card, isOpen }
}

describe('HoverCard', () => {
  it('opens instantly on hover', () => {
    const { wrapper, isOpen } = renderHoverCard()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    expect(isOpen()).toBe(true)
  })

  it('opens instantly on keyboard focus and describes the trigger while open', () => {
    const { link, card, isOpen } = renderHoverCard()
    expect(link.parentElement).not.toHaveAttribute('aria-describedby')
    act(() => link.focus())
    expect(isOpen()).toBe(true)
    expect(link.parentElement).toHaveAttribute('aria-describedby', card.id)
  })

  it('renders a bold heading and a description', () => {
    const { card } = renderHoverCard()
    expect(card.querySelector('.hovercard-title')).toHaveTextContent('gw-hq')
    expect(card.querySelector('.hovercard-description')).toHaveTextContent('Gateway, 99.98% uptime')
  })

  it('renders rich content after the heading', () => {
    const { card } = renderHoverCard({ description: undefined, content: <em>preview</em> })
    expect(card.querySelector('.hovercard-description')).toBeNull()
    expect(card.querySelector('em')).toHaveTextContent('preview')
  })

  it('does not claim the tooltip role', () => {
    const { card } = renderHoverCard()
    expect(card).not.toHaveAttribute('role', 'tooltip')
  })

  it('stays open while the pointer crosses onto the card', () => {
    const { wrapper, card, isOpen } = renderHoverCard()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    fireEvent.pointerLeave(wrapper, { pointerType: 'mouse' })
    fireEvent.pointerEnter(card, { pointerType: 'mouse' })
    advance(overlay.closeGraceMs * 2)
    expect(isOpen()).toBe(true)
  })

  it('stays open when its content is pressed', () => {
    const { wrapper, card, isOpen } = renderHoverCard()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    fireEvent.pointerDown(card, { pointerType: 'mouse' })
    expect(isOpen()).toBe(true)
  })

  it('is dismissed with Escape', () => {
    const { wrapper, isOpen } = renderHoverCard()
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(isOpen()).toBe(false)
  })

  it('ignores touch', () => {
    const { link, isOpen } = renderHoverCard()
    fireEvent.pointerDown(link, { pointerType: 'touch' })
    advance(overlay.longPressMs * 2)
    expect(isOpen()).toBe(false)
  })

  it('honours an explicit hover delay', () => {
    const { wrapper, isOpen } = renderHoverCard({ delay: 300 })
    fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    expect(isOpen()).toBe(false)
    advance(300)
    expect(isOpen()).toBe(true)
  })
})
