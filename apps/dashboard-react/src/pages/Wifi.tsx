import { useState } from 'react';
import { Card, Button, SearchBox, Pill, HealthBar, Toggle, PlusIcon, WifiIcon } from '@dash-ui/react';
import { SSIDS } from '../data.js';

export function Wifi() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SSIDS.map((s) => [s[0], s[5] === 'active'])),
  );
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Wi-Fi</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search SSIDs…" />
          <Button>Import</Button>
          <Button variant="primary">
            <PlusIcon /> New SSID
          </Button>
        </div>
      </div>
      <div className="grid">
        <Card span={4}>
          <h3>Active SSIDs</h3>
          <div className="stat">
            5<span className="unit">of 6 broadcasting</span>
          </div>
          <div className="submeta">Across 6 access points</div>
        </Card>
        <Card span={4}>
          <h3>Wireless Clients</h3>
          <div className="stat">
            88<span className="unit">connected</span>
          </div>
          <div className="submeta">5 GHz · 64 · 2.4 GHz · 24</div>
        </Card>
        <Card span={4}>
          <h3>Channel Utilisation</h3>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#A4A7B5', marginBottom: 4 }}>
                <span>5 GHz</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>38%</span>
              </div>
              <HealthBar value={38} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#A4A7B5', margin: '8px 0 4px' }}>
                <span>2.4 GHz</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>71%</span>
              </div>
              <HealthBar value={71} fillStyle={{ background: 'linear-gradient(90deg,#F5A623,#F5C26B)' }} />
            </div>
          </div>
        </Card>
      </div>
      <div style={{ padding: '0 24px 24px' }}>
        <table style={{ background: '#141415', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Security</th>
              <th>Bands</th>
              <th>Network</th>
              <th style={{ textAlign: 'right' }}>Clients</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {SSIDS.map((s) => (
              <tr key={s[0]}>
                <td>
                  <div className="name-cell">
                    <span className="nc-thumb" style={{ background: 'rgba(0,111,255,0.14)', color: '#7FB6FF' }}>
                      <WifiIcon />
                    </span>
                    <div style={{ color: '#fff', fontSize: 13 }}>{s[0]}</div>
                  </div>
                </td>
                <td style={{ color: '#A4A7B5' }}>{s[1]}</td>
                <td style={{ color: '#A4A7B5' }}>{s[2]}</td>
                <td style={{ color: '#A4A7B5', fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{s[3]}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{s[4]}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: s[6], fontSize: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s[6] }} />
                    {s[7]}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Toggle on={!!enabled[s[0]]} onToggle={() => setEnabled((e) => ({ ...e, [s[0]]: !e[s[0]] }))} ariaLabel={s[0]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

void Pill;
