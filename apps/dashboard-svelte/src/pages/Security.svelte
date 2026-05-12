<script lang="ts">
  import { Card, Button, Pill, Tabs, Sparkline, Toggle, TreeMap, CalendarHeatmap, ChordDiagram, ParetoChart, LollipopChart, SlopeChart, IcicleChart, ForceGraph, PolarHeatmap, StripeChart, WordCloud, PieChart, Spoiler } from '@w5-ui/svelte';
  import type { LollipopItem, SlopeItem, IcicleNode, FDNode, FDLink, PolarCell, WordCloudItem, PieSlice } from '@w5-ui/svelte';
  const THREAT_SEVERITY: PieSlice[] = [
    { label: 'Critical', value: 23,  color: '#FF3B30' },
    { label: 'High',     value: 89,  color: '#F5A623' },
    { label: 'Medium',   value: 234, color: '#FFD60A' },
    { label: 'Low',      value: 312, color: '#006FFF' },
    { label: 'Info',     value: 127, color: '#6E7079' },
  ];
  const THREAT_DISTRIBUTION = [
    { label: 'Malware', value: 412 },
    { label: 'Port Scans', value: 298 },
    { label: 'Botnet C2', value: 137 },
    { label: 'Brute Force', value: 127 },
    { label: 'Phishing', value: 89 },
    { label: 'SQLi/XSS', value: 64 },
    { label: 'DDoS', value: 43 },
  ];
  let tab = $state('threat');
  const pillVariant = (sev: string): 'danger' | 'warn' => (sev === 'danger' ? 'danger' : 'warn');
  const PROTECTIONS: { title: string; description: string; defaultOn: boolean }[] = [
    { title: 'Suspicious activity detection', description: 'Continuously monitors traffic patterns for scanners, brute-force login attempts, and lateral movement between network segments. Detected events are logged and optionally blocked automatically based on the configured IPS sensitivity level. Signatures update hourly from the Dash threat intelligence feed.', defaultOn: true },
    { title: 'Honeypot', description: 'Deploys decoy TCP/UDP listeners on unused ports across all network segments. Any connection attempt to a honeypot port triggers an alert and is treated as high-confidence hostile activity, since legitimate devices should never connect to these ports. Zero false-positive rate by design.', defaultOn: true },
    { title: 'Restrict access to Tor', description: 'Maintains an automatically updated blocklist of known Tor exit nodes, entry guards, and relay servers sourced from the Tor Project and third-party threat intelligence feeds. Updates are applied without requiring a restart or interrupting existing sessions.', defaultOn: true },
    { title: 'Restrict access to malicious sites', description: 'Intercepts DNS queries and compares them against a continuously updated threat intelligence feed. Domains associated with malware distribution, phishing, botnet command-and-control, and other threats are blocked at the resolver level before any network connection is established.', defaultOn: true },
    { title: 'Country restrictions', description: 'Uses MaxMind GeoIP2 database to classify source and destination IP addresses by country. You can configure separate inbound and outbound block lists. Rules apply to all traffic routed through this gateway and are evaluated before firewall rules.', defaultOn: false },
    { title: 'Internet threat protection', description: 'Scores all inbound and outbound flows using a locally run machine learning model updated weekly. Packets are classified in real time with sub-millisecond overhead. Flows above the configured risk threshold trigger configurable responses: log, alert, block, or quarantine.', defaultOn: true },
  ];
  const ATTACK_CALENDAR = (() => {
    const days: { date: string; value: number }[] = [];
    const today = new Date(2026, 4, 10);
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dow = d.getDay();
      const dom = d.getDate();
      const mon = d.getMonth();
      const base = dow === 0 || dow === 6 ? 8 : 38;
      const noise = (dom * 7 + mon * 13) % 48;
      const spike = (dom + mon * 4) % 21 === 0 ? 110 : 0;
      days.push({
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        value: base + noise + spike,
      });
    }
    return days;
  })();

  const VLAN_NODES = [
    { label: 'LAN', color: '#006FFF' },
    { label: 'IoT', color: '#00C875' },
    { label: 'WAN', color: '#F5A623' },
    { label: 'VPN', color: '#A78BFA' },
  ];
  const VLAN_MATRIX = [
    [0,   12,  842, 187],
    [12,   0,  124,   4],
    [842, 124,   0,  23],
    [187,   4,  23,   0],
  ];

  const THREAT_TREND: SlopeItem[] = [
    { label: 'Malware',     before: 487, after: 412 },
    { label: 'Port Scans',  before: 321, after: 298 },
    { label: 'Brute Force', before: 158, after: 127 },
    { label: 'Botnet C2',   before: 112, after: 137 },
    { label: 'Phishing',    before: 102, after: 89  },
    { label: 'SQLi/XSS',    before: 78,  after: 64  },
    { label: 'DDoS',        before: 31,  after: 43  },
  ];

  const BLOCKED_COUNTRIES: LollipopItem[] = [
    { label: 'China', value: 1842, color: '#FF7B7B' },
    { label: 'Russia', value: 1204, color: '#FF7B7B' },
    { label: 'United States', value: 687, color: '#F5A623' },
    { label: 'Netherlands', value: 512, color: '#F5A623' },
    { label: 'Germany', value: 389, color: '#A4A7B5' },
    { label: 'Brazil', value: 247, color: '#A4A7B5' },
    { label: 'India', value: 198, color: '#A4A7B5' },
  ];

  const THREAT_TAXONOMY: IcicleNode = {
    label: 'All Threats',
    children: [
      { label: 'Malware', color: '#FF7B7B', children: [
        { label: 'Ransomware', value: 187 },
        { label: 'Trojan', value: 143 },
        { label: 'Spyware', value: 82 },
      ]},
      { label: 'Network', color: '#F5A623', children: [
        { label: 'Port Scans', value: 298 },
        { label: 'DDoS', value: 43 },
      ]},
      { label: 'Botnet', color: '#A78BFA', children: [
        { label: 'C2 Callout', value: 137 },
      ]},
      { label: 'Auth', color: '#34D399', children: [
        { label: 'Brute Force', value: 127 },
      ]},
      { label: 'Web App', color: '#006FFF', children: [
        { label: 'Phishing', value: 89 },
        { label: 'SQLi/XSS', value: 64 },
      ]},
    ],
  };

  const ATTACK_NODES: FDNode[] = [
    { id: 'internet', label: 'Internet',  color: '#FF7B7B', r: 14 },
    { id: 'firewall', label: 'Firewall',  color: '#F5A623', r: 12 },
    { id: 'dmz',      label: 'DMZ',       color: '#F5C26B', r: 10 },
    { id: 'corp',     label: 'Corp VLAN', color: '#006FFF', r: 10 },
    { id: 'iot',      label: 'IoT VLAN',  color: '#34D399', r: 10 },
    { id: 'web',      label: 'Web',       color: '#A78BFA', r: 8  },
    { id: 'mail',     label: 'Mail',      color: '#A78BFA', r: 8  },
    { id: 'api',      label: 'API',       color: '#A78BFA', r: 8  },
    { id: 'dns',      label: 'DNS',       color: '#00C875', r: 8  },
    { id: 'iothub',   label: 'IoT Hub',   color: '#34D399', r: 8  },
  ];
  const ATTACK_LINKS: FDLink[] = [
    { source: 'internet', target: 'firewall' },
    { source: 'firewall', target: 'dmz' },
    { source: 'firewall', target: 'corp' },
    { source: 'firewall', target: 'iot' },
    { source: 'dmz',      target: 'web' },
    { source: 'dmz',      target: 'mail' },
    { source: 'dmz',      target: 'api' },
    { source: 'corp',     target: 'dns' },
    { source: 'corp',     target: 'api' },
    { source: 'iot',      target: 'iothub' },
  ];

  const THREATS: [string, string, string, string, string, string][] = [
    ['danger', 'Mirai botnet C2 callout', 'c8:69:cd:11:23:11 · 192.168.30.18', '185.220.101.42:8443', 'Blocked', '2 min'],
    ['warn', 'SMB null-session probe', '203.0.113.118:48211', '198.51.100.42:445', 'Blocked', '11 min'],
    ['warn', 'SQL injection · UNION SELECT', '45.142.215.92:54312', '198.51.100.42:443', 'Blocked', '22 min'],
    ['danger', 'Cobalt Strike beacon', 'c8:69:cd:11:23:91 · 192.168.20.84', '203.0.113.55:443', 'Blocked', '38 min'],
  ];
  let protectionState: Record<string, boolean> = $state(
    Object.fromEntries(PROTECTIONS.map((p) => [p.title, p.defaultOn])),
  );

  const THREAT_HEATMAP: PolarCell[] = (() => {
    const cells: PolarCell[] = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        const isWeekend = d >= 5;
        const nightPeak = h >= 2 && h <= 5 ? 2.1 : 1.0;
        const noonPeak = h >= 12 && h <= 14 ? 1.3 : 1.0;
        const base = isWeekend ? 10 : 22;
        const noise = ((d * 7 + h * 13) % 19) / 19;
        cells.push({ row: d, col: h, value: Math.round(base * nightPeak * noonPeak * (0.6 + 0.4 * noise)) });
      }
    }
    return cells;
  })();

  const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}`);
  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const MONTHLY_THREATS = [
    { label: 'Jan 2025', value: 1842 }, { label: 'Feb 2025', value: 1620 },
    { label: 'Mar 2025', value: 1980 }, { label: 'Apr 2025', value: 2140 },
    { label: 'May 2025', value: 1750 }, { label: 'Jun 2025', value: 1530 },
    { label: 'Jul 2025', value: 1690 }, { label: 'Aug 2025', value: 2310 },
    { label: 'Sep 2025', value: 2580 }, { label: 'Oct 2025', value: 2960 },
    { label: 'Nov 2025', value: 3120 }, { label: 'Dec 2025', value: 2870 },
    { label: 'Jan 2026', value: 3240 }, { label: 'Feb 2026', value: 2910 },
    { label: 'Mar 2026', value: 3050 }, { label: 'Apr 2026', value: 3480 },
    { label: 'May 2026', value: 4120 },
  ];

  const THREAT_KEYWORDS: WordCloudItem[] = [
    { word: 'Malware', weight: 412 }, { word: 'Port Scan', weight: 298 },
    { word: 'Botnet', weight: 137 }, { word: 'Brute Force', weight: 127 },
    { word: 'Phishing', weight: 89 }, { word: 'SQLi', weight: 64 },
    { word: 'DDoS', weight: 43 }, { word: 'Ransomware', weight: 187 },
    { word: 'Trojan', weight: 143 }, { word: 'Spyware', weight: 82 },
    { word: 'Cobalt Strike', weight: 38 }, { word: 'Mirai', weight: 31 },
    { word: 'C2 Callout', weight: 55 }, { word: 'XSS', weight: 29 },
    { word: 'UNION SELECT', weight: 22 }, { word: 'Null Session', weight: 47 },
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Security</div>
  <div class="ph-actions">
    <Button>Audit log</Button>
    <Button variant="primary">Apply</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 'threat', label: 'Threat Management' },
    { id: 'fw', label: 'Firewall', badge: 14 },
    { id: 'tr', label: 'Traffic Rules', badge: 22 },
    { id: 'geo', label: 'Geo IP' },
    { id: 'dns', label: 'DNS Shield' },
  ]}
/>
<div class="grid">
  <Card span={6}>
    <h3>IDS / IPS <Pill variant="success">Active</Pill></h3>
    <div class="stat">847<span class="unit">threats blocked · 24 h</span></div>
    <div class="submeta">Signatures · v9.4.21 · updated 14 min ago</div>
    <Sparkline active />
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:6px;font-size:11px;">
      {#each [['Malware', '412'], ['Scans', '298'], ['Botnet C2', '137']] as [k, v]}
        <div style="background:#0A0A0B;border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:8px;">
          <div style="color:#6E7079;">{k}</div>
          <div style="font-size:18px;color:#fff;font-variant-numeric:tabular-nums;font-weight:600;margin-top:2px;">{v}</div>
        </div>
      {/each}
    </div>
  </Card>

  <Card span={6}>
    <h3>Protections</h3>
    {#each PROTECTIONS as p (p.title)}
      <div style="display:flex;align-items:flex-start;gap:14px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;color:#fff;font-weight:500;margin-bottom:4px;">{p.title}</div>
          <Spoiler maxHeight={36} showLabel="More" hideLabel="Less">
            <div style="font-size:11px;color:#6E7079;line-height:1.5;">{p.description}</div>
          </Spoiler>
        </div>
        <Toggle bind:on={protectionState[p.title]} ariaLabel={p.title} />
      </div>
    {/each}
  </Card>

  <Card span={6}>
    <h3>Threat type distribution · 24 h</h3>
    <TreeMap nodes={THREAT_DISTRIBUTION} height={140} ariaLabel="Threat type distribution treemap" />
  </Card>

  <Card span={6}>
    <h3>Threat severity breakdown · 24 h</h3>
    <PieChart
      slices={THREAT_SEVERITY}
      size={160}
      ariaLabel="Pie chart: threat severity breakdown - Critical 23, High 89, Medium 234, Low 312, Info 127 out of 785 total threats"
    />
  </Card>

  <Card span={12}>
    <h3>Pareto analysis <span class="unit">Top threats · 80% threshold</span></h3>
    <ParetoChart
      items={THREAT_DISTRIBUTION}
      height={140}
      ariaLabel="Pareto chart: top threat types by count with cumulative percentage"
    />
  </Card>

  <Card span={12}>
    <h3>Threat taxonomy <span class="unit">Category breakdown · 24 h</span></h3>
    <IcicleChart
      root={THREAT_TAXONOMY}
      height={160}
      ariaLabel="Threat taxonomy icicle chart: Malware (Ransomware 187, Trojan 143, Spyware 82), Network (Port Scans 298, DDoS 43), Botnet C2 Callout 137, Auth Brute Force 127, Web App (Phishing 89, SQLi/XSS 64)"
    />
  </Card>

  <Card span={12}>
    <h3>Threat Activity <span class="unit">Past 12 months</span></h3>
    <CalendarHeatmap
      data={ATTACK_CALENDAR}
      ariaLabel="Threat activity calendar: daily attack counts over the past 12 months"
    />
    <div style="display:flex;align-items:center;gap:5px;margin-top:8px;font-size:11px;color:#6E7079;">
      <span>Less</span>
      {#each ['rgba(255,255,255,0.06)', '#0d2a5e', '#1a4da6', '#2979ff', '#5ba4ff'] as c, i (i)}
        <span style="width:10px;height:10px;background:{c};border-radius:2px;display:inline-block;" aria-hidden="true" />
      {/each}
      <span>More</span>
    </div>
  </Card>

  <Card span={12}>
    <h3>Monthly threat volume <span class="unit">Jan 2025 – May 2026</span></h3>
    <StripeChart
      data={MONTHLY_THREATS}
      height={56}
      colorLow="#0A2840"
      colorHigh="#FF4040"
      ariaLabel="Monthly threat volume stripe chart: Jan 2025 1842 threats (low, dark blue) rising to May 2026 4120 threats (high, red)"
    />
    <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:11px;color:#6E7079;">
      <span>Jan 2025</span><span>May 2026</span>
    </div>
  </Card>

  <Card span={6}>
    <h3>Cross-VLAN traffic matrix · 24h</h3>
    <ChordDiagram
      nodes={VLAN_NODES}
      matrix={VLAN_MATRIX}
      ariaLabel="Cross-VLAN traffic matrix: LAN-IoT 12 GB, LAN-WAN 842 GB, LAN-VPN 187 GB, IoT-WAN 124 GB, IoT-VPN 4 GB, WAN-VPN 23 GB."
    />
  </Card>

  <Card span={6}>
    <h3>Top blocked source countries <span class="unit">24 h</span></h3>
    <LollipopChart
      items={BLOCKED_COUNTRIES}
      ariaLabel="Top blocked source countries: China 1842, Russia 1204, United States 687, Netherlands 512, Germany 389, Brazil 247, India 198"
    />
  </Card>

  <Card span={6}>
    <h3>Threat category trend <span class="unit">Apr vs May</span></h3>
    <SlopeChart
      items={THREAT_TREND}
      labelBefore="Apr"
      labelAfter="May"
      ariaLabel="Threat category trend April to May: Malware 487 to 412, Port Scans 321 to 298, Brute Force 158 to 127, Botnet C2 112 to 137 (increased), Phishing 102 to 89, SQLi/XSS 78 to 64, DDoS 31 to 43 (increased)"
    />
  </Card>

  <Card span={12}>
    <h3>Attack surface topology <span class="unit">Network segment relationships</span></h3>
    <ForceGraph
      nodes={ATTACK_NODES}
      links={ATTACK_LINKS}
      height={260}
      ariaLabel="Attack surface topology: Internet connects to Firewall, which routes to DMZ, Corp VLAN, and IoT VLAN. DMZ hosts Web, Mail, and API services. Corp VLAN connects to DNS and API. IoT VLAN connects to IoT Hub."
    />
  </Card>

  <Card span={12}>
    <h3>Threat activity <span class="unit">Day × hour · 7-day pattern</span></h3>
    <div style="display:flex;align-items:center;gap:20px;">
      <div style="flex:0 0 auto;width:260px;">
        <PolarHeatmap
          data={THREAT_HEATMAP}
          rows={7}
          cols={24}
          colLabels={HOUR_LABELS}
          color="#FF7B7B"
          ariaLabel="Threat activity polar heatmap: 7 rings (Mon inner to Sun outer) by 24 hour segments (clockwise). Attacks peak between 02:00 and 05:00 on weekdays."
        />
      </div>
      <div style="font-size:11px;color:#6E7079;">
        <div style="font-weight:600;color:#A4A7B5;margin-bottom:8px;">Ring (inner to outer)</div>
        {#each DAY_LABELS as day, i (day)}
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span style="display:inline-block;width:24px;height:8px;border-radius:2px;background:rgba(255,123,123,{(0.15 + 0.85 * ((i + 0.5) / 7)).toFixed(2)});" />
            {day}
          </div>
        {/each}
        <div style="margin-top:10px;color:#4A4C55;">Hours 0–23 clockwise from top</div>
      </div>
    </div>
  </Card>

  <Card span={12}>
    <h3>Threat signature keywords <span class="unit">frequency · 24 h</span></h3>
    <WordCloud
      items={THREAT_KEYWORDS}
      height={140}
      ariaLabel="Threat signature keyword cloud: Malware 412 (largest), Port Scan 298, Ransomware 187, Botnet 137, Trojan 143, Brute Force 127, Phishing 89, Spyware 82, SQLi 64, C2 Callout 55, Null Session 47, DDoS 43, Cobalt Strike 38, XSS 29, Mirai 31, UNION SELECT 22"
    />
  </Card>

  <Card span={12} style="padding:0;">
    <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;">
      <h3 style="margin:0;color:#fff;">Recent Blocked Threats</h3>
      <Button>View all</Button>
    </div>
    <table>
      <caption class="sr-only">Recent blocked threats</caption>
      <thead>
        <tr>
          <th scope="col">Severity</th><th scope="col">Signature</th><th scope="col">Source</th>
          <th scope="col">Destination</th><th scope="col">Action</th>
          <th scope="col" style="text-align:right;">When</th>
        </tr>
      </thead>
      <tbody>
        {#each THREATS as t}
          <tr>
            <td><Pill variant={pillVariant(t[0])}>{t[0] === 'danger' ? 'Critical' : 'Medium'}</Pill></td>
            <td style="color:#fff;">{t[1]}</td>
            <td class="mac">{t[2]}</td>
            <td class="mac">{t[3]}</td>
            <td><Pill variant="success">{t[4]}</Pill></td>
            <td style="text-align:right;color:#A4A7B5;">{t[5]} ago</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Card>
</div>
