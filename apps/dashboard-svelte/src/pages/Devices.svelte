<script lang="ts">
  import { Button, SearchBox, Tabs, Signal, StatusIndicator, Pagination, Select, SortHeader, ActionMenu, Popover, Drawer, HoverCard, ConfirmDialog, JsonViewer, KVTable, KanbanBoard, ColumnToggle } from '@dash-ui/svelte';
  import type { ActionMenuItem, KanbanColumn, ColumnToggleDef } from '@dash-ui/svelte';
  import { DEVICES, type DeviceRow } from '../data';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ adopt: void }>();
  let tab = 'all';
  let page = 1;
  let pageSize = 5;
  let sortKey: string | null = null;
  let sortDir: 'asc' | 'desc' = 'asc';
  let drawerDevice: DeviceRow | null = null;
  let drawerOpen = false;
  let forgetDevice: DeviceRow | null = null;

  function onSort(key: string) {
    if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortKey = key; sortDir = 'asc'; }
    page = 1;
  }

  $: sorted = sortKey
    ? [...DEVICES].sort((a, b) => {
        if (sortKey === 'name') {
          const cmp = a[0].localeCompare(b[0]);
          return sortDir === 'asc' ? cmp : -cmp;
        }
        if (sortKey === 'clients') {
          const av = a[5] === '—' ? -1 : Number(a[5]);
          const bv = b[5] === '—' ? -1 : Number(b[5]);
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return 0;
      })
    : DEVICES;

  $: rows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const BOARD_DEFS = [
    { id: 'connected', title: 'Connected', color: '#00B070', match: (r: DeviceRow) => r[7].startsWith('Connected') },
    { id: 'updating', title: 'Updating', color: '#F5A623', match: (r: DeviceRow) => r[7].startsWith('Updating') },
    { id: 'adopting', title: 'Adopting', color: '#006FFF', match: (r: DeviceRow) => r[7].startsWith('Adopting') },
    { id: 'offline', title: 'Offline', color: '#F03A3A', match: (r: DeviceRow) => r[7].startsWith('Offline') },
  ];

  let boardCols: KanbanColumn[] = BOARD_DEFS.map(col => ({
    id: col.id,
    title: col.title,
    color: col.color,
    cards: DEVICES.filter(col.match).map(r => ({ id: r[2], title: r[0], subtitle: r[1], meta: r[7] })),
  }));

  function handleCardMove(cardId: string, fromColId: string, toColId: string) {
    const fromCol = boardCols.find(c => c.id === fromColId);
    const card = fromCol?.cards.find(c => c.id === cardId);
    if (!card) return;
    boardCols = boardCols.map(col => {
      if (col.id === fromColId) return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
      if (col.id === toColId) return { ...col, cards: [...col.cards, card] };
      return col;
    });
  }

  const deviceActions: ActionMenuItem[] = [
    { id: 'details', label: 'View details' },
    { id: 'restart', label: 'Restart' },
    { id: 'forget', label: 'Forget device', danger: true },
  ];

  const deviceColumns: ColumnToggleDef[] = [
    { key: 'name', label: 'Name / Model', required: true },
    { key: 'mac', label: 'MAC / IP' },
    { key: 'site', label: 'Site' },
    { key: 'uptime', label: 'Uptime' },
    { key: 'clients', label: 'Clients' },
    { key: 'signal', label: 'Signal' },
    { key: 'status', label: 'Status' },
  ];
  let visibleCols = new Set(deviceColumns.map(c => c.key));
  const perPageOptions = [
    { value: '5', label: '5 per page' },
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
  ];
</script>

<div class="ph-bar">
  <div class="ph-title">Devices</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search devices…" />
    <Popover label="Filter" title="Filter" placement="bottom-end">
      <fieldset>
        <legend>Status</legend>
        {#each ['Online', 'Updating', 'Offline'] as s}
          <label class="checkbox-label" style="display:flex;padding:4px 0;">
            <input type="checkbox" class="checkbox" checked={s === 'Online'} />
            {s}
          </label>
        {/each}
      </fieldset>
      <fieldset>
        <legend>Type</legend>
        {#each ['Gateway', 'Switch', 'Access Point', 'Camera'] as t}
          <label class="checkbox-label" style="display:flex;padding:4px 0;">
            <input type="checkbox" class="checkbox" checked />
            {t}
          </label>
        {/each}
      </fieldset>
    </Popover>
    <ColumnToggle columns={deviceColumns} visible={visibleCols} onChange={(v) => { visibleCols = v; }} />
    <Button variant="primary" on:click={() => dispatch('adopt')}>Adopt Device</Button>
  </div>
</div>
<Tabs
  bind:active={tab}
  on:change={() => { page = 1; }}
  items={[
    { id: 'all', label: 'All', badge: 12 },
    { id: 'gw', label: 'Gateways', badge: 1 },
    { id: 'sw', label: 'Switches', badge: 2 },
    { id: 'wifi', label: 'Wi-Fi', badge: 6 },
    { id: 'cam', label: 'Cameras', badge: 3 },
    { id: 'pending', label: 'Pending', badge: 1 },
    { id: 'board', label: 'Board' },
  ]}
/>
{#if tab === 'board'}
  <div style="padding:16px 24px 24px;">
    <KanbanBoard columns={boardCols} onCardMove={handleCardMove} ariaLabel="Devices by status" />
  </div>
{:else}
<div style="padding:0 24px 24px;">
  <table style="background:#141415;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
    <caption class="sr-only">Devices</caption>
    <thead>
      <tr>
        <SortHeader sortKey="name" activeKey={sortKey} dir={sortDir} on:sort={(e) => onSort(e.detail)}>Name / Model</SortHeader>
        {#if visibleCols.has('mac')}<th scope="col">MAC / IP</th>{/if}
        {#if visibleCols.has('site')}<th scope="col">Site</th>{/if}
        {#if visibleCols.has('uptime')}<th scope="col" style="text-align:right;">Uptime</th>{/if}
        {#if visibleCols.has('clients')}<SortHeader sortKey="clients" activeKey={sortKey} dir={sortDir} on:sort={(e) => onSort(e.detail)}>Clients</SortHeader>{/if}
        {#if visibleCols.has('signal')}<th scope="col" style="text-align:right;">Signal</th>{/if}
        {#if visibleCols.has('status')}<th scope="col">Status</th>{/if}
        <th scope="col"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      {#each rows as r (r[2])}
        <tr>
          <td>
            <HoverCard placement="bottom">
              <svelte:fragment slot="trigger">
                <div class="name-cell">
                  <span class="nc-thumb">{r[9]}</span>
                  <div>
                    <div style="font-size:13px;color:#fff;">{r[0]}</div>
                    <div class="mac" style="font-size:10px;">{r[1]}</div>
                  </div>
                </div>
              </svelte:fragment>
              <svelte:fragment slot="content">
                <p class="hovercard-title">{r[0]}</p>
                <div class="hovercard-row"><span class="hc-key">Model</span><span class="hc-val">{r[1]}</span></div>
                <div class="hovercard-row"><span class="hc-key">MAC</span><span class="hc-val mac">{r[2]}</span></div>
                <div class="hovercard-row"><span class="hc-key">IP</span><span class="hc-val mac">{r[3]}</span></div>
                <div class="hovercard-row"><span class="hc-key">Uptime</span><span class="hc-val">{r[4]}</span></div>
                <div class="hovercard-row"><span class="hc-key">Status</span><span class="hc-val" style="color:{r[8]};">{r[7]}</span></div>
              </svelte:fragment>
            </HoverCard>
          </td>
          {#if visibleCols.has('mac')}
            <td>
              <div class="mac">{r[2]}</div>
              <div class="mac" style="font-size:10px;color:#4A4B53;">{r[3]}</div>
            </td>
          {/if}
          {#if visibleCols.has('site')}<td style="color:#A4A7B5;">Edge Gateway</td>{/if}
          {#if visibleCols.has('uptime')}<td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{r[4]}</td>{/if}
          {#if visibleCols.has('clients')}<td style="text-align:right;font-variant-numeric:tabular-nums;color:#A4A7B5;">{r[5]}</td>{/if}
          {#if visibleCols.has('signal')}
            <td style="text-align:right;">
              {#if r[10]}<Signal weak={r[10] === 'weak'} />{:else}—{/if}
            </td>
          {/if}
          {#if visibleCols.has('status')}<td><StatusIndicator color={r[6]} text={r[7]} textColor={r[8]} /></td>{/if}
          <td style="text-align:right;width:32px;">
            <ActionMenu items={deviceActions} label="Actions for {r[0]}" on:action={(e) => { if (e.detail === 'details') { drawerDevice = r; drawerOpen = true; } if (e.detail === 'forget') { forgetDevice = r; } }} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
    <Select
      label="Rows per page"
      options={perPageOptions}
      value={String(pageSize)}
      on:change={(e) => { pageSize = Number(e.detail); page = 1; }}
    />
    <Pagination {page} {pageSize} total={DEVICES.length} on:change={(e) => { page = e.detail; }} />
  </div>
</div>
{/if}

<ConfirmDialog
  open={forgetDevice !== null}
  title="Forget device?"
  description={forgetDevice ? `${forgetDevice[0]} will be removed from this site and will need to be re-adopted.` : undefined}
  confirmLabel="Forget"
  variant="danger"
  onConfirm={() => { forgetDevice = null; }}
  onCancel={() => { forgetDevice = null; }}
/>

<Drawer bind:open={drawerOpen} title={drawerDevice?.[0] ?? ''}>
  {#if drawerDevice}
    <KVTable
      caption="{drawerDevice[0]} properties"
      rows={[
        { label: 'Model', value: drawerDevice[1] },
        { label: 'MAC', value: drawerDevice[2] },
        { label: 'IP', value: drawerDevice[3] },
        { label: 'Uptime', value: drawerDevice[4] },
        { label: 'Clients', value: String(drawerDevice[5]) },
        { label: 'Status', value: drawerDevice[7], valueColor: drawerDevice[8] },
      ]}
    />
    <div style="font-size:11px;color:#6E7079;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.06em;">Configuration</div>
    <JsonViewer
      label="{drawerDevice[0]} configuration"
      data={{ model: drawerDevice[1], mac: drawerDevice[2], ip: drawerDevice[3], uptime: drawerDevice[4], clients: drawerDevice[5], firmware: '9.4.21', features: { vlan: true, qos: false, ipv6: true }, ports: { count: 8, poe: 4, sfp: 2 } }}
      maxDepth={2}
    />
  {/if}
</Drawer>
