<script lang="ts">
  import { Card, Button, SearchBox, HealthBar, Toggle, InlineEdit, SortableList, PlusIcon, WifiIcon, AreaChart, MirroredBarChart, RidgelinePlot, HorizonChart } from '@w5-ui/svelte';
  import type { AreaChartSeries, MirroredBarItem, RidgelineSeries, HorizonSeries, SortableItem } from '@w5-ui/svelte';
  import { SSIDS } from '../data';

  let enabled: Record<string, boolean> = $state(Object.fromEntries(SSIDS.map((s) => [s[0], s[5] === 'active'])));
  let names: Record<string, string> = $state(Object.fromEntries(SSIDS.map((s) => [s[0], s[0]])));
  let ssidOrder: SortableItem[] = $state(SSIDS.map((s) => ({ id: s[0], label: s[0], meta: s[2] })));

  const ssidTxRx: MirroredBarItem[] = [
    { label: 'Office',  left: 198, right: 42 },
    { label: 'Staff',   left: 88,  right: 21 },
    { label: 'Guest',   left: 14,  right: 4  },
    { label: 'IoT',     left: 6,   right: 18 },
    { label: 'Conf-AV', left: 32,  right: 8  },
  ];

  const ssidRssi: RidgelineSeries[] = [
    { label: 'Office',  color: '#006FFF', values: [-72,-68,-70,-65,-73,-67,-69,-71,-66,-68,-70,-72,-67,-69,-66,-71,-68,-70,-73,-65] },
    { label: 'Staff',   color: '#00C8C8', values: [-68,-65,-70,-63,-67,-69,-66,-64,-68,-71,-65,-63,-69,-67,-64,-66,-68,-65,-67,-63] },
    { label: 'Guest',   color: '#F5A623', values: [-78,-82,-75,-79,-85,-77,-81,-83,-76,-80,-84,-77,-79,-82,-75,-80,-78,-83,-76,-79] },
    { label: 'IoT',     color: '#A878F5', values: [-88,-84,-90,-86,-82,-89,-85,-91,-87,-83,-90,-86,-84,-88,-82,-87,-85,-83,-89,-86] },
    { label: 'Conf-AV', color: '#00C875', values: [-66,-63,-68,-61,-64,-66,-62,-67,-65,-63,-69,-61,-65,-63,-67,-62,-64,-66,-68,-61] },
  ];

  const wifiTrafficLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  const wifiTrafficSeries: AreaChartSeries[] = [
    { label: '6 GHz', color: '#7FB6FF', values: [12, 8, 6, 22, 48, 34, 18] },
    { label: '5 GHz', color: '#006FFF', values: [68, 45, 38, 112, 198, 134, 88] },
    { label: '2.4 GHz', color: '#00C8C8', values: [28, 22, 18, 44, 62, 48, 32] },
  ];

  const horizonX = ['00:00', '06:00', '12:00', '18:00', '24:00'];
  const ssidClients: HorizonSeries[] = [
    { label: 'Office',  color: '#006FFF', values: [2,1,1,1,2,8,28,45,52,58,55,50,48,52,55,58,60,42,25,15,10,6,4,2] },
    { label: 'Staff',   color: '#00C8C8', values: [1,0,0,0,1,4,12,18,22,24,23,20,19,22,24,25,22,16,10,6,3,2,1,0] },
    { label: 'Guest',   color: '#F5A623', values: [0,0,0,0,0,1,3,8,12,14,13,10,9,11,14,18,20,16,10,6,3,1,0,0] },
    { label: 'IoT',     color: '#A878F5', values: [8,8,8,8,8,9,10,10,11,11,11,11,11,11,11,11,11,10,9,9,8,8,8,8] },
    { label: 'Conf-AV', color: '#00C875', values: [0,0,0,0,0,0,0,4,8,12,10,6,8,10,12,14,10,6,4,2,0,0,0,0] },
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Wi-Fi</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search SSIDs…" />
    <Button>Import</Button>
    <Button variant="primary"><PlusIcon /> New SSID</Button>
  </div>
</div>
<div class="grid">
  <Card span={4}>
    <h3>Active SSIDs</h3>
    <div class="stat">5<span class="unit">of 6 broadcasting</span></div>
    <div class="submeta">Across 6 access points</div>
  </Card>
  <Card span={4}>
    <h3>Wireless Clients</h3>
    <div class="stat">88<span class="unit">connected</span></div>
    <div class="submeta">5 GHz · 64 · 2.4 GHz · 24</div>
  </Card>
  <Card span={4}>
    <h3>Channel Utilisation</h3>
    <div style="display:flex;gap:14px;align-items:center;flex:1;">
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#A4A7B5;margin-bottom:4px;">
          <span>5 GHz</span><span style="font-variant-numeric:tabular-nums;">38%</span>
        </div>
        <HealthBar value={38} />
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#A4A7B5;margin:8px 0 4px;">
          <span>2.4 GHz</span><span style="font-variant-numeric:tabular-nums;">71%</span>
        </div>
        <HealthBar value={71} fillStyle="background:linear-gradient(90deg,#F5A623,#F5C26B);" />
      </div>
    </div>
  </Card>
</div>
<div class="grid" style="padding-top:0;">
  <Card span={12}>
    <h3>WiFi Traffic by Band <span class="unit">Last 24 h · Mbps</span></h3>
    <AreaChart
      ariaLabel="WiFi traffic by band over the last 24 hours: 2.4 GHz, 5 GHz, and 6 GHz in Mbps"
      labels={wifiTrafficLabels}
      series={wifiTrafficSeries}
    />
    <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
      {#each wifiTrafficSeries as { label, color }}
        <span style="display:flex;align-items:center;gap:6px;">
          <span style="width:10px;height:10px;background:{color};border-radius:2px;display:inline-block;" aria-hidden="true"></span>
          <span style="color:#A4A7B5;">{label}</span>
        </span>
      {/each}
    </div>
  </Card>
</div>
<div class="grid" style="padding-top:0;">
  <Card span={6}>
    <h3>TX / RX per SSID <span class="unit">Mbps · last 5 min</span></h3>
    <MirroredBarChart
      items={ssidTxRx}
      leftLabel="Download"
      rightLabel="Upload"
      unit=" M"
      ariaLabel="Download and upload throughput per SSID in Mbps over the last 5 minutes"
    />
    <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
      <span style="display:flex;align-items:center;gap:6px;">
        <span style="width:10px;height:10px;background:#006FFF;border-radius:2px;display:inline-block;" aria-hidden="true"></span>
        <span style="color:#A4A7B5;">Download</span>
      </span>
      <span style="display:flex;align-items:center;gap:6px;">
        <span style="width:10px;height:10px;background:#00C8C8;border-radius:2px;display:inline-block;" aria-hidden="true"></span>
        <span style="color:#A4A7B5;">Upload</span>
      </span>
    </div>
  </Card>

  <Card span={6}>
    <h3>Client signal distribution per SSID</h3>
    <div style="font-size:11px;color:#6E7079;margin-bottom:8px;">RSSI density (dBm) · all connected clients</div>
    <RidgelinePlot
      series={ssidRssi}
      xRange={[-95, -58]}
      height={180}
      ariaLabel="Client signal strength distribution per SSID: ridgeline density curves showing RSSI in dBm"
    />
  </Card>

  <Card span={12}>
    <h3>Clients per SSID · 24 h</h3>
    <div style="font-size:11px;color:#6E7079;margin-bottom:8px;">Horizon chart — band intensity = relative client count</div>
    <HorizonChart
      series={ssidClients}
      xLabels={horizonX}
      bands={3}
      ariaLabel="Clients per SSID over 24 hours: horizon chart showing client count intensity for Office, Staff, Guest, IoT, and Conf-AV networks"
    />
  </Card>
</div>
<div class="grid" style="padding-top:0;">
  <Card span={6}>
    <h3>SSID Priority <span class="unit">drag or use arrow keys to reorder</span></h3>
    <SortableList
      items={ssidOrder}
      onChange={(items) => { ssidOrder = items; }}
      ariaLabel="SSID broadcast priority order"
    />
  </Card>
</div>
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
    <caption class="sr-only">Wi-Fi networks</caption>
    <thead>
      <tr>
        <th scope="col">Name</th><th scope="col">Security</th><th scope="col">Bands</th><th scope="col">Network</th>
        <th scope="col" style="text-align:right;">Clients</th><th scope="col">Status</th><th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      {#each SSIDS as s (s[0])}
        <tr>
          <td>
            <div class="name-cell">
              <span class="nc-thumb" style="background:rgba(0,111,255,0.14);color:#7FB6FF;">
                <WifiIcon />
              </span>
              <InlineEdit value={names[s[0]]} onconfirm={(v) => { names[s[0]] = v; }} label="SSID name" />
            </div>
          </td>
          <td style="color:#A4A7B5;">{s[1]}</td>
          <td style="color:#A4A7B5;">{s[2]}</td>
          <td style="color:#A4A7B5;font-family:'JetBrains Mono',monospace;font-size:12px;">{s[3]}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{s[4]}</td>
          <td>
            <span style="display:inline-flex;align-items:center;gap:6px;color:{s[6]};font-size:12px;">
              <span style="width:6px;height:6px;border-radius:50%;background:{s[6]};"></span>{s[7]}
            </span>
          </td>
          <td style="text-align:right;">
            <Toggle bind:on={enabled[s[0]]} ariaLabel={s[0]} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
