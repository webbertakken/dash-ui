import { Card, Button, Pill, DownloadIcon } from '@dash-ui/react';

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <Card span={3}>
      <h3>{label}</h3>
      <div className="stat" style={{ color: color ?? '#fff' }}>
        {value}
        <span className="unit">{sub ?? ''}</span>
      </div>
    </Card>
  );
}

function UsageBar({ label, pct, color }: { label: string; pct: number; color?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: '#C8C9D0' }}>{label}</span>
        <span style={{ color: '#A4A7B5', fontFamily: '"JetBrains Mono", monospace' }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: color ?? '#006FFF', width: `${pct}%` }} />
      </div>
    </div>
  );
}

const SWITCHES: [string, string, string, string][] = [
  ['Core · Rack 1', 'Pro Max 24 PoE', '248 / 400 W', '24 / 24'],
  ['Floor 1', 'ES-24-Pro-PoE', '64 / 400 W', '22 / 24'],
  ['Warehouse', 'ES-Flex-Mini-2.5G', '—', '5 / 5'],
  ['Edge · Patio', 'ES-8-Lite-PoE', '12 / 60 W', '4 / 8'],
];

const ADOPTION: [string, string, string, string, string, string][] = [
  ['New AP Pro', 'AP-Pro', '78:45:58:1A:0C:22', '192.168.1.187', '7.2.114', 'Adopt'],
  ['New Flex Mini', 'ES-Flex-Mini', 'F4:E2:C7:09:18:A1', '192.168.1.188', '5.4.32', 'Adopt'],
  ['Camera Cam-Bullet 5', 'CAM-Bullet5', 'D0:21:F9:33:71:0A', '192.168.40.91', '4.79.101', 'Upgrade · 4.81'],
  ['Cam-Pro 4', 'CAM-Pro4', '78:8A:20:1F:33:18', '192.168.40.71', '4.78.92', 'Up to date'],
];

export function Infrastructure() {
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
        <Stat label="Devices" value="38" sub="online · 2 offline" />
        <Stat label="Clients" value="142" sub="42 wired · 100 wireless" />
        <Stat label="PoE budget" value="312 W" sub="of 600 W" />
        <Stat label="Storage" value="41%" sub="1.64 / 4.0 TB" />

        <Card span={6}>
          <h3>Console health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <UsageBar label="CPU · 8 / 16 cores" pct={41} />
            <UsageBar label="Memory · 6.2 / 16 GB" pct={38} />
            <UsageBar label="NPU offload" pct={72} />
            <UsageBar label="IDS/IPS engine" pct={54} color="#F5A623" />
            <UsageBar label="Storage · HDD" pct={41} />
            <UsageBar label="Temperature · 48 °C" pct={38} color="#7FB6FF" />
          </div>
        </Card>

        <Card span={6}>
          <h3>PoE consumption by switch</h3>
          <table>
            <thead>
              <tr>
                <th>Switch</th>
                <th>Model</th>
                <th>Used / Budget</th>
                <th>Ports</th>
              </tr>
            </thead>
            <tbody>
              {SWITCHES.map((r) => (
                <tr key={r[0]}>
                  <td style={{ color: '#fff' }}>{r[0]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[1]}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{r[2]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card span={12}>
          <h3>
            Adoption queue <Pill variant="info">2 pending</Pill>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Model</th>
                <th>MAC</th>
                <th>IP</th>
                <th>Firmware</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ADOPTION.map((r) => (
                <tr key={r[0]}>
                  <td style={{ color: '#fff' }}>{r[0]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[1]}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#6E7079' }}>{r[2]}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{r[3]}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{r[4]}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button variant={r[5].startsWith('Adopt') ? 'primary' : 'ghost'} style={{ fontSize: 11, padding: '4px 10px', height: 'auto' }}>
                      {r[5]}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
