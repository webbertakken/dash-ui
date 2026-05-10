import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dash-ui/tokens': path.resolve(__dirname, 'packages/tokens/src/tokens.ts'),
      '@dash-ui/assets': path.resolve(__dirname, 'packages/assets/src/index.ts'),
      '@dash-ui/react': path.resolve(__dirname, 'packages/react/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'packages/**/*.test.{ts,tsx}',
    ],
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
      thresholds: {
        lines: 100,
        statements: 100,
        functions: 100,
        branches: 95,
      },
    },
    css: {
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
});
