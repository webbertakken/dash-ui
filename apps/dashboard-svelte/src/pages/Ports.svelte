<script lang="ts">
  import { Card, Button, Pill, Tabs, SunburstChart, RadialBarChart, MatrixChart, StackedBarChart, SwitchPortGrid, TransferList } from '@w5-ui/svelte';
  import type { SunburstNode, RadialBarItem, StackedBarSeries, SwitchPort, TransferListItem } from '@w5-ui/svelte';
  import { PORT_STATES } from '../data';
  let tab = $state('main');

  const portsGrid: SwitchPort[] = PORT_STATES.map(([status, speed, label]) => ({
    status: (status === 'up' ? 'up' : status === 'poe' ? 'poe' : 'down') as SwitchPort['status'],
    speed: speed || undefined,
    label: label !== '—' ? label : undefined,
  }));

  const INTERFACE_UTIL: RadialBarItem[] = [
    { label: 'Port 01 · Uplink', value: 842, max: 1000, color: '#006FFF', unit: ' Mbps' },
    { label: 'Port 21 · NAS', value: 164, max: 2500, color: '#00C875', unit: ' Mbps' },
    { label: 'Port 04 · AP Lobby', value: 60, max: 1000, color: '#F5A623', unit: ' Mbps' },
    { label: 'Port 05 · AP Reception', value: 50, max: 1000, color: '#A78BFA', unit: ' Mbps' },
  ];

  const PROTOCOL_BREAKDOWN: SunburstNode = {
    label: 'GB · 24h',
    children: [
      {
        label: 'TCP', color: '#006FFF',
        children: [
          { label: 'HTTPS', value: 824 },
          { label: 'HTTP', value: 312 },
          { label: 'SSH', value: 148 },
          { label: 'SMTP', value: 64 },
          { label: 'Other', value: 89 },
        ],
      },
      {
        label: 'UDP', color: '#00C875',
        children: [
          { label: 'DNS', value: 218 },
          { label: 'DHCP', value: 44 },
          { label: 'NTP', value: 31 },
          { label: 'Other', value: 67 },
        ],
      },
      { label: 'ICMP', value: 28, color: '#A78BFA' },
    ],
  };

  const POE_DEVICES: [string, number][] = [
    ['AP · Lobby', 30],
    ['AP · Reception', 24],
    ['Camera · Reception', 19],
    ['NAS uplink', 0],
  ];
  const TRAFFIC_ROWS = ['P01 Uplink', 'P04 AP Lobby', 'P05 AP Recep.', 'P13 Camera', 'P21 NAS'];
  const TRAFFIC_COLS = ['VLAN 1', 'VLAN 10 Corp', 'VLAN 20 Mgmt', 'VLAN 30 IoT'];
  const TRAFFIC_MATRIX = [
    [842, 124, 12, 18],
    [18,    0,  2, 42],
    [12,    0,  1, 38],
    [84,    0,  0, 12],
    [46,  118,  0,  0],
  ];

  const PORTS: [number, string, string, string, string, string, string, string, string, string][] = [
    [1, 'Uplink → ISP', 'VLAN 1 · Default', 'Trunk all', 'Off', '1 Gbps', '842 / 310 Mbps', '#00B070', 'Connected', '#5DDB9F'],
    [4, 'AP · Lobby', 'VLAN 30 · IoT', 'PoE+ 802.3at', '30 W', '1 Gbps', '42 / 18 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
    [5, 'AP · Reception', 'VLAN 30 · IoT', 'PoE+ 802.3at', '24 W', '1 Gbps', '38 / 12 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
    [10, '—', '—', 'Disabled', 'Off', '—', '—', '#6E7079', 'Disabled', '#A4A7B5'],
    [13, 'Camera · Reception', 'VLAN 1', 'PoE++ 802.3bt', '19 W', '1 Gbps', '12 / 84 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
    [21, 'NAS uplink', 'VLAN 1', 'Trunk all', 'Off', '2.5 Gbps', '118 / 46 MB/s', '#00B070', 'Connected', '#5DDB9F'],
  ];

  let vlanAvailable: TransferListItem[] = $state([2,3,6,7,8,9,11,12,14,15,16,17,18,19,20,22,23,24].map((n) => ({
    id: `p${n}`,
    label: `Port ${String(n).padStart(2, '0')}`,
    description: 'Unassigned',
  })));
  let vlanAssigned: TransferListItem[] = $state([
    { id: 'p4', label: 'Port 04', description: 'AP · Lobby' },
    { id: 'p5', label: 'Port 05', description: 'AP · Reception' },
  ]);

  const PROTO_LABELS = ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];
  const PROTO_TRAFFIC: StackedBarSeries[] = [
    { label: 'HTTPS', color: '#006FFF', values: [12, 8, 6, 9, 42, 98, 124, 118, 132, 145, 138, 92] },
    { label: 'HTTP',  color: '#4797FF', values: [4, 3, 2, 3, 14, 32,  48,  46,  50,  54,  51, 34] },
    { label: 'DNS',   color: '#00C8C8', values: [6, 5, 4, 6, 18, 28,  34,  32,  36,  38,  35, 24] },
    { label: 'SSH',   color: '#A878F5', values: [2, 1, 1, 2,  8, 14,  18,  20,  22,  18,  14,  8] },
    { label: 'Other', color: '#6E7079', values: [3, 2, 2, 2,  6, 10,  14,  12,  14,  16,  13,  9] },
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Ports</div>
  <div class="ph-actions">
    <Button>Reset</Button>
    <Button>Cycle PoE</Button>
    <Button variant="primary">Apply</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 'main', label: 'ES-24-Pro-PoE', badge: 26 },
    { id: 'lite', label: 'ES-8-Lite-PoE', badge: 10 },
    { id: 'gw', label: 'Edge Gateway X1', badge: 10 },
  ]}
/>
<div class="grid">
  <Card span={12}>
    <h3>Front Panel · ES-24-Pro-PoE <Pill variant="success">Connected · 24d 14h</Pill></h3>
    <div style="margin-top:6px;">
      <SwitchPortGrid ports={portsGrid} ariaLabel="Front Panel · ES-24-Pro-PoE" />
    </div>
    <div style="display:flex;gap:8px;margin-top:14px;align-items:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;">
      <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:#A4A7B5;">
        <span style="width:10px;height:10px;background:rgba(0,176,112,0.3);border:1px solid rgba(0,176,112,0.5);border-radius:2px;"></span>
        Connected · 16
      </div>
      <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:#A4A7B5;">
        <span style="width:10px;height:10px;background:rgba(245,166,35,0.3);border:1px solid rgba(245,166,35,0.5);border-radius:2px;"></span>
        PoE · 11
      </div>
      <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:#A4A7B5;">
        <span style="width:10px;height:10px;background:#0A0A0B;border:1px solid rgba(255,255,255,0.10);border-radius:2px;"></span>
        Down · 8
      </div>
      <div style="margin-left:auto;display:flex;gap:18px;font-size:12px;color:#A4A7B5;font-variant-numeric:tabular-nums;">
        <span>PoE budget · <span style="color:#fff;">186 / 400 W</span></span>
        <span>Throughput · <span style="color:#fff;">1.4 Gbps</span></span>
      </div>
    </div>
  </Card>

  <Card span={12} style="padding:0;">
    <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h3 style="margin:0;color:#fff;">Port Configuration</h3>
    </div>
    <table>
      <caption class="sr-only">Port configuration</caption>
      <thead>
        <tr>
          <th scope="col">Port</th><th scope="col">Name</th><th scope="col">Network / VLAN</th><th scope="col">Profile</th><th scope="col">PoE</th>
          <th scope="col" style="text-align:right;">Speed</th>
          <th scope="col" style="text-align:right;">RX / TX</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each PORTS as p (p[0])}
          <tr>
            <td><span class="mac" style="color:#fff;font-weight:600;">{String(p[0]).padStart(2, '0')}</span></td>
            <td style="color:#fff;">{p[1]}</td>
            <td style="color:#A4A7B5;font-family:'JetBrains Mono',monospace;font-size:12px;">{p[2]}</td>
            <td><Pill variant="info">{p[3]}</Pill></td>
            <td style="color:#A4A7B5;font-variant-numeric:tabular-nums;">{p[4]}</td>
            <td style="text-align:right;font-variant-numeric:tabular-nums;color:#fff;">{p[5]}</td>
            <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{p[6]}</td>
            <td>
              <span style="display:inline-flex;align-items:center;gap:6px;color:{p[9]};font-size:12px;">
                <span style="width:6px;height:6px;border-radius:50%;background:{p[7]};"></span>{p[8]}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Card>

  <Card span={12}>
    <h3>VLAN port assignment <span class="unit">VLAN 10 · Corporate</span></h3>
    <div style="margin-top:8px;">
      <TransferList
        sourceLabel="Unassigned ports"
        targetLabel="VLAN 10 · Corporate"
        bind:source={vlanAvailable}
        bind:target={vlanAssigned}
      />
    </div>
  </Card>

  <Card span={6}>
    <h3>Traffic by protocol · 24h</h3>
    <SunburstChart
      root={PROTOCOL_BREAKDOWN}
      ariaLabel="Traffic by protocol: TCP 78% (HTTPS 824 GB, HTTP 312 GB, SSH 148 GB, SMTP 64 GB, other 89 GB), UDP 20% (DNS 218 GB, DHCP 44 GB, NTP 31 GB, other 67 GB), ICMP 2% (28 GB). Total 1.8 TB."
    />
  </Card>

  <Card span={6}>
    <h3>PoE power draw · live</h3>
    {#each POE_DEVICES as [name, watts] ([name])}
      <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="flex:1;font-size:12px;color:#C8C9D0;">{name}</div>
        <div style="font-size:13px;font-variant-numeric:tabular-nums;color:{watts > 0 ? '#F5A623' : '#4A4B53'};font-weight:600;">{watts} W</div>
        <div style="width:80px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;">
          <div style="height:100%;width:{(watts / 40) * 100}%;background:{watts > 0 ? '#F5A623' : 'transparent'};border-radius:2px;"></div>
        </div>
      </div>
    {/each}
    <div style="margin-top:12px;display:flex;justify-content:space-between;font-size:12px;">
      <span style="color:#6E7079;">Total draw</span>
      <span style="color:#fff;font-variant-numeric:tabular-nums;font-weight:600;">186 W <span style="color:#6E7079;font-weight:400;">/ 400 W budget</span></span>
    </div>
  </Card>

  <Card span={6}>
    <h3>Interface utilisation · live</h3>
    <RadialBarChart
      items={INTERFACE_UTIL}
      ariaLabel="Interface bandwidth utilisation: Port 01 Uplink 842 of 1000 Mbps (84%), Port 21 NAS 164 of 2500 Mbps (7%), Port 04 AP Lobby 60 of 1000 Mbps (6%), Port 05 AP Reception 50 of 1000 Mbps (5%)."
    />
  </Card>

  <Card span={12}>
    <h3>Protocol traffic · 24 h <span class="unit">Mbps per 2 h</span></h3>
    <StackedBarChart
      series={PROTO_TRAFFIC}
      labels={PROTO_LABELS}
      height={180}
      ariaLabel="Protocol traffic over 24 hours stacked by type: HTTPS peaks at 145 Mbps at 18:00, HTTP peaks 54 Mbps, DNS 38 Mbps, SSH 22 Mbps, other 16 Mbps. Lowest traffic 00:00-06:00."
    />
  </Card>

  <Card span={12}>
    <h3>Port-to-VLAN traffic matrix <span class="unit">Mbps · 24 h</span></h3>
    <MatrixChart
      rows={TRAFFIC_ROWS}
      cols={TRAFFIC_COLS}
      values={TRAFFIC_MATRIX}
      unit=" M"
      ariaLabel="Port-to-VLAN traffic matrix in Mbps over 24 hours: Uplink carries most traffic to VLAN 1 (842) and Corp (124). AP ports send primarily to IoT VLAN 30. Camera mostly to VLAN 1. NAS splits between VLAN 1 (46) and Corp (118)."
    />
  </Card>
</div>
