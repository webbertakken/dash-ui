import type { Meta, StoryObj } from '@storybook/svelte'
import FleetBoardDemo from './FleetBoardDemo.svelte'

const meta = {
  title: 'Fleet/FleetBoard',
  component: FleetBoardDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FleetBoardDemo>
export default meta

type Story = StoryObj<typeof meta>

export const MultiGroup: Story = {
  name: 'multi-group (all up)',
  args: { single: false, degraded: false },
}

export const SingleGroup: Story = {
  name: 'single-group',
  args: { single: true, degraded: false },
}

export const Degraded: Story = {
  name: 'degraded / down',
  args: { single: false, degraded: true },
}

export const WithDrilldown: Story = {
  name: 'with drill-down open',
  args: { single: false, degraded: false, withDrilldown: true },
}
