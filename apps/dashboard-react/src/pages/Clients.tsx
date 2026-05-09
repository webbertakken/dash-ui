import { useState } from 'react';
import { Button, SearchBox, Tabs, Signal } from '@dash-ui/react';
import { CLIENTS } from '../data.js';

export function Clients() {
  const [tab, setTab] = useState('all');
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Client Devices · 142</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search clients…" />
          <Button>Filter</Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'all', label: 'All', badge: 142 },
          { id: 'wired', label: 'Wired', badge: 42 },
          { id: 'wireless', label: 'Wireless', badge: 88 },
          { id: 'vpn', label: 'VPN', badge: 12 },
          { id: 'guest', label: 'Guest', badge: 7 },
        ]}
      />
      <div style={{ padding: '0 24px 24px' }}>
        <table style={{ background: '#141415', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
          <caption className="sr-only">Client devices</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">IP / MAC</th>
              <th scope="col">Network</th>
              <th scope="col">Connected to</th>
              <th scope="col" style={{ textAlign: 'right' }}>RX / TX</th>
              <th scope="col" style={{ textAlign: 'right' }}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => (
              <tr key={c[2]}>
                <td style={{ color: '#fff' }}>{c[0]}</td>
                <td>
                  <div className="mac">{c[1]}</div>
                  <div className="mac" style={{ fontSize: 10, color: '#4A4B53' }}>
                    {c[2]}
                  </div>
                </td>
                <td style={{ color: '#A4A7B5' }}>
                  {c[3]} · {c[4]}
                </td>
                <td style={{ color: '#A4A7B5' }}>{c[5]}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{c[6]}</td>
                <td style={{ textAlign: 'right' }}>{c[7] ? <Signal weak={c[7] === 'weak'} /> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
