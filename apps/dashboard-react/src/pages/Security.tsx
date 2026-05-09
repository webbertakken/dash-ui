import { useState } from 'react';
import { Card, Button, Pill, Tabs, Sparkline, Toggle } from '@dash-ui/react';

const PROTECTIONS: { title: string; description: string; defaultOn: boolean }[] = [
  { title: 'Suspicious activity detection', description: 'Block scanners, brute-force, lateral movement', defaultOn: true },
  { title: 'Honeypot', description: 'Decoy services on unused ports', defaultOn: true },
  { title: 'Restrict access to Tor', description: 'Block all known Tor exit/entry nodes', defaultOn: true },
  { title: 'Restrict access to malicious sites', description: 'DNS-level reputation filtering', defaultOn: true },
  { title: 'Country restrictions', description: 'Block traffic from selected countries', defaultOn: false },
  { title: 'Internet threat protection', description: 'Inline ML-based threat scoring', defaultOn: true },
];

const THREATS: [string, string, string, string, string, string][] = [
  ['danger', 'Mirai botnet C2 callout', 'c8:69:cd:11:23:11 · 192.168.30.18', '185.220.101.42:8443', 'Blocked', '2 min'],
  ['warn', 'SMB null-session probe', '203.0.113.118:48211', '198.51.100.42:445', 'Blocked', '11 min'],
  ['warn', 'SQL injection · UNION SELECT', '45.142.215.92:54312', '198.51.100.42:443', 'Blocked', '22 min'],
  ['danger', 'Cobalt Strike beacon', 'c8:69:cd:11:23:91 · 192.168.20.84', '203.0.113.55:443', 'Blocked', '38 min'],
];

export function Security() {
  const [tab, setTab] = useState('threat');
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(PROTECTIONS.map((p) => [p.title, p.defaultOn])),
  );
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Security</div>
        <div className="ph-actions">
          <Button>Audit log</Button>
          <Button variant="primary">Apply</Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'threat', label: 'Threat Management' },
          { id: 'fw', label: 'Firewall', badge: 14 },
          { id: 'tr', label: 'Traffic Rules', badge: 22 },
          { id: 'geo', label: 'Geo IP' },
          { id: 'dns', label: 'DNS Shield' },
        ]}
      />
      <div className="grid">
        <Card span={6}>
          <h3>
            IDS / IPS <Pill variant="success">Active</Pill>
          </h3>
          <div className="stat">
            847<span className="unit">threats blocked · 24 h</span>
          </div>
          <div className="submeta">Signatures · v9.4.21 · updated 14 min ago</div>
          <Sparkline active />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 6, fontSize: 11 }}>
            {[
              ['Malware', '412'],
              ['Scans', '298'],
              ['Botnet C2', '137'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#0A0A0B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: 8 }}>
                <div style={{ color: '#6E7079' }}>{k}</div>
                <div style={{ fontSize: 18, color: '#fff', fontVariantNumeric: 'tabular-nums', fontWeight: 600, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card span={6}>
          <h3>Protections</h3>
          {PROTECTIONS.map((p) => (
            <div
              key={p.title}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: '#6E7079', marginTop: 2 }}>{p.description}</div>
              </div>
              <Toggle on={!!state[p.title]} onToggle={() => setState((s) => ({ ...s, [p.title]: !s[p.title] }))} ariaLabel={p.title} />
            </div>
          ))}
        </Card>

        <Card span={12} style={{ padding: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: '#fff' }}>Recent Blocked Threats</h3>
            <Button>View all</Button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>Signature</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Action</th>
                <th style={{ textAlign: 'right' }}>When</th>
              </tr>
            </thead>
            <tbody>
              {THREATS.map((t, i) => (
                <tr key={i}>
                  <td>
                    <Pill variant={t[0] as any}>{t[0] === 'danger' ? 'Critical' : 'Medium'}</Pill>
                  </td>
                  <td style={{ color: '#fff' }}>{t[1]}</td>
                  <td className="mac">{t[2]}</td>
                  <td className="mac">{t[3]}</td>
                  <td>
                    <Pill variant="success">{t[4]}</Pill>
                  </td>
                  <td style={{ textAlign: 'right', color: '#A4A7B5' }}>{t[5]} ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
