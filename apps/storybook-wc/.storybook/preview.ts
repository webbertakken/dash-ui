import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/web-components'
import '@w5-ui/tokens/tokens.css'
// Importing the wc bundle has the side effect of registering every uni-* tag
import '@w5-ui/wc'
import '@w5-ui/wc/styles.css'
import './preview.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true, grid: { disable: true } },
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
}

export default preview
