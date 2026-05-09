<script lang="ts">
  import { Card, Button, SearchBox, HealthBar, Toggle, PlusIcon, WifiIcon } from '@dash-ui/svelte';
  import { SSIDS } from '../data';

  let enabled: Record<string, boolean> = Object.fromEntries(SSIDS.map((s) => [s[0], s[5] === 'active']));
</script>

<div class="ph-bar">
  <div class="ph-title">Wi-Fi</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search SSIDs…" />
    <Button>Import</Button>
    <Button variant="primary"><PlusIcon /> New SSID</Button>
  </div>
</div>
<div class="grid">
  <Card span={4}>
    <h3>Active SSIDs</h3>
    <div class="stat">5<span class="unit">of 6 broadcasting</span></div>
    <div class="submeta">Across 6 access points</div>
  </Card>
  <Card span={4}>
    <h3>Wireless Clients</h3>
    <div class="stat">88<span class="unit">connected</span></div>
    <div class="submeta">5 GHz · 64 · 2.4 GHz · 24</div>
  </Card>
  <Card span={4}>
    <h3>Channel Utilisation</h3>
    <div style="display:flex;gap:14px;align-items:center;flex:1;">
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#A4A7B5;margin-bottom:4px;">
          <span>5 GHz</span><span style="font-variant-numeric:tabular-nums;">38%</span>
        </div>
        <HealthBar value={38} />
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#A4A7B5;margin:8px 0 4px;">
          <span>2.4 GHz</span><span style="font-variant-numeric:tabular-nums;">71%</span>
        </div>
        <HealthBar value={71} fillStyle="background:linear-gradient(90deg,#F5A623,#F5C26B);" />
      </div>
    </div>
  </Card>
</div>
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
    <caption class="sr-only">Wi-Fi networks</caption>
    <thead>
      <tr>
        <th scope="col">Name</th><th scope="col">Security</th><th scope="col">Bands</th><th scope="col">Network</th>
        <th scope="col" style="text-align:right;">Clients</th><th scope="col">Status</th><th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      {#each SSIDS as s (s[0])}
        <tr>
          <td>
            <div class="name-cell">
              <span class="nc-thumb" style="background:rgba(0,111,255,0.14);color:#7FB6FF;">
                <WifiIcon />
              </span>
              <div style="color:#fff;font-size:13px;">{s[0]}</div>
            </div>
          </td>
          <td style="color:#A4A7B5;">{s[1]}</td>
          <td style="color:#A4A7B5;">{s[2]}</td>
          <td style="color:#A4A7B5;font-family:'JetBrains Mono',monospace;font-size:12px;">{s[3]}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{s[4]}</td>
          <td>
            <span style="display:inline-flex;align-items:center;gap:6px;color:{s[6]};font-size:12px;">
              <span style="width:6px;height:6px;border-radius:50%;background:{s[6]};"></span>{s[7]}
            </span>
          </td>
          <td style="text-align:right;">
            <Toggle bind:on={enabled[s[0]]} ariaLabel={s[0]} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
