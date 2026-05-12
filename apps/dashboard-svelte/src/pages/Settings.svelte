<script lang="ts">
  import { Card, Button, Pill, Field, Input, RowToggle, RadioGroup, NumberInput, Textarea, Slider, Accordion, AccordionItem, Breadcrumb, Stepper, FileUpload, Combobox, SplitButton, IPInput, CodeBlock, TimePicker, PasswordInput, OTPInput, ColorPicker, COLOR_SWATCHES, MACInput, DurationInput, CIDRInput, Callout, InputGroup, Menubar, TagInput, ContextualHelp, toast } from '@w5-ui/svelte';
  import type { ComboboxOption } from '@w5-ui/svelte';
  const TAB_NAMES = ['System', 'Console', 'Network', 'Internet', 'WiFi', 'VLANs', 'Routing', 'Profiles', 'Advanced'] as const;
  type SettingsTab = (typeof TAB_NAMES)[number];
  let tab: SettingsTab = 'System';
  let country = 'gb';
  let timezone = 'Europe/London';
  let maintStart = '03:00';
  let maintEnd = '05:00';

  const VLAN_ROWS = [
    { name: 'Default', id: '1', purpose: 'Corporate LAN', isolation: '—', dhcp: 'Yes', color: 'blue' },
    { name: 'IoT', id: '20', purpose: 'Smart home', isolation: 'Isolated', dhcp: 'Yes', color: 'amber' },
    { name: 'Guest', id: '30', purpose: 'Captive portal', isolation: 'Isolated', dhcp: 'Yes', color: 'green' },
    { name: 'Cameras', id: '40', purpose: 'Camera Service', isolation: 'Isolated from LAN', dhcp: 'Yes', color: 'purple' },
    { name: 'Servers', id: '50', purpose: 'Rack / NAS', isolation: '—', dhcp: 'Static', color: 'teal' },
    { name: 'Mgmt', id: '99', purpose: 'Switch/AP mgmt', isolation: 'Isolated', dhcp: 'Yes', color: 'slate' },
  ];
  let vlanColors: Record<string, string> = Object.fromEntries(VLAN_ROWS.map((r) => [r.name, r.color]));
  let selectedVlan = VLAN_ROWS[0].name;
  $: selectedVlanColor = vlanColors[selectedVlan] ?? 'blue';

  const COUNTRY_OPTIONS: ComboboxOption[] = [
    { value: 'au', label: 'Australia' },
    { value: 'br', label: 'Brazil' },
    { value: 'ca', label: 'Canada' },
    { value: 'cn', label: 'China' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'in', label: 'India' },
    { value: 'jp', label: 'Japan' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'sg', label: 'Singapore' },
    { value: 'us', label: 'United States' },
    { value: 'gb', label: 'United Kingdom' },
  ];

  const TIMEZONE_OPTIONS: ComboboxOption[] = [
    { value: 'America/New_York', label: 'America/New_York (GMT-4)' },
    { value: 'America/Chicago', label: 'America/Chicago (GMT-5)' },
    { value: 'America/Denver', label: 'America/Denver (GMT-6)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (GMT-7)' },
    { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (GMT-3)' },
    { value: 'Europe/London', label: 'Europe/London (GMT+1)' },
    { value: 'Europe/Paris', label: 'Europe/Paris (GMT+2)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (GMT+2)' },
    { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (GMT+2)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai (GMT+8)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (GMT+8)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (GMT+10)' },
    { value: 'UTC', label: 'UTC (GMT+0)' },
  ];
  let txPower2g = 80;
  let txPower5g = 100;
  let rxSensitivity = 50;

  let otpValue = '';
  const SETTINGS_MENUS = [
    { id: 'file', label: 'File', items: [
      { id: 'save', label: 'Save' },
      { id: 'save-apply', label: 'Save & apply now' },
      { id: 'sep1', label: '', separator: true },
      { id: 'export', label: 'Export config…' },
      { id: 'import', label: 'Import config…' },
    ]},
    { id: 'edit', label: 'Edit', items: [
      { id: 'reset', label: 'Reset to defaults' },
      { id: 'duplicate', label: 'Duplicate profile' },
      { id: 'sep2', label: '', separator: true },
      { id: 'revert', label: 'Revert changes' },
    ]},
    { id: 'view', label: 'View', items: [
      { id: 'compact', label: 'Compact view' },
      { id: 'advanced', label: 'Show advanced settings' },
    ]},
  ];
  function onMenuAction(e: CustomEvent<{ menuId: string; itemId: string }>) {
    const { itemId } = e.detail;
    if (itemId === 'save' || itemId === 'save-apply') toast.success('Settings saved');
    else if (itemId === 'export') toast.info('Config exported');
    else if (itemId === 'import') toast.info('Import config…');
    else if (itemId === 'reset') toast.warn('Reset to defaults');
    else if (itemId === 'revert') toast.warn('Changes reverted');
    else toast.info(itemId);
  }
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
    <SplitButton
      label="Save"
      variant="primary"
      items={[
        { id: 'save-apply', label: 'Save & apply now' },
        { id: 'export', label: 'Export config…' },
      ]}
      on:primary={() => toast.success('Settings saved')}
      on:action={(e) => {
        if (e.detail === 'save-apply') toast.success('Saved & applying…');
        else toast.info('Config exported');
      }}
    />
  </div>
</div>
<div style="padding:8px 24px 0;">
  <Menubar label="Settings toolbar" menus={SETTINGS_MENUS} on:action={onMenuAction} />
</div>
<div style="display:grid;grid-template-columns:200px 1fr;gap:24px;padding:16px 24px 24px;">
  <aside style="display:flex;flex-direction:column;gap:1px;font-size:13px;">
    {#each TAB_NAMES as s}
      <button type="button" class="sb-item {tab === s ? 'active' : ''}" aria-current={tab === s ? 'page' : undefined} style="padding:8px 10px;" on:click={() => (tab = s)}>{s}</button>
    {/each}
  </aside>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <Breadcrumb items={[{ label: 'Settings' }, { label: tab }]} />
    {#if tab === 'System'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">System</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Site name" value="Edge Gateway (Gateway)" />
          <div class="field">
            <label for="sys-country" style="font-size:12px;color:#A4A7B5;display:block;margin-bottom:4px;">Country / Region</label>
            <Combobox id="sys-country" options={COUNTRY_OPTIONS} value={country} on:change={(e) => (country = e.detail)} placeholder="Search country…" />
          </div>
          <div class="field">
            <label for="sys-tz" style="font-size:12px;color:#A4A7B5;display:block;margin-bottom:4px;">Timezone</label>
            <Combobox id="sys-tz" options={TIMEZONE_OPTIONS} value={timezone} on:change={(e) => (timezone = e.detail)} placeholder="Search timezone…" />
          </div>
          <div class="field">
            <span style="font-size:12px;color:#A4A7B5;display:block;margin-bottom:6px;">Maintenance window (Sundays)</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <TimePicker label="Start" value={maintStart} on:change={(e) => (maintStart = e.detail)} />
              <span style="color:#6E7079;font-size:13px;margin-top:18px;">–</span>
              <TimePicker label="End" value={maintEnd} on:change={(e) => (maintEnd = e.detail)} />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Backup</h3>
        <RowToggle title="Auto-backup to Dash Cloud" description="Daily · last successful 04:00 today" on={true} />
        <div style="display:flex;gap:8px;margin-top:10px;">
          <Button>Download backup</Button>
        </div>
        <div style="margin-top:12px;">
          <FileUpload
            label="Restore from backup file"
            hint=".dashx backup files"
            accept=".dashx,application/zip"
          />
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
        <h3 style="color:#fff;font-size:14px;">SSH authorized keys</h3>
        <Callout variant="warn" title="SSH access is powerful">
          Authorized keys bypass password auth. Only add keys from devices you own and trust.
        </Callout>
        <p style="font-size:12px;color:#6E7079;margin:10px 0 10px;">Paste one public key per line. Accepted formats: ssh-rsa, ssh-ed25519, ecdsa-sha2-nistp256.</p>
        <Field label="Authorized keys" id="settings-ssh-keys">
          <Textarea id="settings-ssh-keys" rows={5} placeholder="ssh-ed25519 AAAA... user@host" style="font-family:'JetBrains Mono',monospace;font-size:12px;" />
        </Field>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Quick commands</h3>
        <p style="font-size:12px;color:#6E7079;margin:0 0 10px;">Useful CLI commands for device diagnostics via SSH.</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <CodeBlock language="sh" label="Show system info command" code="dashctl sysinfo" />
          <CodeBlock language="sh" label="Show interface status command" code="ip -br addr show" />
          <CodeBlock language="sh" label="Show active sessions command" code="cat /proc/net/nf_conntrack_count 2>/dev/null || conntrack -L -o extended | wc -l" />
        </div>
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
      <Callout variant="info" title="DHCP changes take effect immediately">
        Existing leases are not revoked. Clients will receive new settings on the next renewal cycle (typically within the lease time).
      </Callout>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Default network</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Network name" value="Default" />
          <CIDRInput label="Subnet" value="192.168.1.0/24" />
          <Field label="DHCP range" value="192.168.1.6 – 192.168.1.254" />
          <DurationInput label="Lease time (HH:MM:SS)" value={86400} maxHours={168} />
        </div>
        <RowToggle title="IGMP snooping" description="Optimize multicast on this network" on={true} />
        <RowToggle title="Multicast DNS" description="Forward mDNS across VLANs" on={false} />
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Networks</h3>
        <table style="margin-top:4px;">
          <caption class="sr-only">Networks</caption>
          <thead>
            <tr>
              <th scope="col">Name</th><th scope="col">VLAN</th><th scope="col">Subnet</th><th scope="col">Clients</th><th scope="col"></th>
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
      <Stepper
        steps={[
          { id: 'detect', label: 'Detected' },
          { id: 'configure', label: 'Configure' },
          { id: 'verify', label: 'Verify' },
          { id: 'online', label: 'Online' },
        ]}
        active="verify"
      />
      <Card>
        <h3 style="color:#fff;font-size:14px;">WAN1 <Pill variant="success">Online</Pill></h3>
        <div style="margin-bottom:14px;">
          <RadioGroup
            legend="Connection type"
            value="dhcp"
            horizontal={true}
            options={[
              { value: 'dhcp', label: 'DHCP', description: 'Automatic address from ISP' },
              { value: 'static', label: 'Static IP', description: 'Fixed address' },
              { value: 'pppoe', label: 'PPPoE', description: 'Username / password' },
            ]}
          />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <IPInput label="Public IP" value="185.42.118.214" />
          <IPInput label="Gateway" value="185.42.118.1" />
          <TagInput label="DNS servers" value={['1.1.1.1', '1.0.0.1']} placeholder="Add IP…" />
          <div style="display:flex;align-items:flex-end;gap:6px;">
            <NumberInput label="MTU" value={1500} min={576} max={9000} />
            <ContextualHelp
              placement="top"
              title="MTU (Maximum Transmission Unit)"
              body="Maximum packet size in bytes. 1500 is standard for Ethernet; PPPoE typically requires 1492. Jumbo frames use 9000."
            />
          </div>
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
    {:else if tab === 'WiFi'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">SSIDs</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="SSID name" value="Office-Net" />
          <PasswordInput label="WPA2 passphrase" value="s3cur3passw0rd" autocomplete="new-password" />
          <Field label="SSID name (guest)" value="Guest-Net" />
          <PasswordInput label="WPA2 passphrase (guest)" placeholder="Enter passphrase…" autocomplete="new-password" />
        </div>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">MAC filter</h3>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px;">
          <MACInput label="Allowed device 1" value="A4:C3:F0:11:22:33" />
          <MACInput label="Allowed device 2" value="DC:A6:32:AB:CD:EF" />
        </div>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">2.4 GHz radio</h3>
        <div style="display:flex;flex-direction:column;gap:16px;margin-top:6px;">
          <Slider label="Transmit power" bind:value={txPower2g} min={0} max={100} step={10} suffix="%" />
          <Slider label="RX sensitivity" bind:value={rxSensitivity} min={0} max={100} step={5} suffix="%" />
        </div>
        <RowToggle title="Auto channel" description="Select least congested channel automatically" on={true} />
        <RowToggle title="Band steering" description="Prefer 5 GHz for capable clients" on={true} />
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">5 GHz radio</h3>
        <div style="display:flex;flex-direction:column;gap:16px;margin-top:6px;">
          <Slider label="Transmit power" bind:value={txPower5g} min={0} max={100} step={10} suffix="%" />
        </div>
        <RowToggle title="Auto channel" description="Select least congested channel automatically" on={true} />
        <RowToggle title="DFS channels" description="Enable radar-protected DFS channels" on={false} />
        <RowToggle title="802.11k/v/r" description="Fast BSS transition and neighbour reports" on={true} />
      </Card>
    {:else if tab === 'VLANs'}
      <Card>
        <h3 style="color:#fff;font-size:14px;display:flex;align-items:center;">
          VLANs
          <Button style="margin-left:auto;font-size:11px;">+ Create VLAN</Button>
        </h3>
        <table style="margin-top:4px;">
          <caption class="sr-only">VLANs</caption>
          <thead>
            <tr>
              <th scope="col" style="width:28px;" aria-label="Label colour"></th>
              <th scope="col">Name</th><th scope="col">VLAN ID</th><th scope="col">Purpose</th><th scope="col">Isolation</th><th scope="col">DHCP</th>
            </tr>
          </thead>
          <tbody>
            {#each VLAN_ROWS as r}
              {@const swatch = COLOR_SWATCHES.find((s) => s.value === vlanColors[r.name])}
              <tr
                on:click={() => (selectedVlan = r.name)}
                style="cursor:pointer;{selectedVlan === r.name ? 'background:rgba(255,255,255,0.03);' : ''}"
              >
                <td>
                  <span
                    style="display:inline-block;width:12px;height:12px;border-radius:50%;background:{swatch?.color ?? '#6E7079'};vertical-align:middle;"
                    aria-hidden="true"
                  />
                </td>
                <td style="color:#fff;">{r.name}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:12px;">{r.id}</td>
                <td>{r.purpose}</td>
                <td style="color:#A4A7B5;">{r.isolation}</td>
                <td style="color:#A4A7B5;">{r.dhcp}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
          <ColorPicker
            label="Label colour — {selectedVlan}"
            value={selectedVlanColor}
            onChange={(v) => { vlanColors[selectedVlan] = v; vlanColors = vlanColors; }}
          />
        </div>
      </Card>
    {:else if tab === 'Routing'}
      <Card>
        <h3 style="color:#fff;font-size:14px;">Static routes</h3>
        <table style="margin-top:4px;">
          <caption class="sr-only">Static routes</caption>
          <thead>
            <tr><th scope="col">Destination</th><th scope="col">Next hop</th><th scope="col">Distance</th><th scope="col">Status</th></tr>
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
        <h3 style="color:#fff;font-size:14px;">Two-factor authentication</h3>
        <p style="font-size:13px;color:#A4A7B5;margin:6px 0 14px;">Enter the 6-digit code from your authenticator app to verify 2FA setup.</p>
        <div style="display:flex;flex-direction:column;gap:14px;">
          <OTPInput label="Verification code" bind:value={otpValue} />
          <div style="display:flex;gap:8px;">
            <Button variant="primary" disabled={otpValue.length < 6}>Verify</Button>
            <Button on:click={() => (otpValue = '')}>Reset</Button>
          </div>
        </div>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">RADIUS profiles</h3>
        <table style="margin-top:4px;">
          <caption class="sr-only">RADIUS profiles</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Auth server</th><th scope="col">Used by</th></tr></thead>
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
        <h3 style="color:#fff;font-size:14px;">Add RADIUS profile</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;">
          <Field label="Profile name">
            <Input placeholder="e.g. Corp 802.1X" />
          </Field>
          <Field label="Authentication server">
            <InputGroup suffix=":1812">
              <Input placeholder="hostname or IP" value="10.0.50.21" />
            </InputGroup>
          </Field>
          <Field label="Accounting server">
            <InputGroup suffix=":1813">
              <Input placeholder="hostname or IP" value="10.0.50.21" />
            </InputGroup>
          </Field>
          <Field label="Shared secret">
            <PasswordInput placeholder="RADIUS shared secret" />
          </Field>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <Button variant="primary">Add profile</Button>
          <Button>Cancel</Button>
        </div>
      </Card>
      <Card>
        <h3 style="color:#fff;font-size:14px;">Schedules</h3>
        <table style="margin-top:4px;">
          <caption class="sr-only">Schedules</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Days</th><th scope="col">Hours</th></tr></thead>
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
        <Accordion>
          <AccordionItem title="Performance" defaultOpen={true}>
            <RowToggle title="Hardware offload" description="Accelerate routing in NPU" on={true} />
            <RowToggle title="Smart DNS" description="Cache and filter queries locally" on={true} />
            <RowToggle title="Connectivity monitor" description="Probe gateway every 5 s" on={true} />
          </AccordionItem>
          <AccordionItem title="Diagnostics">
            <RowToggle title="Crash reports" description="Send kernel panics to Dash" on={true} />
            <RowToggle title="Debug logging" description="Verbose · increases write IO" on={false} />
          </AccordionItem>
          <AccordionItem title="Danger zone">
            <div style="display:flex;gap:8px;flex-wrap:wrap;padding-bottom:4px;">
              <Button>Restart console</Button>
              <Button>Forget all clients</Button>
              <Button variant="danger">Factory reset</Button>
            </div>
          </AccordionItem>
        </Accordion>
      </Card>
    {/if}
  </div>
</div>
