<script lang="ts">
  import {
    SkipLink,
    Topbar,
    Sidebar,
    Modal,
    Field,
    Pill,
    Button,
    Toaster,
    CommandPalette,
    type CommandItem,
    DashboardIcon,
    DevicesIcon,
    ClientsIcon,
    TopologyIcon,
    AlarmIcon,
    LogsIcon,
    WifiIcon,
    PortsIcon,
    VpnIcon,
    SecurityIcon,
    SettingsIcon,
    AirviewIcon,
    InfraIcon,
    IntegrationsIcon,
    type SidebarSectionDef,
  } from '@dash-ui/svelte';

  import Dashboard from './pages/Dashboard.svelte';
  import Topology from './pages/Topology.svelte';
  import Devices from './pages/Devices.svelte';
  import Clients from './pages/Clients.svelte';
  import Alarms from './pages/Alarms.svelte';
  import Logs from './pages/Logs.svelte';
  import Wifi from './pages/Wifi.svelte';
  import Ports from './pages/Ports.svelte';
  import Vpn from './pages/Vpn.svelte';
  import Security from './pages/Security.svelte';
  import Settings from './pages/Settings.svelte';
  import AirView from './pages/AirView.svelte';
  import Infrastructure from './pages/Infrastructure.svelte';
  import Integrations from './pages/Integrations.svelte';

  import { onMount, onDestroy } from 'svelte';

  let activeApp = 'system';
  let page = 'topology';
  let adoptOpen = false;
  let cmdOpen = false;

  const SECTIONS: SidebarSectionDef[] = [
    {
      title: 'Manage',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'devices', label: 'Devices', icon: DevicesIcon, count: 12 },
        { id: 'clients', label: 'Client Devices', icon: ClientsIcon, count: 142 },
        { id: 'topology', label: 'Topology', icon: TopologyIcon },
        { id: 'alarms', label: 'Alarm Manager', icon: AlarmIcon, pill: 3 },
        { id: 'logs', label: 'Logs', icon: LogsIcon },
      ],
    },
    {
      title: 'Configure',
      items: [
        { id: 'wifi', label: 'Wi-Fi', icon: WifiIcon },
        { id: 'ports', label: 'Ports', icon: PortsIcon },
        { id: 'vpn', label: 'VPN', icon: VpnIcon },
        { id: 'security', label: 'Security', icon: SecurityIcon },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ],
    },
    {
      title: 'Insights',
      items: [
        { id: 'airview', label: 'AirView', icon: AirviewIcon },
        { id: 'infra', label: 'Infrastructure', icon: InfraIcon },
        { id: 'integrations', label: 'Integrations', icon: IntegrationsIcon },
      ],
    },
  ];

  const PAGE_LABELS: Record<string, string> = Object.fromEntries(
    SECTIONS.flatMap((s) => s.items).map((i) => [i.id, i.label]),
  );

  $: pageLabel = PAGE_LABELS[page] ?? page;

  const SHORTCUTS: Record<string, string> = {
    dashboard: 'G+D',
    devices: 'G+V',
    clients: 'G+C',
    topology: 'G+T',
    alarms: 'G+A',
    logs: 'G+L',
    settings: 'G+S',
  };

  const cmdItems: CommandItem[] = SECTIONS.flatMap((s) =>
    s.items.map((i) => ({ id: i.id, label: i.label, group: s.title, shortcut: SHORTCUTS[i.id] })),
  );

  function handleCmdKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      cmdOpen = !cmdOpen;
    }
  }

  onMount(() => window.addEventListener('keydown', handleCmdKey));
  onDestroy(() => window.removeEventListener('keydown', handleCmdKey));
</script>

<svelte:head>
  <title>{pageLabel} · Dash UI</title>
</svelte:head>

<div class="app">
  <SkipLink />
  <Topbar siteName="Demo cluster" bind:activeApp />
  <div class="workspace">
    <Sidebar sections={SECTIONS} bind:activeId={page} />
    <main class="content" id="main-content" tabindex="-1" aria-labelledby="page-title">
      <h1 id="page-title" class="sr-only">{pageLabel}</h1>
      {#if page === 'dashboard'}<Dashboard on:adopt={() => (adoptOpen = true)} />
      {:else if page === 'devices'}<Devices on:adopt={() => (adoptOpen = true)} />
      {:else if page === 'clients'}<Clients />
      {:else if page === 'topology'}<Topology />
      {:else if page === 'alarms'}<Alarms />
      {:else if page === 'logs'}<Logs />
      {:else if page === 'wifi'}<Wifi />
      {:else if page === 'ports'}<Ports />
      {:else if page === 'vpn'}<Vpn />
      {:else if page === 'security'}<Security />
      {:else if page === 'settings'}<Settings />
      {:else if page === 'airview'}<AirView />
      {:else if page === 'infra'}<Infrastructure />
      {:else if page === 'integrations'}<Integrations />
      {/if}
    </main>
  </div>

  <Toaster />

  <CommandPalette
    open={cmdOpen}
    items={cmdItems}
    on:select={(e) => { page = e.detail; cmdOpen = false; }}
    on:close={() => (cmdOpen = false)}
  />

  <Modal bind:open={adoptOpen} title="Adopt Device">
    <div style="display:flex;gap:12px;align-items:center;padding:10px 12px;background:#0A0A0B;border:1px solid rgba(255,255,255,0.08);border-radius:8px;margin-bottom:14px;">
      <div class="dr-thumb" style="width:40px;height:40px;font-size:8px;">U7 PRO</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:#fff;">AP Pro · Warehouse</div>
        <div style="font-size:11px;color:#6E7079;font-family:'JetBrains Mono',monospace;">f4:b1:00:aa:bb:c2 · 192.168.1.19</div>
      </div>
      <Pill variant="info">Pending</Pill>
    </div>
    <Field label="Device name" value="AP Pro · Warehouse" />
    <Field label="Site" value="Demo cluster" />
    <svelte:fragment slot="footer">
      <Button on:click={() => (adoptOpen = false)}>Cancel</Button>
      <Button variant="primary" on:click={() => (adoptOpen = false)}>Adopt</Button>
    </svelte:fragment>
  </Modal>
</div>
