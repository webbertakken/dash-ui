import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

const dashboardCss = readFileSync(
  path.join(process.cwd(), 'packages/tokens/src/dashboard.css'),
  'utf8',
)

// Strip CSS comments so we can reason about real selectors, not commented-out hints
const stripped = dashboardCss.replace(/\/\*[\s\S]*?\*\//g, '')

/**
 * Find every selector group that defines the bare `.tag` rule (i.e. `.tag` as a
 * standalone selector, not `.tag-input`, `.tag__label`, `.tag::before`, etc.).
 * Returns the selector group strings (e.g. `.tag:not(.token)` or `.tag, .pill`).
 */
function findBareTagRules(css: string): string[] {
  const matches: string[] = []
  const ruleRe = /([^{}]+)\{[^{}]*\}/g
  let m: RegExpExecArray | null
  while ((m = ruleRe.exec(css)) !== null) {
    const selectorGroup = m[1].trim()
    const selectors = selectorGroup.split(',').map((s) => s.trim())
    for (const selector of selectors) {
      // A "bare .tag" selector is exactly `.tag` optionally followed by
      // pseudo-class modifiers like `:not(...)`, `:hover` etc. but NOT
      // followed by `-`, `_`, or a class/id/attr suffix.
      if (/^\.tag(:[a-z-]+(\([^)]*\))?)*$/.test(selector)) {
        matches.push(selector)
      }
    }
  }
  return matches
}

describe('dashboard.css: .tag rule (Prism collision regression)', () => {
  it('defines the bare .tag rule exactly once', () => {
    const rules = findBareTagRules(stripped)
    expect(rules.length).toBe(1)
  })

  it('scopes .tag to elements that are NOT also Prism tokens', () => {
    // Prism's HTML/JSX/TSX highlighters wrap every in-tag span in
    // `class="token tag"`. Without `:not(.token)` our removable-chip styling
    // (rounded background + border + padded) bleeds onto every HTML/JSX token
    // inside MDX code blocks, turning Setup.mdx into a pile of pastel pills.
    const rules = findBareTagRules(stripped)
    expect(rules.length).toBeGreaterThan(0)
    for (const rule of rules) {
      expect(rule).toMatch(/:not\(\.token\)/)
    }
  })

  it('still produces a pill-shaped chip body for actual <Tag> usages', () => {
    // Sanity: the chip declarations must remain inside the .tag rule body
    // so the typed <Tag> primitive keeps rendering the brand-tinted pill.
    const ruleBody = stripped.match(/\.tag(?::[^{,]+)?\s*\{([^}]+)\}/)?.[1] ?? ''
    expect(ruleBody).toMatch(/border-radius:\s*9999px/)
    expect(ruleBody).toMatch(/background:\s*rgba\(0,\s*111,\s*255/)
    expect(ruleBody).toMatch(/border:\s*1px solid rgba\(0,\s*111,\s*255/)
  })

  it('has no other bare-class selector that collides with a Prism token name', () => {
    // Defensive: if a new bare class is added to dashboard.css and it matches
    // a Prism token class (comment, doctype, punctuation, tag, attr-name,
    // string, char, number, function, keyword, regex, operator, builtin,
    // entity, url, variable, class-name, property, namespace, selector,
    // bold, italic, important, constant, symbol, boolean, atrule, rule,
    // deleted, inserted), Prism-highlighted code blocks will bleed again.
    const prismTokens = new Set([
      'comment',
      'prolog',
      'doctype',
      'cdata',
      'punctuation',
      'namespace',
      'property',
      'tag',
      'boolean',
      'number',
      'constant',
      'symbol',
      'deleted',
      'selector',
      'attr-name',
      'string',
      'char',
      'builtin',
      'inserted',
      'operator',
      'entity',
      'url',
      'variable',
      'function',
      'class-name',
      'keyword',
      'regex',
      'important',
      'bold',
      'italic',
      'atrule',
      'rule',
      'parameter',
    ])

    const bareClasses = new Set<string>()
    const ruleRe = /([^{}]+)\{[^{}]*\}/g
    let m: RegExpExecArray | null
    while ((m = ruleRe.exec(stripped)) !== null) {
      const selectorGroup = m[1].trim()
      const selectors = selectorGroup.split(',').map((s) => s.trim())
      for (const selector of selectors) {
        const bare = selector.match(/^\.([a-z][a-z0-9-]*)(?:[:.[][^{,]*)?$/)?.[1]
        if (bare) bareClasses.add(bare)
      }
    }

    const collisions = Array.from(bareClasses).filter((c) => prismTokens.has(c))
    // `tag` is the one we explicitly handle above; anything else is a new
    // collision that needs the same `:not(.token)` treatment.
    expect(collisions.filter((c) => c !== 'tag')).toEqual([])
  })
})
