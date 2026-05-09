<script lang="ts">
  import { Button, Pill, Tabs } from '@dash-ui/svelte';
  let tab = 'active';
  const ROWS = [
    { sev: 'danger', source: ['CAM', 'Cam-Bullet 5 · Side Entry', 'CAM-Bullet5'], msg: 'No PoE link detected on uplink port', when: '2 min ago' },
    { sev: 'warn', source: ['EG', 'Edge Gateway X1', 'EG-X1'], msg: 'CPU sustained at 84% for 3 minutes', when: '8 min ago' },
    { sev: 'warn', source: ['VLN', 'DHCP · VLAN 20', '192.168.20.0/24'], msg: 'Pool 92% full · 234 / 254 leases active', when: '14 min ago' },
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Alarm Manager</div>
  <div class="ph-actions">
    <Button>Acknowledge all</Button>
    <Button>Configure</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 'active', label: 'Active', badge: 3 },
    { id: 'ack', label: 'Acknowledged', badge: 2 },
    { id: 'all', label: 'All', badge: 42 },
  ]}
/>
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
    <caption class="sr-only">Alarms</caption>
    <thead>
      <tr>
        <th scope="col">Severity</th><th scope="col">Source</th><th scope="col">Message</th><th scope="col">Site</th>
        <th scope="col" style="text-align:right;">When</th><th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      {#each ROWS as r (r.source[1])}
        <tr>
          <td><Pill variant={r.sev}>{r.sev === 'danger' ? 'Critical' : 'Warning'}</Pill></td>
          <td>
            <div class="name-cell">
              <span class="nc-thumb">{r.source[0]}</span>
              <div>
                <div style="font-size:13px;color:#fff;">{r.source[1]}</div>
                <div class="mac" style="font-size:10px;">{r.source[2]}</div>
              </div>
            </div>
          </td>
          <td>{r.msg}</td>
          <td style="color:#A4A7B5;">Edge Gateway</td>
          <td style="text-align:right;color:#A4A7B5;">{r.when}</td>
          <td><Button>Acknowledge</Button></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
