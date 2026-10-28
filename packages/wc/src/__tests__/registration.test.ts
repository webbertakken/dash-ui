import { describe, it, expect, beforeAll } from 'vitest'
import manifest from '../manifest.json'

// Importing the bundle has the side effect of calling customElements.define
// for every uni-* tag in the manifest. We import the freshly built bundle
// (dist/index.js) so the test mirrors what real consumers run.
//
// Browsers share one constructable stylesheet across every shadow root; jsdom has
// constructable sheets but no `adoptedStyleSheets`, so without this accessor each
// element would parse the full component stylesheet into its own `<style>`.
function provideAdoptedStyleSheets(prototype: object) {
  if ('adoptedStyleSheets' in prototype) return
  const sheets = new WeakMap<object, CSSStyleSheet[]>()
  Object.defineProperty(prototype, 'adoptedStyleSheets', {
    configurable: true,
    get(this: object) {
      return sheets.get(this) ?? []
    },
    set(this: object, value: CSSStyleSheet[]) {
      sheets.set(this, value)
    },
  })
}

beforeAll(async () => {
  provideAdoptedStyleSheets(Document.prototype)
  provideAdoptedStyleSheets(ShadowRoot.prototype)
  await import('../../dist/index.js')
})

describe('@w5-ui/wc registration', () => {
  it('registers every tag in the manifest', () => {
    for (const { tag } of manifest as { name: string; tag: string }[]) {
      expect(customElements.get(tag), `${tag} should be registered`).toBeDefined()
    }
  })

  it('every registered element can be instantiated and connected', () => {
    for (const { tag } of manifest as { name: string; tag: string }[]) {
      const el = document.createElement(tag)
      document.body.appendChild(el)
      expect(el.tagName.toLowerCase()).toBe(tag)
      expect(
        el.shadowRoot?.adoptedStyleSheets,
        `${tag} should adopt the shared sheet`,
      ).toHaveLength(1)
      el.remove()
    }
  })
})
