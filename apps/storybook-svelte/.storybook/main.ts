import type { StorybookConfig } from '@storybook/svelte-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|svelte)'],
  addons: [
    {
      // addon-essentials bundles addon-docs but its docs preset does NOT
      // forward `mdxPluginOptions` to the active @storybook/addon-docs
      // preset (it reads them via `presets.apply('options')` at the
      // addon-docs level, not nested under essentials). Opt out of the
      // bundled docs preset here and register addon-docs separately below
      // so remark-gfm actually plugs into the MDX pipeline and pipe-tables
      // render as <table>, not as a literal paragraph of `|` characters.
      name: '@storybook/addon-essentials',
      options: { docs: false },
    },
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: { name: '@storybook/svelte-vite', options: {} },
  docs: {},
  staticDirs: ['../public'],
}

export default config
