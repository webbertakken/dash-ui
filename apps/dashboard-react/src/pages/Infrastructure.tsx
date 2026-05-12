import {
  Card,
  Button,
  Pill,
  DownloadIcon,
  ProgressBar,
  Stat,
  BulletChart,
  GanttChart,
  SparklineMatrix,
  ThresholdAreaChart,
  QuadrantChart,
  CorrelationMatrix,
  FlameGraph,
  ResizablePanel,
  CountUp,
  ToggleGroup,
  StackedProgress,
} from '@w5-ui/react'
import type {
  GanttTask,
  SparklineMatrixRow,
  QuadrantPoint,
  FlameNode,
  ToggleGroupOption,
  StackedProgressSegment,
} from '@w5-ui/react'
import { useState } from 'react'

const SYSTEM_METRICS = [
  { label: 'CPU', value: 41, target: 70, ranges: [50, 75] as [number, number], color: '#006FFF' },
  {
    label: 'Memory',
    value: 38,
    target: 60,
    ranges: [50, 70] as [number, number],
    color: '#7FB6FF',
  },
  { label: 'NPU', value: 72, target: 80, ranges: [60, 80] as [number, number], color: '#4797FF' },
  {
    label: 'Temperature',
    value: 45,
    target: 65,
    ranges: [60, 75] as [number, number],
    color: '#F5A623',
  },
]

const SWITCHES: [string, string, string, string][] = [
  ['Core · Rack 1', 'Pro Max 24 PoE', '248 / 400 W', '24 / 24'],
  ['Floor 1', 'ES-24-Pro-PoE', '64 / 400 W', '22 / 24'],
  ['Warehouse', 'ES-Flex-Mini-2.5G', '—', '5 / 5'],
  ['Edge · Patio', 'ES-8-Lite-PoE', '12 / 60 W', '4 / 8'],
]

const MEM_SEGMENTS: StackedProgressSegment[] = [
  { label: 'Used', value: 6.2, color: '#006FFF' },
  { label: 'Cached', value: 2.1, color: '#4797FF' },
  { label: 'Free', value: 7.7, color: 'rgba(255,255,255,0.10)' },
]

const STORAGE_SEGMENTS: StackedProgressSegment[] = [
  { label: 'System', value: 0.82, color: '#006FFF' },
  { label: 'Recordings', value: 0.54, color: '#7FB6FF' },
  { label: 'Backups', value: 0.28, color: '#4797FF' },
  { label: 'Free', value: 2.36, color: 'rgba(255,255,255,0.10)' },
]

const MAINTENANCE: GanttTask[] = [
  { label: 'Edge Gateway', start: 0.08, end: 0.25, color: '#006FFF' },
  { label: 'Core SW', start: 0.3, end: 0.42, color: '#7FB6FF' },
  { label: 'Floor SW', start: 0.5, end: 0.58, color: '#4797FF' },
  { label: 'AP AP Pro', start: 0.62, end: 0.7, color: '#00C875' },
  { label: 'Camera G5', start: 0.75, end: 0.88, color: '#F5A623' },
]

const MAINTENANCE_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const ALL_IFACE_THROUGHPUT: SparklineMatrixRow[] = [
  {
    label: 'eth0 · WAN',
    unit: ' Mb/s',
    color: '#006FFF',
    values: [120, 132, 145, 138, 152, 160, 155, 148, 162, 170, 165, 158, 172, 180, 175],
  },
  {
    label: 'eth1 · LAN',
    unit: ' Mb/s',
    color: '#00C875',
    values: [45, 52, 48, 55, 60, 58, 54, 62, 67, 64, 59, 66, 70, 68, 63],
  },
  {
    label: 'eth2 · IoT',
    unit: ' Mb/s',
    color: '#7FB6FF',
    values: [8, 10, 9, 12, 11, 10, 13, 11, 9, 12, 10, 11, 14, 12, 10],
  },
  {
    label: 'wlan0 · 5G',
    unit: ' Mb/s',
    color: '#F5A623',
    values: [95, 102, 98, 110, 105, 112, 108, 115, 110, 105, 112, 118, 114, 120, 116],
  },
  {
    label: 'wlan1 · 2.4',
    unit: ' Mb/s',
    color: '#A78BFA',
    values: [42, 45, 50, 48, 52, 55, 53, 58, 56, 60, 58, 63, 61, 65, 62],
  },
]

const IFACE_OPTIONS: ToggleGroupOption[] = ALL_IFACE_THROUGHPUT.map((r) => ({
  value: r.label,
  label: r.label,
}))

const CPU_LOAD = [38, 35, 45, 61, 85, 82, 68, 78, 86, 76, 61, 47]
const CPU_LABELS = [
  '00:00',
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
]

const METRIC_LABELS = ['CPU', 'Mem', 'NPU', 'Temp']
const METRIC_CORR = [
  [1.0, 0.72, 0.65, 0.88],
  [0.72, 1.0, 0.31, 0.59],
  [0.65, 0.31, 1.0, 0.44],
  [0.88, 0.59, 0.44, 1.0],
]

const CPU_FLAME: FlameNode = {
  label: 'CPU (total)',
  children: [
    {
      label: 'Network',
      value: 35,
      children: [
        { label: 'Routing', value: 15 },
        { label: 'Firewall', value: 10 },
        { label: 'NAT', value: 10 },
      ],
    },
    {
      label: 'System',
      value: 25,
      children: [
        { label: 'DHCP', value: 8 },
        { label: 'DNS', value: 9 },
        { label: 'NTP', value: 8 },
      ],
    },
    {
      label: 'Security',
      value: 25,
      children: [
        { label: 'IDS', value: 12 },
        { label: 'VPN', value: 8 },
        { label: 'Portal', value: 5 },
      ],
    },
    { label: 'Other', value: 15 },
  ],
}

const DEVICE_LOAD: QuadrantPoint[] = [
  { x: 41, y: 38, label: 'Edge Gateway', color: '#006FFF' },
  { x: 72, y: 55, label: 'Core SW', color: '#F5A623' },
  { x: 18, y: 22, label: 'Floor SW', color: '#00C875' },
  { x: 9, y: 14, label: 'Warehouse', color: '#00C875' },
  { x: 85, y: 78, label: 'AP-Wide', color: '#FF7B7B' },
  { x: 33, y: 61, label: 'Camera NVR', color: '#A78BFA' },
]

const ADOPTION: [string, string, string, string, string, string][] = [
  ['New AP Pro', 'AP-Pro', '78:45:58:1A:0C:22', '192.168.1.187', '7.2.114', 'Adopt'],
  ['New Flex Mini', 'ES-Flex-Mini', 'F4:E2:C7:09:18:A1', '192.168.1.188', '5.4.32', 'Adopt'],
  [
    'Camera Cam-Bullet 5',
    'CAM-Bullet5',
    'D0:21:F9:33:71:0A',
    '192.168.40.91',
    '4.79.101',
    'Upgrade · 4.81',
  ],
  ['Cam-Pro 4', 'CAM-Pro4', '78:8A:20:1F:33:18', '192.168.40.71', '4.78.92', 'Up to date'],
]

export function Infrastructure() {
  const [adopting, setAdopting] = useState<string | null>(null)
  const [visibleIfaces, setVisibleIfaces] = useState<string[]>(
    ALL_IFACE_THROUGHPUT.map((r) => r.label),
  )

  function handleAdopt(name: string) {
    setAdopting(name)
    setTimeout(() => setAdopting(null), 2000)
  }

  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Infrastructure</div>
        <div className="ph-actions">
          <Button>All sites</Button>
          <Button>Last 24 h</Button>
          <Button iconOnly title="Export">
            <DownloadIcon />
          </Button>
        </div>
      </div>
      <div className="grid">
        <Stat label="Devices" value={<CountUp to={38} />} unit="online · 2 offline" span={3} />
        <Stat
          label="Clients"
          value={<CountUp to={142} />}
          unit="42 wired · 100 wireless"
          span={3}
        />
        <Stat
          label="PoE budget"
          value={<CountUp to={312} suffix=" W" />}
          unit="of 600 W"
          span={3}
        />
        <Stat
          label="Storage"
          value={<CountUp to={41} suffix="%" />}
          unit="1.64 / 4.0 TB"
          span={3}
        />

        <Card span={6}>
          <h3>Console health</h3>
          <BulletChart
            items={SYSTEM_METRICS}
            ariaLabel="Console health: CPU 41%, target 70%; Memory 38%, target 60%; NPU 72%, target 80%; Temperature 45%, target 65%"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <ProgressBar label="IDS/IPS engine" value={54} color="#F5A623" />
            <ProgressBar label="Storage · HDD" value={41} />
          </div>
        </Card>

        <Card span={6}>
          <h3>PoE consumption by switch</h3>
          <table>
            <caption className="sr-only">PoE consumption by switch</caption>
            <thead>
              <tr>
                <th scope="col">Switch</th>
                <th scope="col">Model</th>
                <th scope="col">Used / Budget</th>
                <th scope="col">Ports</th>
              </tr>
            </thead>
            <tbody>
              {SWITCHES.map((r) => (
                <tr key={r[0]}>
                  <td style={{ color: '#fff' }}>{r[0]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[1]}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>
                    {r[2]}
                  </td>
                  <td style={{ color: '#A4A7B5' }}>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card span={6}>
          <h3>
            Memory breakdown <span className="unit">16 GB total</span>
          </h3>
          <div style={{ marginBottom: 12, color: '#6E7079', fontSize: 11 }}>
            Used 6.2 GB · Cached 2.1 GB · Free 7.7 GB
          </div>
          <StackedProgress
            segments={MEM_SEGMENTS}
            total={16}
            ariaLabel="Memory breakdown: used 6.2 GB 39%, cached 2.1 GB 13%, free 7.7 GB 48% of 16 GB total"
          />
        </Card>

        <Card span={6}>
          <h3>
            Storage breakdown <span className="unit">4.0 TB total</span>
          </h3>
          <div style={{ marginBottom: 12, color: '#6E7079', fontSize: 11 }}>
            System 0.82 TB · Recordings 0.54 TB · Backups 0.28 TB · Free 2.36 TB
          </div>
          <StackedProgress
            segments={STORAGE_SEGMENTS}
            total={4.0}
            ariaLabel="Storage breakdown: system 0.82 TB 21%, recordings 0.54 TB 14%, backups 0.28 TB 7%, free 2.36 TB 59% of 4.0 TB total"
          />
        </Card>

        <Card span={12}>
          <h3>
            Maintenance schedule <span className="unit">This week</span>
          </h3>
          <GanttChart
            tasks={MAINTENANCE}
            xLabels={MAINTENANCE_LABELS}
            ariaLabel="Maintenance schedule this week: Edge Gateway Mon–Tue, Core Switch Wed, Floor Switch Thu, AP AP Pro Thu–Fri, Camera G5 Fri–Sat"
          />
        </Card>

        <Card span={12}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <h3 style={{ margin: 0 }}>
              Interface throughput <span className="unit">Last 24 h</span>
            </h3>
            <ToggleGroup
              options={IFACE_OPTIONS}
              value={visibleIfaces}
              onChange={setVisibleIfaces}
              ariaLabel="Toggle interface visibility"
              size="sm"
            />
          </div>
          <SparklineMatrix
            rows={ALL_IFACE_THROUGHPUT.filter((r) => visibleIfaces.includes(r.label))}
            height={150}
            ariaLabel="Interface throughput over the last 24 hours for WAN, LAN, IoT, 5GHz and 2.4GHz interfaces"
          />
        </Card>

        <Card span={12}>
          <h3>
            CPU load <span className="unit">Last 24 h · threshold 80%</span>
          </h3>
          <ThresholdAreaChart
            values={CPU_LOAD}
            labels={CPU_LABELS}
            threshold={80}
            thresholdLabel="80% — warning"
            height={140}
            ariaLabel="CPU load over last 24 hours with 80% warning threshold; exceeded at 08:00 (85%), 10:00 (82%) and 16:00 (86%)"
          />
        </Card>

        <Card span={12}>
          <h3>
            CPU process breakdown <span className="unit">Current snapshot</span>
          </h3>
          <FlameGraph
            root={CPU_FLAME}
            height={160}
            ariaLabel="CPU process breakdown flame graph: Network 35% (Routing 15%, Firewall 10%, NAT 10%), System 25% (DHCP 8%, DNS 9%, NTP 8%), Security 25% (IDS 12%, VPN 8%, Portal 5%), Other 15%"
          />
        </Card>

        <Card span={12}>
          <ResizablePanel
            defaultSize={50}
            min={25}
            max={75}
            orientation="vertical"
            label="Resize device load and metric correlations panels"
            style={{ height: 280 }}
          >
            <div style={{ padding: '0 12px 0 0', height: '100%', overflow: 'auto' }}>
              <h3>
                Device load quadrant <span className="unit">CPU % vs Memory %</span>
              </h3>
              <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
                x = CPU · y = Memory · threshold 60%
              </div>
              <QuadrantChart
                points={DEVICE_LOAD}
                xThreshold={60}
                yThreshold={60}
                xRange={[0, 100]}
                yRange={[0, 100]}
                quadrantLabels={['Mem-bound', 'Critical', 'Healthy', 'CPU-bound']}
                xLabel="CPU %"
                yLabel="Mem %"
                height={200}
                ariaLabel="Device load quadrant: CPU percent vs Memory percent with 60% thresholds. Edge Gateway 41/38 healthy; Core SW 72/55 CPU-bound; AP-Wide 85/78 critical"
              />
            </div>
            <div style={{ padding: '0 0 0 12px', height: '100%', overflow: 'auto' }}>
              <h3>
                Metric correlations <span className="unit">CPU · Mem · NPU · Temp</span>
              </h3>
              <CorrelationMatrix
                labels={METRIC_LABELS}
                data={METRIC_CORR}
                ariaLabel="Correlation matrix for CPU, Memory, NPU and Temperature metrics. CPU-Temperature 0.88 strongest; Memory-NPU 0.31 weakest."
              />
            </div>
          </ResizablePanel>
        </Card>

        <Card span={12}>
          <h3>
            Adoption queue <Pill variant="info">2 pending</Pill>
          </h3>
          <table>
            <caption className="sr-only">Adoption queue</caption>
            <thead>
              <tr>
                <th scope="col">Device</th>
                <th scope="col">Model</th>
                <th scope="col">MAC</th>
                <th scope="col">IP</th>
                <th scope="col">Firmware</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {ADOPTION.map((r) => (
                <tr key={r[0]}>
                  <td style={{ color: '#fff' }}>{r[0]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[1]}</td>
                  <td
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 12,
                      color: '#6E7079',
                    }}
                  >
                    {r[2]}
                  </td>
                  <td
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 12,
                      color: '#A4A7B5',
                    }}
                  >
                    {r[3]}
                  </td>
                  <td
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 12,
                      color: '#A4A7B5',
                    }}
                  >
                    {r[4]}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant={r[5].startsWith('Adopt') ? 'primary' : 'ghost'}
                      style={{ fontSize: 11, padding: '4px 10px', height: 'auto' }}
                      loading={adopting === r[0]}
                      onClick={r[5].startsWith('Adopt') ? () => handleAdopt(r[0]) : undefined}
                    >
                      {adopting === r[0] ? 'Adopting…' : r[5]}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  )
}
