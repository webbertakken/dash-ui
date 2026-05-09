import { useState } from 'react';
import { Card, Button, Pill, Tabs, PlusIcon } from '@dash-ui/react';

const SERVERS: [string, string, string, string, string, string, string, string][] = [
  ['Office WireGuard', 'WireGuard', '203.0.113.42:51820', '10.10.0.0/24', '12', '#00B070', 'Active', '#5DDB9F'],
  ['Legacy IPsec', 'IPsec / IKEv2', '203.0.113.42:500', '10.20.0.0/24', '3', '#00B070', 'Active', '#5DDB9F'],
  ['L2TP Mobile', 'L2TP / IPsec', '203.0.113.42:1701', '10.30.0.0/24', '0', '#6E7079', 'Disabled', '#A4A7B5'],
];

const TELEPORT: [string, string, string, string][] = [
  ['Maria · MacBook Pro', '100.64.0.42', '5 ms', 'Active'],
  ['Tobias · iPhone 15', '100.64.0.61', '22 ms', 'Active'],
  ['Arjun · Pixel 8', '100.64.0.74', '38 ms', 'Active'],
];

export function Vpn() {
  const [tab, setTab] = useState('s2s');
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">VPN</div>
        <div className="ph-actions">
          <Button>Logs</Button>
          <Button variant="primary">
            <PlusIcon /> New Server
          </Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 's2s', label: 'Site-to-Site', badge: 2 },
          { id: 'tp', label: 'Teleport', badge: 8 },
          { id: 'cli', label: 'VPN Clients', badge: 12 },
          { id: 'srv', label: 'VPN Servers', badge: 3 },
        ]}
      />
      <div className="grid">
        <Card span={6}>
          <h3>
            Site-to-Site · WireGuard <Pill variant="success">Connected</Pill>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="dr-thumb" style={{ margin: '0 auto 6px', background: 'linear-gradient(180deg,#1C1C1E,#0A0A0B)' }}>
                EG
              </div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>Edge Gateway (Front Office)</div>
              <div style={{ fontSize: 11, color: '#6E7079', fontFamily: '"JetBrains Mono", monospace' }}>203.0.113.42</div>
            </div>
            <div style={{ flex: '0 0 auto', color: '#00B070' }}>
              <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
                <path d="M2 10h76M70 4l8 6-8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="dr-thumb" style={{ margin: '0 auto 6px', background: 'linear-gradient(180deg,#1C1C1E,#0A0A0B)' }}>
                EG
              </div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>EG SE (Warehouse)</div>
              <div style={{ fontSize: 11, color: '#6E7079', fontFamily: '"JetBrains Mono", monospace' }}>198.51.100.18</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
            <span style={{ color: '#6E7079' }}>Throughput</span>
            <span style={{ color: '#fff', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>↓ 84 / ↑ 12 Mbps</span>
            <span style={{ color: '#6E7079' }}>Latency</span>
            <span style={{ color: '#fff', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>14 ms</span>
            <span style={{ color: '#6E7079' }}>Cipher</span>
            <span style={{ color: '#fff', textAlign: 'right' }}>ChaCha20-Poly1305</span>
            <span style={{ color: '#6E7079' }}>Uptime</span>
            <span style={{ color: '#fff', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>12d 04h</span>
          </div>
        </Card>

        <Card span={6}>
          <h3>
            Teleport · Dash Identity <Pill variant="info">8 sessions</Pill>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TELEPORT.map((t) => (
              <div
                key={t[0]}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                }}
              >
                <span className="status-ring" style={{ width: 8, height: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#fff' }}>{t[0]}</div>
                  <div style={{ fontSize: 11, color: '#6E7079', fontFamily: '"JetBrains Mono", monospace' }}>{t[1]}</div>
                </div>
                <div style={{ fontSize: 11, color: '#A4A7B5', fontVariantNumeric: 'tabular-nums' }}>{t[2]}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card span={12} style={{ padding: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ margin: 0, color: '#fff' }}>VPN Servers</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Endpoint</th>
                <th>Network</th>
                <th style={{ textAlign: 'right' }}>Clients</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SERVERS.map((s) => (
                <tr key={s[0]}>
                  <td style={{ color: '#fff' }}>{s[0]}</td>
                  <td>
                    <Pill variant="info">{s[1]}</Pill>
                  </td>
                  <td className="mac">{s[2]}</td>
                  <td className="mac" style={{ color: '#A4A7B5' }}>
                    {s[3]}
                  </td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{s[4]}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: s[7], fontSize: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s[5] }} />
                      {s[6]}
                    </span>
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
