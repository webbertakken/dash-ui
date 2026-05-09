<script lang="ts">
  import { Button, SearchBox, Tabs, DownloadIcon } from '@dash-ui/svelte';
  import { LOG_ROWS } from '../data';
  let tab = 'all';
  const sevColor = (s: string) => (s === 'danger' ? '#FF7B7B' : s === 'warn' ? '#F5C26B' : '#7FB6FF');
  const sevDot = (s: string) => (s === 'danger' ? '#F03A3A' : s === 'warn' ? '#F5A623' : '#006FFF');
</script>

<div class="ph-bar">
  <div class="ph-title">Logs</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search logs…" />
    <Button>Last 1 h</Button>
    <Button iconOnly title="Download"><DownloadIcon /></Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 'all', label: 'All', badge: '2,418' },
    { id: 'network', label: 'Network', badge: '1,842' },
    { id: 'system', label: 'System', badge: 214 },
    { id: 'security', label: 'Security', badge: 187 },
    { id: 'vpn', label: 'VPN', badge: 62 },
    { id: 'access', label: 'Access', badge: 94 },
    { id: 'protect', label: 'Protect', badge: 19 },
  ]}
/>
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;font-family:'JetBrains Mono',monospace;font-size:12px;">
    <thead style="font-family:Inter,sans-serif;">
      <tr>
        <th style="width:90px;">Severity</th>
        <th style="width:90px;">Source</th>
        <th style="width:90px;">Time</th>
        <th>Event</th><th>Subject</th><th>Detail</th>
      </tr>
    </thead>
    <tbody>
      {#each LOG_ROWS as r}
        <tr>
          <td>
            <span style="display:inline-flex;align-items:center;gap:6px;color:{sevColor(r[0])};font-size:11px;font-family:Inter,sans-serif;text-transform:uppercase;letter-spacing:0.04em;font-weight:600;">
              <span style="width:6px;height:6px;border-radius:50%;background:{sevDot(r[0])};"></span>
              {r[0] === 'danger' ? 'crit' : r[0]}
            </span>
          </td>
          <td style="color:#A4A7B5;font-family:Inter,sans-serif;font-size:12px;">{r[1]}</td>
          <td style="color:#6E7079;">{r[2]}</td>
          <td style="color:#fff;font-family:Inter,sans-serif;font-size:13px;">{r[3]}</td>
          <td style="color:#C8C9D0;font-family:Inter,sans-serif;font-size:13px;">{r[4]}</td>
          <td style="color:#6E7079;">{r[5]}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
