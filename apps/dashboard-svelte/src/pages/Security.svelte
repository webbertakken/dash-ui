<script lang="ts">
  import { Card, Button, Pill, Tabs, Sparkline, Toggle } from '@dash-ui/svelte';
  let tab = 'threat';
  const PROTECTIONS: { title: string; description: string; defaultOn: boolean }[] = [
    { title: 'Suspicious activity detection', description: 'Block scanners, brute-force, lateral movement', defaultOn: true },
    { title: 'Honeypot', description: 'Decoy services on unused ports', defaultOn: true },
    { title: 'Restrict access to Tor', description: 'Block all known Tor exit/entry nodes', defaultOn: true },
    { title: 'Restrict access to malicious sites', description: 'DNS-level reputation filtering', defaultOn: true },
    { title: 'Country restrictions', description: 'Block traffic from selected countries', defaultOn: false },
    { title: 'Internet threat protection', description: 'Inline ML-based threat scoring', defaultOn: true },
  ];
  const THREATS: [string, string, string, string, string, string][] = [
    ['danger', 'Mirai botnet C2 callout', 'c8:69:cd:11:23:11 · 192.168.30.18', '185.220.101.42:8443', 'Blocked', '2 min'],
    ['warn', 'SMB null-session probe', '203.0.113.118:48211', '198.51.100.42:445', 'Blocked', '11 min'],
    ['warn', 'SQL injection · UNION SELECT', '45.142.215.92:54312', '198.51.100.42:443', 'Blocked', '22 min'],
    ['danger', 'Cobalt Strike beacon', 'c8:69:cd:11:23:91 · 192.168.20.84', '203.0.113.55:443', 'Blocked', '38 min'],
  ];
  let state: Record<string, boolean> = Object.fromEntries(PROTECTIONS.map((p) => [p.title, p.defaultOn]));
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
      <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="flex:1;">
          <div style="font-size:13px;color:#fff;font-weight:500;">{p.title}</div>
          <div style="font-size:11px;color:#6E7079;margin-top:2px;">{p.description}</div>
        </div>
        <Toggle bind:on={state[p.title]} ariaLabel={p.title} />
      </div>
    {/each}
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
            <td><Pill variant={t[0]}>{t[0] === 'danger' ? 'Critical' : 'Medium'}</Pill></td>
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
