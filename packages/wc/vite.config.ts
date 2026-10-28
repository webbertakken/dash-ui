import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'

const isCustomElementWrapper = (filename: string) => /packages\/wc\/src\/.*\.svelte$/.test(filename)

const SHADOW_SHEET = /\/packages\/wc\/src\/shadow\.css(\?|$)/
const FONT_FACE_RULE = /@font-face\s*\{[^}]*\}/g

/**
 * The page registers Inter and JetBrains Mono through `@w5-ui/wc/styles.css`,
 * and a shadow root's `@font-face` registers nothing. The tokens the shadow
 * sheet imports carry those rules anyway; left in, library mode would inline
 * every font file into the bundle as base64.
 */
function fontsStayOnThePage(): Plugin {
  return {
    name: 'w5-wc:fonts-stay-on-the-page',
    enforce: 'pre',
    transform(code, id) {
      if (!SHADOW_SHEET.test(id)) return null
      return { code: code.replace(FONT_FACE_RULE, ''), map: null }
    },
  }
}

export default defineConfig({
  plugins: [
    // Compiles src/shadow.css (imported ?inline by styled.ts) with Tailwind.
    tailwindcss(),
    fontsStayOnThePage(),
    // One Svelte plugin compiles both the custom-element wrappers in
    // packages/wc/src/elements and the @w5-ui/svelte components they mount
    // inside their shadow root; only the wrappers compile as custom elements.
    svelte({
      preprocess: vitePreprocess(),
      dynamicCompileOptions: ({ filename }) =>
        isCustomElementWrapper(filename) ? { customElement: true } : undefined,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rolldownOptions: {
      output: {
        // Inline everything into a single bundle so consumers only need
        // one import to register all elements.
        codeSplitting: false,
      },
    },
    sourcemap: true,
    target: 'es2022',
    minify: false,
  },
})
