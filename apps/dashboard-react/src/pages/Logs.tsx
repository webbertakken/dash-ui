import { useState } from 'react';
import { Button, SearchBox, Tabs, DownloadIcon } from '@dash-ui/react';
import { LOG_ROWS } from '../data.js';

const sevColor = (s: string) => (s === 'danger' ? '#FF7B7B' : s === 'warn' ? '#F5C26B' : '#7FB6FF');
const sevDot = (s: string) => (s === 'danger' ? '#F03A3A' : s === 'warn' ? '#F5A623' : '#006FFF');

export function Logs() {
  const [tab, setTab] = useState('all');
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Logs</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search logs…" />
          <Button>Last 1 h</Button>
          <Button iconOnly title="Download">
            <DownloadIcon />
          </Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'all', label: 'All', badge: '2,418' },
          { id: 'network', label: 'Network', badge: '1,842' },
          { id: 'system', label: 'System', badge: 214 },
          { id: 'security', label: 'Security', badge: 187 },
          { id: 'vpn', label: 'VPN', badge: 62 },
          { id: 'access', label: 'Access', badge: 94 },
          { id: 'protect', label: 'Protect', badge: 19 },
        ]}
      />
      <div style={{ padding: '0 24px 24px' }}>
        <table
          style={{
            background: '#141415',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            overflow: 'hidden',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
          }}
        >
          <caption className="sr-only">Logs</caption>
          <thead style={{ fontFamily: 'Inter, sans-serif' }}>
            <tr>
              <th scope="col" style={{ width: 90 }}>Severity</th>
              <th scope="col" style={{ width: 90 }}>Source</th>
              <th scope="col" style={{ width: 90 }}>Time</th>
              <th scope="col">Event</th>
              <th scope="col">Subject</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {LOG_ROWS.map((r, i) => (
              <tr key={i}>
                <td>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: sevColor(r[0]),
                      fontSize: 11,
                      fontFamily: 'Inter, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: sevDot(r[0]) }} />
                    {r[0] === 'danger' ? 'crit' : r[0]}
                  </span>
                </td>
                <td style={{ color: '#A4A7B5', fontFamily: 'Inter, sans-serif', fontSize: 12 }}>{r[1]}</td>
                <td style={{ color: '#6E7079' }}>{r[2]}</td>
                <td style={{ color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>{r[3]}</td>
                <td style={{ color: '#C8C9D0', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>{r[4]}</td>
                <td style={{ color: '#6E7079' }}>{r[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
