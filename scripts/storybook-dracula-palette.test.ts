import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Storybook MDX code-block theme parity check.
 *
 * Foundation pages render fenced code blocks via Prism inside Storybook's
 * Source block. The Storybook default palette is "tomorrow", which collides
 * with our dashboard-css colour vocabulary (green doctype-name on green
 * comments, near-black punctuation on near-black surface). We override the
 * token palette with Dracula (https://draculatheme.com/prism) so HTML / TSX /
 * CSS / JSON / YAML / bash all read with the same six-colour vocabulary and
 * sit on a single dark surface regardless of motif.
 *
 * This file enforces parity across all three storybooks so a future preview
 * css edit can't silently drop the override on one framework and keep it on
 * the others.
 */

const previews = [
  'apps/storybook-react/.storybook/preview.css',
  'apps/storybook-svelte/.storybook/preview.css',
  'apps/storybook-wc/.storybook/preview.css',
] as const

const dracula = {
  bg: '#282a36',
  fg: '#f8f8f2',
  selection: '#44475a',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  yellow: '#f1fa8c',
} as const

function read(rel: string): string {
  return readFileSync(path.join(process.cwd(), rel), 'utf8')
}

describe.each(previews)('Dracula token palette in %s', (previewPath) => {
  const css = read(previewPath)

  it('paints the outer .sbdocs <pre> surface with the Dracula background', () => {
    // The outer wrapper has to win over Storybook's docblock-source emotion
    // background; anchoring to .sbdocs pre keeps specificity high enough.
    const preRule = css.match(/\.sbdocs pre\s*\{[^}]+\}/)
    expect(preRule, 'expected a `.sbdocs pre` rule').not.toBeNull()
    expect(preRule![0]).toMatch(new RegExp(`background:\\s*${dracula.bg}`))
    expect(preRule![0]).toMatch(new RegExp(`color:\\s*${dracula.fg}`))
    expect(preRule![0]).toMatch(new RegExp(`border:\\s*1px solid ${dracula.selection}`))
  })

  it('repaints the inner Prism <pre> + docblock-source wrapper to Dracula', () => {
    // Storybook 8 nests `<pre><div class="docblock-source"><...><pre class="prismjs">`;
    // the inner pre and the docblock-source wrapper both need the Dracula bg
    // or the wrapper bleeds back through.
    expect(css).toMatch(/\.sbdocs\s+\.docblock-source\s*\{[^}]*background:\s*#282a36/)
    expect(css).toMatch(/\.sbdocs\s+pre\.prismjs\s*\{[^}]*background:\s*#282a36/)
  })

  it.each([
    ['comment', dracula.comment, ['.token.comment', '.token.prolog', '.token.cdata']],
    [
      'pink (tag/property/symbol/deleted/constant)',
      dracula.pink,
      ['.token.tag', '.token.property'],
    ],
    ['purple (boolean/number)', dracula.purple, ['.token.boolean', '.token.number']],
    [
      'green (string/attr-name/selector/char)',
      dracula.green,
      ['.token.string', '.token.attr-name'],
    ],
    [
      'yellow (function/class-name/atrule/attr-value)',
      dracula.yellow,
      ['.token.function', '.token.class-name'],
    ],
    ['cyan (keyword)', dracula.cyan, ['.token.keyword']],
    ['orange (regex/important)', dracula.orange, ['.token.regex', '.token.important']],
    ['punctuation (foreground)', dracula.fg, ['.token.punctuation']],
  ])('declares Dracula %s', (_label, hex, selectors) => {
    for (const selector of selectors) {
      const escaped = selector.replace(/\./g, '\\.')
      // Selectors must be prefixed with `.sbdocs pre` (4 classes) to outrank
      // Storybook's emotion-injected `.css-XXX * .token.X` (3 classes).
      const pattern = new RegExp(`\\.sbdocs\\s+pre\\s+${escaped}[^{]*\\{[^}]*color:\\s*${hex}`, 'i')
      expect(css, `${selector} must map to ${hex}`).toMatch(pattern)
    }
  })

  it('keeps Dracula entity-cursor + bold + italic affordances', () => {
    expect(css).toMatch(/\.sbdocs\s+pre\s+\.token\.entity[^{]*\{[^}]*cursor:\s*help/)
    expect(css).toMatch(/\.sbdocs\s+pre\s+\.token\.bold[^{]*\{[^}]*font-weight:\s*bold/)
    expect(css).toMatch(/\.sbdocs\s+pre\s+\.token\.italic[^{]*\{[^}]*font-style:\s*italic/)
  })

  it('still keeps the inline-code chip styling distinct (not Dracula)', () => {
    // Inline `code` in prose should remain a brand-tinted chip; only fenced
    // <pre><code> blocks adopt Dracula. The `pre code` reset rule must keep
    // background:transparent so chip styling doesn't bleed into Dracula.
    expect(css).toMatch(/\.sbdocs pre code\s*\{[^}]*background:\s*transparent/)
  })
})
