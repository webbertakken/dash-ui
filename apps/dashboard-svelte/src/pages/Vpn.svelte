<script lang="ts">
  import { Card, Button, Pill, Tabs, PlusIcon, FunnelChart, UptimeTimeline, DumbbellChart, ErrorBandChart, ArcDiagram, CumulativeDistribution, ExpandableRow } from '@w5-ui/svelte';
  import type { FunnelSegment, UptimeSeries, DumbbellItem, ErrorBandSeries, ArcNode, ArcLink, CdfSeries } from '@w5-ui/svelte';
  let tab = $state('s2s');

  const VPN_UPTIME: UptimeSeries[] = [
    {
      label: 'WireGuard',
      segments: [
        { from: 0, to: 0.08, status: 'down' },
        { from: 0.08, to: 0.88, status: 'up' },
        { from: 0.88, to: 0.93, status: 'degraded' },
        { from: 0.93, to: 1, status: 'up' },
      ],
    },
    {
      label: 'IPsec',
      segments: [{ from: 0, to: 1, status: 'up' }],
    },
    {
      label: 'L2TP',
      segments: [
        { from: 0, to: 0.28, status: 'down' },
        { from: 0.28, to: 0.42, status: 'degraded' },
        { from: 0.42, to: 0.70, status: 'up' },
        { from: 0.70, to: 1, status: 'down' },
      ],
    },
  ];

  const VPN_X_LABELS = ['00:00', '06:00', '12:00', '18:00', '24:00'];

  const VPN_FUNNEL: FunnelSegment[] = [
    { label: 'Attempted', value: 158, color: '#006FFF' },
    { label: 'Auth OK', value: 142, color: '#0092FF' },
    { label: 'Tunnel', value: 138, color: '#00B4C2' },
    { label: 'Active', value: 127, color: '#00C875' },
  ];

  const SERVERS: [string, string, string, string, string, string, string, string][] = [
    ['Office WireGuard', 'WireGuard', '203.0.113.42:51820', '10.10.0.0/24', '12', '#00B070', 'Active', '#5DDB9F'],
    ['Legacy IPsec', 'IPsec / IKEv2', '203.0.113.42:500', '10.20.0.0/24', '3', '#00B070', 'Active', '#5DDB9F'],
    ['L2TP Mobile', 'L2TP / IPsec', '203.0.113.42:1701', '10.30.0.0/24', '0', '#6E7079', 'Disabled', '#A4A7B5'],
  ];

  const SERVER_DETAIL: Record<string, { cipher: string; handshake: string; rx: string; tx: string; uptime: string }> = {
    'Office WireGuard': { cipher: 'ChaCha20-Poly1305', handshake: '2m 14s ago', rx: '2.4 GB', tx: '0.8 GB', uptime: '12d 04h' },
    'Legacy IPsec':     { cipher: 'AES-256-GCM',        handshake: '8m 52s ago', rx: '320 MB', tx: '190 MB', uptime: '3d 11h' },
    'L2TP Mobile':      { cipher: '3DES (deprecated)',   handshake: 'N/A',        rx: '0 B',    tx: '0 B',    uptime: '—' },
  };
  const VPN_LATENCY: DumbbellItem[] = [
    { label: 'WireGuard', start: 3, end: 18, color: '#006FFF' },
    { label: 'IPsec', start: 12, end: 42, color: '#00C875' },
    { label: 'L2TP', start: 28, end: 95, color: '#F5A623' },
  ];

  const LATENCY_BAND: ErrorBandSeries[] = [
    {
      label: 'WireGuard',
      color: '#006FFF',
      mean:  [8, 9, 7, 8, 10, 12, 9, 8, 7, 9, 11, 10, 9, 8, 7, 9, 10, 8, 9, 10, 9, 8, 7, 8],
      lower: [5, 6, 4, 5,  7,  8, 6, 5, 4, 6,  7,  7, 6, 5, 4, 6,  7, 5, 6,  7, 6, 5, 4, 5],
      upper: [14,15,12,14, 18, 22,16,13,12,15, 18, 17,14,13,11,15, 17,13,14, 16,15,13,11,13],
    },
    {
      label: 'IPsec',
      color: '#00C875',
      mean:  [22,24,21,23,25,28,24,22,20,24,27,25,23,22,20,24,26,22,24,26,24,22,20,22],
      lower: [16,18,15,17,19,22,18,16,14,18,21,19,17,16,14,18,20,16,18,20,18,16,14,16],
      upper: [30,34,29,31,35,40,32,30,28,32,36,33,31,30,28,32,34,30,32,34,32,30,28,30],
    },
  ];
  const LATENCY_X = ['00:00', '06:00', '12:00', '18:00', '24:00'];

  const LATENCY_CDF: CdfSeries[] = [
    { label: 'WireGuard', color: '#006FFF', values: [3,4,5,5,6,6,7,7,7,8,8,8,9,9,10,11,12,13,15,18] },
    { label: 'IPsec',     color: '#00C875', values: [12,14,15,16,17,18,20,21,22,23,24,25,26,28,30,32,35,38,40,42] },
    { label: 'L2TP',      color: '#F5A623', values: [28,32,35,38,40,42,45,48,50,52,55,58,62,65,68,72,78,82,88,95] },
  ];

  const VPN_ARC_NODES: ArcNode[] = [
    { id: 'hq', label: 'HQ' },
    { id: 'branch', label: 'Branch 1' },
    { id: 'aws-e', label: 'AWS East' },
    { id: 'aws-w', label: 'AWS West' },
    { id: 'azure', label: 'Azure' },
    { id: 'mobile', label: 'Mobile' },
  ];

  const VPN_ARC_LINKS: ArcLink[] = [
    { source: 'hq', target: 'aws-e', value: 28 },
    { source: 'hq', target: 'aws-w', value: 14 },
    { source: 'hq', target: 'azure', value: 20 },
    { source: 'branch', target: 'hq', value: 18 },
    { source: 'branch', target: 'aws-e', value: 8 },
    { source: 'mobile', target: 'hq', value: 5 },
    { source: 'mobile', target: 'aws-w', value: 3 },
  ];

  const TELEPORT: [string, string, string, string][] = [
    ['Maria · MacBook Pro', '100.64.0.42', '5 ms', 'Active'],
    ['Tobias · iPhone 15', '100.64.0.61', '22 ms', 'Active'],
    ['Arjun · Pixel 8', '100.64.0.74', '38 ms', 'Active'],
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">VPN</div>
  <div class="ph-actions">
    <Button>Logs</Button>
    <Button variant="primary"><PlusIcon /> New Server</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 's2s', label: 'Site-to-Site', badge: 2 },
    { id: 'tp', label: 'Teleport', badge: 8 },
    { id: 'cli', label: 'VPN Clients', badge: 12 },
    { id: 'srv', label: 'VPN Servers', badge: 3 },
  ]}
/>
<div class="grid">
  <Card span={6}>
    <h3>Site-to-Site · WireGuard <Pill variant="success">Connected</Pill></h3>
    <div style="display:flex;align-items:center;gap:14px;padding:14px 0;">
      <div style="flex:1;text-align:center;">
        <div class="dr-thumb" style="margin:0 auto 6px;background:linear-gradient(180deg,#1C1C1E,#0A0A0B);">EG</div>
        <div style="font-size:13px;color:#fff;font-weight:500;">Edge Gateway (Front Office)</div>
        <div style="font-size:11px;color:#6E7079;font-family:'JetBrains Mono',monospace;">203.0.113.42</div>
      </div>
      <div style="flex:0 0 auto;color:#00B070;">
        <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
          <path d="M2 10h76M70 4l8 6-8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div style="flex:1;text-align:center;">
        <div class="dr-thumb" style="margin:0 auto 6px;background:linear-gradient(180deg,#1C1C1E,#0A0A0B);">EG</div>
        <div style="font-size:13px;color:#fff;font-weight:500;">EG SE (Warehouse)</div>
        <div style="font-size:11px;color:#6E7079;font-family:'JetBrains Mono',monospace;">198.51.100.18</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;">
      <span style="color:#6E7079;">Throughput</span>
      <span style="color:#fff;text-align:right;font-variant-numeric:tabular-nums;">↓ 84 / ↑ 12 Mbps</span>
      <span style="color:#6E7079;">Latency</span>
      <span style="color:#fff;text-align:right;font-variant-numeric:tabular-nums;">14 ms</span>
      <span style="color:#6E7079;">Cipher</span>
      <span style="color:#fff;text-align:right;">ChaCha20-Poly1305</span>
      <span style="color:#6E7079;">Uptime</span>
      <span style="color:#fff;text-align:right;font-variant-numeric:tabular-nums;">12d 04h</span>
    </div>
  </Card>

  <Card span={6}>
    <h3>Teleport · Dash Identity <Pill variant="info">8 sessions</Pill></h3>
    <div style="display:flex;flex-direction:column;gap:8px;">
      {#each TELEPORT as t (t[0])}
        <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:#0A0A0B;border:1px solid rgba(255,255,255,0.06);border-radius:6px;">
          <span class="status-ring" style="width:8px;height:8px;"></span>
          <div style="flex:1;">
            <div style="font-size:13px;color:#fff;">{t[0]}</div>
            <div style="font-size:11px;color:#6E7079;font-family:'JetBrains Mono',monospace;">{t[1]}</div>
          </div>
          <div style="font-size:11px;color:#A4A7B5;font-variant-numeric:tabular-nums;">{t[2]}</div>
        </div>
      {/each}
    </div>
  </Card>

  <Card span={6}>
    <h3>VPN Client Connection Funnel <span class="unit">Last 24 h</span></h3>
    <div style="font-size:11px;color:#6E7079;margin-bottom:8px;">Attempted → authenticated → tunnelled → active</div>
    <FunnelChart
      segments={VPN_FUNNEL}
      height={150}
      ariaLabel="VPN client connection funnel: attempted, authenticated, tunnel established, active"
    />
  </Card>

  <Card span={6}>
    <h3>Connection Drop-off</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px;">
      {#each VPN_FUNNEL as seg, i (seg.label)}
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span style="color:#C8C9D0;">{seg.label}</span>
            <span style="color:{seg.color};font-variant-numeric:tabular-nums;">
              {seg.value}{i > 0 ? ` (${Math.round((seg.value / VPN_FUNNEL[0].value) * 100)}%)` : ''}
            </span>
          </div>
          <div style="height:5px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
            <div style="height:100%;background:{seg.color};width:{(seg.value / VPN_FUNNEL[0].value) * 100}%;border-radius:3px;"></div>
          </div>
        </div>
      {/each}
    </div>
  </Card>

  <Card span={12}>
    <h3>Tunnel uptime <span class="unit">Last 24 h</span></h3>
    <UptimeTimeline
      series={VPN_UPTIME}
      xLabels={VPN_X_LABELS}
      ariaLabel="VPN tunnel uptime last 24 hours: WireGuard mostly up, IPsec fully up, L2TP mostly down"
    />
  </Card>

  <Card span={6}>
    <h3>Latency range <span class="unit">min → max · Last 24 h</span></h3>
    <DumbbellChart
      items={VPN_LATENCY}
      unit=" ms"
      ariaLabel="VPN tunnel latency range last 24 hours: WireGuard 3–18 ms, IPsec 12–42 ms, L2TP 28–95 ms"
    />
  </Card>

  <Card span={6}>
    <h3>Latency over time <span class="unit">ms · shaded = jitter band</span></h3>
    <div style="font-size:11px;color:#6E7079;margin-bottom:8px;">Mean ± p5–p95 · WireGuard vs IPsec</div>
    <ErrorBandChart
      series={LATENCY_BAND}
      xLabels={LATENCY_X}
      yRange={[0, 45]}
      height={160}
      unit=" ms"
      ariaLabel="VPN latency over time: WireGuard mean 8–12 ms with jitter band, IPsec mean 20–28 ms with jitter band"
    />
    <div style="display:flex;gap:12px;margin-top:8px;font-size:11px;color:#A4A7B5;">
      {#each LATENCY_BAND as s (s.label)}
        <span style="display:flex;align-items:center;gap:4px;">
          <span style="width:20px;height:2px;background:{s.color};display:inline-block;"></span>
          {s.label}
        </span>
      {/each}
    </div>
  </Card>

  <Card span={12}>
    <h3>Latency distribution <span class="unit">ECDF · p50 / p95 guides</span></h3>
    <CumulativeDistribution
      series={LATENCY_CDF}
      guides={[50, 95]}
      height={160}
      unit=" ms"
      ariaLabel="VPN latency cumulative distribution: WireGuard p50 ~8 ms p95 ~14 ms, IPsec p50 ~23 ms p95 ~38 ms, L2TP p50 ~52 ms p95 ~85 ms"
    />
    <div style="display:flex;gap:12px;margin-top:8px;font-size:11px;color:#A4A7B5;">
      {#each LATENCY_CDF as s (s.label)}
        <span style="display:flex;align-items:center;gap:4px;">
          <span style="width:20px;height:2px;background:{s.color};display:inline-block;"></span>
          {s.label}
        </span>
      {/each}
    </div>
  </Card>

  <Card span={12} style="padding:0;">
    <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h3 style="margin:0;color:#fff;">VPN Servers</h3>
    </div>
    <table>
      <caption class="sr-only">VPN servers</caption>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Name</th><th scope="col">Type</th><th scope="col">Endpoint</th><th scope="col">Network</th>
          <th scope="col" style="text-align:right;">Clients</th><th scope="col">Status</th>
        </tr>
      </thead>
      {#each SERVERS as s (s[0])}
        {@const det = SERVER_DETAIL[s[0]]}
        <ExpandableRow colSpan={6}>
          {#snippet row()}
                  
              <td style="color:#fff;">{s[0]}</td>
              <td><Pill variant="info">{s[1]}</Pill></td>
              <td class="mac">{s[2]}</td>
              <td class="mac" style="color:#A4A7B5;">{s[3]}</td>
              <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{s[4]}</td>
              <td>
                <span style="display:inline-flex;align-items:center;gap:6px;color:{s[7]};font-size:12px;">
                  <span style="width:6px;height:6px;border-radius:50%;background:{s[5]};"></span>{s[6]}
                </span>
              </td>
            
                  {/snippet}
          {#snippet detail()}
                  
              <div style="display:grid;grid-template-columns:repeat(5,max-content);column-gap:24px;row-gap:4px;font-size:12px;">
                <span style="color:#6E7079;">Cipher</span><span style="color:#C8C9D0;">{det.cipher}</span>
                <span></span>
                <span style="color:#6E7079;">RX</span><span style="color:#C8C9D0;">{det.rx}</span>
                <span style="color:#6E7079;">Handshake</span><span style="color:#C8C9D0;">{det.handshake}</span>
                <span></span>
                <span style="color:#6E7079;">TX</span><span style="color:#C8C9D0;">{det.tx}</span>
                <span style="color:#6E7079;">Uptime</span><span style="color:#C8C9D0;">{det.uptime}</span>
              </div>
            
                  {/snippet}
        </ExpandableRow>
      {/each}
    </table>
  </Card>

  <Card span={12}>
    <h3>Site-to-site mesh <span class="unit">arc thickness = bandwidth · Mbps</span></h3>
    <ArcDiagram
      nodes={VPN_ARC_NODES}
      links={VPN_ARC_LINKS}
      height={180}
      ariaLabel="VPN site-to-site topology: HQ connects to AWS East (28 Mbps), AWS West (14 Mbps), Azure (20 Mbps); Branch 1 connects to HQ (18 Mbps) and AWS East (8 Mbps); Mobile connects to HQ (5 Mbps) and AWS West (3 Mbps)"
    />
  </Card>
</div>
