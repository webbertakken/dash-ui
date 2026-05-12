import type { Meta, StoryObj } from '@storybook/svelte'
import App from 'dashboard-svelte/App.svelte'

const meta: Meta = {
  title: 'Dashboard/Full app',
  component: App as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The complete dashboard app, exactly as shipped in apps/dashboard-svelte. Use the sidebar inside the canvas to switch between pages.',
      },
    },
  },
}
export default meta

type Story = StoryObj

export const FullApp: Story = { name: 'Full app' }
