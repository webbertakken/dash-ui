<script lang="ts">
  import { Card, Button, Pill, SearchBox, Tabs, Carousel, StarRating, PlusIcon } from '@w5-ui/svelte';
  let tab = 'all';
  const FEATURED = [
    { id: 'entra', title: 'New: Microsoft Entra ID', description: 'Sync up to 10,000 users via SAML & SCIM — now generally available.', color: '#0078D4' },
    { id: 'datadog', title: 'Datadog metrics streaming', description: 'Stream device metrics and topology events to your Datadog account in real time.', color: '#632CA6' },
    { id: 'ha', title: 'Home Assistant integration', description: 'Control lights, locks, and door-access events locally without cloud relay.', color: '#41BDF5' },
  ];
  const ITEMS: [string, string, string, string, number][] = [
    ['Microsoft Entra ID', 'SAML & SCIM for VPN, Wi-Fi, and Identity Enterprise. Sync up to 10,000 users.', 'Connected', '#0078D4', 5],
    ['Google Workspace', 'Identity provider for portal sign-in and Wi-Fi captive portal.', 'Connected', '#4285F4', 5],
    ['Okta', 'SAML 2.0 SSO for the Dash console and site manager.', 'Available', '#007DC1', 4],
    ['Webhook · Slack', 'Posts critical alarms to #netops every 60 s.', 'Connected', '#611F69', 4],
    ['PagerDuty', 'Routes danger-severity alarms to the on-call schedule.', 'Available', '#06AC38', 5],
    ['Datadog', 'Streams device metrics and topology events.', 'Connected', '#632CA6', 4],
    ['Home Assistant', 'Local control of lights, locks, and door-access events.', 'Available', '#41BDF5', 5],
    ['Zabbix', 'SNMP v3 polling and trap forwarding.', 'Available', '#D40000', 3],
    ['IFTTT · Door Access', 'Trigger flows on entry, denied, or alarm events.', 'Beta', '#406AFF', 3],
  ];
  const HOOKS: [string, string, string, string, string][] = [
    ['https://hooks.slack.com/services/T0…', 'alarm.danger, alarm.warn', '2 min ago', '200 OK', 'success'],
    ['https://api.pagerduty.com/incidents', 'alarm.danger', '42 min ago', '200 OK', 'success'],
    ['https://int.acme.local/integration', 'client.connect, client.disconnect', '5 min ago', '200 OK', 'success'],
    ['https://logs.acme.local/ingest', 'log.security', '12 min ago', '503 Retry', 'warn'],
  ];
  const KEYS: [string, string, string, string][] = [
    ['Grafana scrape', 'grf_•••• 4f12', 'rw, 30d', 'active'],
    ['Backup script', 'bkp_•••• 9d28', 'ro, 90d', 'active'],
    ['Legacy bridge', 'leg_•••• 1100', 'ro, expired', 'revoked'],
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Integrations</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search integrations…" />
    <Button variant="primary"><PlusIcon /> Generate API key</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  items={[
    { id: 'all', label: 'All' },
    { id: 'connected', label: 'Connected', badge: 4 },
    { id: 'identity', label: 'Identity' },
    { id: 'auto', label: 'Automation' },
    { id: 'mon', label: 'Monitoring' },
    { id: 'api', label: 'API & Webhooks' },
  ]}
/>
<div class="grid" style="padding-bottom:0;">
  <div style="grid-column:span 12;">
    <Carousel slides={FEATURED} label="Featured integrations" />
  </div>
</div>
<div class="grid">
  {#each ITEMS as [name, desc, status, color, rating] (name)}
    <Card span={4} style="flex-direction:row;gap:12px;align-items:flex-start;">
      <div style="width:36px;height:36px;border-radius:8px;background:{color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0;">
        {name[0]}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="font-size:13px;color:#fff;font-weight:500;">{name}</div>
          {#if status === 'Connected'}
            <Pill variant="success">Connected</Pill>
          {:else if status === 'Available'}
            <span class="pill" style="color:#A4A7B5;background:rgba(255,255,255,0.06);">Available</span>
          {:else}
            <Pill variant="info">Beta</Pill>
          {/if}
        </div>
        <div style="color:#6E7079;font-size:12px;margin-top:4px;line-height:1.5;">{desc}</div>
        <StarRating label="{name} community rating" value={rating} readOnly size="sm" />
        <div style="margin-top:10px;display:flex;gap:6px;">
          <Button style="font-size:11px;padding:4px 10px;">{status === 'Connected' ? 'Configure' : 'Connect'}</Button>
          {#if status === 'Connected'}
            <Button style="font-size:11px;padding:4px 10px;">Logs</Button>
          {/if}
        </div>
      </div>
    </Card>
  {/each}
</div>
<div class="grid" style="padding-top:0;">
  <Card span={8}>
    <h3 style="display:flex;align-items:center;">
      Webhooks
      <Button style="margin-left:auto;font-size:11px;">+ New endpoint</Button>
    </h3>
    <table>
      <caption class="sr-only">Webhooks</caption>
      <thead>
        <tr><th scope="col">Endpoint</th><th scope="col">Events</th><th scope="col">Last delivery</th><th scope="col">Status</th></tr>
      </thead>
      <tbody>
        {#each HOOKS as r (r[0])}
          <tr>
            <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#C8C9D0;">{r[0]}</td>
            <td style="font-size:12px;color:#A4A7B5;">{r[1]}</td>
            <td style="color:#A4A7B5;">{r[2]}</td>
            <td><Pill variant={r[4] === 'success' ? 'success' : 'warn'}>{r[3]}</Pill></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Card>

  <Card span={4}>
    <h3>API keys</h3>
    {#each KEYS as k (k[0])}
      <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;color:#fff;font-weight:500;">{k[0]}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#6E7079;margin-top:2px;">
            {k[1]} · {k[2]}
          </div>
        </div>
        {#if k[3] === 'active'}
          <Pill variant="success">Active</Pill>
        {:else}
          <span class="pill" style="color:#FF7B7B;background:rgba(240,58,58,0.12);"><span class="dot"></span>Revoked</span>
        {/if}
      </div>
    {/each}
  </Card>
</div>
