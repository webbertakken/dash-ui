import { useState, type ReactNode } from 'react';
import { Card, Button, Pill, Field, Input, Toggle, RowToggle } from '@dash-ui/react';

const TAB_NAMES = ['System', 'Console', 'Network', 'Internet', 'VLANs', 'Routing', 'Profiles', 'Advanced'] as const;
type SettingsTab = (typeof TAB_NAMES)[number];

export function Settings() {
  const [tab, setTab] = useState<SettingsTab>('System');
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Settings</div>
        <div className="ph-actions">
          <Button>Discard</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, padding: '16px 24px 24px' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13 }}>
          {TAB_NAMES.map((s) => (
            <a
              key={s}
              className={`sb-item ${tab === s ? 'active' : ''}`}
              style={{ padding: '8px 10px' }}
              onClick={() => setTab(s)}
            >
              {s}
            </a>
          ))}
        </aside>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SettingsBody tab={tab} />
        </div>
      </div>
    </>
  );
}

function SettingsBody({ tab }: { tab: SettingsTab }) {
  switch (tab) {
    case 'System':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>System</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Site name" defaultValue="Edge Gateway (Gateway)" />
              <Field label="Country / Region" defaultValue="United Kingdom" />
              <Field label="Timezone" defaultValue="Europe/London (GMT+1)" />
              <Field label="Update schedule" defaultValue="Sundays · 03:00" />
            </div>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Backup</h3>
            <RowToggle title="Auto-backup to Dash Cloud" description="Daily · last successful 04:00 today" on />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Button>Download backup</Button>
              <Button>Restore from file</Button>
            </div>
          </Card>
        </>
      );
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
              <ToggleRowState key={t as string} title={t as string} description={d as string} initial={on as boolean} />
            ))}
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
      );
    case 'Network':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Default network</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Network name" defaultValue="Default" />
              <Field label="Gateway / Subnet" defaultValue="192.168.1.1/24" />
              <Field label="DHCP range" defaultValue="192.168.1.6 – 192.168.1.254" />
              <Field label="Lease time" defaultValue="86400 s" />
            </div>
            <ToggleRowState title="IGMP snooping" description="Optimize multicast on this network" initial />
            <ToggleRowState title="Multicast DNS" description="Forward mDNS across VLANs" initial={false} />
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Networks</h3>
            <table style={{ marginTop: 4 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>VLAN</th>
                  <th>Subnet</th>
                  <th>Clients</th>
                  <th />
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
                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{r[1]}</td>
                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{r[2]}</td>
                    <td>{r[3]}</td>
                    <td style={{ textAlign: 'right', color: '#6E7079' }}>›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      );
    case 'Internet':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>
              WAN1 <Pill variant="success">Online</Pill>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Connection" defaultValue="DHCP" />
              <Field label="Public IP" defaultValue="185.42.118.214" />
              <Field label="Gateway" defaultValue="185.42.118.1" />
              <Field label="DNS" defaultValue="1.1.1.1, 1.0.0.1" />
              <Field label="MTU" defaultValue="1500" />
              <Field label="Uptime" defaultValue="42d 6h 12m" />
            </div>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>
              WAN2 (Failover){' '}
              <span className="pill" style={{ color: '#A4A7B5', background: 'rgba(255,255,255,0.06)' }}>
                Standby
              </span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
              <Field label="Connection" defaultValue="LTE Modem" />
              <Field label="Carrier" defaultValue="Vodafone UK" />
              <Field label="Signal" defaultValue="-71 dBm · Excellent" />
              <Field label="Failover threshold" defaultValue="3 consecutive failures" />
            </div>
            <ToggleRowState title="Smart Queues (QoS)" description="Prioritize realtime traffic" initial />
            <ToggleRowState title="IPv6 prefix delegation" description="/56 from ISP" initial />
          </Card>
        </>
      );
    case 'VLANs':
      return (
        <Card>
          <h3 style={{ color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center' }}>
            VLANs
            <Button style={{ marginLeft: 'auto', fontSize: 11 }}>+ Create VLAN</Button>
          </h3>
          <table style={{ marginTop: 4 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>VLAN ID</th>
                <th>Purpose</th>
                <th>Isolation</th>
                <th>DHCP</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Default', '1', 'Corporate LAN', '—', 'Yes'],
                ['IoT', '20', 'Smart home', 'Isolated', 'Yes'],
                ['Guest', '30', 'Captive portal', 'Isolated', 'Yes'],
                ['Cameras', '40', 'Camera Service', 'Isolated from LAN', 'Yes'],
                ['Servers', '50', 'Rack / NAS', '—', 'Static'],
                ['Mgmt', '99', 'Switch/AP mgmt', 'Isolated', 'Yes'],
              ].map((r) => (
                <tr key={r[0]}>
                  <td style={{ color: '#fff' }}>{r[0]}</td>
                  <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[3]}</td>
                  <td style={{ color: '#A4A7B5' }}>{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      );
    case 'Routing':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Static routes</h3>
            <table style={{ marginTop: 4 }}>
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Next hop</th>
                  <th>Distance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['10.10.0.0/16', '192.168.1.254', '5', 'Active'],
                  ['172.16.20.0/24', 'VPN-WG', '10', 'Active'],
                  ['203.0.113.0/24', '185.42.118.1', '15', 'Inactive'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#fff' }}>{r[0]}</td>
                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>
                      {r[3] === 'Active' ? (
                        <Pill variant="success">{r[3]}</Pill>
                      ) : (
                        <span className="pill" style={{ color: '#6E7079', background: 'rgba(255,255,255,0.06)' }}>
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
      );
    case 'Profiles':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>RADIUS profiles</h3>
            <table style={{ marginTop: 4 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Auth server</th>
                  <th>Used by</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Corp 802.1X', '10.0.50.21:1812', 'Default, Mgmt'],
                  ['Guest portal', 'radius.local:1812', 'Guest'],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td style={{ color: '#fff' }}>{r[0]}</td>
                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Schedules</h3>
            <table style={{ marginTop: 4 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Days</th>
                  <th>Hours</th>
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
                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#A4A7B5' }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      );
    case 'Advanced':
      return (
        <>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Advanced</h3>
            <ToggleRowState title="Hardware offload" description="Accelerate routing in NPU" initial />
            <ToggleRowState title="Smart DNS" description="Cache and filter queries locally" initial />
            <ToggleRowState title="Connectivity monitor" description="Probe gateway every 5 s" initial />
            <ToggleRowState title="Crash reports" description="Send kernel panics to Dash" initial />
            <ToggleRowState title="Debug logging" description="Verbose · increases write IO" initial={false} />
          </Card>
          <Card>
            <h3 style={{ color: '#fff', fontSize: 14 }}>Danger zone</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button>Restart console</Button>
              <Button>Forget all clients</Button>
              <Button variant="danger">Factory reset</Button>
            </div>
          </Card>
        </>
      );
  }
}

function ToggleRowState({ title, description, initial }: { title: string; description: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return <RowToggle title={title} description={description} on={on} onToggle={() => setOn((v) => !v)} />;
}

void Input;
void Toggle;
void (null as ReactNode);
