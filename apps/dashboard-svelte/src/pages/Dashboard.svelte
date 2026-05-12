<script lang="ts">
  import { Card, Pill, Button, SearchBox, Sparkline, Donut, StatusIndicator, PlusIcon, LineChart, BarChart, WaterfallChart, SankeyDiagram, WaffleChart, StreamGraph, NightingaleChart, DualAxisChart, Banner, AvatarGroup, RankedList } from '@w5-ui/svelte';
  import type { SankeyNode, SankeyLink, StreamSeries, RankedItem } from '@w5-ui/svelte';
  import { DASHBOARD_DEVICES, DASHBOARD_ALARMS } from '../data';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ adopt: void }>();
  let showBanner = $state(true);
  const pillVariant = (sev: string): 'danger' | 'warn' => (sev === 'danger' ? 'danger' : 'warn');
  function thumb(model: string) {
    if (model.includes('EG')) return 'EG';
    if (model.includes('ES')) return 'ES';
    if (model.includes('U7')) return 'U7';
    if (model.includes('CAM')) return 'CAM';
    return '?';
  }
  const legend = [
    { label: 'Wireless', color: '#006FFF', n: 88 },
    { label: 'Wired', color: '#4797FF', n: 42 },
    { label: 'VPN', color: '#7FB6FF', n: 12 },
  ];

  const trafficNodes: SankeyNode[] = [
    { id: 'wifi', label: 'WiFi · 480 Mbps', color: '#006FFF' },
    { id: 'wired', label: 'Wired · 240 Mbps', color: '#4797FF' },
    { id: 'vpn', label: 'VPN · 80 Mbps', color: '#7FB6FF' },
    { id: 'internet', label: 'Internet · 520 Mbps', color: '#00C875' },
    { id: 'internal', label: 'Internal · 200 Mbps', color: '#A78BFA' },
    { id: 'iot', label: 'IoT · 80 Mbps', color: '#F5A623' },
  ];

  const trafficLinks: SankeyLink[] = [
    { source: 'wifi', target: 'internet', value: 310 },
    { source: 'wifi', target: 'internal', value: 130 },
    { source: 'wifi', target: 'iot', value: 40 },
    { source: 'wired', target: 'internet', value: 180 },
    { source: 'wired', target: 'internal', value: 60 },
    { source: 'vpn', target: 'internet', value: 30 },
    { source: 'vpn', target: 'internal', value: 10 },
    { source: 'vpn', target: 'iot', value: 40 },
  ];

  const streamLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  const streamSeries: StreamSeries[] = [
    { label: 'Streaming',  color: '#006FFF', values: [40, 20, 60, 110, 180, 240, 140] },
    { label: 'Gaming',     color: '#A878F5', values: [30, 10, 20,  80, 140, 120,  60] },
    { label: 'Browsing',   color: '#00C8C8', values: [20, 10, 50,  70,  60,  80,  50] },
    { label: 'Social',     color: '#F5A623', values: [10,  5, 30,  50,  40,  60,  30] },
    { label: 'IoT',        color: '#4797FF', values: [15, 15, 15,  20,  20,  20,  15] },
  ];

  const hourlyClients = [2,1,1,1,2,5,18,45,67,73,68,55,58,62,65,71,78,82,75,60,42,28,15,7].map(
    (v, i) => ({ label: `${i}h`, value: v }),
  );

  const topClients: RankedItem[] = [
    { label: 'MacBook Pro (Alice)',    sublabel: '192.168.1.42', value: 4820, color: '#006FFF' },
    { label: 'Gaming PC (Bob)',        sublabel: '192.168.1.78', value: 3210, color: '#A878F5' },
    { label: 'Apple TV (Living Room)', sublabel: '192.168.1.15', value: 2650, color: '#00C8C8' },
    { label: 'iPhone 15 (Carol)',      sublabel: '192.168.1.91', value: 1840, color: '#F5A623' },
    { label: 'Smart TV (Bedroom)',     sublabel: '192.168.1.34', value: 1230, color: '#4797FF' },
  ];

  const topAps: RankedItem[] = [
    { label: 'AP Pro (Living Room)', sublabel: '32 clients', value: 1240, color: '#006FFF' },
    { label: 'AP Pro (Office)',      sublabel: '28 clients', value:  980, color: '#4797FF' },
    { label: 'U7 Outdoor (Garden)', sublabel: '12 clients', value:  420, color: '#00C8C8' },
    { label: 'U6 Lite (Basement)',  sublabel: '8 clients',  value:  210, color: '#A878F5' },
  ];
</script>

{#if showBanner}
  <Banner variant="warn" title="Firmware update available" action={{ label: 'Update now', onClick: () => { showBanner = false; } }} onDismiss={() => { showBanner = false; }}>
    Dash OS 4.1.13 is ready — 3 devices will restart briefly.
  </Banner>
{/if}
<div class="ph-bar">
  <div class="ph-title">Dashboard</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search devices, clients…" />
    <Button>Last 24 h</Button>
    <Button variant="primary" on:click={() => dispatch('adopt')}>
      <PlusIcon /> Adopt
    </Button>
  </div>
</div>

<div class="grid">
  <Card span={4}>
    <h3>Internet <Pill variant="success">Online</Pill></h3>
    <div class="stat">847<span class="unit">Mbps · down</span></div>
    <div class="submeta">↑ 312 Mbps · 18 ms · 0.0% loss · <span class="delta-up">+12% 24h</span></div>
    <Sparkline />
  </Card>

  <Card span={4}>
    <h3>Throughput <Pill variant="info">Live</Pill></h3>
    <div class="stat">5.0<span class="unit">Gbps · IDS/IPS</span></div>
    <div class="submeta">8 / 16 cores · 41% CPU · 6.2 / 16 GB</div>
    <Sparkline active seed={2} />
  </Card>

  <Card span={4}>
    <h3>Clients <span style="color:#6E7079;font-weight:400;">142 connected</span></h3>
    <div style="display:flex;align-items:center;gap:18px;flex:1;">
      <Donut
        segments={[
          { label: 'wireless', value: 88, color: '#006FFF' },
          { label: 'wired', value: 42, color: '#4797FF' },
          { label: 'vpn', value: 12, color: '#7FB6FF' },
        ]}
        centerValue={142}
        centerLabel="connected"
      />
      <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;flex:1;">
        {#each legend as l (l.label)}
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="display:flex;align-items:center;gap:6px;color:#C8C9D0;">
              <span style="width:8px;height:8px;background:{l.color};border-radius:2px;"></span>{l.label}
            </span>
            <span style="font-variant-numeric:tabular-nums;color:#fff;">{l.n}</span>
          </div>
        {/each}
      </div>
    </div>
    <div style="margin-top:12px;display:flex;align-items:center;gap:10px;">
      <AvatarGroup
        avatars={[
          { initials: 'AB' },
          { initials: 'CJ' },
          { initials: 'KP' },
          { initials: 'ML' },
          { initials: 'RS' },
          { initials: 'TV' },
          { initials: 'WX' },
        ]}
        max={5}
        size="sm"
        ariaLabel="Recently active clients"
      />
      <span style="font-size:11px;color:#6E7079;">Recently active</span>
    </div>
  </Card>

  <Card span={8} style="padding:0;">
    <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h3 style="margin:0;color:#fff;font-size:13px;">Network Devices</h3>
      <div style="display:flex;gap:8px;">
        <Pill variant="success">10 connected</Pill>
        <Pill variant="warn">1 updating</Pill>
        <Pill variant="danger">1 offline</Pill>
      </div>
    </div>
    <div style="overflow:auto;">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th><th scope="col">Model</th><th scope="col">IP</th>
            <th scope="col" style="text-align:right;">Uptime</th>
            <th scope="col" style="text-align:right;">CPU / Mem</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each DASHBOARD_DEVICES as r (r[0])}
            <tr>
              <td>
                <div class="name-cell">
                  <span class="nc-thumb">{thumb(r[1])}</span>
                  <div>
                    <div style="font-size:13px;color:#fff;">{r[0]}</div>
                    <div class="mac" style="font-size:10px;">{r[1]}</div>
                  </div>
                </div>
              </td>
              <td style="color:#A4A7B5;">{r[1]}</td>
              <td class="mac">{r[2]}</td>
              <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{r[3]}</td>
              <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{r[4]}</td>
              <td><StatusIndicator color={r[5]} text={r[6]} textColor={r[7]} /></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>

  <Card span={12}>
    <h3>Network Throughput <span class="unit">Last 24 h</span></h3>
    <LineChart
      ariaLabel="Network throughput over the last 24 hours: download and upload in Mbps"
      labels={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']}
      series={[
        { label: 'Download', color: '#006FFF', values: [220, 310, 280, 450, 840, 520, 380] },
        { label: 'Upload', color: '#00C8C8', values: [80, 120, 95, 180, 312, 210, 145] },
      ]}
    />
    <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
      {#each [{ name: 'Download', color: '#006FFF' }, { name: 'Upload', color: '#00C8C8' }] as s (s.name)}
        <span style="display:flex;align-items:center;gap:6px;">
          <span style="width:16px;height:2px;background:{s.color};border-radius:1px;display:inline-block;" aria-hidden="true"></span>
          <span style="color:#A4A7B5;">{s.name}</span>
        </span>
      {/each}
    </div>
  </Card>

  <Card span={8}>
    <h3>Traffic by Device Type <span class="unit">Last 24 h · Mbps</span></h3>
    <BarChart
      ariaLabel="Traffic by device type over the last 24 hours: download and upload in Mbps per device category"
      labels={['Gateway', 'Switch', 'AP', 'Camera']}
      series={[
        { label: 'Download', color: '#006FFF', values: [312, 148, 524, 42] },
        { label: 'Upload', color: '#00C8C8', values: [118, 56, 198, 14] },
      ]}
    />
    <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
      {#each [{ name: 'Download', color: '#006FFF' }, { name: 'Upload', color: '#00C8C8' }] as s (s.name)}
        <span style="display:flex;align-items:center;gap:6px;">
          <span style="width:10px;height:10px;background:{s.color};border-radius:2px;display:inline-block;" aria-hidden="true"></span>
          <span style="color:#A4A7B5;">{s.name}</span>
        </span>
      {/each}
    </div>
  </Card>

  <Card span={4}>
    <h3>Client Delta <span class="unit">Mon – Sun</span></h3>
    <WaterfallChart
      ariaLabel="Client count waterfall: starting at 118, daily changes Mon through Sat, ending at 142 total"
      bars={[
        { label: 'Mon', value: 118, type: 'start' },
        { label: 'Tue', value: 14 },
        { label: 'Wed', value: -8 },
        { label: 'Thu', value: 22 },
        { label: 'Fri', value: -6 },
        { label: 'Sat', value: 2 },
        { label: 'Total', value: 142, type: 'total' },
      ]}
    />
  </Card>

  <Card span={8}>
    <h3>Traffic Flow <span class="unit">Last 24 h · Mbps</span></h3>
    <SankeyDiagram
      nodes={trafficNodes}
      links={trafficLinks}
      height={180}
      ariaLabel="Network traffic flow: WiFi, Wired, and VPN sources flowing to Internet, Internal, and IoT destinations in Mbps"
    />
  </Card>

  <Card span={4}>
    <h3>Device Status <span class="unit">12 managed</span></h3>
    <WaffleChart
      ariaLabel="Device status breakdown: 10 connected, 1 updating, 1 offline out of 12 managed devices"
      segments={[
        { label: 'Connected', value: 10, color: '#00B070' },
        { label: 'Updating', value: 1, color: '#F5A623' },
        { label: 'Offline', value: 1, color: '#F03A3A' },
      ]}
    />
  </Card>

  <Card span={8}>
    <h3>Traffic Composition <span class="unit">Last 24 h · Mbps</span></h3>
    <StreamGraph
      ariaLabel="Traffic composition over the last 24 hours: streaming, gaming, browsing, social, and IoT in Mbps"
      labels={streamLabels}
      series={streamSeries}
    />
    <div style="display:flex;gap:12px;margin-top:8px;font-size:12px;flex-wrap:wrap;">
      {#each streamSeries as s (s.label)}
        <span style="display:flex;align-items:center;gap:5px;">
          <span style="width:10px;height:10px;background:{s.color};border-radius:2px;display:inline-block;" aria-hidden="true"></span>
          <span style="color:#A4A7B5;">{s.label}</span>
        </span>
      {/each}
    </div>
  </Card>

  <Card span={4}>
    <h3>Client Activity <span class="unit">by hour · avg clients</span></h3>
    <NightingaleChart
      ariaLabel="Client activity by hour of day: peaks between 17:00 and 20:00 with up to 82 active clients"
      segments={hourlyClients}
    />
  </Card>

  <Card span={8}>
    <h3>Throughput vs Clients <span class="unit">Last 24 h · Mbps / count</span></h3>
    <DualAxisChart
      ariaLabel="Throughput in Mbps (bars, left axis) and active client count (line, right axis) over the last 24 hours"
      labels={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']}
      bars={{ label: 'Throughput (Mbps)', color: '#006FFF', values: [280, 150, 380, 620, 840, 720, 420] }}
      line={{ label: 'Clients', color: '#F5A623', values: [28, 8, 55, 78, 95, 82, 45] }}
    />
  </Card>

  <Card span={8}>
    <h3>Top Clients by Usage <span class="unit">Last 24 h · MB</span></h3>
    <RankedList items={topClients} unit="MB" ariaLabel="Top clients by data usage in the last 24 hours" />
  </Card>

  <Card span={4}>
    <h3>Top APs by Traffic <span class="unit">Last 24 h · Mbps</span></h3>
    <RankedList items={topAps} unit="Mbps" ariaLabel="Top access points by traffic in the last 24 hours" />
  </Card>

  <Card span={4}>
    <h3>Alarm Manager <Pill variant="warn">3 active</Pill></h3>
    {#each DASHBOARD_ALARMS as [sev, t, d, w] (t)}
      <div style="padding:10px;background:#0A0A0B;border:1px solid rgba(255,255,255,0.06);border-radius:6px;margin-top:8px;">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;">
            <Pill variant={pillVariant(sev)}>{sev === 'danger' ? 'Critical' : 'Warning'}</Pill>
            <span style="font-size:13px;color:#fff;font-weight:500;">{t}</span>
          </div>
          <span style="font-size:11px;color:#6E7079;">{w}</span>
        </div>
        <div style="font-size:11px;color:#A4A7B5;margin-top:4px;">{d}</div>
      </div>
    {/each}
  </Card>
</div>
