import type { PillVariant } from '@w5-ui/react'
import {
  Alert,
  Badge,
  BellIcon,
  Button,
  Card,
  EmptyState,
  NotificationPanel,
  Pill,
  Tabs,
  Timeline,
  AnnotatedTimeSeries,
  ActivityFeed,
  GroupedList,
} from '@w5-ui/react'
import type {
  Notification,
  TimelineEvent,
  TimeSeriesAnnotation,
  ActivityItem,
  GroupedListGroup,
} from '@w5-ui/react'
import { useState } from 'react'

const ALARM_HISTORY = [
  { label: '00:00', values: [1] },
  { label: '02:00', values: [1] },
  { label: '04:00', values: [0] },
  { label: '06:00', values: [0] },
  { label: '08:00', values: [2] },
  { label: '10:00', values: [2] },
  { label: '12:00', values: [4] },
  { label: '14:00', values: [3] },
  { label: '16:00', values: [3] },
  { label: '18:00', values: [5] },
  { label: '20:00', values: [4] },
  { label: '22:00', values: [3] },
  { label: 'Now', values: [3] },
]

const ALARM_DATA = ALARM_HISTORY.map((h) => h.values[0])
const ALARM_LABELS = ALARM_HISTORY.map((h) => h.label)
const ALARM_ANNOTATIONS: TimeSeriesAnnotation[] = [
  { index: 9, label: 'WAN failover', color: '#00B458' },
  { index: 11, label: 'FW update', color: '#006FFF' },
]

const ROWS = [
  {
    sev: 'danger',
    source: ['CAM', 'Cam-Bullet 5 · Side Entry', 'CAM-Bullet5'],
    msg: 'No PoE link detected on uplink port',
    when: '2 min ago',
  },
  {
    sev: 'warn',
    source: ['EG', 'Edge Gateway X1', 'EG-X1'],
    msg: 'CPU sustained at 84% for 3 minutes',
    when: '8 min ago',
  },
  {
    sev: 'warn',
    source: ['VLN', 'DHCP · VLAN 20', '192.168.20.0/24'],
    msg: 'Pool 92% full · 234 / 254 leases active',
    when: '14 min ago',
  },
] as const

const GROUPED_ALARMS: GroupedListGroup[] = [
  {
    label: 'Critical',
    color: '#F03A3A',
    items: [
      {
        label: 'Cam-Bullet 5 — PoE link failure',
        sublabel: 'No PoE link on uplink port. Device offline.',
        meta: '2 min ago',
        status: 'danger',
      },
    ],
  },
  {
    label: 'Warning',
    color: '#F5A623',
    items: [
      {
        label: 'Edge Gateway X1 — High CPU',
        sublabel: 'CPU at 84% for 3 minutes.',
        meta: '8 min ago',
        status: 'warn',
      },
      {
        label: 'VLAN 20 — DHCP pool near full',
        sublabel: 'Pool 92% exhausted (234/254 leases).',
        meta: '14 min ago',
        status: 'warn',
      },
    ],
  },
  {
    label: 'Info',
    color: '#006FFF',
    defaultOpen: false,
    items: [
      {
        label: 'ES-48-Pro — Firmware updated',
        sublabel: 'Updated from 6.6.55 to 6.6.61 successfully.',
        meta: '2 h ago',
        status: 'success',
      },
      {
        label: 'AP-Pro — Client roamed',
        sublabel: '14 clients roamed from Main Hall reception.',
        meta: '3 h ago',
        status: 'info',
      },
      {
        label: 'Edge Gateway X1 — WAN failover',
        sublabel: 'WAN1 recovered. Traffic failed back from LTE.',
        meta: '6 h ago',
        status: 'success',
      },
    ],
  },
]

const HISTORY: TimelineEvent[] = [
  {
    id: 'h1',
    title: 'Cam-Bullet 5 · Side Entry — PoE link failure',
    description: 'No PoE link detected on uplink port. Device went offline.',
    time: '2 min ago',
    variant: 'danger',
  },
  {
    id: 'h2',
    title: 'Edge Gateway X1 — High CPU',
    description: 'CPU sustained at 84% for 3 minutes. Auto-throttled IDS/IPS inspection.',
    time: '8 min ago',
    variant: 'warn',
  },
  {
    id: 'h3',
    title: 'VLAN 20 — DHCP pool near full',
    description: 'Pool 92% exhausted (234/254 leases). Consider expanding subnet.',
    time: '14 min ago',
    variant: 'warn',
  },
  {
    id: 'h4',
    title: 'ES-48-Pro · Core — Firmware updated',
    description: 'Updated from 6.6.55 to 6.6.61 successfully.',
    time: '2 h ago',
    variant: 'success',
  },
  {
    id: 'h5',
    title: 'AP-Pro · Main Hall — Client roamed',
    description: '14 clients roamed from AP-Pro · Reception within 30 s.',
    time: '3 h ago',
    variant: 'info',
  },
  {
    id: 'h6',
    title: 'Edge Gateway X1 — WAN failover',
    description: 'WAN1 recovered. Traffic failed back from LTE within 4 s.',
    time: '6 h ago',
    variant: 'success',
  },
  {
    id: 'h7',
    title: 'Cam-Dome 4 · Parking — Motion detected',
    description: 'Motion event recorded. Clip saved to NVR storage.',
    time: '8 h ago',
    variant: 'neutral',
  },
]

const FEED_ITEMS: ActivityItem[] = [
  {
    id: 'f1',
    title: 'Cam-Bullet 5 -- Side Entry -- PoE link failure',
    description: 'No PoE link detected on uplink port. Device went offline.',
    time: '2 min ago',
    severity: 'error',
  },
  {
    id: 'f2',
    title: 'Edge Gateway X1 -- High CPU',
    description: 'CPU sustained at 84% for 3 minutes. Auto-throttled IDS/IPS inspection.',
    time: '8 min ago',
    severity: 'warn',
  },
  {
    id: 'f3',
    title: 'VLAN 20 -- DHCP pool near full',
    description: 'Pool 92% exhausted (234/254 leases). Consider expanding subnet.',
    time: '14 min ago',
    severity: 'warn',
  },
  {
    id: 'f4',
    title: 'ES-48-Pro -- Core -- Firmware updated',
    description: 'Updated from 6.6.55 to 6.6.61 successfully.',
    time: '2 h ago',
    severity: 'success',
  },
  {
    id: 'f5',
    title: 'AP-Pro -- Main Hall -- Client roamed',
    description: '14 clients roamed from AP-Pro -- Reception within 30 s.',
    time: '3 h ago',
    severity: 'info',
  },
  {
    id: 'f6',
    title: 'Edge Gateway X1 -- WAN failover',
    description: 'WAN1 recovered. Traffic failed back from LTE within 4 s.',
    time: '6 h ago',
    severity: 'success',
  },
  {
    id: 'f7',
    title: 'Cam-Dome 4 -- Parking -- Motion detected',
    description: 'Motion event recorded. Clip saved to NVR storage.',
    time: '8 h ago',
    severity: 'neutral',
  },
  {
    id: 'f8',
    title: 'AP-Pro -- Reception -- Client connected',
    description: 'New client 9A:B3:7D:... connected at 1.2 Gbps (Wi-Fi 6E).',
    time: '10 h ago',
    severity: 'info',
  },
  {
    id: 'f9',
    title: 'ES-8-Lite -- Break Room -- Port 4 up',
    description: 'Link established at 1 Gbps (full duplex).',
    time: '12 h ago',
    severity: 'neutral',
  },
  {
    id: 'f10',
    title: 'Edge Gateway X1 -- DPI signature update',
    description: 'Deep Packet Inspection signatures updated to v2024.05.1.',
    time: '18 h ago',
    severity: 'info',
  },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'alarm',
    severity: 'danger',
    title: 'PoE link failure — Cam-Bullet 5',
    description: 'No PoE link detected on uplink port. Device went offline.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'alarm',
    severity: 'warn',
    title: 'High CPU — Edge Gateway X1',
    description: 'CPU sustained at 84% for 3 minutes.',
    time: '8 min ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'alarm',
    severity: 'warn',
    title: 'DHCP pool near full — VLAN 20',
    description: 'Pool 92% exhausted (234/254 leases).',
    time: '14 min ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'update',
    severity: 'success',
    title: 'Firmware updated — ES-48-Pro',
    description: 'Updated from 6.6.55 to 6.6.61 successfully.',
    time: '2 h ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'system',
    severity: 'info',
    title: 'WAN failover recovered',
    description: 'WAN1 recovered. Traffic failed back from LTE within 4 s.',
    time: '6 h ago',
    read: true,
  },
]

export function Alarms() {
  const [tab, setTab] = useState('active')
  const [criticalDismissed, setCriticalDismissed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)

  const unread = notifications.filter((n) => !n.read).length

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Alarm Manager</div>
        <div className="ph-actions">
          <Button
            onClick={() => setNotifOpen(true)}
            aria-label={`Notification centre${unread > 0 ? `, ${unread} unread` : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'active', label: 'Active', badge: 3 },
          { id: 'grouped', label: 'By Severity' },
          { id: 'ack', label: 'Acknowledged', badge: 2 },
          { id: 'all', label: 'All', badge: 42 },
          { id: 'feed', label: 'Live Feed' },
        ]}
      />
      {!criticalDismissed && (
        <div style={{ padding: '12px 24px 0' }}>
          <Alert variant="danger" onDismiss={() => setCriticalDismissed(true)}>
            1 critical alarm requires immediate attention: PoE link failure on Cam-Bullet 5 · Side
            Entry.
          </Alert>
        </div>
      )}
      <div style={{ padding: '12px 24px 0' }}>
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
      <div style={{ padding: '0 24px 24px' }}>
        {tab === 'ack' ? (
          <EmptyState
            title="No acknowledged alarms"
            description="Acknowledged alarms will appear here. All active alarms still require attention."
          />
        ) : tab === 'grouped' ? (
          <div style={{ paddingTop: 16 }}>
            <Card>
              <GroupedList groups={GROUPED_ALARMS} ariaLabel="Alarms grouped by severity" />
            </Card>
          </div>
        ) : tab === 'all' ? (
          <div style={{ paddingTop: 16 }}>
            <Timeline events={HISTORY} />
          </div>
        ) : tab === 'feed' ? (
          <div style={{ paddingTop: 16 }}>
            <ActivityFeed items={FEED_ITEMS} label="Alarm event feed" maxHeight={400} />
          </div>
        ) : (
          <table
            style={{
              background: '#141415',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <caption className="sr-only">Alarms</caption>
            <thead>
              <tr>
                <th scope="col">Severity</th>
                <th scope="col">Source</th>
                <th scope="col">Message</th>
                <th scope="col">Site</th>
                <th scope="col" style={{ textAlign: 'right' }}>
                  When
                </th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.source[1]}>
                  <td>
                    <Pill variant={r.sev as PillVariant}>
                      {r.sev === 'danger' ? 'Critical' : 'Warning'}
                    </Pill>
                  </td>
                  <td>
                    <div className="name-cell">
                      <span className="nc-thumb">{r.source[0]}</span>
                      <div>
                        <div style={{ fontSize: 13, color: '#fff' }}>{r.source[1]}</div>
                        <div className="mac" style={{ fontSize: 10 }}>
                          {r.source[2]}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{r.msg}</td>
                  <td style={{ color: '#A4A7B5' }}>Edge Gateway</td>
                  <td style={{ textAlign: 'right', color: '#A4A7B5' }}>{r.when}</td>
                  <td>
                    <Button>Acknowledge</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
