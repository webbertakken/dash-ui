import { useState } from 'react';
import { Card, Button, Pill, Tabs } from '@dash-ui/react';
import { PORT_STATES } from '../data.js';

const PORTS = [
  [1, 'Uplink → ISP', 'VLAN 1 · Default', 'Trunk all', 'Off', '1 Gbps', '842 / 310 Mbps', '#00B070', 'Connected', '#5DDB9F'],
  [4, 'AP · Lobby', 'VLAN 30 · IoT', 'PoE+ 802.3at', '30 W', '1 Gbps', '42 / 18 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
  [5, 'AP · Reception', 'VLAN 30 · IoT', 'PoE+ 802.3at', '24 W', '1 Gbps', '38 / 12 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
  [10, '—', '—', 'Disabled', 'Off', '—', '—', '#6E7079', 'Disabled', '#A4A7B5'],
  [13, 'Camera · Reception', 'VLAN 1', 'PoE++ 802.3bt', '19 W', '1 Gbps', '12 / 84 Mbps', '#F5A623', 'PoE Active', '#F5C26B'],
  [21, 'NAS uplink', 'VLAN 1', 'Trunk all', 'Off', '2.5 Gbps', '118 / 46 MB/s', '#00B070', 'Connected', '#5DDB9F'],
] as const;

export function Ports() {
  const [tab, setTab] = useState('main');
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Ports</div>
        <div className="ph-actions">
          <Button>Reset</Button>
          <Button>Cycle PoE</Button>
          <Button variant="primary">Apply</Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'main', label: 'ES-24-Pro-PoE', badge: 26 },
          { id: 'lite', label: 'ES-8-Lite-PoE', badge: 10 },
          { id: 'udm', label: 'Edge Gateway X1', badge: 10 },
        ]}
      />
      <div className="grid">
        <Card span={12}>
          <h3>
            Front Panel · ES-24-Pro-PoE <Pill variant="success">Connected · 24d 14h</Pill>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, marginTop: 6 }}>
            {PORT_STATES.map((s, i) => (
              <div
                key={i}
                title={`Port ${i + 1}`}
                style={{
                  aspectRatio: '1.4 / 1',
                  border: `1px solid ${s[0] ? 'rgba(0,176,112,0.5)' : 'rgba(255,255,255,0.10)'}`,
                  background: s[0] === 'up' ? 'rgba(0,176,112,0.16)' : s[0] === 'poe' ? 'rgba(245,166,35,0.16)' : '#0A0A0B',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9,
                  color: s[0] ? '#fff' : '#4A4B53',
                  position: 'relative',
                }}
              >
                <div style={{ fontWeight: 600 }}>{i + 1}</div>
                <div style={{ fontSize: 8, color: s[0] === 'up' ? '#5DDB9F' : s[0] === 'poe' ? '#F5C26B' : '#4A4B53' }}>{s[1]}</div>
                {s[0] === 'poe' && (
                  <div style={{ position: 'absolute', top: 2, right: 3, fontSize: 7, color: '#F5C26B', fontWeight: 600 }}>PoE</div>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 14,
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 14,
            }}
          >
            <Legend swatch="rgba(0,176,112,0.3)" border="rgba(0,176,112,0.5)" label="Connected · 16" />
            <Legend swatch="rgba(245,166,35,0.3)" border="rgba(245,166,35,0.5)" label="PoE · 11" />
            <Legend swatch="#0A0A0B" border="rgba(255,255,255,0.10)" label="Down · 8" />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 18, fontSize: 12, color: '#A4A7B5', fontVariantNumeric: 'tabular-nums' }}>
              <span>
                PoE budget · <span style={{ color: '#fff' }}>186 / 400 W</span>
              </span>
              <span>
                Throughput · <span style={{ color: '#fff' }}>1.4 Gbps</span>
              </span>
            </div>
          </div>
        </Card>

        <Card span={12} style={{ padding: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ margin: 0, color: '#fff' }}>Port Configuration</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Port</th>
                <th>Name</th>
                <th>Network / VLAN</th>
                <th>Profile</th>
                <th>PoE</th>
                <th style={{ textAlign: 'right' }}>Speed</th>
                <th style={{ textAlign: 'right' }}>RX / TX</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PORTS.map((p) => (
                <tr key={p[0]}>
                  <td>
                    <span className="mac" style={{ color: '#fff', fontWeight: 600 }}>
                      {String(p[0]).padStart(2, '0')}
                    </span>
                  </td>
                  <td style={{ color: '#fff' }}>{p[1]}</td>
                  <td style={{ color: '#A4A7B5', fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{p[2]}</td>
                  <td>
                    <Pill variant="info">{p[3]}</Pill>
                  </td>
                  <td style={{ color: '#A4A7B5', fontVariantNumeric: 'tabular-nums' }}>{p[4]}</td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#fff' }}>{p[5]}</td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{p[6]}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: p[9], fontSize: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: p[7] }} />
                      {p[8]}
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

function Legend({ swatch, border, label }: { swatch: string; border: string; label: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: '#A4A7B5' }}>
      <span style={{ width: 10, height: 10, background: swatch, border: `1px solid ${border}`, borderRadius: 2 }} />
      {label}
    </div>
  );
}
