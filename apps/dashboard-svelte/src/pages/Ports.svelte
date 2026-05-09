<script lang="ts">
  import { Card, Button, Pill, Tabs } from '@dash-ui/svelte';
  import { PORT_STATES } from '../data';
  let tab = 'main';
  const PORTS: [number, string, string, string, string, string, string, string, string, string][] = [
    [1, 'Uplink → ISP', 'VLAN 1 · Default', 'Trunk all', 'Off', '1 Gbps', '842 / 310 Mbps', '#00B070', 'Connected', '#5DDB9F'],
    [4, 'AP · Lobby', 'VLAN 30 · IoT', 'PoE+ 802.3at', '30 W', '1 Gbps', '42 / 18 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
    [5, 'AP · Reception', 'VLAN 30 · IoT', 'PoE+ 802.3at', '24 W', '1 Gbps', '38 / 12 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
    [10, '—', '—', 'Disabled', 'Off', '—', '—', '#6E7079', 'Disabled', '#A4A7B5'],
    [13, 'Camera · Reception', 'VLAN 1', 'PoE++ 802.3bt', '19 W', '1 Gbps', '12 / 84 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
    [21, 'NAS uplink', 'VLAN 1', 'Trunk all', 'Off', '2.5 Gbps', '118 / 46 MB/s', '#00B070', 'Connected', '#5DDB9F'],
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
    { id: 'udm', label: 'Edge Gateway X1', badge: 10 },
  ]}
/>
<div class="grid">
  <Card span={12}>
    <h3>Front Panel · ES-24-Pro-PoE <Pill variant="success">Connected · 24d 14h</Pill></h3>
    <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:6px;margin-top:6px;">
      {#each PORT_STATES as s, i}
        <div
          title="Port {i + 1}"
          style="aspect-ratio:1.4/1;border:1px solid {s[0] ? 'rgba(0,176,112,0.5)' : 'rgba(255,255,255,0.10)'};background:{s[0] === 'up' ? 'rgba(0,176,112,0.16)' : s[0] === 'poe' ? 'rgba(245,166,35,0.16)' : '#0A0A0B'};border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;color:{s[0] ? '#fff' : '#4A4B53'};position:relative;"
        >
          <div style="font-weight:600;">{i + 1}</div>
          <div style="font-size:8px;color:{s[0] === 'up' ? '#5DDB9F' : s[0] === 'poe' ? '#F5C26B' : '#4A4B53'};">{s[1]}</div>
          {#if s[0] === 'poe'}
            <div style="position:absolute;top:2px;right:3px;font-size:7px;color:#F5C26B;font-weight:600;">PoE</div>
          {/if}
        </div>
      {/each}
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
      <thead>
        <tr>
          <th>Port</th><th>Name</th><th>Network / VLAN</th><th>Profile</th><th>PoE</th>
          <th style="text-align:right;">Speed</th>
          <th style="text-align:right;">RX / TX</th>
          <th>Status</th>
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
</div>
