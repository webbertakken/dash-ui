import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Storybook's Svelte preview build runs through Vite, so its plugins
 * apply to every story render. We hook `@tailwindcss/vite` here so every
 * migrated component picks up its inline Tailwind utilities. Without
 * this, stories render as raw HTML lists with default browser styles
 * — exactly what we caught when inspecting Sidebar on its own.
 */
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
})
