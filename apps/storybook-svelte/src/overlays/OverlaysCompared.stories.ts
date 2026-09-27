// Tooltip vs hover card vs popover, side by side. Embedded by the
// Foundations / Overlays page; mirrored in the React and WC storybooks.

import type { Meta, StoryObj } from '@storybook/svelte'
import OverlaysComparedDemo from './OverlaysComparedDemo.svelte'

const meta: Meta = {
  title: 'Selection & menus/Overlays compared',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tooltip names a control (1 s hover, instant keyboard focus). Hover card shows rich, non-essential content (instant). Popover is a click-opened, interactive surface.',
      },
    },
  },
}
export default meta

type Story = StoryObj

export const Compared: Story = {
  name: 'Tooltip vs hover card vs popover',
  render: () => ({ Component: OverlaysComparedDemo }),
}
