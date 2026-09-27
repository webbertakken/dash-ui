// The built bundle styles every uni-* shadow root with the compiled Tailwind
// output of the @w5-ui/svelte sources (jsdom takes the <style> fallback).

import { beforeAll, describe, expect, it } from 'vitest'
import manifest from '../manifest.json'

beforeAll(async () => {
  await import('../../dist/index.js')
})

async function flush() {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

/** The at-rule preludes enclosing `index` in `css`, outermost first. */
function enclosingBlocks(css: string, index: number): string[] {
  const stack: string[] = []
  let start = 0
  for (let i = 0; i < index; i++) {
    if (css[i] === '{') stack.push(css.slice(start, i).trim().split(/[;}]/).pop()!.trim())
    if (css[i] === '}') stack.pop()
    if (css[i] === '{' || css[i] === '}' || css[i] === ';') start = i + 1
  }
  return stack
}

function shadowCss(el: Element): string {
  return Array.from(el.shadowRoot?.querySelectorAll('style[data-w5-wc]') ?? [])
    .map((s) => s.textContent ?? '')
    .join('\n')
}

describe('@w5-ui/wc shadow styles', () => {
  it('styles every registered element', () => {
    const unstyled = (manifest as { tag: string }[])
      .map(({ tag }) => document.createElement(tag))
      .filter((el) => el.shadowRoot && !shadowCss(el))
      .map((el) => el.localName)
    expect(unstyled).toEqual([])
  })

  it('ships compiled utilities used by the Svelte components', () => {
    const css = shadowCss(document.createElement('uni-button'))
    expect(css).not.toContain("@import 'tailwindcss'")
    expect(css).toMatch(/\.bg-brand-05[\s,{]/)
    expect(css).toMatch(/\.inline-flex\s*\{/)
  })

  it('layers the dashboard chrome under the utilities, so utilities win', () => {
    const css = shadowCss(document.createElement('uni-button'))
    const index = css.indexOf('.icon-btn {')
    expect(index).toBeGreaterThan(-1)
    expect(enclosingBlocks(css, index)[0]).toBe('@layer base')
  })

  it('registers Tailwind @property rules on the document', () => {
    document.createElement('uni-button')
    const doc = Array.from(document.head.querySelectorAll('style[data-w5-wc]'))
      .map((s) => s.textContent)
      .join('\n')
    expect(doc).toContain('@property --tw-')
  })

  it('keeps a portalled popover panel inside the shadow root', async () => {
    document.body.innerHTML = '<uni-popover label="Filter">Online only</uni-popover>'
    await flush()
    const host = document.querySelector('uni-popover')!
    ;(host.shadowRoot!.querySelector('button') as HTMLButtonElement).click()
    await flush()
    expect(host.shadowRoot!.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.querySelector(':scope > [role="dialog"]')).toBeNull()
  })

  it('keeps the popover open when its own panel is pressed', async () => {
    document.body.innerHTML = '<uni-popover label="Filter">Online only</uni-popover>'
    await flush()
    const host = document.querySelector('uni-popover')!
    ;(host.shadowRoot!.querySelector('button') as HTMLButtonElement).click()
    await flush()
    const panel = host.shadowRoot!.querySelector('[role="dialog"]')!
    panel.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }))
    await flush()
    expect(host.shadowRoot!.querySelector('[role="dialog"]')).not.toBeNull()
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }))
    await flush()
    expect(host.shadowRoot!.querySelector('[role="dialog"]')).toBeNull()
  })

  it('lets page tokens such as --radius-md inherit into shadow roots', () => {
    const css = shadowCss(document.createElement('uni-button'))
    expect(css).not.toMatch(/--radius-md:\s*var\(--radius-md\)/)
  })
})
