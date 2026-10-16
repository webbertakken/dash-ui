// Tooltip vs hover card on the Web Components build: the same timings and
// WCAG 1.4.13 behaviour as `packages/react/src/__tests__/overlays.test.tsx`
// and `packages/svelte/src/__tests__/overlays.test.ts`, exercised through the
// real `uni-tooltip` / `uni-hover-card` custom elements from the built bundle.

import { overlay } from '@w5-ui/tokens'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

beforeAll(async () => {
  await import('../../dist/index.js')
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

/** Svelte custom elements mount and update on microtasks. */
async function flush() {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

async function advance(ms: number) {
  vi.advanceTimersByTime(ms)
  await flush()
}

function pointer(el: Element, type: string, pointerType: string) {
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true, pointerType }))
}

async function mount(html: string) {
  document.body.innerHTML = html
  await flush()
  vi.useFakeTimers()
  const host = document.body.firstElementChild as HTMLElement
  const root = host.shadowRoot!
  const wrapper = root.querySelector('[data-state]') as HTMLElement
  const isOpen = () => wrapper.getAttribute('data-state') === 'open'
  return { host, root, wrapper, isOpen }
}

describe('uni-tooltip', () => {
  const html =
    '<uni-tooltip label="Zoom in"><button type="button"><svg></svg></button></uni-tooltip>'

  it('names a slotted icon-only control after its label', async () => {
    const { host } = await mount(html)
    expect(host.querySelector('button')).toHaveAttribute('aria-label', 'Zoom in')
  })

  it('opens after 1 s of hover', async () => {
    const { wrapper, isOpen } = await mount(html)
    pointer(wrapper, 'pointerenter', 'mouse')
    await advance(overlay.tooltipOpenDelayMs - 1)
    expect(isOpen()).toBe(false)
    await advance(1)
    expect(isOpen()).toBe(true)
  })

  it('opens instantly on keyboard focus and closes on blur', async () => {
    const { host, isOpen } = await mount(html)
    host.querySelector('button')!.focus()
    await flush()
    expect(isOpen()).toBe(true)
    host.querySelector('button')!.blur()
    await flush()
    expect(isOpen()).toBe(false)
  })

  it('is dismissed with Escape', async () => {
    const { host, isOpen } = await mount(html)
    host.querySelector('button')!.focus()
    await flush()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flush()
    expect(isOpen()).toBe(false)
  })

  it('opens on touch long-press', async () => {
    const { host, isOpen } = await mount(html)
    pointer(host.querySelector('button')!, 'pointerdown', 'touch')
    await advance(overlay.longPressMs)
    expect(isOpen()).toBe(true)
  })

  it('honours the delay attribute', async () => {
    const { wrapper, isOpen } = await mount(
      '<uni-tooltip label="Zoom in" delay="200"><button type="button">+</button></uni-tooltip>',
    )
    pointer(wrapper, 'pointerenter', 'mouse')
    await advance(200)
    expect(isOpen()).toBe(true)
  })
})

describe('uni-hover-card', () => {
  const html =
    '<uni-hover-card heading="gw-hq" description="Gateway, 99.98% uptime"><a href="#gw">gw-hq</a></uni-hover-card>'

  it('renders the slotted trigger with a heading and description', async () => {
    const { root } = await mount(html)
    expect(root.querySelector('slot')).not.toBeNull()
    expect(root.querySelector('[data-hovercard-title]')).toHaveTextContent('gw-hq')
    expect(root.querySelector('[data-hovercard-description]')).toHaveTextContent(
      'Gateway, 99.98% uptime',
    )
  })

  it('opens instantly on hover', async () => {
    const { wrapper, isOpen } = await mount(html)
    pointer(wrapper, 'pointerenter', 'mouse')
    await flush()
    expect(isOpen()).toBe(true)
  })

  it('opens instantly on keyboard focus', async () => {
    const { host, isOpen } = await mount(html)
    host.querySelector('a')!.focus()
    await flush()
    expect(isOpen()).toBe(true)
  })

  it('is dismissed with Escape', async () => {
    const { wrapper, isOpen } = await mount(html)
    pointer(wrapper, 'pointerenter', 'mouse')
    await flush()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flush()
    expect(isOpen()).toBe(false)
  })
})
