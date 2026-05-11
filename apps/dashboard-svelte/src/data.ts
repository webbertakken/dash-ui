// Data shared across pages — mirrors apps/dashboard-react/src/data.ts.

export interface TopologyNode {
  id: string;
  type: 'isp' | 'gateway' | 'switch' | 'ap' | 'cam' | 'iot';
  name: string;
  meta: string;
  status: 'good' | 'warn' | 'danger' | 'info';
  x: number;
  y: number;
  clients?: number;
}

export interface TopologyLink {
  a: string;
  b: string;
  speed: string;
  cls: 'tenG' | 'fiveG' | 'oneG' | 'wifi';
}

export const NODES: TopologyNode[] = [
  { id: 'isp', type: 'isp', name: 'Internet', meta: '847 / 312 Mbps', status: 'good', x: 0.5, y: 0.06 },
  { id: 'gw', type: 'gateway', name: 'Edge Gateway X1', meta: '192.168.1.1', status: 'good', x: 0.5, y: 0.24, clients: 142 },
  { id: 'sw1', type: 'switch', name: 'ES-24-Pro-PoE', meta: '192.168.1.2', status: 'good', x: 0.22, y: 0.5, clients: 18 },
  { id: 'sw2', type: 'switch', name: 'ES-8-Lite-PoE', meta: '192.168.1.3', status: 'good', x: 0.78, y: 0.5, clients: 6 },
  { id: 'ap1', type: 'ap', name: 'AP Pro · Lobby', meta: '192.168.1.18', status: 'warn', x: 0.1, y: 0.78, clients: 24 },
  { id: 'ap2', type: 'ap', name: 'AP-Plus · Conference', meta: '192.168.1.20', status: 'good', x: 0.28, y: 0.78, clients: 31 },
  { id: 'ap3', type: 'ap', name: 'AP-Plus · Reception', meta: '192.168.1.21', status: 'good', x: 0.46, y: 0.78, clients: 14 },
  { id: 'cam1', type: 'cam', name: 'Cam-Pro 5 · Reception', meta: '192.168.1.30', status: 'good', x: 0.66, y: 0.78 },
  { id: 'cam2', type: 'cam', name: 'Cam-Bullet 5 · Side Entry', meta: '—', status: 'danger', x: 0.84, y: 0.78 },
];

export const LINKS: TopologyLink[] = [
  { a: 'isp', b: 'gw', speed: '10 GbE', cls: 'tenG' },
  { a: 'gw', b: 'sw1', speed: '10 GbE', cls: 'tenG' },
  { a: 'gw', b: 'sw2', speed: '2.5 GbE', cls: 'fiveG' },
  { a: 'sw1', b: 'ap1', speed: '2.5 GbE', cls: 'fiveG' },
  { a: 'sw1', b: 'ap2', speed: '1 GbE', cls: 'oneG' },
  { a: 'sw1', b: 'ap3', speed: '1 GbE', cls: 'oneG' },
  { a: 'sw2', b: 'cam1', speed: '1 GbE PoE', cls: 'oneG' },
  { a: 'sw2', b: 'cam2', speed: '—', cls: 'oneG' },
];

export const NODE_LABEL: Record<TopologyNode['type'], string> = {
  gateway: 'EG-X1',
  switch: 'ES',
  ap: 'U7 PRO',
  cam: 'G5',
  isp: 'WAN',
  iot: 'IOT',
};

export type DeviceRow = [string, string, string, string, string, string, string, string, string, string, string | null];
export const DEVICES: DeviceRow[] = [
  ['Front Office EG', 'EG-X1', 'f4:b1:00:11:22:33', '192.168.1.1', '24d 14h', '—', '#00B070', 'Connected', '#5DDB9F', 'EG', null],
  ['ES-24-Pro-PoE', 'ES-24-Pro-PoE', 'f4:b1:00:11:22:34', '192.168.1.2', '24d 14h', '—', '#00B070', 'Connected', '#5DDB9F', 'ES', null],
  ['ES-8-Lite-PoE', 'ES-8-Lite-PoE', 'f4:b1:00:11:22:35', '192.168.1.3', '5d 02h', '—', '#00B070', 'Connected', '#5DDB9F', 'ES', null],
  ['AP Pro · Lobby', 'AP-Pro', 'f4:b1:00:aa:bb:c1', '192.168.1.18', '—', '24', '#F5A623', 'Updating · 64%', '#F5C26B', 'AP', 'strong'],
  ['AP Pro · Warehouse', 'AP-Pro', 'f4:b1:00:aa:bb:c2', '192.168.1.19', '—', '—', '#006FFF', 'Adopting', '#7FB6FF', 'AP', null],
  ['AP-Plus · Conference', 'AP-Plus', 'f4:b1:00:aa:bb:c3', '192.168.1.20', '12d 03h', '31', '#00B070', 'Connected', '#5DDB9F', 'AP', 'strong'],
  ['AP-Plus · Reception', 'AP-Plus', 'f4:b1:00:aa:bb:c4', '192.168.1.21', '12d 03h', '14', '#00B070', 'Connected', '#5DDB9F', 'AP', 'strong'],
  ['AP-Wall · Office 4', 'AP-Wall', 'f4:b1:00:aa:bb:c5', '192.168.1.22', '3d 19h', '9', '#00B070', 'Connected', '#5DDB9F', 'AP', 'weak'],
  ['Cam-Bullet 5 · Side Entry', 'CAM-Bullet5', 'f4:b1:00:cc:dd:01', '—', '—', '—', '#F03A3A', 'Offline', '#FF7B7B', 'CAM', null],
  ['Cam-Pro 5 · Reception', 'CAM-Pro5', 'f4:b1:00:cc:dd:02', '192.168.1.30', '9d 02h', '—', '#00B070', 'Connected', '#5DDB9F', 'CAM', null],
  ['Cam-Flex 5 · Stockroom', 'CAM-Flex5', 'f4:b1:00:cc:dd:03', '192.168.1.31', '9d 02h', '—', '#00B070', 'Connected', '#5DDB9F', 'CAM', null],
  ['UA-G2 · Front Door', 'UA-G2', 'f4:b1:00:ee:ff:01', '192.168.1.40', '17d 06h', '—', '#00B070', 'Connected', '#5DDB9F', 'UA', null],
];

export type ClientRow = [string, string, string, string, string, string, string, string | null];
export const CLIENTS: ClientRow[] = [
  ['Maria · MacBook Pro', '192.168.1.142', 'c8:69:cd:11:23:11', 'Office', '5 GHz', 'AP Pro · Lobby', '42.1 / 8.4 MB/s', 'strong'],
  ['Tobias · iPhone 15', '192.168.20.84', '3a:42:90:ab:cc:01', 'Staff', '5 GHz', 'AP Pro · Warehouse', '5.4 / 1.1 MB/s', 'strong'],
  ['Pixel 8 Pro', '192.168.1.156', 'b8:c1:71:dd:ee:02', 'Guest', '2.4 GHz', 'AP-Plus · Reception', '1.2 / 0.8 MB/s', 'weak'],
  ['HP-LaserJet-M404', '192.168.10.4', '3c:5a:b4:00:11:21', 'Office', 'Wired', 'ES-24-Pro · port 12', '—', null],
  ['NAS-Synology', '192.168.10.6', '00:11:32:cc:dd:31', 'Office', 'Wired · 10G', 'Edge Gateway · SFP+ 1', '118 / 46 MB/s', null],
  ['ESPRESSO-Hub', '192.168.30.18', 'aa:bb:cc:33:44:55', 'IoT VLAN', '2.4 GHz', 'AP-Plus · Conference', '0.04 / 0.02 MB/s', 'weak'],
  ['Nest-Thermostat', '192.168.30.19', 'aa:bb:cc:33:44:56', 'IoT VLAN', '2.4 GHz', 'AP-Plus · Reception', '—', 'weak'],
];

export type DashboardDeviceRow = [string, string, string, string, string, string, string, string];
export const DASHBOARD_DEVICES: DashboardDeviceRow[] = [
  ['Front Office EG', 'EG-X1', '192.168.1.1', '24d 14h', '41 / 38', '#00B070', 'Connected', '#5DDB9F'],
  ['ES-24-Pro-PoE', 'ES-24-Pro-PoE', '192.168.1.2', '24d 14h', '12 / 18', '#00B070', 'Connected', '#5DDB9F'],
  ['ES-8-Lite-PoE', 'ES-8-Lite-PoE', '192.168.1.3', '5d 02h', '8 / 21', '#00B070', 'Connected', '#5DDB9F'],
  ['AP Pro · Lobby', 'AP-Pro', '192.168.1.18', '—', '—', '#F5A623', 'Updating · 64%', '#F5C26B'],
  ['AP Pro · Warehouse', 'AP-Pro', '192.168.1.19', '—', '—', '#006FFF', 'Adopting', '#7FB6FF'],
  ['Cam-Pro 5 · Reception', 'CAM-Pro5', '192.168.1.30', '9d 02h', '22 / 30', '#00B070', 'Connected', '#5DDB9F'],
  ['Cam-Bullet 5 · Side Entry', 'CAM-Bullet5', '—', '—', '—', '#F03A3A', 'Offline · 2 min', '#FF7B7B'],
];

export const DASHBOARD_ALARMS: [string, string, string, string][] = [
  ['danger', 'Cam-Bullet 5 offline', 'Side Entry · No PoE link detected', '2 min'],
  ['warn', 'High CPU on Edge Gateway', 'Sustained 84% for 3 minutes', '8 min'],
  ['warn', 'DHCP pool 92% full', 'VLAN 20 · 234 / 254 leases', '14 min'],
];

export const SSIDS: [string, string, string, string, string, string, string, string][] = [
  ['Office', 'WPA3', '5 GHz · 2.4 GHz', 'VLAN 1 · Default', '142', 'active', '#00B070', 'Active'],
  ['Staff', 'WPA3', '5 GHz only', 'VLAN 20 · Staff', '38', 'active', '#00B070', 'Active'],
  ['Guest', 'Captive Portal', '2.4 GHz · 5 GHz', 'VLAN 30 · Guest', '7', 'active', '#00B070', 'Active · 4 h limit'],
  ['IoT', 'WPA2-PSK', '2.4 GHz only', 'VLAN 30 · IoT', '24', 'active', '#00B070', 'Active'],
  ['Conference-AV', 'Open · MAC ACL', '5 GHz only', 'VLAN 40 · AV', '3', 'paused', '#F5A623', 'Paused'],
  ['Legacy-Printers', 'WPA2-PSK', '2.4 GHz only', 'VLAN 50 · Print', '2', 'disabled', '#6E7079', 'Disabled'],
];

export const PORT_STATES: [string, string, string][] = [
  ['up', '1G', 'VLAN 1'], ['up', '1G', 'VLAN 1'], ['up', '1G', 'VLAN 20'], ['poe', '1G', 'VLAN 30'],
  ['poe', '1G', 'VLAN 30'], ['poe', '1G', 'VLAN 30'], ['poe', '1G', 'VLAN 30'], ['up', '1G', 'VLAN 1'],
  ['up', '1G', 'VLAN 1'], ['', '', '—'], ['up', '1G', 'VLAN 10'], ['up', '1G', 'VLAN 10'],
  ['poe', '1G', 'VLAN 1'], ['poe', '1G', 'VLAN 1'], ['', '', '—'], ['', '', '—'],
  ['up', '1G', 'VLAN 1'], ['up', '1G', 'VLAN 1'], ['poe', '1G', 'VLAN 1'], ['poe', '1G', 'VLAN 1'],
  ['poe', '2.5G', 'VLAN 1'], ['poe', '2.5G', 'VLAN 1'], ['', '', '—'], ['', '', '—'],
];

export const LOG_ROWS: [string, string, string, string, string, string][] = [
  ['info', 'Network', '12:42:18', 'Client connected', 'Maria · MacBook Pro', 'c8:69:cd:11:23:11 ↔ AP Pro · Lobby (5 GHz)'],
  ['warn', 'Network', '12:41:55', 'High channel utilisation', 'AP-Plus · Conference', '2.4 GHz at 71% over 3 min'],
  ['danger', 'Security', '12:41:02', 'Threat blocked · Mirai C2', '192.168.30.18', '185.220.101.42:8443 — IDS sig 1:2024918'],
  ['info', 'System', '12:39:14', 'Firmware updated', 'AP Pro · Lobby', '9.4.20 → 9.4.21 (signed)'],
  ['warn', 'Network', '12:38:42', 'PoE budget warning', 'ES-24-Pro-PoE', '186 / 400 W · port 13 spike'],
  ['info', 'Access', '12:36:01', 'Door unlock', 'Front Door · UA-G2', 'Maria · MacBook Pro · NFC card'],
  ['danger', 'Network', '12:32:18', 'Device offline', 'Cam-Bullet 5 · Side Entry', 'No PoE link · port 22 ES-8-Lite'],
  ['info', 'Network', '12:31:47', 'DHCP lease', 'Pixel 8 Pro', '192.168.30.156 (Guest) · 4h'],
  ['info', 'VPN', '12:30:12', 'Teleport session', 'Tobias · iPhone 15', '100.64.0.61 ← 81.2.69.142'],
  ['warn', 'System', '12:28:33', 'CPU sustained 84%', 'Edge Gateway X1', '3 min average'],
  ['info', 'Network', '12:27:51', 'Port up', 'ES-24-Pro · port 21', '2.5 Gbps full-duplex · NAS uplink'],
  ['info', 'Protect', '12:25:08', 'Recording started', 'Cam-Pro 5 · Reception', 'Motion detected · person'],
];
