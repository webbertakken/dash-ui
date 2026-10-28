import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

const isCustomElementWrapper = (filename: string) => /packages\/wc\/src\/.*\.svelte$/.test(filename)

export default defineConfig({
  plugins: [
    // Compiles src/shadow.css (imported ?inline by styled.ts) with Tailwind.
    tailwindcss(),
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
