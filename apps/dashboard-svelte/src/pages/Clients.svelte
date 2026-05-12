<script lang="ts">
  import { SearchBox, Tabs, Signal, Checkbox, CopyButton, MultiSelect, BumpChart, Card, MarimekkoChart, CirclePacking, VennDiagram, VirtualList, SelectionToolbar } from '@w5-ui/svelte';
  import type { MultiSelectOption, BumpSeries, MarimekkoColumn, CirclePackItem, VennSet, VennIntersection, SelectionToolbarAction } from '@w5-ui/svelte';
  import { CLIENTS } from '../data';

  type LeaseRow = { name: string; ip: string; network: string; signal: 'strong' | 'weak' | null };
  const asLease = (x: unknown): LeaseRow => x as LeaseRow;
  const NETWORKS_SV = ['Office', 'Staff', 'Guest', 'IoT VLAN'];
  const SIGNALS_SV: Array<'strong' | 'weak' | null> = ['strong', 'strong', 'weak', null];
  const ALL_LEASES: LeaseRow[] = Array.from({ length: 200 }, (_, i) => ({
    name: `Client-${String(i + 1).padStart(3, '0')}`,
    ip: `192.168.${Math.floor(i / 254) + 1}.${(i % 254) + 1}`,
    network: NETWORKS_SV[i % NETWORKS_SV.length],
    signal: SIGNALS_SV[i % SIGNALS_SV.length],
  }));

  const CLIENT_RANK_LABELS = ['09:00', '10:00', '11:00', '12:00', '13:00'];

  const CLIENT_TRAFFIC_MIX: MarimekkoColumn[] = [
    { label: 'WiFi 5 GHz', segments: [
      { label: 'Streaming', value: 288, color: '#006FFF' },
      { label: 'Browsing',  value: 96,  color: '#4797FF' },
      { label: 'Gaming',    value: 72,  color: '#A78BFA' },
      { label: 'Other',     value: 24,  color: '#6E7079' },
    ]},
    { label: 'WiFi 2.4 GHz', segments: [
      { label: 'Streaming', value: 44,  color: '#006FFF' },
      { label: 'Browsing',  value: 68,  color: '#4797FF' },
      { label: 'Gaming',    value: 16,  color: '#A78BFA' },
      { label: 'Other',     value: 52,  color: '#6E7079' },
    ]},
    { label: 'Wired', segments: [
      { label: 'Streaming', value: 72,  color: '#006FFF' },
      { label: 'Browsing',  value: 96,  color: '#4797FF' },
      { label: 'Gaming',    value: 36,  color: '#A78BFA' },
      { label: 'Other',     value: 12,  color: '#6E7079' },
    ]},
    { label: 'VPN', segments: [
      { label: 'Streaming', value: 18,  color: '#006FFF' },
      { label: 'Browsing',  value: 36,  color: '#4797FF' },
      { label: 'Gaming',    value: 6,   color: '#A78BFA' },
      { label: 'Other',     value: 20,  color: '#6E7079' },
    ]},
  ];
  const CLIENT_RANK_SERIES: BumpSeries[] = [
    { label: 'MacBook Pro',  color: '#006FFF', ranks: [1, 2, 1, 1, 2] },
    { label: 'Desktop PC',   color: '#00C8C8', ranks: [2, 1, 2, 3, 1] },
    { label: 'iPhone 15',    color: '#F5A623', ranks: [3, 3, 4, 2, 3] },
    { label: 'iPad Pro',     color: '#7FB6FF', ranks: [4, 4, 3, 4, 4] },
    { label: 'Apple TV',     color: '#A878F5', ranks: [5, 5, 5, 5, 5] },
  ];
  const DEVICE_TYPES: CirclePackItem[] = [
    { id: 'laptop',     label: 'Laptop',  value: 38, color: '#006FFF' },
    { id: 'smartphone', label: 'Phone',   value: 51, color: '#00C875' },
    { id: 'tablet',     label: 'Tablet',  value: 14, color: '#F5A623' },
    { id: 'iot',        label: 'IoT',     value: 22, color: '#A78BFA' },
    { id: 'tv',         label: 'TV',      value: 9,  color: '#FF7B7B' },
    { id: 'gaming',     label: 'Gaming',  value: 6,  color: '#00C8C8' },
    { id: 'other',      label: 'Other',   value: 2,  color: '#6E7079' },
  ];

  const CONN_SETS: VennSet[] = [
    { id: 'wifi',  label: 'WiFi',  value: 88, color: '#006FFF' },
    { id: 'wired', label: 'Wired', value: 42, color: '#00C875' },
    { id: 'vpn',   label: 'VPN',   value: 12, color: '#A78BFA' },
  ];
  const CONN_INTERS: VennIntersection[] = [
    { sets: ['wifi', 'wired'], value: 5 },
    { sets: ['wifi', 'vpn'],   value: 7 },
  ];

  let tab = $state('all');
  let selected = $state(new Set<string>());
  let filters: string[] = $state([]);

  const CLIENT_FILTER_OPTIONS: MultiSelectOption[] = [
    { value: 'wireless', label: 'Type: Wireless' },
    { value: 'wired', label: 'Type: Wired' },
    { value: 'vpn', label: 'Type: VPN' },
    { value: '5ghz', label: 'Band: 5 GHz' },
    { value: '24ghz', label: 'Band: 2.4 GHz' },
    { value: 'default-net', label: 'Network: Default' },
    { value: 'iot', label: 'Network: IoT' },
    { value: 'blocked', label: 'Status: Blocked' },
  ];

  let allKeys = $derived(CLIENTS.map((c) => c[2]));
  let allSelected = $derived(allKeys.length > 0 && allKeys.every((k) => selected.has(k)));
  let someSelected = $derived(allKeys.some((k) => selected.has(k)));

  function toggleAll() {
    if (allSelected) selected = new Set();
    else selected = new Set(allKeys);
  }

  function toggleRow(key: string) {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    selected = next;
  }

  const selectionActions: SelectionToolbarAction[] = [
    { label: 'Block', variant: 'danger', onClick: () => { selected = new Set(); } },
    { label: 'Disconnect', onClick: () => { selected = new Set(); } },
    { label: 'Export', onClick: () => { selected = new Set(); } },
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Client Devices · 142</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search clients…" />
    <MultiSelect
      options={CLIENT_FILTER_OPTIONS}
      value={filters}
      on:change={(e) => { filters = e.detail; }}
      label="Filter clients"
      placeholder="Filter…"
    />
  </div>
</div>
<SelectionToolbar count={selected.size} actions={selectionActions} onClear={() => { selected = new Set(); }} />
<Tabs
  bind:active={tab}
  items={[
    { id: 'all', label: 'All', badge: 142 },
    { id: 'wired', label: 'Wired', badge: 42 },
    { id: 'wireless', label: 'Wireless', badge: 88 },
    { id: 'vpn', label: 'VPN', badge: 12 },
    { id: 'guest', label: 'Guest', badge: 7 },
  ]}
/>
<div class="grid" style="padding-top:0;">
  <Card span={4}>
    <h3>Device types <span class="unit">142 clients · circle size = count</span></h3>
    <CirclePacking
      items={DEVICE_TYPES}
      height={180}
      ariaLabel="Client device types: Phone 51, Laptop 38, IoT 22, Tablet 14, TV 9, Gaming 6, Other 2"
    />
  </Card>
  <Card span={8}>
    <h3>Top Clients by Usage Rank <span class="unit">Today · Bandwidth</span></h3>
    <BumpChart
      ariaLabel="Top client devices ranked by bandwidth usage from 09:00 to 13:00 today"
      labels={CLIENT_RANK_LABELS}
      series={CLIENT_RANK_SERIES}
    />
  </Card>
  <Card span={6}>
    <h3>Connectivity overlap <span class="unit">142 clients · shared connections</span></h3>
    <VennDiagram
      sets={CONN_SETS}
      intersections={CONN_INTERS}
      height={220}
      ariaLabel="Client connectivity overlap: WiFi 88 (76 exclusive), Wired 42 (37 exclusive), VPN 12 (5 exclusive). WiFi and Wired overlap: 5. WiFi and VPN overlap: 7."
    />
  </Card>
  <Card span={12}>
    <h3>Traffic mix by connection type <span class="unit">Column width = share of total · 24 h</span></h3>
    <MarimekkoChart
      columns={CLIENT_TRAFFIC_MIX}
      height={160}
      ariaLabel="Client traffic mix by connection type: WiFi 5GHz (Streaming 288, Browsing 96, Gaming 72, Other 24), WiFi 2.4GHz (Streaming 44, Browsing 68, Gaming 16, Other 52), Wired (Streaming 72, Browsing 96, Gaming 36, Other 12), VPN (Streaming 18, Browsing 36, Gaming 6, Other 20)"
    />
    <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
      {#each [
        { label: 'Streaming', color: '#006FFF' },
        { label: 'Browsing',  color: '#4797FF' },
        { label: 'Gaming',    color: '#A78BFA' },
        { label: 'Other',     color: '#6E7079' },
      ] as item (item.label)}
        <span style="display:flex;align-items:center;gap:6px;">
          <span style="width:10px;height:10px;border-radius:2px;background:{item.color};display:inline-block;" aria-hidden="true"></span>
          <span style="color:#A4A7B5;">{item.label}</span>
        </span>
      {/each}
    </div>
  </Card>
</div>
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
    <caption class="sr-only">Client devices</caption>
    <thead>
      <tr>
        <th scope="col" style="width:40px;">
          <Checkbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            on:change={toggleAll}
            aria-label="Select all clients"
          />
        </th>
        <th scope="col">Name</th>
        <th scope="col">IP / MAC</th>
        <th scope="col">Network</th>
        <th scope="col">Connected to</th>
        <th scope="col" style="text-align:right;">RX / TX</th>
        <th scope="col" style="text-align:right;">Signal</th>
      </tr>
    </thead>
    <tbody>
      {#each CLIENTS as c (c[2])}
        <tr style={selected.has(c[2]) ? 'background:rgba(0,111,255,0.06)' : ''}>
          <td>
            <Checkbox
              checked={selected.has(c[2])}
              on:change={() => toggleRow(c[2])}
              aria-label="Select {c[0]}"
            />
          </td>
          <td style="color:#fff;">{c[0]}</td>
          <td>
            <div style="display:flex;align-items:center;gap:4px;">
              <div>
                <div class="mac">{c[1]}</div>
                <div class="mac" style="font-size:10px;color:#4A4B53;">{c[2]}</div>
              </div>
              <CopyButton text={c[2]} label="Copy MAC address {c[2]}" />
            </div>
          </td>
          <td style="color:#A4A7B5;">{c[3]} · {c[4]}</td>
          <td style="color:#A4A7B5;">{c[5]}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{c[6]}</td>
          <td style="text-align:right;">
            {#if c[7]}<Signal weak={c[7] === 'weak'} />{:else}—{/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div style="margin-top:24px;">
  <Card>
    <h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#fff;">
      DHCP Leases · {ALL_LEASES.length}
    </h2>
    <VirtualList items={ALL_LEASES} itemHeight={40} height={320} label="DHCP lease list">
      {#snippet children({ item, index })}
          
          {#if item}
            {@const row = asLease(item)}
            <div class="vl-row" style="height:40px;">
              <span class="vl-row-name">{row.name}</span>
              <span class="vl-row-ip">{row.ip}</span>
              <span class="vl-row-badge" style="background:rgba(255,255,255,0.06);color:#A4A7B5;">{row.network}</span>
              <span style="width:20px;text-align:right;">
                {#if row.signal}<Signal weak={row.signal === 'weak'} />{:else}—{/if}
              </span>
            </div>
          {/if}
        
          {/snippet}
    </VirtualList>
  </Card>
</div>
