import { useState } from 'react';
import { Button, Pill, Tabs } from '@dash-ui/react';

const ROWS = [
  { sev: 'danger', source: ['CAM', 'Cam-Bullet 5 · Side Entry', 'CAM-Bullet5'], msg: 'No PoE link detected on uplink port', when: '2 min ago' },
  { sev: 'warn', source: ['EG', 'Edge Gateway X1', 'EG-X1'], msg: 'CPU sustained at 84% for 3 minutes', when: '8 min ago' },
  { sev: 'warn', source: ['VLN', 'DHCP · VLAN 20', '192.168.20.0/24'], msg: 'Pool 92% full · 234 / 254 leases active', when: '14 min ago' },
] as const;

export function Alarms() {
  const [tab, setTab] = useState('active');
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Alarm Manager</div>
        <div className="ph-actions">
          <Button>Acknowledge all</Button>
          <Button>Configure</Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'active', label: 'Active', badge: 3 },
          { id: 'ack', label: 'Acknowledged', badge: 2 },
          { id: 'all', label: 'All', badge: 42 },
        ]}
      />
      <div style={{ padding: '0 24px 24px' }}>
        <table style={{ background: '#141415', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
          <caption className="sr-only">Alarms</caption>
          <thead>
            <tr>
              <th scope="col">Severity</th>
              <th scope="col">Source</th>
              <th scope="col">Message</th>
              <th scope="col">Site</th>
              <th scope="col" style={{ textAlign: 'right' }}>When</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.source[1]}>
                <td>
                  <Pill variant={r.sev as any}>{r.sev === 'danger' ? 'Critical' : 'Warning'}</Pill>
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
      </div>
    </>
  );
}
