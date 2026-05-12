import type { StorybookConfig } from '@storybook/web-components-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|js)'],
  addons: [
    {
      // addon-essentials bundles addon-docs; configure GFM here so MDX
      // tables, strikethrough and task lists render. MDX 3 omits these.
      name: '@storybook/addon-essentials',
      options: {
        docs: {
          mdxPluginOptions: {
            mdxCompileOptions: { remarkPlugins: [remarkGfm] },
          },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: { name: '@storybook/web-components-vite', options: {} },
  docs: {},
  staticDirs: ['../public'],
}

export default config
