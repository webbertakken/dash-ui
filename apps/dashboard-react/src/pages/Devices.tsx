import { useState } from 'react';
import { Button, SearchBox, Tabs, Signal, StatusIndicator } from '@dash-ui/react';
import { DEVICES } from '../data.js';

export interface DevicesProps {
  onAdopt: () => void;
}

export function Devices({ onAdopt }: DevicesProps) {
  const [tab, setTab] = useState('all');
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Devices</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search devices…" />
          <Button>Filter</Button>
          <Button variant="primary" onClick={onAdopt}>
            Adopt Device
          </Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'all', label: 'All', badge: 12 },
          { id: 'gw', label: 'Gateways', badge: 1 },
          { id: 'sw', label: 'Switches', badge: 2 },
          { id: 'wifi', label: 'Wi-Fi', badge: 6 },
          { id: 'cam', label: 'Cameras', badge: 3 },
          { id: 'pending', label: 'Pending', badge: 1 },
        ]}
      />
      <div style={{ padding: '0 24px 24px' }}>
        <table style={{ background: '#141415', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
          <caption className="sr-only">Devices</caption>
          <thead>
            <tr>
              <th scope="col">Name / Model</th>
              <th scope="col">MAC / IP</th>
              <th scope="col">Site</th>
              <th scope="col" style={{ textAlign: 'right' }}>Uptime</th>
              <th scope="col" style={{ textAlign: 'right' }}>Clients</th>
              <th scope="col" style={{ textAlign: 'right' }}>Signal</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {DEVICES.map((r) => (
              <tr key={r[2]}>
                <td>
                  <div className="name-cell">
                    <span className="nc-thumb">{r[9]}</span>
                    <div>
                      <div style={{ fontSize: 13, color: '#fff' }}>{r[0]}</div>
                      <div className="mac" style={{ fontSize: 10 }}>
                        {r[1]}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="mac">{r[2]}</div>
                  <div className="mac" style={{ fontSize: 10, color: '#4A4B53' }}>
                    {r[3]}
                  </div>
                </td>
                <td style={{ color: '#A4A7B5' }}>Edge Gateway</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{r[4]}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{r[5]}</td>
                <td style={{ textAlign: 'right' }}>{r[10] ? <Signal weak={r[10] === 'weak'} /> : '—'}</td>
                <td>
                  <StatusIndicator color={r[6]} text={r[7]} textColor={r[8]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
