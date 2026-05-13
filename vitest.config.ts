import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react({ include: /\.tsx?$/ }),
    svelte({
      compilerOptions: { customElement: false },
      include: [/packages\/svelte\/.*\.svelte$/],
      preprocess: vitePreprocess(),
      hot: false,
    }),
  ],
  resolve: {
    alias: {
      '@w5-ui/tokens': path.resolve(__dirname, 'packages/tokens/src/tokens.ts'),
      '@w5-ui/assets': path.resolve(__dirname, 'packages/assets/src/index.ts'),
      '@w5-ui/react': path.resolve(__dirname, 'packages/react/src/index.ts'),
      '@w5-ui/svelte': path.resolve(__dirname, 'packages/svelte/src/lib/index.ts'),
    },
    // Svelte 5 ships separate server/client builds; tests run in jsdom
    // which is browser-like, so resolve to the browser/client build.
    // Without 'browser' first, `mount(...)` throws lifecycle_function_unavailable.
    conditions: ['browser', 'development', 'module', 'default'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'packages/react/src/components/**/*.{ts,tsx}',
        'packages/svelte/src/lib/components/**/*.{ts,svelte}',
        'packages/wc/src/**/*.{ts,svelte}',
      ],
      exclude: [
        '**/index.ts',
        '**/*.d.ts',
        '**/*.stories.*',
        '**/*.test.*',
        'packages/svelte/src/lib/components/icons/**',
      ],
      // See DECISIONS.md §2026-05-10 "Coverage thresholds". Smoke + interaction
      // tests cover every component but a small number of defensive branches
      // (chart edge cases, error rejections) are intentionally not exercised.
      thresholds: {
        lines: 95,
        statements: 95,
        functions: 88,
        branches: 80,
      },
    },
    css: {
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
})
