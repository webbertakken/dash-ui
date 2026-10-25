// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { brand, neutral, primaryFill } from '../packages/tokens/src/tokens'

/**
 * The primary fill: what a filled primary control (a primary button, an
 * active page, a selected day, a count badge) is painted with, and the
 * text on it. Text on `brand-05` is 4.45:1 and on `brand-06` 2.94:1, both
 * under WCAG 2.2 AA for 12-13px text, so the fill is `brand-04` and its
 * states darken from there. `--primary` stays `brand-05`: as a focus ring
 * it must clear 3:1 on every dark depth, which `brand-04` does not.
 */

const here = fileURLToPath(new URL('.', import.meta.url))
const tokensDir = join(here, '../packages/tokens/src')
const read = (file: string): string => readFileSync(join(tokensDir, file), 'utf8')
const tokensCss = read('tokens.css')
const tailwindCss = read('tailwind.css')
const dashboardCss = read('dashboard.css')

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** The body of the motif block that opens with `selector`. */
function motifBlock(selector: string): string {
  const start = tokensCss.indexOf(selector)
  return tokensCss.slice(start, tokensCss.indexOf('}', start))
}

describe('the primary fill tokens', () => {
  it.each(["[data-motif='dark']", "[data-motif='light']"])('are declared for %s', (motif) => {
    const block = motifBlock(motif)
    expect(block).toMatch(/--primary-fill:\s*var\(--brand-04\);/)
    expect(block).toMatch(/--primary-fill-hover:\s*var\(--brand-03\);/)
    expect(block).toMatch(/--primary-fill-press:\s*var\(--brand-02\);/)
    expect(block).toMatch(/--primary-fill-fg:\s*#ffffff;/)
    expect(block).toMatch(/--primary:\s*var\(--brand-05\);/)
  })

  it('replace the button tokens the fill used to share with the ring', () => {
    expect(tokensCss).not.toMatch(/--primary-(hover|press|fg):/)
    expect(tailwindCss).not.toMatch(/--color-primary-(hover|press|fg):/)
  })

  it('are Tailwind colours', () => {
    for (const name of ['fill', 'fill-hover', 'fill-press', 'fill-fg']) {
      expect(tailwindCss).toContain(`--color-primary-${name}: var(--primary-${name});`)
    }
  })

  it('mirror the CSS in the JS surface', () => {
    expect(primaryFill).toEqual({
      rest: brand['04'],
      hover: brand['03'],
      press: brand['02'],
      fg: neutral['00'],
    })
  })

  it.each(['rest', 'hover', 'press'] as const)('reads at 4.5:1 or more when %s', (state) => {
    expect(contrast(primaryFill.fg, primaryFill[state])).toBeGreaterThanOrEqual(4.5)
  })
})

const FAILING_FILL = /(^|\s)(hover:|active:)?bg-brand-0[56](\s|$)/
const TEXT_ON_FILL = /\btext-(white|primary-fill-fg)\b/
/** Components whose white-on-fill is a tick, not text: 3:1 is a glyph's floor, and `brand-05` clears it. */
const GLYPH_ONLY = new Set(['MultiSelect.svelte'])
const GLYPH_ONLY_RULES = new Set([".multiselect-option[aria-selected='true'] .multiselect-check"])

function svelteSources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) svelteSources(full, out)
    else if (entry.name.endsWith('.svelte')) out.push(full)
  }
  return out
}

describe('the components', () => {
  it('put no text on a brand-05 or brand-06 fill, at rest, on hover or pressed', () => {
    const offenders: string[] = []
    for (const file of svelteSources(join(here, '../packages/svelte/src/lib/components'))) {
      const text = readFileSync(file, 'utf8')
      for (const match of text.matchAll(/(["'`])([^"'`\n]*\bbg-brand-0[56]\b[^"'`\n]*)\1/g)) {
        const classes = match[2] ?? ''
        if (
          TEXT_ON_FILL.test(classes) &&
          FAILING_FILL.test(classes) &&
          !GLYPH_ONLY.has(file.split('/').pop() ?? '')
        ) {
          offenders.push(
            `${file.split('/components/')[1]}:${text.slice(0, match.index).split('\n').length}`,
          )
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('give no rule in dashboard.css white text on a brand-05 or brand-06 fill', () => {
    const blocks = [...dashboardCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, sel, body]) => ({
      selector: (sel ?? '').replace(/\/\*[\s\S]*?\*\//g, '').trim(),
      body: body ?? '',
    }))
    const colourOf = (body: string): string | undefined =>
      /(?:^|[;\s])color\s*:\s*([^;]+);/.exec(body)?.[1]?.trim()
    const bySelector = new Map(blocks.map((b) => [b.selector, b.body]))
    const fill = /background(?:-color)?\s*:\s*(?:var\(--brand-0[56]\)|#006fff|#4797ff)\s*;/i
    const white = /^(#fff|#ffffff|white|var\(--neutral-00\))$/i
    const offenders = blocks.flatMap(({ selector, body }) => {
      if (!fill.test(body) || GLYPH_ONLY_RULES.has(selector)) return []
      const base = (selector.split(',')[0] ?? '')
        .replace(/:(hover|focus|focus-visible|active)(:not\([^)]*\))?/g, '')
        .trim()
      const colour = colourOf(body) ?? colourOf(bySelector.get(base) ?? '')
      return colour !== undefined && white.test(colour) ? [selector] : []
    })
    expect(offenders).toEqual([])
  })
})
