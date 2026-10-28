import { afterEach, describe, expect, it, vi } from 'vitest'
import { createShadowStyler, dropSelfReferences, splitDocumentRules } from '../shadow-styles.js'

const CSS = `:host { --radius-md: var(--radius-md); }
@property --tw-translate-x { syntax: "*"; inherits: false; initial-value: 0; }
.inline-flex { display: inline-flex; }
@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}
.bg-bg-2 { background-color: var(--depthBg-2); }`

afterEach(() => {
  document.body.innerHTML = ''
  document.head.querySelectorAll('style[data-w5-wc]').forEach((s) => s.remove())
  vi.restoreAllMocks()
})

function host(): ShadowRoot {
  const el = document.createElement('div')
  document.body.append(el)
  return el.attachShadow({ mode: 'open' })
}

describe('splitDocumentRules', () => {
  it('moves @property rules out of the shadow sheet', () => {
    const { shadow, document: doc } = splitDocumentRules(CSS)
    expect(shadow).not.toContain('@property')
    expect(shadow).toContain('.inline-flex')
    expect(shadow).toContain('.bg-bg-2')
    expect(doc).toContain('@property --tw-translate-x')
    expect(doc).toContain('@property --tw-shadow')
    expect(doc).not.toContain('.inline-flex')
  })
})

describe('dropSelfReferences', () => {
  it('removes cyclic custom properties so page tokens inherit into the shadow root', () => {
    const css =
      ':root, :host {\n    --radius-md: var(--radius-md);\n    --blur-sm: 8px;\n    --font-sans:var(--font-sans);\n  }'
    const out = dropSelfReferences(css)
    expect(out).not.toContain('--radius-md')
    expect(out).not.toContain('--font-sans')
    expect(out).toContain('--blur-sm: 8px;')
  })

  it('keeps properties that reference a different variable or add a fallback', () => {
    const css = '.x { --a: var(--b); --c: var(--c, 4px); }'
    expect(dropSelfReferences(css)).toBe(css)
  })
})

describe('createShadowStyler (no adoptedStyleSheets: <style> fallback)', () => {
  it('adds the component styles to a shadow root', () => {
    const root = host()
    createShadowStyler(CSS).adopt(root)
    const style = root.querySelector('style[data-w5-wc]')
    expect(style?.textContent).toContain('.inline-flex')
    expect(style?.textContent).not.toContain('@property')
    expect(style?.textContent).not.toContain('--radius-md')
  })

  it('is idempotent per shadow root', () => {
    const root = host()
    const styler = createShadowStyler(CSS)
    styler.adopt(root)
    styler.adopt(root)
    expect(root.querySelectorAll('style[data-w5-wc]')).toHaveLength(1)
  })

  it('registers @property rules on the document exactly once', () => {
    const styler = createShadowStyler(CSS)
    styler.adopt(host())
    styler.adopt(host())
    const docStyles = document.head.querySelectorAll('style[data-w5-wc]')
    expect(docStyles).toHaveLength(1)
    expect(docStyles[0]!.textContent).toContain('@property --tw-translate-x')
  })

  it('skips the document sheet when there are no @property rules', () => {
    createShadowStyler('.x { color: red }').adopt(host())
    expect(document.head.querySelector('style[data-w5-wc]')).toBeNull()
  })
})

describe('createShadowStyler (constructable stylesheets)', () => {
  function fakeEnv() {
    const replaced: string[] = []
    class FakeSheet {
      replaceSync(text: string) {
        replaced.push(text)
      }
    }
    const doc = { adoptedStyleSheets: [] as unknown[] }
    return { replaced, FakeSheet, doc }
  }

  it('shares one sheet across shadow roots and keeps existing sheets', () => {
    const { replaced, FakeSheet, doc } = fakeEnv()
    const styler = createShadowStyler(CSS, {
      Sheet: FakeSheet as unknown as typeof CSSStyleSheet,
      document: doc as unknown as Document,
    })
    const existing = {}
    const a = { adoptedStyleSheets: [existing] } as unknown as ShadowRoot
    const b = { adoptedStyleSheets: [] } as unknown as ShadowRoot
    styler.adopt(a)
    styler.adopt(b)
    styler.adopt(a)
    expect(a.adoptedStyleSheets).toHaveLength(2)
    expect(a.adoptedStyleSheets[0]).toBe(existing)
    expect(a.adoptedStyleSheets[1]).toBe(b.adoptedStyleSheets[0])
    expect(doc.adoptedStyleSheets).toHaveLength(1)
    expect(replaced).toHaveLength(2)
  })
})

describe('withShadowStyles', () => {
  it('adopts the styles when the element attaches its shadow root', () => {
    const styler = createShadowStyler('.probe { color: red }')
    class Base extends HTMLElement {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
      }
    }
    const Styled = styler.extend(Base as unknown as new () => HTMLElement)
    customElements.define('x-shadow-styles-probe', Styled)
    const el = document.createElement('x-shadow-styles-probe')
    expect(el.shadowRoot?.querySelector('style[data-w5-wc]')?.textContent).toContain('.probe')
  })

  it('does nothing for elements without a shadow root', () => {
    const styler = createShadowStyler('.probe { color: red }')
    const Styled = styler.extend(HTMLElement as unknown as new () => HTMLElement)
    customElements.define('x-shadow-styles-light', Styled)
    expect(() => document.createElement('x-shadow-styles-light')).not.toThrow()
  })
})
