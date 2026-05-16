import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Storybook 8.6's `@storybook/addon-docs` preset reads the active
 * `mdxPluginOptions` via `presets.apply("options", {})` — i.e. it only sees
 * options that are exposed at the addon-docs preset level. Nesting the
 * option under `@storybook/addon-essentials > options.docs.mdxPluginOptions`
 * (the shape Storybook's older docs suggested) is silently dropped, so
 * `remark-gfm` never plugs in and pipe-tables in MDX render as a literal
 * paragraph of `|` characters.
 *
 * The canonical fix in Storybook 8.x is to:
 *   1. Disable docs in addon-essentials (`options.docs = false`)
 *   2. Register `@storybook/addon-docs` as a separate addon entry with
 *      `options.mdxPluginOptions.mdxCompileOptions.remarkPlugins = [remarkGfm]`.
 *
 * This test guards that shape across all three storybooks so a future
 * refactor can't silently re-break GFM tables.
 */

const storybookRoots = [
  'apps/storybook-react/.storybook/main.ts',
  'apps/storybook-svelte/.storybook/main.ts',
  'apps/storybook-wc/.storybook/main.ts',
] as const

function read(rel: string): string {
  return readFileSync(path.join(process.cwd(), rel), 'utf8')
}

describe.each(storybookRoots)('storybook MDX config: %s', (configPath) => {
  const src = read(configPath)

  it('imports remark-gfm', () => {
    expect(src).toMatch(/import\s+remarkGfm\s+from\s+['"]remark-gfm['"]/)
  })

  it('disables docs in addon-essentials so the docs preset is owned by addon-docs', () => {
    // The bundled docs preset inside @storybook/addon-essentials does not
    // forward `mdxPluginOptions` to @storybook/addon-docs. Disabling it
    // lets the standalone addon-docs entry below own that pipeline.
    const essentials = src.match(
      /name:\s*['"]@storybook\/addon-essentials['"][^}]*?options:\s*\{[^}]*?docs:\s*([^,}]+)/s,
    )
    expect(essentials, 'addon-essentials entry must opt-out of docs').not.toBeNull()
    expect(essentials![1].trim()).toBe('false')
  })

  it('registers @storybook/addon-docs as a separate addon with mdxPluginOptions', () => {
    // Match the addon-docs object form: { name: '@storybook/addon-docs', options: { mdxPluginOptions: {...} } }
    const addonDocs = src.match(
      /\{\s*name:\s*['"]@storybook\/addon-docs['"][\s\S]*?options:\s*\{([\s\S]*?)\}\s*,?\s*\}/,
    )
    expect(addonDocs, '@storybook/addon-docs must appear as a separate addon entry').not.toBeNull()
    const optionsBody = addonDocs![1]
    expect(optionsBody).toMatch(/mdxPluginOptions/)
    expect(optionsBody).toMatch(/mdxCompileOptions/)
    expect(optionsBody).toMatch(/remarkPlugins/)
    expect(optionsBody).toMatch(/remarkGfm/)
  })

  it('keeps the addon list addon-essentials -> addon-docs -> addon-a11y -> addon-themes', () => {
    // Order matters: addon-docs must register before addon-a11y/addon-themes
    // so its preset wins the MDX pipeline. (Storybook applies addons in order;
    // later entries can only override, never inject earlier.)
    // Strip comments first so prose mentions of other addons don't fool the
    // ordering check.
    const code = src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '')
    const indexOfAddon = (name: string) => {
      const m = new RegExp(`(?:name:\\s*['"]${name}['"]|^\\s*['"]${name}['"])`, 'm').exec(code)
      return m ? m.index : -1
    }
    const idxEssentials = indexOfAddon('@storybook/addon-essentials')
    const idxDocs = indexOfAddon('@storybook/addon-docs')
    const idxA11y = indexOfAddon('@storybook/addon-a11y')
    const idxThemes = indexOfAddon('@storybook/addon-themes')
    expect(idxEssentials).toBeGreaterThanOrEqual(0)
    expect(idxDocs).toBeGreaterThan(idxEssentials)
    expect(idxA11y).toBeGreaterThan(idxDocs)
    expect(idxThemes).toBeGreaterThan(idxA11y)
  })
})

describe('storybook MDX config: package.json has @storybook/addon-docs as devDep', () => {
  const apps = [
    'apps/storybook-react/package.json',
    'apps/storybook-svelte/package.json',
    'apps/storybook-wc/package.json',
  ] as const

  it.each(apps)('%s declares @storybook/addon-docs', (pkgPath) => {
    const pkg = JSON.parse(read(pkgPath)) as {
      devDependencies?: Record<string, string>
      dependencies?: Record<string, string>
    }
    const versionFromDev = pkg.devDependencies?.['@storybook/addon-docs']
    const versionFromProd = pkg.dependencies?.['@storybook/addon-docs']
    const version = versionFromDev ?? versionFromProd
    expect(version, `${pkgPath} must depend on @storybook/addon-docs`).toBeDefined()
  })
})
