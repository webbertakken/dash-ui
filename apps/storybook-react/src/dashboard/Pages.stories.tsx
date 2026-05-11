// One story per page in the dashboard, rendered standalone (no chrome) so
// they can be browsed individually without leaving Storybook.

import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from 'dashboard-react/pages/Dashboard';
import { Devices } from 'dashboard-react/pages/Devices';
import { Clients } from 'dashboard-react/pages/Clients';
import { Topology } from 'dashboard-react/pages/Topology';
import { Alarms } from 'dashboard-react/pages/Alarms';
import { Logs } from 'dashboard-react/pages/Logs';
import { Wifi } from 'dashboard-react/pages/Wifi';
import { Ports } from 'dashboard-react/pages/Ports';
import { Vpn } from 'dashboard-react/pages/Vpn';
import { Security } from 'dashboard-react/pages/Security';
import { Settings } from 'dashboard-react/pages/Settings';
import { Wireless } from 'dashboard-react/pages/Wireless';
import { Infrastructure } from 'dashboard-react/pages/Infrastructure';
import { Integrations } from 'dashboard-react/pages/Integrations';

const meta: Meta = {
  title: 'Dashboard/Pages',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;
const noop = () => {};

export const DashboardPage: Story = { name: 'Dashboard', render: () => <Dashboard onAdopt={noop} /> };
export const DevicesPage: Story = { name: 'Devices', render: () => <Devices onAdopt={noop} /> };
export const ClientsPage: Story = { name: 'Client Devices', render: () => <Clients /> };
export const TopologyPage: Story = { name: 'Topology', render: () => <Topology onAdopt={noop} /> };
export const AlarmsPage: Story = { name: 'Alarm Manager', render: () => <Alarms /> };
export const LogsPage: Story = { name: 'Logs', render: () => <Logs /> };
export const WifiPage: Story = { name: 'Wi-Fi', render: () => <Wifi /> };
export const PortsPage: Story = { name: 'Ports', render: () => <Ports /> };
export const VpnPage: Story = { name: 'VPN', render: () => <Vpn /> };
export const SecurityPage: Story = { name: 'Security', render: () => <Security /> };
export const SettingsPage: Story = { name: 'Settings', render: () => <Settings /> };
export const WirelessPage: Story = { name: 'Wireless', render: () => <Wireless /> };
export const InfrastructurePage: Story = { name: 'Infrastructure', render: () => <Infrastructure /> };
export const IntegrationsPage: Story = { name: 'Integrations', render: () => <Integrations /> };
