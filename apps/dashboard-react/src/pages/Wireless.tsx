import {
  Card,
  Pill,
  SegmentedControl,
  RangeSlider,
  HeatMap,
  BubbleChart,
  RadarChart,
  BoxPlot,
  DotPlot,
  Histogram,
  ViolinPlot,
  ParallelCoordinates,
  CandlestickChart,
  BeeswarmChart,
  HexbinChart,
  ContourPlot,
} from '@w5-ui/react'
import type {
  BubblePoint,
  RadarSeries,
  BoxSeries,
  DotPlotItem,
  HistogramBin,
  ViolinSeries,
  ParallelAxis,
  ParallelSeries,
  CandlestickBar,
  BeeswarmSeries,
  HexbinPoint,
  ContourPoint,
} from '@w5-ui/react'
import { useMemo, useState } from 'react'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const SPECTRUM_COLORS = ['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B']
const FREQ_LABELS = ['5180', '5260', '5500', '5680', '5805 MHz']

const APS: [string, string, number, number, number][] = [
  ['AP Pro · Reception', '149 · 80 MHz', 71, -94, 28],
  ['AP Pro · Open office', '36 · 80 MHz', 62, -96, 42],
  ['AP Pro · Meeting B', '44 · 40 MHz', 38, -97, 11],
  ['U6 Long-Range · Warehouse', '52 · 40 MHz', 81, -93, 19],
  ['U6 Mesh · Patio', '100 · 40 MHz', 12, -99, 4],
]

const SOURCES: [string, string, 'warn' | 'info' | 'danger'][] = [
  ['Microwave oven', '2.4 GHz · CH 6–11', 'warn'],
  ['Bluetooth', '2.4 GHz · hopping', 'info'],
  ['Adjacent AP (rogue-uplink-5)', '5 GHz · CH 149', 'warn'],
  ['Continuous wave', '5 GHz · CH 52', 'danger'],
]

const BAND_OPTIONS = [
  { value: '2.4', label: '2.4 GHz' },
  { value: '5', label: '5 GHz' },
  { value: '6', label: '6 GHz' },
]

const TIME_OPTIONS = [
  { value: '1h', label: 'Last 1 h' },
  { value: '6h', label: 'Last 6 h' },
  { value: '24h', label: 'Last 24 h' },
]

export function Wireless() {
  const [band, setBand] = useState('5')
  const [timeRange, setTimeRange] = useState('1h')
  const [noiseRange, setNoiseRange] = useState<[number, number]>([-110, -60])
  const filteredAPS = APS.filter(
    ([, , , noise]) => noise >= noiseRange[0] && noise <= noiseRange[1],
  )

  const apRadar: RadarSeries[] = [
    { label: 'Reception', color: '#006FFF', values: [0.83, 0.29, 0.67, 1.0, 0.7] },
    { label: 'Open office', color: '#00C875', values: [0.5, 0.38, 1.0, 1.0, 0.72] },
    { label: 'Meeting B', color: '#F5A623', values: [0.33, 0.62, 0.26, 0.5, 0.43] },
  ]

  const apBoxPlot: BoxSeries[] = [
    { label: 'Recep.', q0: -100, q1: -97, q2: -94, q3: -91, q4: -86, color: '#00C875' },
    { label: 'Open', q0: -103, q1: -99, q2: -96, q3: -93, q4: -89, color: '#F5A623' },
    { label: 'Meet.B', q0: -106, q1: -101, q2: -97, q3: -94, q4: -91, color: '#FF7B7B' },
    { label: 'Ware.', q0: -99, q1: -96, q2: -93, q3: -90, q4: -85, color: '#00C875' },
    { label: 'Patio', q0: -108, q1: -104, q2: -99, q3: -96, q4: -93, color: '#FF7B7B' },
  ]

  const apDotPlot: DotPlotItem[] = [
    { label: 'AP Pro · Reception', value: 28, compare: 22, color: '#006FFF' },
    { label: 'AP Pro · Open office', value: 42, compare: 35, color: '#00C7A8' },
    { label: 'AP Pro · Meeting B', value: 11, compare: 18, color: '#F5A623' },
    { label: 'U6 LR · Warehouse', value: 19, compare: 15, color: '#006FFF' },
    { label: 'U6 Mesh · Patio', value: 4, compare: 6, color: '#FF7B7B' },
  ]

  const apParallelAxes: ParallelAxis[] = [
    { label: 'Util.', unit: '%', min: 0, max: 100 },
    { label: 'SNR', unit: 'dB', min: 0, max: 30 },
    { label: 'Clients', min: 0, max: 50 },
    { label: 'Width', unit: 'MHz', min: 0, max: 80 },
    { label: 'Uptime', unit: '%', min: 0, max: 100 },
  ]

  const apParallelSeries: ParallelSeries[] = [
    { label: 'Reception', color: '#006FFF', values: [71, 22, 28, 80, 98] },
    { label: 'Open office', color: '#00C7A8', values: [62, 20, 42, 80, 99] },
    { label: 'Meeting B', color: '#F5A623', values: [38, 17, 11, 40, 94] },
    { label: 'Warehouse', color: '#7FB6FF', values: [81, 21, 19, 40, 99] },
    { label: 'Patio', color: '#FF7B7B', values: [12, 15, 4, 40, 87] },
  ]

  const apViolin: ViolinSeries[] = [
    {
      label: 'Recep.',
      color: '#00C875',
      values: [
        -95, -92, -94, -91, -96, -93, -90, -97, -94, -88, -92, -95, -91, -93, -87, -94, -96, -90,
        -93, -95,
      ],
    },
    {
      label: 'Open',
      color: '#F5A623',
      values: [
        -97, -95, -99, -96, -93, -100, -98, -94, -97, -95, -92, -96, -99, -97, -94, -98, -96, -93,
        -100, -97,
      ],
    },
    {
      label: 'Meet.B',
      color: '#FF7B7B',
      values: [
        -102, -99, -97, -101, -104, -98, -97, -103, -100, -96, -101, -99, -97, -103, -100, -97,
        -101, -98, -97, -102,
      ],
    },
    {
      label: 'Ware.',
      color: '#00C875',
      values: [
        -95, -92, -96, -91, -93, -90, -96, -93, -91, -94, -90, -95, -92, -93, -91, -94, -92, -90,
        -93, -95,
      ],
    },
    {
      label: 'Patio',
      color: '#FF7B7B',
      values: [
        -104, -101, -99, -103, -106, -100, -99, -104, -102, -98, -103, -101, -99, -104, -101, -99,
        -103, -100, -99, -103,
      ],
    },
  ]

  const rssiHistogram: HistogramBin[] = [
    { x0: -105, x1: -100, count: 3 },
    { x0: -100, x1: -95, count: 12 },
    { x0: -95, x1: -90, count: 28 },
    { x0: -90, x1: -85, count: 47 },
    { x0: -85, x1: -80, count: 63 },
    { x0: -80, x1: -75, count: 82 },
    { x0: -75, x1: -70, count: 71 },
    { x0: -70, x1: -65, count: 54 },
    { x0: -65, x1: -60, count: 38 },
    { x0: -60, x1: -55, count: 21 },
    { x0: -55, x1: -50, count: 9 },
  ]

  const snrCandles: CandlestickBar[] = [
    { label: '00:00', open: 18, close: 16, high: 22, low: 13 },
    { label: '03:00', open: 16, close: 21, high: 24, low: 15 },
    { label: '06:00', open: 21, close: 25, high: 27, low: 20 },
    { label: '09:00', open: 25, close: 22, high: 29, low: 21 },
    { label: '12:00', open: 22, close: 24, high: 28, low: 19 },
    { label: '15:00', open: 24, close: 26, high: 30, low: 23 },
    { label: '18:00', open: 26, close: 23, high: 28, low: 21 },
    { label: '21:00', open: 23, close: 19, high: 25, low: 17 },
  ]

  const rssiSwarm: BeeswarmSeries[] = [
    {
      label: 'Recep.',
      color: '#006FFF',
      points: [
        -92, -90, -94, -88, -91, -95, -89, -93, -87, -91, -96, -88, -92, -90, -94, -93, -89, -91,
        -87, -95,
      ],
    },
    {
      label: 'Open',
      color: '#00C875',
      points: [
        -98, -96, -100, -94, -97, -101, -95, -99, -93, -97, -102, -95, -98, -96, -100, -99, -95,
        -97, -93, -101,
      ],
    },
    {
      label: 'Meet.B',
      color: '#F5A623',
      points: [
        -104, -101, -99, -106, -103, -100, -105, -102, -98, -104, -107, -101, -104, -102, -100,
        -106, -103, -99, -105, -102,
      ],
    },
    {
      label: 'Ware.',
      color: '#A78BFA',
      points: [
        -91, -89, -93, -87, -90, -94, -88, -92, -86, -90, -95, -88, -91, -89, -93, -92, -88, -90,
        -86, -94,
      ],
    },
  ]

  const apScatter: BubblePoint[] = APS.map(([, , util, noise, clients]) => ({
    x: util,
    y: noise,
    size: clients,
    color: noise >= -95 ? '#00C875' : noise >= -97 ? '#F5A623' : '#FF7B7B',
    key: String(util) + String(noise),
  }))
  const hexbinPts: HexbinPoint[] = useMemo(() => {
    const r = rng(99)
    const pts: HexbinPoint[] = []
    for (let i = 0; i < 25; i++) pts.push({ x: -62 - r() * 13, y: 26 + r() * 12 - 2 })
    for (let i = 0; i < 28; i++) pts.push({ x: -76 - r() * 10, y: 17 + r() * 10 - 2 })
    for (let i = 0; i < 17; i++) pts.push({ x: -88 - r() * 12, y: 6 + r() * 9 - 1 })
    return pts
  }, [])

  const contourPts: ContourPoint[] = useMemo(() => {
    const r = rng(42)
    const pts: ContourPoint[] = []
    for (let i = 0; i < 30; i++) pts.push({ x: -60 - r() * 15, y: 28 + r() * 10 - 2 })
    for (let i = 0; i < 30; i++) pts.push({ x: -76 - r() * 12, y: 16 + r() * 10 - 2 })
    for (let i = 0; i < 20; i++) pts.push({ x: -90 - r() * 10, y: 5 + r() * 8 })
    return pts
  }, [])

  const heatData = useMemo(() => {
    const rows: number[][] = []
    const r = rng(7)
    for (let y = 0; y < 24; y++) {
      const row: number[] = []
      for (let x = 0; x < 48; x++) {
        row.push(
          Math.max(
            0,
            Math.min(
              1,
              0.4 +
                0.5 * Math.sin(x * 0.4 + y * 0.2) +
                0.3 * Math.sin(x * 0.15) +
                0.25 * (r() - 0.5),
            ),
          ),
        )
      }
      rows.push(row)
    }
    return rows
  }, [])

  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Wireless</div>
        <div className="ph-actions">
          <SegmentedControl
            label="Frequency band"
            options={BAND_OPTIONS}
            value={band}
            onChange={setBand}
          />
          <SegmentedControl
            label="Time range"
            options={TIME_OPTIONS}
            value={timeRange}
            onChange={setTimeRange}
          />
        </div>
      </div>
      <div className="grid">
        <Card span={8}>
          <h3>
            Spectrum · 5 GHz <Pill variant="info">Live</Pill>
          </h3>
          <div style={{ marginTop: 4 }}>
            <HeatMap
              data={heatData}
              colors={SPECTRUM_COLORS}
              height={240}
              xLabels={FREQ_LABELS}
              ariaLabel="RF spectrum 5 GHz (5180–5805 MHz)"
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
              fontSize: 11,
              color: '#A4A7B5',
            }}
          >
            <span>Quiet</span>
            <div
              style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', flex: 1 }}
            >
              {['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B'].map((c) => (
                <div key={c} style={{ flex: 1, background: c }} />
              ))}
            </div>
            <span>Saturated</span>
          </div>
        </Card>

        <Card span={4}>
          <h3>Channel utilization</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['36', '62%', '#006FFF'],
              ['44', '38%', '#006FFF'],
              ['52', '81%', '#F5A623'],
              ['60', '24%', '#006FFF'],
              ['100', '12%', '#006FFF'],
              ['149', '71%', '#F5A623'],
              ['157', '45%', '#006FFF'],
              ['165', '19%', '#006FFF'],
            ].map((c) => (
              <div key={c[0]}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: '#fff', fontFamily: '"JetBrains Mono", monospace' }}>
                    CH {c[0]}
                  </span>
                  <span style={{ color: '#A4A7B5', fontFamily: '"JetBrains Mono", monospace' }}>
                    {c[1]}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ height: '100%', background: c[2], width: c[1] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card span={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 12,
            }}
          >
            <h3 style={{ margin: 0 }}>Access points (5 GHz)</h3>
            <div style={{ width: 220 }}>
              <RangeSlider
                label="Noise floor filter"
                min={-110}
                max={-60}
                step={1}
                suffix=" dBm"
                onChange={setNoiseRange}
              />
            </div>
          </div>
          <table>
            <caption className="sr-only">Access points (5 GHz)</caption>
            <thead>
              <tr>
                <th scope="col">AP</th>
                <th scope="col">Channel · Width</th>
                <th scope="col">Utilization</th>
                <th scope="col">Noise floor</th>
                <th scope="col">Clients</th>
              </tr>
            </thead>
            <tbody>
              {filteredAPS.map(([name, ch, util, noise, clients]) => (
                <tr key={name}>
                  <td style={{ color: '#fff' }}>{name}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{ch}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 4,
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            background: util > 70 ? '#F5A623' : '#006FFF',
                            width: `${util}%`,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: 11,
                          color: '#A4A7B5',
                          width: 34,
                          textAlign: 'right',
                        }}
                      >
                        {util}%
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 12,
                      color: '#A4A7B5',
                    }}
                  >
                    {noise} dBm
                  </td>
                  <td>{clients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card span={6}>
          <h3>AP RF quality</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Utilization (x) vs noise floor (y) · bubble = client count
          </div>
          <BubbleChart
            points={apScatter}
            xRange={[0, 100]}
            yRange={[-102, -90]}
            rRange={[4, 18]}
            height={150}
            ariaLabel="AP RF quality: channel utilisation vs noise floor, bubble size = client count"
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: '#A4A7B5' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#00C875',
                  display: 'inline-block',
                }}
              />{' '}
              Good
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F5A623',
                  display: 'inline-block',
                }}
              />{' '}
              Fair
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#FF7B7B',
                  display: 'inline-block',
                }}
              />{' '}
              Poor
            </span>
          </div>
        </Card>

        <Card span={6}>
          <h3>AP performance comparison</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 4 }}>
            Signal · Capacity · Clients · Width · Score
          </div>
          <RadarChart
            series={apRadar}
            axes={['Signal', 'Capacity', 'Clients', 'Width', 'Score']}
            height={180}
            ariaLabel="AP performance comparison radar chart"
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: '#A4A7B5' }}>
            {apRadar.map((s) => (
              <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: s.color,
                    display: 'inline-block',
                  }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </Card>

        <Card span={6}>
          <h3>Signal strength distribution</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            RSSI range per AP (dBm) · box = IQR · line = median
          </div>
          <BoxPlot
            series={apBoxPlot}
            yRange={[-112, -82]}
            height={150}
            ariaLabel="Signal strength distribution per AP"
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: '#A4A7B5' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#00C875',
                  display: 'inline-block',
                }}
              />{' '}
              &gt;−95 dBm
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F5A623',
                  display: 'inline-block',
                }}
              />{' '}
              −95–−98
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#FF7B7B',
                  display: 'inline-block',
                }}
              />{' '}
              &lt;−98 dBm
            </span>
          </div>
        </Card>

        <Card span={6}>
          <h3>Client count per AP</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Current week vs previous week
          </div>
          <DotPlot
            items={apDotPlot}
            min={0}
            max={50}
            valueLegend="This week"
            compareLegend="Last week"
            ariaLabel="AP client count comparison: current week vs previous week"
          />
        </Card>

        <Card span={6}>
          <h3>Client RSSI distribution</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Sample count per signal-strength bin (dBm) · all APs
          </div>
          <Histogram
            bins={rssiHistogram}
            height={160}
            color="#006FFF"
            xUnit=" dBm"
            ariaLabel="Client RSSI distribution histogram: sample count per signal-strength bin across all APs"
          />
        </Card>

        <Card span={6}>
          <h3>RSSI density per AP</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Distribution shape (dBm) · line = median
          </div>
          <ViolinPlot
            series={apViolin}
            yRange={[-110, -84]}
            height={160}
            ariaLabel="RSSI density distribution per access point; violin width shows signal concentration, white line shows median"
          />
        </Card>

        <Card span={6}>
          <h3>AP multi-metric comparison</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Parallel coordinates: utilisation · SNR · clients · width · uptime
          </div>
          <ParallelCoordinates
            axes={apParallelAxes}
            series={apParallelSeries}
            height={180}
            ariaLabel="AP multi-metric parallel coordinates: utilisation, SNR, client count, channel width, and uptime per access point"
          />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 8,
              fontSize: 11,
              color: '#A4A7B5',
            }}
          >
            {apParallelSeries.map((s) => (
              <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{ width: 20, height: 2, background: s.color, display: 'inline-block' }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </Card>

        <Card span={6}>
          <h3>SNR trend (24 h)</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Signal-to-noise ratio per 3 h interval (dB) · open/close = period start/end
          </div>
          <CandlestickChart
            bars={snrCandles}
            yRange={[10, 33]}
            height={160}
            unit=" dB"
            ariaLabel="SNR trend over 24 hours: each candle shows open, close, high and low signal-to-noise ratio per 3-hour interval"
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: '#A4A7B5' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{ width: 10, height: 10, background: '#00C875', display: 'inline-block' }}
              />{' '}
              Improved
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{ width: 10, height: 10, background: '#FF7B7B', display: 'inline-block' }}
              />{' '}
              Degraded
            </span>
          </div>
        </Card>

        <Card span={6}>
          <h3>Client RSSI distribution per AP</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Each dot = one client sample · dBm · last hour
          </div>
          <BeeswarmChart
            series={rssiSwarm}
            yRange={[-110, -80]}
            height={180}
            unit=" dBm"
            dotRadius={4}
            ariaLabel="Client RSSI distribution per access point: each dot represents one client signal sample in dBm"
          />
        </Card>

        <Card span={6}>
          <h3>Client RSSI vs SNR density</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            2D hexbin · x = RSSI (dBm) · y = SNR (dB) · brightness = sample density
          </div>
          <HexbinChart
            points={hexbinPts}
            xRange={[-105, -50]}
            yRange={[0, 42]}
            height={160}
            hexRadius={10}
            ariaLabel="Client RSSI vs SNR 2D density hexbin: bright hexagons indicate high concentration of client samples; three clusters correspond to good, fair, and poor signal-quality zones"
          />
        </Card>

        <Card span={6}>
          <h3>RSSI vs SNR density contours</h3>
          <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 8 }}>
            Iso-density contours · x = RSSI (dBm) · y = SNR (dB) · dots = samples
          </div>
          <ContourPlot
            points={contourPts}
            xRange={[-105, -50]}
            yRange={[0, 42]}
            height={160}
            bandwidth={3.5}
            ariaLabel="RSSI vs SNR density contour map: iso-contour lines show regions of equal client sample density; inner contours indicate high-density clusters in good, fair and poor signal zones"
          />
        </Card>

        <Card span={6}>
          <h3>
            Interference sources{' '}
            <span style={{ color: '#6E7079', fontWeight: 400 }}>classified by analytics</span>
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginTop: 4,
            }}
          >
            {SOURCES.map(([name, freq, sev]) => (
              <div
                key={name}
                style={{
                  background: '#141415',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                    color: sev === 'danger' ? '#FF7B7B' : sev === 'warn' ? '#F5C26B' : '#7FB6FF',
                  }}
                >
                  <span
                    style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}
                  />
                  {sev === 'danger' ? 'High' : sev === 'warn' ? 'Medium' : 'Low'}
                </div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                  {name}
                </div>
                <div
                  style={{
                    color: '#6E7079',
                    fontSize: 11,
                    marginTop: 2,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {freq}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
