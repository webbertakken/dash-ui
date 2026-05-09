<script lang="ts">
  import { Card, Button, Pill, Field, RowToggle } from '@dash-ui/svelte';
  const TAB_NAMES = ['System', 'Console', 'Network', 'Internet', 'VLANs', 'Routing', 'Profiles', 'Advanced'] as const;
  type SettingsTab = (typeof TAB_NAMES)[number];
  let tab: SettingsTab = 'System';

  const CONSOLE_TOGGLES: [string, string, boolean][] = [
    ['Application updates', 'Automatically update Network, Protect, Access', true],
    ['Telemetry', 'Send anonymized diagnostic data to Dash', true],
    ['SSH', 'Enable shell access from local network', false],
    ['UI Beta channel', 'Receive early-access Dash releases', false],
    ['Remote access', 'Connect via Site Manager', true],
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Settings</div>
  <div class="ph-actions">
    <Button>Discard</Button>
    <Button variant="primary">Save</Button>
  </div>
</div>
<div style="display:grid;grid-template-columns:200px 1fr;gap:24px;padding:16px 24px 24px;">
  <aside style="display:flex;flex-direction:column;gap:1px;font-size:13px;">
    {#each TAB_NAMES as s}
      <a class="sb-item {tab === s ? 'active' : ''}" style="padding:8px 10px;" on:click={() => (tab = s)}>{s}</a>
    {/each}
  </aside>
  <div style="display:flex;flex-direction:column;gap:12px;">
    {#if tab === 'System'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">System</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Site name" value="Edge Gateway (Gateway)" />
          <Field label="Country / Region" value="United Kingdom" />
          <Field label="Timezone" value="Europe/London (GMT+1)" />
          <Field label="Update schedule" value="Sundays · 03:00" />
        </div>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Backup</h3>
        <RowToggle title="Auto-backup to Dash Cloud" description="Daily · last successful 04:00 today" on={true} />
        <div style="display:flex;gap:8px;margin-top:10px;">
          <Button>Download backup</Button>
          <Button>Restore from file</Button>
        </div>
      </Card>
    {:else if tab === 'Console'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">Console</h3>
        {#each CONSOLE_TOGGLES as [t, d, on]}
          <RowToggle title={t} description={d} {on} />
        {/each}
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Hardware</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Model" value="EG-X1" />
          <Field label="Firmware" value="4.2.21 · up to date" />
          <Field label="Serial" value="F4E2C72A8B19" />
          <Field label="Storage" value="HDD 4 TB · 41% used" />
        </div>
      </Card>
    {:else if tab === 'Network'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">Default network</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Network name" value="Default" />
          <Field label="Gateway / Subnet" value="192.168.1.1/24" />
          <Field label="DHCP range" value="192.168.1.6 – 192.168.1.254" />
          <Field label="Lease time" value="86400 s" />
        </div>
        <RowToggle title="IGMP snooping" description="Optimize multicast on this network" on={true} />
        <RowToggle title="Multicast DNS" description="Forward mDNS across VLANs" on={false} />
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Networks</h3>
        <table style="margin-top:4px;">
          <thead>
            <tr>
              <th>Name</th><th>VLAN</th><th>Subnet</th><th>Clients</th><th></th>
            </tr>
          </thead>
          <tbody>
            {#each [
              ['Default', '1', '192.168.1.0/24', '142'],
              ['IoT', '20', '192.168.20.0/24', '38'],
              ['Guest', '30', '192.168.30.0/24', '9'],
              ['Cameras', '40', '192.168.40.0/24', '12'],
              ['Servers', '50', '10.0.50.0/24', '7'],
            ] as r}
              <tr>
                <td style="color:#fff;">{r[0]}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{r[1]}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{r[2]}</td>
                <td>{r[3]}</td>
                <td style="text-align:right;color:#6E7079;">›</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Card>
    {:else if tab === 'Internet'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">WAN1 <Pill variant="success">Online</Pill></h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Connection" value="DHCP" />
          <Field label="Public IP" value="185.42.118.214" />
          <Field label="Gateway" value="185.42.118.1" />
          <Field label="DNS" value="1.1.1.1, 1.0.0.1" />
          <Field label="MTU" value="1500" />
          <Field label="Uptime" value="42d 6h 12m" />
        </div>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">
          WAN2 (Failover)
          <span class="pill" style="color:#A4A7B5;background:rgba(255,255,255,0.06);">Standby</span>
        </h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Connection" value="LTE Modem" />
          <Field label="Carrier" value="Vodafone UK" />
          <Field label="Signal" value="-71 dBm · Excellent" />
          <Field label="Failover threshold" value="3 consecutive failures" />
        </div>
        <RowToggle title="Smart Queues (QoS)" description="Prioritize realtime traffic" on={true} />
        <RowToggle title="IPv6 prefix delegation" description="/56 from ISP" on={true} />
      </Card>
    {:else if tab === 'VLANs'}
      <Card>
        <h3 style="color:#fff;font-size:14px;display:flex;align-items:center;">
          VLANs
          <Button style="margin-left:auto;font-size:11px;">+ Create VLAN</Button>
        </h3>
        <table style="margin-top:4px;">
          <thead>
            <tr>
              <th>Name</th><th>VLAN ID</th><th>Purpose</th><th>Isolation</th><th>DHCP</th>
            </tr>
          </thead>
          <tbody>
            {#each [
              ['Default', '1', 'Corporate LAN', '—', 'Yes'],
              ['IoT', '20', 'Smart home', 'Isolated', 'Yes'],
              ['Guest', '30', 'Captive portal', 'Isolated', 'Yes'],
              ['Cameras', '40', 'Camera Service', 'Isolated from LAN', 'Yes'],
              ['Servers', '50', 'Rack / NAS', '—', 'Static'],
              ['Mgmt', '99', 'Switch/AP mgmt', 'Isolated', 'Yes'],
            ] as r}
              <tr>
                <td style="color:#fff;">{r[0]}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;">{r[1]}</td>
                <td>{r[2]}</td>
                <td style="color:#A4A7B5;">{r[3]}</td>
                <td style="color:#A4A7B5;">{r[4]}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Card>
    {:else if tab === 'Routing'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">Static routes</h3>
        <table style="margin-top:4px;">
          <thead>
            <tr><th>Destination</th><th>Next hop</th><th>Distance</th><th>Status</th></tr>
          </thead>
          <tbody>
            {#each [
              ['10.10.0.0/16', '192.168.1.254', '5', 'Active'],
              ['172.16.20.0/24', 'VPN-WG', '10', 'Active'],
              ['203.0.113.0/24', '185.42.118.1', '15', 'Inactive'],
            ] as r}
              <tr>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#fff;">{r[0]}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{r[1]}</td>
                <td>{r[2]}</td>
                <td>
                  {#if r[3] === 'Active'}
                    <Pill variant="success">{r[3]}</Pill>
                  {:else}
                    <span class="pill" style="color:#6E7079;background:rgba(255,255,255,0.06);"><span class="dot"></span>{r[3]}</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Dynamic routing</h3>
        <RowToggle title="OSPF" description="Open Shortest Path First" on={false} />
        <RowToggle title="BGP" description="Border Gateway Protocol" on={false} />
        <RowToggle title="Multicast routing" description="PIM-SM" on={false} />
      </Card>
    {:else if tab === 'Profiles'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">RADIUS profiles</h3>
        <table style="margin-top:4px;">
          <thead><tr><th>Name</th><th>Auth server</th><th>Used by</th></tr></thead>
          <tbody>
            {#each [['Corp 802.1X', '10.0.50.21:1812', 'Default, Mgmt'], ['Guest portal', 'radius.local:1812', 'Guest']] as r}
              <tr>
                <td style="color:#fff;">{r[0]}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{r[1]}</td>
                <td>{r[2]}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Schedules</h3>
        <table style="margin-top:4px;">
          <thead><tr><th>Name</th><th>Days</th><th>Hours</th></tr></thead>
          <tbody>
            {#each [['Business hours', 'Mon–Fri', '08:00 – 18:00'], ['Quiet', 'Daily', '22:00 – 06:00'], ['Weekend', 'Sat–Sun', 'All day']] as r}
              <tr>
                <td style="color:#fff;">{r[0]}</td>
                <td>{r[1]}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#A4A7B5;">{r[2]}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Card>
    {:else if tab === 'Advanced'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">Advanced</h3>
        <RowToggle title="Hardware offload" description="Accelerate routing in NPU" on={true} />
        <RowToggle title="Smart DNS" description="Cache and filter queries locally" on={true} />
        <RowToggle title="Connectivity monitor" description="Probe gateway every 5 s" on={true} />
        <RowToggle title="Crash reports" description="Send kernel panics to Dash" on={true} />
        <RowToggle title="Debug logging" description="Verbose · increases write IO" on={false} />
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Danger zone</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <Button>Restart console</Button>
          <Button>Forget all clients</Button>
          <Button variant="danger">Factory reset</Button>
        </div>
      </Card>
    {/if}
  </div>
</div>
