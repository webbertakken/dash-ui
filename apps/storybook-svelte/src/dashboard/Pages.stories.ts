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
import Wireless from 'dashboard-svelte/pages/Wireless.svelte';
import Infrastructure from 'dashboard-svelte/pages/Infrastructure.svelte';
import Integrations from 'dashboard-svelte/pages/Integrations.svelte';

// In @storybook/svelte v8, `meta.component` sets the default; per-story
// `component` is NOT honoured as an override. To render a different
// component per story we use `render` returning `{ Component }`, which is
// the contract the Svelte renderer's PreviewRender consumes.
const meta: Meta = {
  title: 'Dashboard/Pages',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;
const r = (Component: unknown) => () => ({ Component });

export const DashboardPage: Story = { name: 'Dashboard', render: r(Dashboard) };
export const DevicesPage: Story = { name: 'Devices', render: r(Devices) };
export const ClientsPage: Story = { name: 'Client Devices', render: r(Clients) };
export const TopologyPage: Story = { name: 'Topology', render: r(Topology) };
export const AlarmsPage: Story = { name: 'Alarm Manager', render: r(Alarms) };
export const LogsPage: Story = { name: 'Logs', render: r(Logs) };
export const WifiPage: Story = { name: 'Wi-Fi', render: r(Wifi) };
export const PortsPage: Story = { name: 'Ports', render: r(Ports) };
export const VpnPage: Story = { name: 'VPN', render: r(Vpn) };
export const SecurityPage: Story = { name: 'Security', render: r(Security) };
export const SettingsPage: Story = { name: 'Settings', render: r(Settings) };
export const WirelessPage: Story = { name: 'Wireless', render: r(Wireless) };
export const InfrastructurePage: Story = { name: 'Infrastructure', render: r(Infrastructure) };
export const IntegrationsPage: Story = { name: 'Integrations', render: r(Integrations) };
