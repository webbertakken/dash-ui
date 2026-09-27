import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../packages/tokens/src')
const read = (file: string) => readFileSync(path.join(SRC, file), 'utf8')

interface FontFace {
  family: string
  weight: string
  display: string
  unicodeRange: string
  url: string
}

function fontFaces(css: string): FontFace[] {
  return Array.from(css.matchAll(/@font-face\s*\{([^}]*)\}/g), ([, body]) => {
    const prop = (name: string) =>
      body!.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1]?.trim() ?? ''
    return {
      family: prop('font-family').replace(/['"]/g, ''),
      weight: prop('font-weight'),
      display: prop('font-display'),
      unicodeRange: prop('unicode-range'),
      url: body!.match(/url\(['"]?([^'")]+)['"]?\)/)?.[1] ?? '',
    }
  })
}

describe('self-hosted fonts', () => {
  const tokens = read('tokens.css')
  const faces = fontFaces(read('fonts.css'))

  it('loads no fonts from a third party', () => {
    expect(tokens).not.toMatch(/fonts\.googleapis|fonts\.gstatic|@import\s+url\(\s*['"]?https?:/)
  })

  it('imports the local font faces before any rule, so every bundler inlines them', () => {
    const firstStatement = tokens
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
      .split(';')[0]
    expect(firstStatement).toBe("@import './fonts.css'")
  })

  it.each([
    ['Inter', '--font-sans'],
    ['JetBrains Mono', '--font-mono'],
  ])('declares %s, the family %s names first', (family, token) => {
    const stack = tokens.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1] ?? ''
    expect(stack.split(',')[0]!.replace(/['"]/g, '').trim()).toBe(family)
    const own = faces.filter((f) => f.family === family)
    expect(own.length).toBeGreaterThanOrEqual(2)
    expect(own.map((f) => f.url)).toContainEqual(
      expect.stringMatching(/-latin-wght-normal\.woff2$/),
    )
  })

  it('swaps in without blocking text, covers the used weights, and splits by script', () => {
    for (const face of faces) {
      expect(face.display).toBe('swap')
      const [min, max] = face.weight.split(/\s+/).map(Number)
      expect(min).toBeLessThanOrEqual(400)
      expect(max).toBeGreaterThanOrEqual(face.family === 'Inter' ? 800 : 600)
      expect(face.unicodeRange).toMatch(/^U\+/)
    }
  })

  it('references only vendored files, and vendors nothing unreferenced', () => {
    const referenced = new Set(faces.map((f) => path.normalize(f.url)))
    for (const url of referenced) {
      expect({ url, exists: existsSync(path.join(SRC, url)) }).toEqual({ url, exists: true })
    }
    const vendored = readdirSync(path.join(SRC, 'fonts')).filter((f) => f.endsWith('.woff2'))
    expect(vendored.map((f) => path.normalize(`fonts/${f}`)).sort()).toEqual([...referenced].sort())
  })

  it('ships each font’s licence alongside it', () => {
    for (const licence of ['fonts/Inter-OFL.txt', 'fonts/JetBrainsMono-OFL.txt']) {
      expect(read(licence)).toContain('SIL Open Font License, Version 1.1')
    }
  })
})
