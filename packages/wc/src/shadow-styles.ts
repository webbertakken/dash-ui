/**
 * Styles for `uni-*` shadow roots. Tailwind utilities in the page never cross
 * a shadow boundary, so the components' compiled CSS is adopted into every
 * element's shadow root as one shared constructable stylesheet (a `<style>`
 * element where `adoptedStyleSheets` is unavailable).
 *
 * `@property` rules only register at document level, so they are split out
 * and added to the document once; without them Tailwind's composed utilities
 * (translate, shadow, ring) resolve to invalid values inside shadow roots.
 */

const MARKER = 'data-w5-wc'
const PROPERTY_RULE = /@property\s+[^{]+\{[^}]*\}/g
// `--x: var(--x);` is cyclic, so it is invalid and blocks the page token from inheriting.
const SELF_REFERENCE = /\s*(--[\w-]+)\s*:\s*var\(\s*\1\s*\)\s*;/g

type ElementClass = new () => HTMLElement

export interface ShadowStylerEnv {
  /** Constructable stylesheet class; omit to use `<style>` elements. */
  Sheet?: typeof CSSStyleSheet
  document?: Document
}

export interface ShadowStyler {
  adopt(root: ShadowRoot): void
  /** Svelte `customElement.extend` hook: styles the shadow root on construction. */
  extend(Base: ElementClass): ElementClass
}

/**
 * Tailwind's `@theme inline` bridge declares `--radius-md: var(--radius-md)` and
 * friends on `:root, :host`. Harmless in the document (unlayered tokens win), but
 * on `:host` it shadows the inherited token with an invalid value.
 */
export function dropSelfReferences(css: string): string {
  return css.replace(SELF_REFERENCE, '')
}

export function splitDocumentRules(css: string): { shadow: string; document: string } {
  const rules = css.match(PROPERTY_RULE) ?? []
  return { shadow: css.replace(PROPERTY_RULE, ''), document: rules.join('\n') }
}

function supportsAdoption(Sheet: typeof CSSStyleSheet | undefined): boolean {
  return (
    Sheet !== undefined &&
    typeof ShadowRoot !== 'undefined' &&
    'adoptedStyleSheets' in ShadowRoot.prototype &&
    'replaceSync' in Sheet.prototype
  )
}

function defaultEnv(): ShadowStylerEnv {
  const Sheet = typeof CSSStyleSheet === 'undefined' ? undefined : CSSStyleSheet
  return {
    ...(supportsAdoption(Sheet) && Sheet ? { Sheet } : {}),
    ...(typeof document === 'undefined' ? {} : { document }),
  }
}

function styleElement(doc: Document, text: string): HTMLStyleElement {
  const style = doc.createElement('style')
  style.setAttribute(MARKER, '')
  style.textContent = text
  return style
}

export function createShadowStyler(css: string, env: ShadowStylerEnv = defaultEnv()): ShadowStyler {
  const parts = splitDocumentRules(dropSelfReferences(css))
  const { Sheet } = env
  const styled = new WeakSet<ShadowRoot>()
  let shadowSheet: CSSStyleSheet | undefined
  let documentDone = false

  function adoptDocumentRules(doc: Document | undefined) {
    if (documentDone || !doc || !parts.document) return
    documentDone = true
    if (Sheet) {
      const sheet = new Sheet()
      sheet.replaceSync(parts.document)
      doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet]
    } else {
      doc.head.append(styleElement(doc, parts.document))
    }
  }

  function adopt(root: ShadowRoot) {
    if (styled.has(root)) return
    styled.add(root)
    const doc = env.document ?? root.ownerDocument
    adoptDocumentRules(doc)
    if (Sheet) {
      if (!shadowSheet) {
        shadowSheet = new Sheet()
        shadowSheet.replaceSync(parts.shadow)
      }
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, shadowSheet]
      return
    }
    root.prepend(styleElement(root.ownerDocument, parts.shadow))
  }

  function extend(Base: ElementClass): ElementClass {
    return class extends Base {
      constructor() {
        super()
        if (this.shadowRoot) adopt(this.shadowRoot)
      }
    }
  }

  return { adopt, extend }
}
