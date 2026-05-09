<script lang="ts">
  import { Card, Button, Pill } from '@dash-ui/svelte';

  function rng(s0: number) {
    let s = s0;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }
  function cellColor(v: number) {
    return v > 0.85 ? '#FF7B7B' : v > 0.65 ? '#F5A623' : v > 0.45 ? '#F5C26B' : v > 0.25 ? '#7FB6FF' : v > 0.1 ? '#3F7BC4' : '#1B2D5A';
  }

  const cells = (() => {
    const out: { color: string; opacity: number }[] = [];
    const r = rng(7);
    for (let y = 0; y < 24; y++) {
      for (let x = 0; x < 48; x++) {
        const v = Math.max(0, Math.min(1, 0.4 + 0.5 * Math.sin(x * 0.4 + y * 0.2) + 0.3 * Math.sin(x * 0.15) + 0.25 * (r() - 0.5)));
        out.push({ color: cellColor(v), opacity: 0.4 + v * 0.6 });
      }
    }
    return out;
  })();

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

  const CHANNELS: [string, string, string][] = [
    ['36', '62%', '#006FFF'],
    ['44', '38%', '#006FFF'],
    ['52', '81%', '#F5A623'],
    ['60', '24%', '#006FFF'],
    ['100', '12%', '#006FFF'],
    ['149', '71%', '#F5A623'],
    ['157', '45%', '#006FFF'],
    ['165', '19%', '#006FFF'],
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">AirView</div>
  <div class="ph-actions">
    <Button>2.4 GHz</Button>
    <Button style="border-color:#006FFF;color:#fff;">5 GHz</Button>
    <Button>6 GHz</Button>
    <Button>Last 1 h</Button>
  </div>
</div>
<div class="grid">
  <Card span={8}>
    <h3>Spectrum · 5 GHz <Pill variant="info">Live</Pill></h3>
    <div style="display:grid;grid-template-columns:repeat(48,1fr);gap:1px;height:240px;background:#0E0E0F;border-radius:6px;padding:6px;margin-top:4px;">
      {#each cells as c}
        <div style="background:{c.color};opacity:{c.opacity};"></div>
      {/each}
    </div>
    <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;color:#6E7079;margin-top:6px;">
      <span>5180</span><span>5260</span><span>5500</span><span>5680</span><span>5805 MHz</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:11px;color:#A4A7B5;">
      <span>Quiet</span>
      <div style="display:flex;height:6px;border-radius:3px;overflow:hidden;flex:1;">
        {#each ['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B'] as c}
          <div style="flex:1;background:{c};"></div>
        {/each}
      </div>
      <span>Saturated</span>
    </div>
  </Card>

  <Card span={4}>
    <h3>Channel utilization</h3>
    <div style="display:flex;flex-direction:column;gap:10px;">
      {#each CHANNELS as c}
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span style="color:#fff;font-family:'JetBrains Mono',monospace;">CH {c[0]}</span>
            <span style="color:#A4A7B5;font-family:'JetBrains Mono',monospace;">{c[1]}</span>
          </div>
          <div style="height:5px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
            <div style="height:100%;background:{c[2]};width:{c[1]};"></div>
          </div>
        </div>
      {/each}
    </div>
  </Card>

  <Card span={12}>
    <h3>Access points (5 GHz)</h3>
    <table>
      <thead>
        <tr><th>AP</th><th>Channel · Width</th><th>Utilization</th><th>Noise floor</th><th>Clients</th></tr>
      </thead>
      <tbody>
        {#each APS as [name, ch, util, noise, clients] (name)}
          <tr>
            <td style="color:#fff;">{name}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;">{ch}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="flex:1;height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;">
                  <div style="height:100%;background:{util > 70 ? '#F5A623' : '#006FFF'};width:{util}%;"></div>
                </div>
                <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#A4A7B5;width:34px;text-align:right;">{util}%</span>
              </div>
            </td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{noise} dBm</td>
            <td>{clients}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Card>

  <Card span={12}>
    <h3>Interference sources <span style="color:#6E7079;font-weight:400;">classified by AirView</span></h3>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:4px;">
      {#each SOURCES as [name, freq, sev] (name)}
        <div style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:10px 12px;">
          <div style="display:flex;align-items:center;gap:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;font-weight:600;color:{sev === 'danger' ? '#FF7B7B' : sev === 'warn' ? '#F5C26B' : '#7FB6FF'};">
            <span style="width:6px;height:6px;border-radius:50%;background:currentColor;"></span>
            {sev === 'danger' ? 'High' : sev === 'warn' ? 'Medium' : 'Low'}
          </div>
          <div style="color:#fff;font-size:13px;font-weight:500;margin-top:4px;">{name}</div>
          <div style="color:#6E7079;font-size:11px;margin-top:2px;font-family:'JetBrains Mono',monospace;">{freq}</div>
        </div>
      {/each}
    </div>
  </Card>
</div>
