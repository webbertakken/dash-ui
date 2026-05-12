import type { PillVariant } from '@w5-ui/react'
import {
  Card,
  Pill,
  Button,
  SearchBox,
  Sparkline,
  Donut,
  Pill as P,
  StatusIndicator,
  PlusIcon,
  LineChart,
  BarChart,
  WaterfallChart,
  SankeyDiagram,
  WaffleChart,
  StreamGraph,
  NightingaleChart,
  DualAxisChart,
  Banner,
  AvatarGroup,
  RankedList,
} from '@w5-ui/react'
import type { SankeyNode, SankeyLink, StreamSeries, RankedItem } from '@w5-ui/react'
import { useState } from 'react'
import { DASHBOARD_DEVICES, DASHBOARD_ALARMS } from '../data.js'

const TRAFFIC_NODES: SankeyNode[] = [
  { id: 'wifi', label: 'WiFi · 480 Mbps', color: '#006FFF' },
  { id: 'wired', label: 'Wired · 240 Mbps', color: '#4797FF' },
  { id: 'vpn', label: 'VPN · 80 Mbps', color: '#7FB6FF' },
  { id: 'internet', label: 'Internet · 520 Mbps', color: '#00C875' },
  { id: 'internal', label: 'Internal · 200 Mbps', color: '#A78BFA' },
  { id: 'iot', label: 'IoT · 80 Mbps', color: '#F5A623' },
]

const TRAFFIC_LINKS: SankeyLink[] = [
  { source: 'wifi', target: 'internet', value: 310 },
  { source: 'wifi', target: 'internal', value: 130 },
  { source: 'wifi', target: 'iot', value: 40 },
  { source: 'wired', target: 'internet', value: 180 },
  { source: 'wired', target: 'internal', value: 60 },
  { source: 'vpn', target: 'internet', value: 30 },
  { source: 'vpn', target: 'internal', value: 10 },
  { source: 'vpn', target: 'iot', value: 40 },
]

const STREAM_LABELS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
const STREAM_SERIES: StreamSeries[] = [
  { label: 'Streaming', color: '#006FFF', values: [40, 20, 60, 110, 180, 240, 140] },
  { label: 'Gaming', color: '#A878F5', values: [30, 10, 20, 80, 140, 120, 60] },
  { label: 'Browsing', color: '#00C8C8', values: [20, 10, 50, 70, 60, 80, 50] },
  { label: 'Social', color: '#F5A623', values: [10, 5, 30, 50, 40, 60, 30] },
  { label: 'IoT', color: '#4797FF', values: [15, 15, 15, 20, 20, 20, 15] },
]

const HOURLY_CLIENTS = [
  2, 1, 1, 1, 2, 5, 18, 45, 67, 73, 68, 55, 58, 62, 65, 71, 78, 82, 75, 60, 42, 28, 15, 7,
].map((v, i) => ({ label: `${i}h`, value: v }))

const TOP_CLIENTS: RankedItem[] = [
  { label: 'MacBook Pro (Alice)', sublabel: '192.168.1.42', value: 4820, color: '#006FFF' },
  { label: 'Gaming PC (Bob)', sublabel: '192.168.1.78', value: 3210, color: '#A878F5' },
  { label: 'Apple TV (Living Room)', sublabel: '192.168.1.15', value: 2650, color: '#00C8C8' },
  { label: 'iPhone 15 (Carol)', sublabel: '192.168.1.91', value: 1840, color: '#F5A623' },
  { label: 'Smart TV (Bedroom)', sublabel: '192.168.1.34', value: 1230, color: '#4797FF' },
]

const TOP_APS: RankedItem[] = [
  { label: 'AP Pro (Living Room)', sublabel: '32 clients', value: 1240, color: '#006FFF' },
  { label: 'AP Pro (Office)', sublabel: '28 clients', value: 980, color: '#4797FF' },
  { label: 'U7 Outdoor (Garden)', sublabel: '12 clients', value: 420, color: '#00C8C8' },
  { label: 'U6 Lite (Basement)', sublabel: '8 clients', value: 210, color: '#A878F5' },
]

export interface DashboardProps {
  onAdopt: () => void
}

export function Dashboard({ onAdopt }: DashboardProps) {
  const [showBanner, setShowBanner] = useState(true)
  return (
    <>
      {showBanner && (
        <Banner
          variant="warn"
          title="Firmware update available"
          action={{ label: 'Update now', onClick: () => setShowBanner(false) }}
          onDismiss={() => setShowBanner(false)}
        >
          Dash OS 4.1.13 is ready — 3 devices will restart briefly.
        </Banner>
      )}
      <div className="ph-bar">
        <div className="ph-title">Dashboard</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search devices, clients…" />
          <Button>Last 24 h</Button>
          <Button variant="primary" onClick={onAdopt}>
            <PlusIcon /> Adopt
          </Button>
        </div>
      </div>

      <div className="grid">
        <Card span={4}>
          <h3>
            Internet <Pill variant="success">Online</Pill>
          </h3>
          <div className="stat">
            847<span className="unit">Mbps · down</span>
          </div>
          <div className="submeta">
            ↑ 312 Mbps · 18 ms · 0.0% loss · <span className="delta-up">+12% 24h</span>
          </div>
          <Sparkline />
        </Card>

        <Card span={4}>
          <h3>
            Throughput <Pill variant="info">Live</Pill>
          </h3>
          <div className="stat">
            5.0<span className="unit">Gbps · IDS/IPS</span>
          </div>
          <div className="submeta">8 / 16 cores · 41% CPU · 6.2 / 16 GB</div>
          <Sparkline active seed={2} />
        </Card>

        <Card span={4}>
          <h3>
            Clients <span style={{ color: '#6E7079', fontWeight: 400 }}>142 connected</span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
            <Donut
              segments={[
                { label: 'wireless', value: 88, color: '#006FFF' },
                { label: 'wired', value: 42, color: '#4797FF' },
                { label: 'vpn', value: 12, color: '#7FB6FF' },
              ]}
              centerValue={142}
              centerLabel="connected"
            />
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, flex: 1 }}
            >
              {[
                ['Wireless', '#006FFF', 88],
                ['Wired', '#4797FF', 42],
                ['VPN', '#7FB6FF', 12],
              ].map(([label, color, n]) => (
                <div
                  key={label as string}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C8C9D0' }}>
                    <span
                      style={{ width: 8, height: 8, background: color as string, borderRadius: 2 }}
                    />{' '}
                    {label}
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: '#fff' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AvatarGroup
              avatars={[
                { initials: 'AB' },
                { initials: 'CJ' },
                { initials: 'KP' },
                { initials: 'ML' },
                { initials: 'RS' },
                { initials: 'TV' },
                { initials: 'WX' },
              ]}
              max={5}
              size="sm"
              ariaLabel="Recently active clients"
            />
            <span style={{ fontSize: 11, color: '#6E7079' }}>Recently active</span>
          </div>
        </Card>

        <Card span={8} style={{ padding: 0 }}>
          <div
            style={{
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 style={{ margin: 0, color: '#fff', fontSize: 13 }}>Network Devices</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <P variant="success">10 connected</P>
              <P variant="warn">1 updating</P>
              <P variant="danger">1 offline</P>
            </div>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Model</th>
                  <th scope="col">IP</th>
                  <th scope="col" style={{ textAlign: 'right' }}>
                    Uptime
                  </th>
                  <th scope="col" style={{ textAlign: 'right' }}>
                    CPU / Mem
                  </th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {DASHBOARD_DEVICES.map((r) => {
                  const thumb = r[1].includes('EG')
                    ? 'EG'
                    : r[1].includes('ES')
                      ? 'ES'
                      : r[1].includes('U7')
                        ? 'U7'
                        : r[1].includes('CAM')
                          ? 'CAM'
                          : '?'
                  return (
                    <tr key={r[0]}>
                      <td>
                        <div className="name-cell">
                          <span className="nc-thumb">{thumb}</span>
                          <div>
                            <div style={{ fontSize: 13, color: '#fff' }}>{r[0]}</div>
                            <div className="mac" style={{ fontSize: 10 }}>
                              {r[1]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#A4A7B5' }}>{r[1]}</td>
                      <td className="mac">{r[2]}</td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                          color: '#A4A7B5',
                        }}
                      >
                        {r[3]}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                          color: '#A4A7B5',
                        }}
                      >
                        {r[4]}
                      </td>
                      <td>
                        <StatusIndicator color={r[5]} text={r[6]} textColor={r[7]} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card span={12}>
          <h3>
            Network Throughput <span className="unit">Last 24 h</span>
          </h3>
          <LineChart
            ariaLabel="Network throughput over the last 24 hours: download and upload in Mbps"
            labels={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']}
            series={[
              { label: 'Download', color: '#006FFF', values: [220, 310, 280, 450, 840, 520, 380] },
              { label: 'Upload', color: '#00C8C8', values: [80, 120, 95, 180, 312, 210, 145] },
            ]}
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
            {[
              ['Download', '#006FFF'],
              ['Upload', '#00C8C8'],
            ].map(([name, color]) => (
              <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 16,
                    height: 2,
                    background: color,
                    borderRadius: 1,
                    display: 'inline-block',
                  }}
                  aria-hidden="true"
                />
                <span style={{ color: '#A4A7B5' }}>{name}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card span={8}>
          <h3>
            Traffic by Device Type <span className="unit">Last 24 h · Mbps</span>
          </h3>
          <BarChart
            ariaLabel="Traffic by device type over the last 24 hours: download and upload in Mbps per device category"
            labels={['Gateway', 'Switch', 'AP', 'Camera']}
            series={[
              { label: 'Download', color: '#006FFF', values: [312, 148, 524, 42] },
              { label: 'Upload', color: '#00C8C8', values: [118, 56, 198, 14] },
            ]}
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
            {[
              ['Download', '#006FFF'],
              ['Upload', '#00C8C8'],
            ].map(([name, color]) => (
              <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: color as string,
                    borderRadius: 2,
                    display: 'inline-block',
                  }}
                  aria-hidden="true"
                />
                <span style={{ color: '#A4A7B5' }}>{name}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card span={4}>
          <h3>
            Client Delta <span className="unit">Mon – Sun</span>
          </h3>
          <WaterfallChart
            ariaLabel="Client count waterfall: starting at 118, daily changes Mon through Sat, ending at 142 total"
            bars={[
              { label: 'Mon', value: 118, type: 'start' },
              { label: 'Tue', value: 14 },
              { label: 'Wed', value: -8 },
              { label: 'Thu', value: 22 },
              { label: 'Fri', value: -6 },
              { label: 'Sat', value: 2 },
              { label: 'Total', value: 142, type: 'total' },
            ]}
          />
        </Card>

        <Card span={8}>
          <h3>
            Traffic Flow <span className="unit">Last 24 h · Mbps</span>
          </h3>
          <SankeyDiagram
            nodes={TRAFFIC_NODES}
            links={TRAFFIC_LINKS}
            height={180}
            ariaLabel="Network traffic flow: WiFi, Wired, and VPN sources flowing to Internet, Internal, and IoT destinations in Mbps"
          />
        </Card>

        <Card span={4}>
          <h3>
            Device Status <span className="unit">12 managed</span>
          </h3>
          <WaffleChart
            ariaLabel="Device status breakdown: 10 connected, 1 updating, 1 offline out of 12 managed devices"
            segments={[
              { label: 'Connected', value: 10, color: '#00B070' },
              { label: 'Updating', value: 1, color: '#F5A623' },
              { label: 'Offline', value: 1, color: '#F03A3A' },
            ]}
          />
        </Card>

        <Card span={8}>
          <h3>
            Traffic Composition <span className="unit">Last 24 h · Mbps</span>
          </h3>
          <StreamGraph
            ariaLabel="Traffic composition over the last 24 hours: streaming, gaming, browsing, social, and IoT in Mbps"
            labels={STREAM_LABELS}
            series={STREAM_SERIES}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, flexWrap: 'wrap' }}>
            {STREAM_SERIES.map((s) => (
              <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: s.color,
                    borderRadius: 2,
                    display: 'inline-block',
                  }}
                  aria-hidden="true"
                />
                <span style={{ color: '#A4A7B5' }}>{s.label}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card span={4}>
          <h3>
            Client Activity <span className="unit">by hour · avg clients</span>
          </h3>
          <NightingaleChart
            ariaLabel="Client activity by hour of day: peaks between 17:00 and 20:00 with up to 82 active clients"
            segments={HOURLY_CLIENTS}
          />
        </Card>

        <Card span={8}>
          <h3>
            Throughput vs Clients <span className="unit">Last 24 h · Mbps / count</span>
          </h3>
          <DualAxisChart
            ariaLabel="Throughput in Mbps (bars, left axis) and active client count (line, right axis) over the last 24 hours"
            labels={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']}
            bars={{
              label: 'Throughput (Mbps)',
              color: '#006FFF',
              values: [280, 150, 380, 620, 840, 720, 420],
            }}
            line={{ label: 'Clients', color: '#F5A623', values: [28, 8, 55, 78, 95, 82, 45] }}
          />
        </Card>

        <Card span={8}>
          <h3>
            Top Clients by Usage <span className="unit">Last 24 h · MB</span>
          </h3>
          <RankedList
            items={TOP_CLIENTS}
            unit="MB"
            ariaLabel="Top clients by data usage in the last 24 hours"
          />
        </Card>

        <Card span={4}>
          <h3>
            Top APs by Traffic <span className="unit">Last 24 h · Mbps</span>
          </h3>
          <RankedList
            items={TOP_APS}
            unit="Mbps"
            ariaLabel="Top access points by traffic in the last 24 hours"
          />
        </Card>

        <Card span={4}>
          <h3>
            Alarm Manager <Pill variant="warn">3 active</Pill>
          </h3>
          {DASHBOARD_ALARMS.map(([sev, t, d, w]) => (
            <div
              key={t}
              style={{
                padding: 10,
                background: '#0A0A0B',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 6,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pill variant={sev as PillVariant} className="pill-small">
                    {sev === 'danger' ? 'Critical' : 'Warning'}
                  </Pill>
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{t}</span>
                </div>
                <span style={{ fontSize: 11, color: '#6E7079' }}>{w}</span>
              </div>
              <div style={{ fontSize: 11, color: '#A4A7B5', marginTop: 4 }}>{d}</div>
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}
