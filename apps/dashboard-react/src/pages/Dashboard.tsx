import { Card, Pill, Button, SearchBox, Sparkline, Donut, Pill as P, StatusIndicator, PlusIcon } from '@dash-ui/react';
import { DASHBOARD_DEVICES, DASHBOARD_ALARMS } from '../data.js';

export interface DashboardProps {
  onAdopt: () => void;
}

export function Dashboard({ onAdopt }: DashboardProps) {
  return (
    <>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, flex: 1 }}>
              {[
                ['Wireless', '#006FFF', 88],
                ['Wired', '#4797FF', 42],
                ['VPN', '#7FB6FF', 12],
              ].map(([label, color, n]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C8C9D0' }}>
                    <span style={{ width: 8, height: 8, background: color as string, borderRadius: 2 }} /> {label}
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: '#fff' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card span={8} style={{ padding: 0 }}>
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
                  <th scope="col" style={{ textAlign: 'right' }}>Uptime</th>
                  <th scope="col" style={{ textAlign: 'right' }}>CPU / Mem</th>
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
                    : '?';
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
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{r[3]}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{r[4]}</td>
                      <td>
                        <StatusIndicator color={r[5]} text={r[6]} textColor={r[7]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pill variant={sev as any} className="pill-small">
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
  );
}
