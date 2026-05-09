<script lang="ts">
  import { Card, Button, Pill, DownloadIcon } from '@dash-ui/svelte';

  const STATS: [string, string, string, string?][] = [
    ['Devices', '38', 'online · 2 offline'],
    ['Clients', '142', '42 wired · 100 wireless'],
    ['PoE budget', '312 W', 'of 600 W'],
    ['Storage', '41%', '1.64 / 4.0 TB'],
  ];
  const HEALTH: [string, number, string?][] = [
    ['CPU · 8 / 16 cores', 41],
    ['Memory · 6.2 / 16 GB', 38],
    ['NPU offload', 72],
    ['IDS/IPS engine', 54, '#F5A623'],
    ['Storage · HDD', 41],
    ['Temperature · 48 °C', 38, '#7FB6FF'],
  ];
  const SWITCHES: [string, string, string, string][] = [
    ['Core · Rack 1', 'Pro Max 24 PoE', '248 / 400 W', '24 / 24'],
    ['Floor 1', 'ES-24-Pro-PoE', '64 / 400 W', '22 / 24'],
    ['Warehouse', 'ES-Flex-Mini-2.5G', '—', '5 / 5'],
    ['Edge · Patio', 'ES-8-Lite-PoE', '12 / 60 W', '4 / 8'],
  ];
  const ADOPTION: [string, string, string, string, string, string][] = [
    ['New AP Pro', 'AP-Pro', '78:45:58:1A:0C:22', '192.168.1.187', '7.2.114', 'Adopt'],
    ['New Flex Mini', 'ES-Flex-Mini', 'F4:E2:C7:09:18:A1', '192.168.1.188', '5.4.32', 'Adopt'],
    ['Camera Cam-Bullet 5', 'CAM-Bullet5', 'D0:21:F9:33:71:0A', '192.168.40.91', '4.79.101', 'Upgrade · 4.81'],
    ['Cam-Pro 4', 'CAM-Pro4', '78:8A:20:1F:33:18', '192.168.40.71', '4.78.92', 'Up to date'],
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Infrastructure</div>
  <div class="ph-actions">
    <Button>All sites</Button>
    <Button>Last 24 h</Button>
    <Button iconOnly title="Export"><DownloadIcon /></Button>
  </div>
</div>
<div class="grid">
  {#each STATS as [label, value, sub] (label)}
    <Card span={3}>
      <h3>{label}</h3>
      <div class="stat">{value}<span class="unit">{sub ?? ''}</span></div>
    </Card>
  {/each}

  <Card span={6}>
    <h3>Console health</h3>
    <div style="display:flex;flex-direction:column;gap:12px;">
      {#each HEALTH as [label, pct, color] (label)}
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span style="color:#C8C9D0;">{label}</span>
            <span style="color:#A4A7B5;font-family:'JetBrains Mono',monospace;">{pct}%</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
            <div style="height:100%;background:{color ?? '#006FFF'};width:{pct}%;"></div>
          </div>
        </div>
      {/each}
    </div>
  </Card>

  <Card span={6}>
    <h3>PoE consumption by switch</h3>
    <table>
      <thead>
        <tr><th>Switch</th><th>Model</th><th>Used / Budget</th><th>Ports</th></tr>
      </thead>
      <tbody>
        {#each SWITCHES as r (r[0])}
          <tr>
            <td style="color:#fff;">{r[0]}</td>
            <td style="color:#A4A7B5;">{r[1]}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;">{r[2]}</td>
            <td style="color:#A4A7B5;">{r[3]}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Card>

  <Card span={12}>
    <h3>Adoption queue <Pill variant="info">2 pending</Pill></h3>
    <table>
      <thead>
        <tr><th>Device</th><th>Model</th><th>MAC</th><th>IP</th><th>Firmware</th><th></th></tr>
      </thead>
      <tbody>
        {#each ADOPTION as r (r[0])}
          <tr>
            <td style="color:#fff;">{r[0]}</td>
            <td style="color:#A4A7B5;">{r[1]}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#6E7079;">{r[2]}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{r[3]}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{r[4]}</td>
            <td style="text-align:right;">
              <Button variant={r[5].startsWith('Adopt') ? 'primary' : 'ghost'} style="font-size:11px;padding:4px 10px;height:auto;">{r[5]}</Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Card>
</div>
