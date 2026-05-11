import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
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
  framework: { name: '@storybook/react-vite', options: {} },
  docs: {},
  typescript: { check: false, reactDocgen: false },
  staticDirs: ['../public'],
};

export default config;
