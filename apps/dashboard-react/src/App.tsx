import { useState } from 'react';
import {
  Topbar,
  Sidebar,
  Modal,
  Field,
  Pill,
  Button,
  DashboardIcon,
  DevicesIcon,
  ClientsIcon,
  TopologyIcon,
  AlarmIcon,
  LogsIcon,
  WifiIcon,
  PortsIcon,
  VpnIcon,
  SecurityIcon,
  SettingsIcon,
  AirviewIcon,
  InfraIcon,
  IntegrationsIcon,
  type SidebarSectionDef,
} from '@dash-ui/react';
import { Dashboard } from './pages/Dashboard.js';
import { Topology } from './pages/Topology.js';
import { Devices } from './pages/Devices.js';
import { Clients } from './pages/Clients.js';
import { Alarms } from './pages/Alarms.js';
import { Logs } from './pages/Logs.js';
import { Wifi } from './pages/Wifi.js';
import { Ports } from './pages/Ports.js';
import { Vpn } from './pages/Vpn.js';
import { Security } from './pages/Security.js';
import { Settings } from './pages/Settings.js';
import { AirView } from './pages/AirView.js';
import { Infrastructure } from './pages/Infrastructure.js';
import { Integrations } from './pages/Integrations.js';

const SECTIONS: SidebarSectionDef[] = [
  {
    title: 'Manage',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { id: 'devices', label: 'Devices', icon: <DevicesIcon />, count: 12 },
      { id: 'clients', label: 'Client Devices', icon: <ClientsIcon />, count: 142 },
      { id: 'topology', label: 'Topology', icon: <TopologyIcon /> },
      { id: 'alarms', label: 'Alarm Manager', icon: <AlarmIcon />, pill: 3 },
      { id: 'logs', label: 'Logs', icon: <LogsIcon /> },
    ],
  },
  {
    title: 'Configure',
    items: [
      { id: 'wifi', label: 'Wi-Fi', icon: <WifiIcon /> },
      { id: 'ports', label: 'Ports', icon: <PortsIcon /> },
      { id: 'vpn', label: 'VPN', icon: <VpnIcon /> },
      { id: 'security', label: 'Security', icon: <SecurityIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ],
  },
  {
    title: 'Insights',
    items: [
      { id: 'airview', label: 'AirView', icon: <AirviewIcon /> },
      { id: 'infra', label: 'Infrastructure', icon: <InfraIcon /> },
      { id: 'integrations', label: 'Integrations', icon: <IntegrationsIcon /> },
    ],
  },
];

export function App() {
  const [activeApp, setActiveApp] = useState('network');
  const [page, setPage] = useState('topology');
  const [adoptOpen, setAdoptOpen] = useState(false);

  const openAdopt = () => setAdoptOpen(true);
  const closeAdopt = () => setAdoptOpen(false);

  return (
    <div className="app">
      <Topbar siteName="Edge Gateway (Gateway)" activeApp={activeApp} onAppChange={setActiveApp} />
      <div className="workspace">
        <Sidebar sections={SECTIONS} activeId={page} onChange={setPage} />
        <main className="content">
          {page === 'dashboard' && <Dashboard onAdopt={openAdopt} />}
          {page === 'devices' && <Devices onAdopt={openAdopt} />}
          {page === 'clients' && <Clients />}
          {page === 'topology' && <Topology />}
          {page === 'alarms' && <Alarms />}
          {page === 'logs' && <Logs />}
          {page === 'wifi' && <Wifi />}
          {page === 'ports' && <Ports />}
          {page === 'vpn' && <Vpn />}
          {page === 'security' && <Security />}
          {page === 'settings' && <Settings />}
          {page === 'airview' && <AirView />}
          {page === 'infra' && <Infrastructure />}
          {page === 'integrations' && <Integrations />}
        </main>
      </div>

      <Modal
        open={adoptOpen}
        onClose={closeAdopt}
        title="Adopt Device"
        footer={
          <>
            <Button onClick={closeAdopt}>Cancel</Button>
            <Button variant="primary" onClick={closeAdopt}>
              Adopt
            </Button>
          </>
        }
      >
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: '10px 12px',
            background: '#0A0A0B',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            marginBottom: 14,
          }}
        >
          <div className="dr-thumb" style={{ width: 40, height: 40, fontSize: 8 }}>
            U7 PRO
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>AP Pro · Warehouse</div>
            <div style={{ fontSize: 11, color: '#6E7079', fontFamily: '"JetBrains Mono", monospace' }}>
              f4:b1:00:aa:bb:c2 · 192.168.1.19
            </div>
          </div>
          <Pill variant="info">Pending</Pill>
        </div>
        <Field label="Device name" defaultValue="AP Pro · Warehouse" />
        <Field label="Site" defaultValue="Edge Gateway (Gateway)" />
      </Modal>
    </div>
  );
}
