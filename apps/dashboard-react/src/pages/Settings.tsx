import {
  Card,
  Button,
  Pill,
  Field,
  Input,
  Toggle,
  RowToggle,
  RadioGroup,
  NumberInput,
  Textarea,
  Slider,
  Accordion,
  AccordionItem,
  Breadcrumb,
  Stepper,
  FileUpload,
  Combobox,
  SplitButton,
  IPInput,
  CodeBlock,
  TimePicker,
  PasswordInput,
  OTPInput,
  ColorPicker,
  COLOR_SWATCHES,
  MACInput,
  DurationInput,
  CIDRInput,
  Callout,
  InputGroup,
  Menubar,
  TagInput,
  ContextualHelp,
  toast,
} from '@w5-ui/react'
import type { ComboboxOption } from '@w5-ui/react'
import { useState, type ReactNode } from 'react'

const TAB_NAMES = [
  'System',
  'Console',
  'Network',
  'Internet',
  'WiFi',
  'VLANs',
  'Routing',
  'Profiles',
  'Advanced',
] as const
type SettingsTab = (typeof TAB_NAMES)[number]

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
]

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
]

const SETTINGS_MENUS = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'save', label: 'Save' },
      { id: 'save-apply', label: 'Save & apply now' },
      { id: 'sep1', label: '', separator: true },
      { id: 'export', label: 'Export config…' },
      { id: 'import', label: 'Import config…' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'reset', label: 'Reset to defaults' },
      { id: 'duplicate', label: 'Duplicate profile' },
      { id: 'sep2', label: '', separator: true },
      { id: 'revert', label: 'Revert changes' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'compact', label: 'Compact view' },
      { id: 'advanced', label: 'Show advanced settings' },
    ],
  },
]

export function Settings() {
  const [tab, setTab] = useState<SettingsTab>('System')
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Settings</div>
        <div className="ph-actions">
          <Button>Discard</Button>
          <SplitButton
            label="Save"
            variant="primary"
            onPrimaryClick={() => toast.success('Settings saved')}
            items={[
              { id: 'save-apply', label: 'Save & apply now' },
              { id: 'export', label: 'Export config…' },
            ]}
            onAction={(id) => {
              if (id === 'save-apply') toast.success('Saved & applying…')
              else toast.info('Config exported')
            }}
          />
        </div>
      </div>
      <div style={{ padding: '8px 24px 0' }}>
        <Menubar
          label="Settings toolbar"
          menus={SETTINGS_MENUS}
          onAction={(menuId, itemId) => {
            if (itemId === 'save' || itemId === 'save-apply') toast.success('Settings saved')
            else if (itemId === 'export') toast.info('Config exported')
            else if (itemId === 'import') toast.info('Import config…')
            else if (itemId === 'reset') toast.warn('Reset to defaults')
            else if (itemId === 'revert') toast.warn('Changes reverted')
            else toast.info(`${menuId} › ${itemId}`)
          }}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: 24,
          padding: '16px 24px 24px',
        }}
      >
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13 }}>
          {TAB_NAMES.map((s) => (
            <button
              key={s}
              type="button"
              className={`sb-item ${tab === s ? 'active' : ''}`}
              aria-current={tab === s ? 'page' : undefined}
              style={{ padding: '8px 10px' }}
              onClick={() => setTab(s)}
            >
              {s}
            </button>
          ))}
        </aside>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Breadcrumb items={[{ label: 'Settings' }, { label: tab }]} />
          <SettingsBody tab={tab} />
        </div>
      </div>
    </>
  )
}

function SystemCard() {
  const [country, setCountry] = useState('gb')
  const [timezone, setTimezone] = useState('Europe/London')
  const [maintStart, setMaintStart] = useState('03:00')
  const [maintEnd, setMaintEnd] = useState('05:00')
  return (
    <Card>
      <h3 style={{ color: '#fff', fontSize: 14 }}>System</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
        <Field label="Site name" defaultValue="Edge Gateway (Gateway)" />
        <div className="field">
          <label
            htmlFor="sys-country"
            style={{ fontSize: 12, color: '#A4A7B5', display: 'block', marginBottom: 4 }}
          >
            Country / Region
          </label>
          <Combobox
            id="sys-country"
            options={COUNTRY_OPTIONS}
            value={country}
            onChange={setCountry}
            placeholder="Search country…"
          />
        </div>
        <div className="field">
          <label
            htmlFor="sys-tz"
            style={{ fontSize: 12, color: '#A4A7B5', display: 'block', marginBottom: 4 }}
          >
            Timezone
          </label>
          <Combobox
            id="sys-tz"
            options={TIMEZONE_OPTIONS}
            value={timezone}
            onChange={setTimezone}
            placeholder="Search timezone…"
          />
        </div>
        <div className="field">
          <span style={{ fontSize: 12, color: '#A4A7B5', display: 'block', marginBottom: 6 }}>
            Maintenance window (Sundays)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TimePicker label="Start" value={maintStart} onChange={setMaintStart} />
            <span style={{ color: '#6E7079', fontSize: 13, marginTop: 18 }}>–</span>
            <TimePicker label="End" value={maintEnd} onChange={setMaintEnd} />
          </div>
        </div>
      </div>
    </Card>
  )
}

function SettingsBody({ tab }: { tab: SettingsTab }) {
  switch (tab) {
    case 'System':
      return (
        <>
          <SystemCard />
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Backup</h3>
            <RowToggle
              title="Auto-backup to Dash Cloud"
              description="Daily · last successful 04:00 today"
              on
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Button>Download backup</Button>
            </div>
            <div style={{ marginTop: 12 }}>
              <FileUpload
                label="Restore from backup file"
                hint=".dashx backup files"
                accept=".dashx,application/zip"
              />
            </div>
          </Card>
        </>
      )
    case 'Console':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Console</h3>
            {[
              ['Application updates', 'Automatically update Network, Protect, Access', true],
              ['Telemetry', 'Send anonymized diagnostic data to Dash', true],
              ['SSH', 'Enable shell access from local network', false],
              ['UI Beta channel', 'Receive early-access Dash releases', false],
              ['Remote access', 'Connect via Site Manager', true],
            ].map(([t, d, on]) => (
              <ToggleRowState
                key={t as string}
                title={t as string}
                description={d as string}
                initial={on as boolean}
              />
            ))}
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>SSH authorized keys</h3>
            <Callout variant="warn" title="SSH access is powerful">
              Authorized keys bypass password auth. Only add keys from devices you own and trust.
            </Callout>
            <p style={{ fontSize: 12, color: '#6E7079', margin: '10px 0 10px' }}>
              Paste one public key per line. Accepted formats: ssh-rsa, ssh-ed25519,
              ecdsa-sha2-nistp256.
            </p>
            <Field label="Authorized keys" id="settings-ssh-keys">
              <Textarea
                id="settings-ssh-keys"
                rows={5}
                placeholder="ssh-ed25519 AAAA... user@host"
                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}
              />
            </Field>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Quick commands</h3>
            <p style={{ fontSize: 12, color: '#6E7079', margin: '0 0 10px' }}>
              Useful CLI commands for device diagnostics via SSH.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CodeBlock language="sh" label="Show system info command" code="dashctl sysinfo" />
              <CodeBlock
                language="sh"
                label="Show interface status command"
                code="ip -br addr show"
              />
              <CodeBlock
                language="sh"
                label="Show active sessions command"
                code="cat /proc/net/nf_conntrack_count 2>/dev/null || conntrack -L -o extended | wc -l"
              />
            </div>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Hardware</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Model" defaultValue="EG-X1" />
              <Field label="Firmware" defaultValue="4.2.21 · up to date" />
              <Field label="Serial" defaultValue="F4E2C72A8B19" />
              <Field label="Storage" defaultValue="HDD 4 TB · 41% used" />
            </div>
          </Card>
        </>
      )
    case 'Network':
      return (
        <>
          <Callout variant="info" title="DHCP changes take effect immediately">
            Existing leases are not revoked. Clients will receive new settings on the next renewal
            cycle (typically within the lease time).
          </Callout>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Default network</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Network name" defaultValue="Default" />
              <CIDRInput label="Subnet" defaultValue="192.168.1.0/24" />
              <Field label="DHCP range" defaultValue="192.168.1.6 – 192.168.1.254" />
              <DurationInput label="Lease time (HH:MM:SS)" defaultValue={86400} maxHours={168} />
            </div>
            <ToggleRowState
              title="IGMP snooping"
              description="Optimize multicast on this network"
              initial
            />
            <ToggleRowState
              title="Multicast DNS"
              description="Forward mDNS across VLANs"
              initial={false}
            />
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Networks</h3>
            <table style={{ marginTop: 4 }}>
              <caption className="sr-only">Networks</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">VLAN</th>
                  <th scope="col">Subnet</th>
                  <th scope="col">Clients</th>
                  <th scope="col" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {[
                  ['Default', '1', '192.168.1.0/24', '142'],
                  ['IoT', '20', '192.168.20.0/24', '38'],
                  ['Guest', '30', '192.168.30.0/24', '9'],
                  ['Cameras', '40', '192.168.40.0/24', '12'],
                  ['Servers', '50', '10.0.50.0/24', '7'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td style={{ color: '#fff' }}>{r[0]}</td>
                    <td
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 12,
                        color: '#A4A7B5',
                      }}
                    >
                      {r[1]}
                    </td>
                    <td
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 12,
                        color: '#A4A7B5',
                      }}
                    >
                      {r[2]}
                    </td>
                    <td>{r[3]}</td>
                    <td style={{ textAlign: 'right', color: '#6E7079' }}>›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )
    case 'Internet':
      return (
        <>
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
            <h3 style={{ color: '#fff', fontSize: 14 }}>
              WAN1 <Pill variant="success">Online</Pill>
            </h3>
            <div style={{ marginBottom: 14 }}>
              <RadioGroup
                legend="Connection type"
                defaultValue="dhcp"
                horizontal
                options={[
                  { value: 'dhcp', label: 'DHCP', description: 'Automatic address from ISP' },
                  { value: 'static', label: 'Static IP', description: 'Fixed address' },
                  { value: 'pppoe', label: 'PPPoE', description: 'Username / password' },
                ]}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <IPInput label="Public IP" defaultValue="185.42.118.214" />
              <IPInput label="Gateway" defaultValue="185.42.118.1" />
              <TagInput
                label="DNS servers"
                defaultValue={['1.1.1.1', '1.0.0.1']}
                placeholder="Add IP…"
              />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <NumberInput label="MTU" defaultValue={1500} min={576} max={9000} />
                <ContextualHelp
                  placement="top"
                  title="MTU (Maximum Transmission Unit)"
                  body="Maximum packet size in bytes. 1500 is standard for Ethernet; PPPoE typically requires 1492. Jumbo frames use 9000."
                />
              </div>
              <Field label="Uptime" defaultValue="42d 6h 12m" />
            </div>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>
              WAN2 (Failover){' '}
              <span
                className="pill"
                style={{ color: '#A4A7B5', background: 'rgba(255,255,255,0.06)' }}
              >
                Standby
              </span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Connection" defaultValue="LTE Modem" />
              <Field label="Carrier" defaultValue="Vodafone UK" />
              <Field label="Signal" defaultValue="-71 dBm · Excellent" />
              <Field label="Failover threshold" defaultValue="3 consecutive failures" />
            </div>
            <ToggleRowState
              title="Smart Queues (QoS)"
              description="Prioritize realtime traffic"
              initial
            />
            <ToggleRowState title="IPv6 prefix delegation" description="/56 from ISP" initial />
          </Card>
        </>
      )
    case 'WiFi':
      return <WifiSettings />
    case 'VLANs':
      return <VLANCard />
    case 'Routing':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Static routes</h3>
            <table style={{ marginTop: 4 }}>
              <caption className="sr-only">Static routes</caption>
              <thead>
                <tr>
                  <th scope="col">Destination</th>
                  <th scope="col">Next hop</th>
                  <th scope="col">Distance</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['10.10.0.0/16', '192.168.1.254', '5', 'Active'],
                  ['172.16.20.0/24', 'VPN-WG', '10', 'Active'],
                  ['203.0.113.0/24', '185.42.118.1', '15', 'Inactive'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 12,
                        color: '#fff',
                      }}
                    >
                      {r[0]}
                    </td>
                    <td
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 12,
                        color: '#A4A7B5',
                      }}
                    >
                      {r[1]}
                    </td>
                    <td>{r[2]}</td>
                    <td>
                      {r[3] === 'Active' ? (
                        <Pill variant="success">{r[3]}</Pill>
                      ) : (
                        <span
                          className="pill"
                          style={{ color: '#6E7079', background: 'rgba(255,255,255,0.06)' }}
                        >
                          <span className="dot" />
                          {r[3]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Dynamic routing</h3>
            <ToggleRowState title="OSPF" description="Open Shortest Path First" initial={false} />
            <ToggleRowState title="BGP" description="Border Gateway Protocol" initial={false} />
            <ToggleRowState title="Multicast routing" description="PIM-SM" initial={false} />
          </Card>
        </>
      )
    case 'Profiles':
      return (
        <>
          <TwoFactorCard />
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>RADIUS profiles</h3>
            <table style={{ marginTop: 4 }}>
              <caption className="sr-only">RADIUS profiles</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Auth server</th>
                  <th scope="col">Used by</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Corp 802.1X', '10.0.50.21:1812', 'Default, Mgmt'],
                  ['Guest portal', 'radius.local:1812', 'Guest'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td style={{ color: '#fff' }}>{r[0]}</td>
                    <td
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 12,
                        color: '#A4A7B5',
                      }}
                    >
                      {r[1]}
                    </td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Add RADIUS profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Profile name">
                <Input placeholder="e.g. Corp 802.1X" />
              </Field>
              <Field label="Authentication server">
                <InputGroup suffix=":1812">
                  <Input placeholder="hostname or IP" defaultValue="10.0.50.21" />
                </InputGroup>
              </Field>
              <Field label="Accounting server">
                <InputGroup suffix=":1813">
                  <Input placeholder="hostname or IP" defaultValue="10.0.50.21" />
                </InputGroup>
              </Field>
              <Field label="Shared secret">
                <PasswordInput placeholder="RADIUS shared secret" />
              </Field>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button variant="primary">Add profile</Button>
              <Button>Cancel</Button>
            </div>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Schedules</h3>
            <table style={{ marginTop: 4 }}>
              <caption className="sr-only">Schedules</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Days</th>
                  <th scope="col">Hours</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Business hours', 'Mon–Fri', '08:00 – 18:00'],
                  ['Quiet', 'Daily', '22:00 – 06:00'],
                  ['Weekend', 'Sat–Sun', 'All day'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td style={{ color: '#fff' }}>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 12,
                        color: '#A4A7B5',
                      }}
                    >
                      {r[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )
    case 'Advanced':
      return (
        <Card>
          <Accordion>
            <AccordionItem title="Performance" defaultOpen>
              <ToggleRowState
                title="Hardware offload"
                description="Accelerate routing in NPU"
                initial
              />
              <ToggleRowState
                title="Smart DNS"
                description="Cache and filter queries locally"
                initial
              />
              <ToggleRowState
                title="Connectivity monitor"
                description="Probe gateway every 5 s"
                initial
              />
            </AccordionItem>
            <AccordionItem title="Diagnostics">
              <ToggleRowState
                title="Crash reports"
                description="Send kernel panics to Dash"
                initial
              />
              <ToggleRowState
                title="Debug logging"
                description="Verbose · increases write IO"
                initial={false}
              />
            </AccordionItem>
            <AccordionItem title="Danger zone">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 4 }}>
                <Button>Restart console</Button>
                <Button>Forget all clients</Button>
                <Button variant="danger">Factory reset</Button>
              </div>
            </AccordionItem>
          </Accordion>
        </Card>
      )
  }
}

function WifiSettings() {
  const [txPower2g, setTxPower2g] = useState(80)
  const [txPower5g, setTxPower5g] = useState(100)
  const [rxSensitivity, setRxSensitivity] = useState(50)
  return (
    <>
      <Card>
        <h3 style={{ color: '#fff', fontSize: 14 }}>SSIDs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
          <Field label="SSID name" defaultValue="Office-Net" />
          <PasswordInput
            label="WPA2 passphrase"
            defaultValue="s3cur3passw0rd"
            autocomplete="new-password"
          />
          <Field label="SSID name (guest)" defaultValue="Guest-Net" />
          <PasswordInput
            label="WPA2 passphrase (guest)"
            placeholder="Enter passphrase…"
            autocomplete="new-password"
          />
        </div>
      </Card>
      <Card>
        <h3 style={{ color: '#fff', fontSize: 14 }}>MAC filter</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
          <MACInput label="Allowed device 1" defaultValue="A4:C3:F0:11:22:33" />
          <MACInput label="Allowed device 2" defaultValue="DC:A6:32:AB:CD:EF" />
        </div>
      </Card>
      <Card>
        <h3 style={{ color: '#fff', fontSize: 14 }}>2.4 GHz radio</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6 }}>
          <Slider
            label="Transmit power"
            value={txPower2g}
            min={0}
            max={100}
            step={10}
            suffix="%"
            onChange={setTxPower2g}
          />
          <Slider
            label="RX sensitivity"
            value={rxSensitivity}
            min={0}
            max={100}
            step={5}
            suffix="%"
            onChange={setRxSensitivity}
          />
        </div>
        <ToggleRowState
          title="Auto channel"
          description="Select least congested channel automatically"
          initial
        />
        <ToggleRowState
          title="Band steering"
          description="Prefer 5 GHz for capable clients"
          initial
        />
      </Card>
      <Card>
        <h3 style={{ color: '#fff', fontSize: 14 }}>5 GHz radio</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6 }}>
          <Slider
            label="Transmit power"
            value={txPower5g}
            min={0}
            max={100}
            step={10}
            suffix="%"
            onChange={setTxPower5g}
          />
        </div>
        <ToggleRowState
          title="Auto channel"
          description="Select least congested channel automatically"
          initial
        />
        <ToggleRowState
          title="DFS channels"
          description="Enable radar-protected DFS channels"
          initial={false}
        />
        <ToggleRowState
          title="802.11k/v/r"
          description="Fast BSS transition and neighbour reports"
          initial
        />
      </Card>
    </>
  )
}

const VLAN_ROWS = [
  {
    name: 'Default',
    id: '1',
    purpose: 'Corporate LAN',
    isolation: '—',
    dhcp: 'Yes',
    color: 'blue',
  },
  {
    name: 'IoT',
    id: '20',
    purpose: 'Smart home',
    isolation: 'Isolated',
    dhcp: 'Yes',
    color: 'amber',
  },
  {
    name: 'Guest',
    id: '30',
    purpose: 'Captive portal',
    isolation: 'Isolated',
    dhcp: 'Yes',
    color: 'green',
  },
  {
    name: 'Cameras',
    id: '40',
    purpose: 'Camera Service',
    isolation: 'Isolated from LAN',
    dhcp: 'Yes',
    color: 'purple',
  },
  {
    name: 'Servers',
    id: '50',
    purpose: 'Rack / NAS',
    isolation: '—',
    dhcp: 'Static',
    color: 'teal',
  },
  {
    name: 'Mgmt',
    id: '99',
    purpose: 'Switch/AP mgmt',
    isolation: 'Isolated',
    dhcp: 'Yes',
    color: 'slate',
  },
] as const

function VLANCard() {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(VLAN_ROWS.map((r) => [r.name, r.color])),
  )
  const [selected, setSelected] = useState<string>(VLAN_ROWS[0].name)

  return (
    <Card>
      <h3 style={{ color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center' }}>
        VLANs
        <Button style={{ marginLeft: 'auto', fontSize: 11 }}>+ Create VLAN</Button>
      </h3>
      <table style={{ marginTop: 4 }}>
        <caption className="sr-only">VLANs</caption>
        <thead>
          <tr>
            <th scope="col" style={{ width: 28 }} aria-label="Label colour" />
            <th scope="col">Name</th>
            <th scope="col">VLAN ID</th>
            <th scope="col">Purpose</th>
            <th scope="col">Isolation</th>
            <th scope="col">DHCP</th>
          </tr>
        </thead>
        <tbody>
          {VLAN_ROWS.map((r) => {
            const swatch = COLOR_SWATCHES.find((s) => s.value === colors[r.name])
            return (
              <tr
                key={r.name}
                onClick={() => setSelected(r.name)}
                style={{
                  cursor: 'pointer',
                  background: selected === r.name ? 'rgba(255,255,255,0.03)' : undefined,
                }}
              >
                <td aria-label="Colour">
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: swatch?.color ?? '#6E7079',
                      verticalAlign: 'middle',
                    }}
                    aria-hidden="true"
                  />
                </td>
                <td style={{ color: '#fff' }}>{r.name}</td>
                <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{r.id}</td>
                <td>{r.purpose}</td>
                <td style={{ color: '#A4A7B5' }}>{r.isolation}</td>
                <td style={{ color: '#A4A7B5' }}>{r.dhcp}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <ColorPicker
          label={`Label colour — ${selected}`}
          value={colors[selected]}
          onChange={(v) => setColors((prev) => ({ ...prev, [selected]: v }))}
        />
      </div>
    </Card>
  )
}

function TwoFactorCard() {
  const [otp, setOtp] = useState('')
  return (
    <Card>
      <h3 style={{ color: '#fff', fontSize: 14 }}>Two-factor authentication</h3>
      <p style={{ fontSize: 13, color: '#A4A7B5', margin: '6px 0 14px' }}>
        Enter the 6-digit code from your authenticator app to verify 2FA setup.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <OTPInput label="Verification code" value={otp} onChange={setOtp} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" disabled={otp.length < 6}>
            Verify
          </Button>
          <Button onClick={() => setOtp('')}>Reset</Button>
        </div>
      </div>
    </Card>
  )
}

function ToggleRowState({
  title,
  description,
  initial,
}: {
  title: string
  description: string
  initial: boolean
}) {
  const [on, setOn] = useState(initial)
  return (
    <RowToggle title={title} description={description} on={on} onToggle={() => setOn((v) => !v)} />
  )
}

void Input
void Toggle
void (null as ReactNode)
