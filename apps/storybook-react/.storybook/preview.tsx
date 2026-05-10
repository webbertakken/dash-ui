import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { CATEGORY_ORDER } from '@dash-ui/storybook-meta';
import '@dash-ui/tokens/tokens.css';
import '@dash-ui/react/styles.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dashboard',
      values: [
        { name: 'dashboard', value: '#0A1623' },
        { name: 'card', value: '#13202E' },
        { name: 'light', value: '#F4F6F9' },
      ],
    },
    options: {
      storySort: {
        order: ['Foundations', ...CATEGORY_ORDER.filter((c) => c !== 'Foundations')],
      },
    },
    controls: { expanded: true },
    a11y: { context: '#storybook-root' },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { Dark: 'dark', Light: 'light' },
      defaultTheme: 'Dark',
      attributeName: 'data-motif',
    }),
  ],
};

export default preview;
