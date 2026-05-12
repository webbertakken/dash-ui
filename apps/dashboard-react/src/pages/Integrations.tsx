import { Card, Button, Pill, SearchBox, Tabs, Carousel, StarRating, PlusIcon } from '@w5-ui/react'
import { useState } from 'react'

const FEATURED = [
  {
    id: 'entra',
    title: 'New: Microsoft Entra ID',
    description: 'Sync up to 10,000 users via SAML & SCIM — now generally available.',
    color: '#0078D4',
  },
  {
    id: 'datadog',
    title: 'Datadog metrics streaming',
    description: 'Stream device metrics and topology events to your Datadog account in real time.',
    color: '#632CA6',
  },
  {
    id: 'ha',
    title: 'Home Assistant integration',
    description: 'Control lights, locks, and door-access events locally without cloud relay.',
    color: '#41BDF5',
  },
]

const ITEMS: [string, string, string, string, number][] = [
  [
    'Microsoft Entra ID',
    'SAML & SCIM for VPN, Wi-Fi, and Identity Enterprise. Sync up to 10,000 users.',
    'Connected',
    '#0078D4',
    5,
  ],
  [
    'Google Workspace',
    'Identity provider for portal sign-in and Wi-Fi captive portal.',
    'Connected',
    '#4285F4',
    5,
  ],
  ['Okta', 'SAML 2.0 SSO for the Dash console and site manager.', 'Available', '#007DC1', 4],
  ['Webhook · Slack', 'Posts critical alarms to #netops every 60 s.', 'Connected', '#611F69', 4],
  [
    'PagerDuty',
    'Routes danger-severity alarms to the on-call schedule.',
    'Available',
    '#06AC38',
    5,
  ],
  ['Datadog', 'Streams device metrics and topology events.', 'Connected', '#632CA6', 4],
  [
    'Home Assistant',
    'Local control of lights, locks, and door-access events.',
    'Available',
    '#41BDF5',
    5,
  ],
  ['Zabbix', 'SNMP v3 polling and trap forwarding.', 'Available', '#D40000', 3],
  ['IFTTT · Door Access', 'Trigger flows on entry, denied, or alarm events.', 'Beta', '#406AFF', 3],
]

const HOOKS: [string, string, string, string, string][] = [
  [
    'https://hooks.slack.com/services/T0…',
    'alarm.danger, alarm.warn',
    '2 min ago',
    '200 OK',
    'success',
  ],
  ['https://api.pagerduty.com/incidents', 'alarm.danger', '42 min ago', '200 OK', 'success'],
  [
    'https://int.acme.local/integration',
    'client.connect, client.disconnect',
    '5 min ago',
    '200 OK',
    'success',
  ],
  ['https://logs.acme.local/ingest', 'log.security', '12 min ago', '503 Retry', 'warn'],
]

const KEYS: [string, string, string, string][] = [
  ['Grafana scrape', 'grf_•••• 4f12', 'rw, 30d', 'active'],
  ['Backup script', 'bkp_•••• 9d28', 'ro, 90d', 'active'],
  ['Legacy bridge', 'leg_•••• 1100', 'ro, expired', 'revoked'],
]

function ServiceCard({
  name,
  desc,
  status,
  color,
  rating,
}: {
  name: string
  desc: string
  status: string
  color: string
  rating: number
}) {
  const pill =
    status === 'Connected' ? (
      <Pill variant="success">Connected</Pill>
    ) : status === 'Available' ? (
      <span className="pill" style={{ color: '#A4A7B5', background: 'rgba(255,255,255,0.06)' }}>
        Available
      </span>
    ) : (
      <Pill variant="info">Beta</Pill>
    )
  return (
    <Card span={4} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{name}</div>
          {pill}
        </div>
        <div style={{ color: '#6E7079', fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
        <StarRating label={`${name} community rating`} value={rating} readOnly size="sm" />
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <Button style={{ fontSize: 11, padding: '4px 10px' }}>
            {status === 'Connected' ? 'Configure' : 'Connect'}
          </Button>
          {status === 'Connected' && (
            <Button style={{ fontSize: 11, padding: '4px 10px' }}>Logs</Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export function Integrations() {
  const [tab, setTab] = useState('all')
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Integrations</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search integrations…" />
          <Button variant="primary">
            <PlusIcon /> Generate API key
          </Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'all', label: 'All' },
          { id: 'connected', label: 'Connected', badge: 4 },
          { id: 'identity', label: 'Identity' },
          { id: 'auto', label: 'Automation' },
          { id: 'mon', label: 'Monitoring' },
          { id: 'api', label: 'API & Webhooks' },
        ]}
      />
      <div className="grid" style={{ paddingBottom: 0 }}>
        <div style={{ gridColumn: 'span 12' }}>
          <Carousel slides={FEATURED} label="Featured integrations" />
        </div>
      </div>
      <div className="grid">
        {ITEMS.map(([name, desc, status, color, rating]) => (
          <ServiceCard
            key={name}
            name={name}
            desc={desc}
            status={status}
            color={color}
            rating={rating}
          />
        ))}
      </div>
      <div className="grid" style={{ paddingTop: 0 }}>
        <Card span={8}>
          <h3 style={{ display: 'flex', alignItems: 'center' }}>
            Webhooks
            <Button style={{ marginLeft: 'auto', fontSize: 11 }}>+ New endpoint</Button>
          </h3>
          <table>
            <caption className="sr-only">Webhooks</caption>
            <thead>
              <tr>
                <th scope="col">Endpoint</th>
                <th scope="col">Events</th>
                <th scope="col">Last delivery</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {HOOKS.map((r) => (
                <tr key={r[0]}>
                  <td
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 11,
                      color: '#C8C9D0',
                    }}
                  >
                    {r[0]}
                  </td>
                  <td style={{ fontSize: 12, color: '#A4A7B5' }}>{r[1]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[2]}</td>
                  <td>
                    <Pill variant={r[4] === 'success' ? 'success' : 'warn'}>{r[3]}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card span={4}>
          <h3>API keys</h3>
          {KEYS.map((k) => (
            <div
              key={k[0]}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{k[0]}</div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    color: '#6E7079',
                    marginTop: 2,
                  }}
                >
                  {k[1]} · {k[2]}
                </div>
              </div>
              {k[3] === 'active' ? (
                <Pill variant="success">Active</Pill>
              ) : (
                <span
                  className="pill"
                  style={{ color: '#FF7B7B', background: 'rgba(240,58,58,0.12)' }}
                >
                  <span className="dot" />
                  Revoked
                </span>
              )}
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}
