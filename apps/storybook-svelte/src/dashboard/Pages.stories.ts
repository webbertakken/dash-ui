import type { Meta, StoryObj } from '@storybook/svelte';
import Dashboard from 'dashboard-svelte/pages/Dashboard.svelte';
import Devices from 'dashboard-svelte/pages/Devices.svelte';
import Clients from 'dashboard-svelte/pages/Clients.svelte';
import Topology from 'dashboard-svelte/pages/Topology.svelte';
import Alarms from 'dashboard-svelte/pages/Alarms.svelte';
import Logs from 'dashboard-svelte/pages/Logs.svelte';
import Wifi from 'dashboard-svelte/pages/Wifi.svelte';
import Ports from 'dashboard-svelte/pages/Ports.svelte';
import Vpn from 'dashboard-svelte/pages/Vpn.svelte';
import Security from 'dashboard-svelte/pages/Security.svelte';
import Settings from 'dashboard-svelte/pages/Settings.svelte';
import AirView from 'dashboard-svelte/pages/AirView.svelte';
import Infrastructure from 'dashboard-svelte/pages/Infrastructure.svelte';
import Integrations from 'dashboard-svelte/pages/Integrations.svelte';

// Storybook 8 + Svelte 4 supports overriding the component per-story in meta.
// We pick Dashboard as the default placeholder so MDX docs / Controls have a
// component to inspect.
const meta: Meta = {
  title: 'Dashboard/Pages',
  component: Dashboard as any,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const DashboardPage: Story = { name: 'Dashboard', component: Dashboard as any };
export const DevicesPage: Story = { name: 'Devices', component: Devices as any };
export const ClientsPage: Story = { name: 'Client Devices', component: Clients as any };
export const TopologyPage: Story = { name: 'Topology', component: Topology as any };
export const AlarmsPage: Story = { name: 'Alarm Manager', component: Alarms as any };
export const LogsPage: Story = { name: 'Logs', component: Logs as any };
export const WifiPage: Story = { name: 'Wi-Fi', component: Wifi as any };
export const PortsPage: Story = { name: 'Ports', component: Ports as any };
export const VpnPage: Story = { name: 'VPN', component: Vpn as any };
export const SecurityPage: Story = { name: 'Security', component: Security as any };
export const SettingsPage: Story = { name: 'Settings', component: Settings as any };
export const AirViewPage: Story = { name: 'AirView', component: AirView as any };
export const InfrastructurePage: Story = { name: 'Infrastructure', component: Infrastructure as any };
export const IntegrationsPage: Story = { name: 'Integrations', component: Integrations as any };
