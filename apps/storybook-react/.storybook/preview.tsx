import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '@dash-ui/tokens/tokens.css';
import '@dash-ui/react/styles.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    // Disable the backgrounds addon - it would race with the motif data
    // attribute and stories would lose their token-driven background. The
    // motif toolbar (Light / Dark) is the single source of truth.
    backgrounds: { disable: true, grid: { disable: true } },
    options: {
      // Storybook 8 requires this to be a literal
      storySort: {
        order: [
          'Foundations',
          'Dashboard',
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
