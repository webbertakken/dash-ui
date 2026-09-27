// Tooltip vs hover card: the canonical timings and WCAG 1.4.13 behaviour.
// Mirrors `packages/react/src/__tests__/overlays.test.tsx` case for case so
// the React, Svelte and Web Components builds stay behaviourally identical.

import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { overlay } from '@w5-ui/tokens'
import { tick } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HoverCardHarness from './fixtures/HoverCardHarness.svelte'
import TooltipHarness from './fixtures/TooltipHarness.svelte'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

async function advance(ms: number) {
  vi.advanceTimersByTime(ms)
  await tick()
}

async function focus(el: HTMLElement) {
  el.focus()
  await tick()
}

async function blur(el: HTMLElement) {
  el.blur()
  await tick()
}

async function renderTooltip(props: Record<string, unknown> = {}) {
  render(TooltipHarness, { props })
  await tick()
  const tooltip = screen.getByRole('tooltip', { hidden: true })
  const wrapper = tooltip.parentElement as HTMLElement
  const button = screen.getAllByRole('button')[0]!
  const isOpen = () => wrapper.getAttribute('data-state') === 'open'
  return { tooltip, wrapper, button, isOpen }
}

describe('Tooltip', () => {
  it('names an icon-only control after its label', async () => {
    const { button } = await renderTooltip()
    expect(button).toHaveAccessibleName('Zoom in')
  })

  it('keeps the control’s own name', async () => {
    const { button } = await renderTooltip({ label: 'Save', variant: 'text' })
    expect(button).not.toHaveAttribute('aria-label')
    expect(button).toHaveAccessibleName('Save')
  })

  it('is not wired as a description (the tooltip is the name)', async () => {
    const { button, wrapper } = await renderTooltip()
    expect(button).not.toHaveAttribute('aria-describedby')
    expect(wrapper.querySelector('[aria-describedby]')).toBeNull()
  })

  it('starts closed', async () => {
    const { isOpen } = await renderTooltip()
    expect(isOpen()).toBe(false)
  })

  it('opens after 1 s of hover', async () => {
    const { wrapper, isOpen } = await renderTooltip()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await advance(overlay.tooltipOpenDelayMs - 1)
    expect(isOpen()).toBe(false)
    await advance(1)
    expect(isOpen()).toBe(true)
  })

  it('honours a custom hover delay', async () => {
    const { wrapper, isOpen } = await renderTooltip({ delay: 200 })
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await advance(200)
    expect(isOpen()).toBe(true)
  })

  it('opens instantly on keyboard focus and closes on blur', async () => {
    const { button, isOpen } = await renderTooltip()
    await focus(button)
    expect(isOpen()).toBe(true)
    await blur(button)
    expect(isOpen()).toBe(false)
  })

  it('stays open while the pointer moves onto the bubble (hoverable)', async () => {
    const { wrapper, tooltip, isOpen } = await renderTooltip()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await advance(overlay.tooltipOpenDelayMs)
    await fireEvent.pointerLeave(wrapper, { pointerType: 'mouse' })
    await fireEvent.pointerEnter(tooltip, { pointerType: 'mouse' })
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await advance(overlay.closeGraceMs * 2)
    expect(isOpen()).toBe(true)
  })

  it('closes after the pointer leaves', async () => {
    const { wrapper, isOpen } = await renderTooltip()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await advance(overlay.tooltipOpenDelayMs)
    await fireEvent.pointerLeave(wrapper, { pointerType: 'mouse' })
    await advance(overlay.closeGraceMs)
    expect(isOpen()).toBe(false)
  })

  it('is dismissed with Escape', async () => {
    const { button, isOpen } = await renderTooltip()
    await focus(button)
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(isOpen()).toBe(false)
  })

  it('ignores other keys', async () => {
    const { button, isOpen } = await renderTooltip()
    await focus(button)
    await fireEvent.keyDown(document, { key: 'Enter' })
    expect(isOpen()).toBe(true)
  })

  it('closes when the control is pressed', async () => {
    const { wrapper, button, isOpen } = await renderTooltip()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await advance(overlay.tooltipOpenDelayMs)
    await fireEvent.pointerDown(button, { pointerType: 'mouse' })
    expect(isOpen()).toBe(false)
  })

  it('opens on touch long-press and lingers briefly after release', async () => {
    const { button, isOpen } = await renderTooltip()
    await fireEvent.pointerDown(button, { pointerType: 'touch' })
    await advance(overlay.longPressMs)
    expect(isOpen()).toBe(true)
    await fireEvent.pointerUp(button, { pointerType: 'touch' })
    await advance(overlay.touchDismissMs)
    expect(isOpen()).toBe(false)
  })

  it('treats a cancelled touch as a release', async () => {
    const { button, isOpen } = await renderTooltip()
    await fireEvent.pointerDown(button, { pointerType: 'touch' })
    await fireEvent.pointerCancel(button, { pointerType: 'touch' })
    await advance(overlay.longPressMs)
    expect(isOpen()).toBe(false)
  })

  it('stays open when focus moves within the trigger', async () => {
    const { wrapper, isOpen } = await renderTooltip({ label: 'Pair', variant: 'pair' })
    const [a, b] = Array.from(wrapper.querySelectorAll('button'))
    await focus(a!)
    await focus(b!)
    expect(isOpen()).toBe(true)
  })

  it('renders every placement', async () => {
    for (const placement of ['top', 'bottom', 'left', 'right'] as const) {
      const { unmount } = render(TooltipHarness, { props: { placement } })
      const wrapper = screen.getByRole('tooltip', { hidden: true }).parentElement!
      expect(wrapper).toHaveAttribute('data-placement', placement)
      expect(wrapper).toHaveClass('extra')
      unmount()
    }
  })
})

async function renderHoverCard(props: Record<string, unknown> = {}) {
  render(HoverCardHarness, { props })
  await tick()
  const link = screen.getByRole('link')
  const wrapper = link.closest('[data-state]') as HTMLElement
  const card = wrapper.querySelector('[data-hovercard]') as HTMLElement
  const isOpen = () => wrapper.getAttribute('data-state') === 'open'
  return { link, wrapper, card, isOpen }
}

describe('HoverCard', () => {
  it('opens instantly on hover', async () => {
    const { wrapper, isOpen } = await renderHoverCard()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    expect(isOpen()).toBe(true)
  })

  it('opens instantly on keyboard focus and describes the trigger while open', async () => {
    const { link, card, isOpen } = await renderHoverCard()
    expect(link.parentElement).not.toHaveAttribute('aria-describedby')
    await focus(link)
    expect(isOpen()).toBe(true)
    expect(link.parentElement).toHaveAttribute('aria-describedby', card.id)
  })

  it('renders a bold heading and a description', async () => {
    const { card } = await renderHoverCard()
    expect(card.querySelector('[data-hovercard-title]')).toHaveTextContent('gw-hq')
    expect(card.querySelector('[data-hovercard-title]')).toHaveClass('font-semibold')
    expect(card.querySelector('[data-hovercard-description]')).toHaveTextContent(
      'Gateway, 99.98% uptime',
    )
  })

  it('renders rich content after the heading', async () => {
    const { card } = await renderHoverCard({ rich: true })
    expect(card.querySelector('[data-hovercard-description]')).toBeNull()
    expect(card.querySelector('em')).toHaveTextContent('preview')
  })

  it('still accepts the trigger snippet', async () => {
    const { wrapper, isOpen } = await renderHoverCard({ useTriggerSnippet: true })
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    expect(isOpen()).toBe(true)
  })

  it('does not claim the tooltip role', async () => {
    const { card } = await renderHoverCard()
    expect(card).not.toHaveAttribute('role', 'tooltip')
  })

  it('stays open while the pointer crosses onto the card', async () => {
    const { wrapper, card, isOpen } = await renderHoverCard()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await fireEvent.pointerLeave(wrapper, { pointerType: 'mouse' })
    await fireEvent.pointerEnter(card, { pointerType: 'mouse' })
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await advance(overlay.closeGraceMs * 2)
    expect(isOpen()).toBe(true)
  })

  it('stays open when its content is pressed', async () => {
    const { wrapper, card, isOpen } = await renderHoverCard()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await fireEvent.pointerDown(card, { pointerType: 'mouse' })
    expect(isOpen()).toBe(true)
  })

  it('is dismissed with Escape', async () => {
    const { wrapper, isOpen } = await renderHoverCard()
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(isOpen()).toBe(false)
  })

  it('ignores touch', async () => {
    const { link, isOpen } = await renderHoverCard()
    await fireEvent.pointerDown(link, { pointerType: 'touch' })
    await advance(overlay.longPressMs * 2)
    expect(isOpen()).toBe(false)
  })

  it('honours an explicit hover delay', async () => {
    const { wrapper, isOpen } = await renderHoverCard({ delay: 300 })
    await fireEvent.pointerEnter(wrapper, { pointerType: 'mouse' })
    expect(isOpen()).toBe(false)
    await advance(300)
    expect(isOpen()).toBe(true)
  })
})
