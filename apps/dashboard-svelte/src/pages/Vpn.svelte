<script lang="ts">
  import { Card, Button, Pill, Tabs, PlusIcon } from '@dash-ui/svelte';
  let tab = 's2s';
  const SERVERS: [string, string, string, string, string, string, string, string][] = [
    ['Office WireGuard', 'WireGuard', '203.0.113.42:51820', '10.10.0.0/24', '12', '#00B070', 'Active', '#5DDB9F'],
    ['Legacy IPsec', 'IPsec / IKEv2', '203.0.113.42:500', '10.20.0.0/24', '3', '#00B070', 'Active', '#5DDB9F'],
    ['L2TP Mobile', 'L2TP / IPsec', '203.0.113.42:1701', '10.30.0.0/24', '0', '#6E7079', 'Disabled', '#A4A7B5'],
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

  <Card span={12} style="padding:0;">
    <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h3 style="margin:0;color:#fff;">VPN Servers</h3>
    </div>
    <table>
      <caption class="sr-only">VPN servers</caption>
      <thead>
        <tr>
          <th scope="col">Name</th><th scope="col">Type</th><th scope="col">Endpoint</th><th scope="col">Network</th>
          <th scope="col" style="text-align:right;">Clients</th><th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each SERVERS as s (s[0])}
          <tr>
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
          </tr>
        {/each}
      </tbody>
    </table>
  </Card>
</div>
