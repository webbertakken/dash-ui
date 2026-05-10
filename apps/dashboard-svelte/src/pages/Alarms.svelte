<script lang="ts">
  import { ActivityFeed, Alert, AnnotatedTimeSeries, Badge, BellIcon, Button, Card, EmptyState, GroupedList, NotificationPanel, Pill, Tabs, Timeline } from '@dash-ui/svelte';
  import type { ActivityItem, GroupedListGroup, NotificationItem, TimelineEvent, TimeSeriesAnnotation } from '@dash-ui/svelte';
  let tab = 'active';
  let criticalDismissed = false;
  let notifOpen = false;

  const ALARM_DATA = [1, 1, 0, 0, 2, 2, 4, 3, 3, 5, 4, 3, 3];
  const ALARM_LABELS = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', 'Now'];
  const ALARM_ANNOTATIONS: TimeSeriesAnnotation[] = [
    { index: 9, label: 'WAN failover', color: '#00B458' },
    { index: 11, label: 'FW update', color: '#006FFF' },
  ];
  const ROWS = [
    { sev: 'danger', source: ['CAM', 'Cam-Bullet 5 · Side Entry', 'CAM-Bullet5'], msg: 'No PoE link detected on uplink port', when: '2 min ago' },
    { sev: 'warn', source: ['EG', 'Edge Gateway X1', 'EG-X1'], msg: 'CPU sustained at 84% for 3 minutes', when: '8 min ago' },
    { sev: 'warn', source: ['VLN', 'DHCP · VLAN 20', '192.168.20.0/24'], msg: 'Pool 92% full · 234 / 254 leases active', when: '14 min ago' },
  ];
  const GROUPED_ALARMS: GroupedListGroup[] = [
    {
      label: 'Critical',
      color: '#F03A3A',
      items: [
        { label: 'Cam-Bullet 5 — PoE link failure', sublabel: 'No PoE link on uplink port. Device offline.', meta: '2 min ago', status: 'danger' },
      ],
    },
    {
      label: 'Warning',
      color: '#F5A623',
      items: [
        { label: 'Edge Gateway X1 — High CPU', sublabel: 'CPU at 84% for 3 minutes.', meta: '8 min ago', status: 'warn' },
        { label: 'VLAN 20 — DHCP pool near full', sublabel: 'Pool 92% exhausted (234/254 leases).', meta: '14 min ago', status: 'warn' },
      ],
    },
    {
      label: 'Info',
      color: '#006FFF',
      defaultOpen: false,
      items: [
        { label: 'ES-48-Pro — Firmware updated', sublabel: 'Updated from 6.6.55 to 6.6.61 successfully.', meta: '2 h ago', status: 'success' },
        { label: 'AP-Pro — Client roamed', sublabel: '14 clients roamed from Main Hall reception.', meta: '3 h ago', status: 'info' },
        { label: 'Edge Gateway X1 — WAN failover', sublabel: 'WAN1 recovered. Traffic failed back from LTE.', meta: '6 h ago', status: 'success' },
      ],
    },
  ];

  const HISTORY: TimelineEvent[] = [
    { id: 'h1', title: 'Cam-Bullet 5 · Side Entry — PoE link failure', description: 'No PoE link detected on uplink port. Device went offline.', time: '2 min ago', variant: 'danger' },
    { id: 'h2', title: 'Edge Gateway X1 — High CPU', description: 'CPU sustained at 84% for 3 minutes. Auto-throttled IDS/IPS inspection.', time: '8 min ago', variant: 'warn' },
    { id: 'h3', title: 'VLAN 20 — DHCP pool near full', description: 'Pool 92% exhausted (234/254 leases). Consider expanding subnet.', time: '14 min ago', variant: 'warn' },
    { id: 'h4', title: 'ES-48-Pro · Core — Firmware updated', description: 'Updated from 6.6.55 to 6.6.61 successfully.', time: '2 h ago', variant: 'success' },
    { id: 'h5', title: 'AP-Pro · Main Hall — Client roamed', description: '14 clients roamed from AP-Pro · Reception within 30 s.', time: '3 h ago', variant: 'info' },
    { id: 'h6', title: 'Edge Gateway X1 — WAN failover', description: 'WAN1 recovered. Traffic failed back from LTE within 4 s.', time: '6 h ago', variant: 'success' },
    { id: 'h7', title: 'Cam-Dome 4 · Parking — Motion detected', description: 'Motion event recorded. Clip saved to NVR storage.', time: '8 h ago', variant: 'neutral' },
  ];

  const FEED_ITEMS: ActivityItem[] = [
    { id: 'f1', title: 'Cam-Bullet 5 -- Side Entry -- PoE link failure', description: 'No PoE link detected on uplink port. Device went offline.', time: '2 min ago', severity: 'error' },
    { id: 'f2', title: 'Edge Gateway X1 -- High CPU', description: 'CPU sustained at 84% for 3 minutes. Auto-throttled IDS/IPS inspection.', time: '8 min ago', severity: 'warn' },
    { id: 'f3', title: 'VLAN 20 -- DHCP pool near full', description: 'Pool 92% exhausted (234/254 leases). Consider expanding subnet.', time: '14 min ago', severity: 'warn' },
    { id: 'f4', title: 'ES-48-Pro -- Core -- Firmware updated', description: 'Updated from 6.6.55 to 6.6.61 successfully.', time: '2 h ago', severity: 'success' },
    { id: 'f5', title: 'AP-Pro -- Main Hall -- Client roamed', description: '14 clients roamed from AP-Pro -- Reception within 30 s.', time: '3 h ago', severity: 'info' },
    { id: 'f6', title: 'Edge Gateway X1 -- WAN failover', description: 'WAN1 recovered. Traffic failed back from LTE within 4 s.', time: '6 h ago', severity: 'success' },
    { id: 'f7', title: 'Cam-Dome 4 -- Parking -- Motion detected', description: 'Motion event recorded. Clip saved to NVR storage.', time: '8 h ago', severity: 'neutral' },
    { id: 'f8', title: 'AP-Pro -- Reception -- Client connected', description: 'New client 9A:B3:7D:... connected at 1.2 Gbps (Wi-Fi 6E).', time: '10 h ago', severity: 'info' },
    { id: 'f9', title: 'ES-8-Lite -- Break Room -- Port 4 up', description: 'Link established at 1 Gbps (full duplex).', time: '12 h ago', severity: 'neutral' },
    { id: 'f10', title: 'Edge Gateway X1 -- DPI signature update', description: 'Deep Packet Inspection signatures updated to v2024.05.1.', time: '18 h ago', severity: 'info' },
  ];

  let notifications: NotificationItem[] = [
    { id: 'n1', type: 'alarm', severity: 'danger', title: 'PoE link failure — Cam-Bullet 5', description: 'No PoE link detected on uplink port. Device went offline.', time: '2 min ago', read: false },
    { id: 'n2', type: 'alarm', severity: 'warn', title: 'High CPU — Edge Gateway X1', description: 'CPU sustained at 84% for 3 minutes.', time: '8 min ago', read: false },
    { id: 'n3', type: 'alarm', severity: 'warn', title: 'DHCP pool near full — VLAN 20', description: 'Pool 92% exhausted (234/254 leases).', time: '14 min ago', read: false },
    { id: 'n4', type: 'update', severity: 'success', title: 'Firmware updated — ES-48-Pro', description: 'Updated from 6.6.55 to 6.6.61 successfully.', time: '2 h ago', read: true },
    { id: 'n5', type: 'system', severity: 'info', title: 'WAN failover recovered', description: 'WAN1 recovered. Traffic failed back from LTE within 4 s.', time: '6 h ago', read: true },
  ];

  $: unread = notifications.filter((n) => !n.read).length;

  function markRead(id: string) {
    notifications = notifications.map((n) => n.id === id ? { ...n, read: true } : n);
  }
  function markAllRead() {
    notifications = notifications.map((n) => ({ ...n, read: true }));
  }
</script>

<div class="ph-bar">
  <div class="ph-title">Alarm Manager</div>
  <div class="ph-actions">
    <Button
      on:click={() => { notifOpen = true; }}
      aria-label="Notification centre{unread > 0 ? `, ${unread} unread` : ''}"
      style="display:inline-flex;align-items:center;gap:6px;"
    >
      <Badge count={unread} color="danger">
        <BellIcon aria-hidden="true" />
      </Badge>
      Notifications
    </Button>
    <Button>Acknowledge all</Button>
    <Button>Configure</Button>
  </div>
</div>
<NotificationPanel
  bind:open={notifOpen}
  {notifications}
  onClose={() => { notifOpen = false; }}
  onMarkRead={markRead}
  onMarkAllRead={markAllRead}
/>
<Tabs
  bind:active={tab}
  items={[
    { id: 'active', label: 'Active', badge: 3 },
    { id: 'grouped', label: 'By Severity' },
    { id: 'ack', label: 'Acknowledged', badge: 2 },
    { id: 'all', label: 'All', badge: 42 },
    { id: 'feed', label: 'Live Feed' },
  ]}
/>
{#if !criticalDismissed}
  <div style="padding:12px 24px 0;">
    <Alert variant="danger" onDismiss={() => { criticalDismissed = true; }}>
      1 critical alarm requires immediate attention: PoE link failure on Cam-Bullet 5 · Side Entry.
    </Alert>
  </div>
{/if}
<div style="padding:12px 24px 0;">
  <Card>
    <h3>Active alarm count — last 24 h</h3>
    <AnnotatedTimeSeries
      data={ALARM_DATA}
      labels={ALARM_LABELS}
      annotations={ALARM_ANNOTATIONS}
      color="#F5A623"
      height={120}
      ariaLabel="Active alarm count over last 24 hours: peaked at 5 alarms at 18:00, currently 3 active; WAN failover at 18:00, firmware update at 22:00"
    />
  </Card>
</div>
<div style="padding:0 24px 24px;">
  {#if tab === 'ack'}
    <EmptyState
      title="No acknowledged alarms"
      description="Acknowledged alarms will appear here. All active alarms still require attention."
    />
  {:else if tab === 'grouped'}
    <div style="padding-top:16px;">
      <Card>
        <GroupedList groups={GROUPED_ALARMS} ariaLabel="Alarms grouped by severity" />
      </Card>
    </div>
  {:else if tab === 'all'}
    <div style="padding-top:16px;">
      <Timeline events={HISTORY} />
    </div>
  {:else if tab === 'feed'}
    <div style="padding-top:16px;">
      <ActivityFeed items={FEED_ITEMS} label="Alarm event feed" maxHeight={400} />
    </div>
  {:else}
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
  {/if}
</div>
