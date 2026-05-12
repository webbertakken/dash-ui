import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // 1. Custom-element wrappers from packages/wc/src/elements
    svelte({
      compilerOptions: {
        customElement: true,
      },
      include: [/packages\/wc\/src\/.*\.svelte$/],
      preprocess: vitePreprocess(),
    }),
    // 2. The underlying @w5-ui/svelte components, compiled normally so the
    //    wrappers can mount them inside their custom-element shadow root.
    svelte({
      compilerOptions: { customElement: false },
      include: [/packages\/svelte\/.*\.svelte$/],
      preprocess: vitePreprocess(),
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      output: {
        // Inline everything into a single bundle so consumers only need
        // one import to register all elements.
        inlineDynamicImports: true,
      },
    },
    sourcemap: true,
    target: 'es2022',
    minify: false,
  },
})
