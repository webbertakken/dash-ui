// Embeds the full dashboard-react app inside a single Storybook story so the
// reader can pick a renderer here, see the chrome (Topbar + Sidebar) and
// click between every page without opening another tab.

import type { Meta, StoryObj } from '@storybook/react';
import { App } from 'dashboard-react/App';

const meta: Meta<typeof App> = {
  title: 'Dashboard/Full app',
  component: App,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The complete dashboard app, exactly as shipped in apps/dashboard-react. Use the sidebar inside the canvas to switch between Dashboard, Devices, Topology, Settings (8 tabs) and the rest.' } },
  },
};
export default meta;

type Story = StoryObj<typeof App>;

export const FullApp: Story = {
  name: 'Full app',
};
