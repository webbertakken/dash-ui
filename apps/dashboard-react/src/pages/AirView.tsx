import { useMemo } from 'react';
import { Card, Button, Pill } from '@dash-ui/react';

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function cellColor(v: number): string {
  return v > 0.85 ? '#FF7B7B' : v > 0.65 ? '#F5A623' : v > 0.45 ? '#F5C26B' : v > 0.25 ? '#7FB6FF' : v > 0.1 ? '#3F7BC4' : '#1B2D5A';
}

const APS: [string, string, number, number, number][] = [
  ['AP Pro · Reception', '149 · 80 MHz', 71, -94, 28],
  ['AP Pro · Open office', '36 · 80 MHz', 62, -96, 42],
  ['AP Pro · Meeting B', '44 · 40 MHz', 38, -97, 11],
  ['U6 Long-Range · Warehouse', '52 · 40 MHz', 81, -93, 19],
  ['U6 Mesh · Patio', '100 · 40 MHz', 12, -99, 4],
];

const SOURCES: [string, string, 'warn' | 'info' | 'danger'][] = [
  ['Microwave oven', '2.4 GHz · CH 6–11', 'warn'],
  ['Bluetooth', '2.4 GHz · hopping', 'info'],
  ['Adjacent AP (rogue-uplink-5)', '5 GHz · CH 149', 'warn'],
  ['Continuous wave', '5 GHz · CH 52', 'danger'],
];

export function AirView() {
  const cells = useMemo(() => {
    const out: { color: string; opacity: number }[] = [];
    const r = rng(7);
    for (let y = 0; y < 24; y++) {
      for (let x = 0; x < 48; x++) {
        const v = Math.max(0, Math.min(1, 0.4 + 0.5 * Math.sin(x * 0.4 + y * 0.2) + 0.3 * Math.sin(x * 0.15) + 0.25 * (r() - 0.5)));
        out.push({ color: cellColor(v), opacity: 0.4 + v * 0.6 });
      }
    }
    return out;
  }, []);

  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">AirView</div>
        <div className="ph-actions">
          <Button>2.4 GHz</Button>
          <Button style={{ borderColor: '#006FFF', color: '#fff' }}>5 GHz</Button>
          <Button>6 GHz</Button>
          <Button>Last 1 h</Button>
        </div>
      </div>
      <div className="grid">
        <Card span={8}>
          <h3>
            Spectrum · 5 GHz <Pill variant="info">Live</Pill>
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(48, 1fr)',
              gap: 1,
              height: 240,
              background: '#0E0E0F',
              borderRadius: 6,
              padding: 6,
              marginTop: 4,
            }}
          >
            {cells.map((c, i) => (
              <div key={i} style={{ background: c.color, opacity: c.opacity }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#6E7079', marginTop: 6 }}>
            <span>5180</span>
            <span>5260</span>
            <span>5500</span>
            <span>5680</span>
            <span>5805 MHz</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 11, color: '#A4A7B5' }}>
            <span>Quiet</span>
            <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', flex: 1 }}>
              {['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B'].map((c) => (
                <div key={c} style={{ flex: 1, background: c }} />
              ))}
            </div>
            <span>Saturated</span>
          </div>
        </Card>

        <Card span={4}>
          <h3>Channel utilization</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['36', '62%', '#006FFF'],
              ['44', '38%', '#006FFF'],
              ['52', '81%', '#F5A623'],
              ['60', '24%', '#006FFF'],
              ['100', '12%', '#006FFF'],
              ['149', '71%', '#F5A623'],
              ['157', '45%', '#006FFF'],
              ['165', '19%', '#006FFF'],
            ].map((c) => (
              <div key={c[0]}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#fff', fontFamily: '"JetBrains Mono", monospace' }}>CH {c[0]}</span>
                  <span style={{ color: '#A4A7B5', fontFamily: '"JetBrains Mono", monospace' }}>{c[1]}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: c[2], width: c[1] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card span={12}>
          <h3>Access points (5 GHz)</h3>
          <table>
            <thead>
              <tr>
                <th>AP</th>
                <th>Channel · Width</th>
                <th>Utilization</th>
                <th>Noise floor</th>
                <th>Clients</th>
              </tr>
            </thead>
            <tbody>
              {APS.map(([name, ch, util, noise, clients]) => (
                <tr key={name}>
                  <td style={{ color: '#fff' }}>{name}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{ch}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: util > 70 ? '#F5A623' : '#006FFF', width: `${util}%` }} />
                      </div>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#A4A7B5', width: 34, textAlign: 'right' }}>{util}%</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{noise} dBm</td>
                  <td>{clients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card span={12}>
          <h3>
            Interference sources <span style={{ color: '#6E7079', fontWeight: 400 }}>classified by AirView</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 4 }}>
            {SOURCES.map(([name, freq, sev]) => (
              <div key={name} style={{ background: '#141415', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '10px 12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                    color: sev === 'danger' ? '#FF7B7B' : sev === 'warn' ? '#F5C26B' : '#7FB6FF',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                  {sev === 'danger' ? 'High' : sev === 'warn' ? 'Medium' : 'Low'}
                </div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, marginTop: 4 }}>{name}</div>
                <div style={{ color: '#6E7079', fontSize: 11, marginTop: 2, fontFamily: '"JetBrains Mono", monospace' }}>{freq}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
