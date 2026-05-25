/**
 * Style-parity check between `@w5-ui/react` and `@w5-ui/tokens/dashboard.css`.
 *
 * React components ship their layout as `className="..."` strings that
 * resolve to rules in `dashboard.css`. The Svelte siblings instead
 * embed inline Tailwind utilities that the legacy SPA's compiler picks
 * up. If a `dashboard.css` rule for a class shipped by a React
 * component is missing, the React build renders the markup unstyled
 * (e.g. `<Pill>` rendering as raw text before this sweep added the
 * `.pill` rule).
 *
 * This test collects every literal `className="..."` in
 * `packages/react/src/components/**` that ISN'T a Tailwind utility,
 * then asserts every class has a matching rule in `dashboard.css`.
 *
 * The allow-list documents intentional uncovered class names (e.g.
 * class hooks consumers wire up themselves, or names whose rule is
 * applied via attribute selectors and the literal lookup misses).
 */

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const COMPONENTS = path.resolve(HERE, '../components')
const DASHBOARD_CSS = path.resolve(HERE, '../../../tokens/src/dashboard.css')
const TOKENS_CSS = path.resolve(HERE, '../../../tokens/src/tokens.css')

/**
 * Heuristic: a "design-system class" is lowercase, mostly letters /
 * dashes / underscores, often with a `--variant` suffix. We exclude
 * names containing characters that betray Tailwind utilities (`:`,
 * `[`, `]`, `/`, `%`) and any name with digits + alphabetic suffix
 * (like `m-2`, `gap-2`, `h-1.5`) that we leave to the Tailwind
 * compiler in apps that consume our components.
 *
 * The list of design-system prefixes below was hand-curated from a
 * grep of dashboard.css; it keeps the test fast and avoids treating
 * arbitrary userland classes (set via `className` props) as part of
 * the design system.
 */
const DS_CLASS = /^[a-z][a-z0-9_-]*$/
const TAILWIND_HINT =
  /^(?:[hwmpt][trblxy]?-|gap-|grid-|flex-|items-|justify-|text-|font-|bg-|border-|rounded-|shadow-|space-|max-|min-|inset-|top-|left-|right-|bottom-|overflow-|cursor-|transition-|duration-|ease-|leading-|tracking-|tabular-|whitespace-|truncate$|sr-only$)/

function collectClasses(src: string): Set<string> {
  const out = new Set<string>()

  // (1) Plain `className="foo bar"` literals.
  for (const m of src.matchAll(/className=['"]([^'"]+?)['"]/g)) {
    for (const cls of m[1]!.split(/\s+/)) addIfDs(out, cls)
  }

  // (2) `className={...}` brace expressions. A naive `\{[^}]+\}` regex
  //     truncates at the first `}` of a nested `${...}` substitution,
  //     so scan brace depth manually and feed the resulting expression
  //     to the template-literal collector.
  for (const expr of scanBraceExprs(src, 'className=')) processClassNameExpr(expr, out)
  return out
}

function scanBraceExprs(src: string, prefix: string): string[] {
  const out: string[] = []
  let i = 0
  while (i < src.length) {
    const next = src.indexOf(prefix + '{', i)
    if (next < 0) break
    let depth = 0
    let j = next + prefix.length
    let start = j
    for (; j < src.length; j++) {
      const c = src[j]!
      if (c === '{') {
        if (depth === 0) start = j + 1
        depth++
      } else if (c === '}') {
        depth--
        if (depth === 0) {
          out.push(src.slice(start, j))
          break
        }
      }
    }
    i = j + 1
  }
  return out
}

function processClassNameExpr(expr: string, out: Set<string>): void {
  // Template-literal segments and variant prefixes.
  for (const mm of expr.matchAll(/`([^`]*)`/g)) {
    const tpl = mm[1]!
    for (const cls of tpl.split(/\s+|\$\{[^}]*\}/)) addIfDs(out, cls)
    for (const pm of tpl.matchAll(/([a-z][a-z0-9_-]*-{1,2})\$\{/g)) {
      out.add(`__prefix__:${pm[1]!}`)
    }
  }
  // Static strings that AREN'T inside template literals. Strip every
  // backtick block first so ternary defaults inside `${variant ?? 'x'}`
  // don't leak; only true ternaries like `className={open ? 'foo' : 'bar'}`
  // contribute.
  const stripped = expr.replace(/`[^`]*`/g, '')
  for (const mm of stripped.matchAll(/(['"])([^'"\n]+?)\1/g)) {
    for (const cls of mm[2]!.split(/\s+/)) addIfDs(out, cls)
  }
}

function addIfDs(out: Set<string>, cls: string): void {
  if (!cls) return
  if (!DS_CLASS.test(cls)) return
  if (TAILWIND_HINT.test(cls)) return
  // Segments ending with `-` or `--` are variant prefixes (the
  // tail of `pill-${variant}` etc), captured by `__prefix__:` entries
  // separately; don't double-record them as real class names.
  if (cls.endsWith('-')) return
  out.add(cls)
}

function loadCss(): string {
  return readFileSync(DASHBOARD_CSS, 'utf8') + '\n' + readFileSync(TOKENS_CSS, 'utf8')
}

/**
 * Classes shipped by React components that aren't (yet) documented as
 * matching real CSS rules. Each entry MUST come with a reason. Empty
 * = full style parity.
 */
const ALLOWED_MISSING: Record<string, string> = {}

describe('@w5-ui/react vs @w5-ui/tokens/dashboard.css class parity', () => {
  const css = loadCss()

  it('every literal className shipped by a React component has a CSS rule', () => {
    const used = new Set<string>()
    for (const f of readdirSync(COMPONENTS)) {
      if (!f.endsWith('.tsx')) continue
      const src = readFileSync(path.join(COMPONENTS, f), 'utf8')
      for (const cls of collectClasses(src)) used.add(cls)
    }

    const missing: string[] = []
    for (const cls of used) {
      if (cls.startsWith('__prefix__:')) {
        // Variant prefix; check that AT LEAST one full class matching
        // the pattern exists (e.g. `pill-success`).
        const prefix = cls.slice('__prefix__:'.length)
        const re = new RegExp(`\\.${escape(prefix)}[a-z0-9_-]+\\b`)
        if (!re.test(css)) missing.push(`${prefix}*`)
        continue
      }
      if (cls in ALLOWED_MISSING) continue
      const re = new RegExp(`\\.${escape(cls)}\\b`)
      if (!re.test(css)) missing.push(cls)
    }

    expect(missing.sort()).toEqual([])
  })
})

function escape(s: string): string {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}
