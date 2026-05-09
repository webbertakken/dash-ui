<script lang="ts">
  import { Card, Pill, Button, SearchBox, Sparkline, Donut, StatusIndicator, PlusIcon } from '@dash-ui/svelte';
  import { DASHBOARD_DEVICES, DASHBOARD_ALARMS } from '../data';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ adopt: void }>();
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
</script>

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

  <Card span={4}>
    <h3>Alarm Manager <Pill variant="warn">3 active</Pill></h3>
    {#each DASHBOARD_ALARMS as [sev, t, d, w] (t)}
      <div style="padding:10px;background:#0A0A0B;border:1px solid rgba(255,255,255,0.06);border-radius:6px;margin-top:8px;">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;">
            <Pill variant={sev}>{sev === 'danger' ? 'Critical' : 'Warning'}</Pill>
            <span style="font-size:13px;color:#fff;font-weight:500;">{t}</span>
          </div>
          <span style="font-size:11px;color:#6E7079;">{w}</span>
        </div>
        <div style="font-size:11px;color:#A4A7B5;margin-top:4px;">{d}</div>
      </div>
    {/each}
  </Card>
</div>
