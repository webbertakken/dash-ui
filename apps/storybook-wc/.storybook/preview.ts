import type { Preview } from '@storybook/web-components';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '@dash-ui/tokens/tokens.css';
// Importing the wc bundle has the side effect of registering every uni-* tag
import '@dash-ui/wc';
import '@dash-ui/wc/styles.css';
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
        order: [
          'Foundations',
          'Layout',
          'Inputs',
          'Selection & menus',
          'Navigation',
          'Feedback',
          'Data display',
          'Charts: comparison',
          'Charts: time-series',
          'Charts: distribution',
          'Charts: hierarchy & flow',
          'Specialised',
        ],
      },
    },
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
