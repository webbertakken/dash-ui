import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Foundations parity across the three storybooks.
 *
 * For every MDX page that lives in `apps/storybook-react/src/foundations/`
 * there must be a mirror in `apps/storybook-svelte/src/foundations/` and
 * `apps/storybook-wc/src/foundations/` with the same `<Meta title="...">`.
 *
 * Without this guard, every new React Foundations page silently drops out of
 * the Svelte / WC sidebars and userland in those two frameworks loses the
 * documented contract for the new pattern.
 */

const reactFoundations = 'apps/storybook-react/src/foundations'
const svelteFoundations = 'apps/storybook-svelte/src/foundations'
const wcFoundations = 'apps/storybook-wc/src/foundations'

function listMdx(rel: string): string[] {
  return readdirSync(path.join(process.cwd(), rel))
    .filter((f) => f.endsWith('.mdx'))
    .sort()
}

function metaTitle(rel: string, file: string): string | null {
  const src = readFileSync(path.join(process.cwd(), rel, file), 'utf8')
  const m = src.match(/<Meta\s+title=["']([^"']+)["']/)
  return m?.[1] ?? null
}

describe('Foundations parity: every React MDX page exists in Svelte + WC', () => {
  const reactPages = listMdx(reactFoundations)
  const sveltePages = new Set(listMdx(svelteFoundations))
  const wcPages = new Set(listMdx(wcFoundations))

  it.each(reactPages)('Svelte storybook has %s', (page) => {
    expect(sveltePages.has(page), `${svelteFoundations}/${page} missing`).toBe(true)
  })

  it.each(reactPages)('Web Components storybook has %s', (page) => {
    expect(wcPages.has(page), `${wcFoundations}/${page} missing`).toBe(true)
  })

  it.each(reactPages)('%s declares the same <Meta title> in all three storybooks', (page) => {
    const reactTitle = metaTitle(reactFoundations, page)
    const svelteTitle = sveltePages.has(page) ? metaTitle(svelteFoundations, page) : null
    const wcTitle = wcPages.has(page) ? metaTitle(wcFoundations, page) : null
    expect(reactTitle, `react ${page} must declare a <Meta title>`).not.toBeNull()
    expect(svelteTitle).toBe(reactTitle)
    expect(wcTitle).toBe(reactTitle)
  })
})
