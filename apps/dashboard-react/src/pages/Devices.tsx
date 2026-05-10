import { useState, useMemo } from 'react';
import { Button, SearchBox, Tabs, Signal, StatusIndicator, Pagination, Select, SortHeader, useSortable, ActionMenu, Popover, Drawer, HoverCard, ConfirmDialog, JsonViewer, KVTable, KanbanBoard, ColumnToggle } from '@dash-ui/react';
import type { ActionMenuItem, KanbanColumn, ColumnDef } from '@dash-ui/react';
import { DEVICES, type DeviceRow } from '../data.js';

const DEVICE_ACTIONS: ActionMenuItem[] = [
  { id: 'details', label: 'View details' },
  { id: 'restart', label: 'Restart' },
  { id: 'forget', label: 'Forget device', danger: true },
];

const PER_PAGE_OPTIONS = [
  { value: '5', label: '5 per page' },
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
];

export interface DevicesProps {
  onAdopt: () => void;
}

const DEVICE_COLUMNS: ColumnDef[] = [
  { key: 'name', label: 'Name / Model', required: true },
  { key: 'mac', label: 'MAC / IP' },
  { key: 'site', label: 'Site' },
  { key: 'uptime', label: 'Uptime' },
  { key: 'clients', label: 'Clients' },
  { key: 'signal', label: 'Signal' },
  { key: 'status', label: 'Status' },
];

export function Devices({ onAdopt }: DevicesProps) {
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [drawerDevice, setDrawerDevice] = useState<DeviceRow | null>(null);
  const [forgetDevice, setForgetDevice] = useState<DeviceRow | null>(null);
  const { sortKey, dir, onSort } = useSortable();
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    new Set(DEVICE_COLUMNS.map((c) => c.key))
  );

  const sorted = useMemo(() => {
    if (!sortKey) return DEVICES;
    return [...DEVICES].sort((a, b) => {
      if (sortKey === 'name') {
        const cmp = a[0].localeCompare(b[0]);
        return dir === 'asc' ? cmp : -cmp;
      }
      if (sortKey === 'clients') {
        const av = a[5] === '—' ? -1 : Number(a[5]);
        const bv = b[5] === '—' ? -1 : Number(b[5]);
        return dir === 'asc' ? av - bv : bv - av;
      }
      return 0;
    });
  }, [sortKey, dir]);

  function handleSort(key: string) { onSort(key); setPage(1); }

  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const BOARD_COLS: { id: string; title: string; color: string; match: (r: DeviceRow) => boolean }[] = [
    { id: 'connected', title: 'Connected', color: '#00B070', match: r => r[7].startsWith('Connected') },
    { id: 'updating', title: 'Updating', color: '#F5A623', match: r => r[7].startsWith('Updating') },
    { id: 'adopting', title: 'Adopting', color: '#006FFF', match: r => r[7].startsWith('Adopting') },
    { id: 'offline', title: 'Offline', color: '#F03A3A', match: r => r[7].startsWith('Offline') },
  ];

  const [boardCols, setBoardCols] = useState<KanbanColumn[]>(() =>
    BOARD_COLS.map(col => ({
      id: col.id,
      title: col.title,
      color: col.color,
      cards: DEVICES.filter(col.match).map(r => ({ id: r[2], title: r[0], subtitle: r[1], meta: r[7] })),
    }))
  );

  function handleCardMove(cardId: string, fromColId: string, toColId: string) {
    setBoardCols(prev => {
      const fromCol = prev.find(c => c.id === fromColId);
      const card = fromCol?.cards.find(c => c.id === cardId);
      if (!card) return prev;
      return prev.map(col => {
        if (col.id === fromColId) return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
        if (col.id === toColId) return { ...col, cards: [...col.cards, card] };
        return col;
      });
    });
  }
  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Devices</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search devices…" />
          <Popover label="Filter" title="Filter" placement="bottom-end">
            <fieldset>
              <legend>Status</legend>
              {['Online', 'Updating', 'Offline'].map((s) => (
                <label key={s} className="checkbox-label" style={{ display: 'flex', padding: '4px 0' }}>
                  <input type="checkbox" className="checkbox" defaultChecked={s === 'Online'} />
                  {s}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Type</legend>
              {['Gateway', 'Switch', 'Access Point', 'Camera'].map((t) => (
                <label key={t} className="checkbox-label" style={{ display: 'flex', padding: '4px 0' }}>
                  <input type="checkbox" className="checkbox" defaultChecked />
                  {t}
                </label>
              ))}
            </fieldset>
          </Popover>
          <ColumnToggle columns={DEVICE_COLUMNS} visible={visibleCols} onChange={setVisibleCols} />
          <Button variant="primary" onClick={onAdopt}>
            Adopt Device
          </Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={(t) => { setTab(t); setPage(1); }}
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
      {tab === 'board' ? (
        <div style={{ padding: '16px 24px 24px' }}>
          <KanbanBoard columns={boardCols} onCardMove={handleCardMove} ariaLabel="Devices by status" />
        </div>
      ) : (
      <div style={{ padding: '0 24px 24px' }}>
        <table style={{ background: '#141415', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
          <caption className="sr-only">Devices</caption>
          <thead>
            <tr>
              <SortHeader sortKey="name" activeKey={sortKey} dir={dir} onSort={handleSort}>Name / Model</SortHeader>
              {visibleCols.has('mac') && <th scope="col">MAC / IP</th>}
              {visibleCols.has('site') && <th scope="col">Site</th>}
              {visibleCols.has('uptime') && <th scope="col" style={{ textAlign: 'right' }}>Uptime</th>}
              {visibleCols.has('clients') && <SortHeader sortKey="clients" activeKey={sortKey} dir={dir} onSort={handleSort} style={{ textAlign: 'right' }}>Clients</SortHeader>}
              {visibleCols.has('signal') && <th scope="col" style={{ textAlign: 'right' }}>Signal</th>}
              {visibleCols.has('status') && <th scope="col">Status</th>}
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[2]}>
                <td>
                  <HoverCard
                    placement="bottom"
                    content={
                      <>
                        <p className="hovercard-title">{r[0]}</p>
                        <div className="hovercard-row"><span className="hc-key">Model</span><span className="hc-val">{r[1]}</span></div>
                        <div className="hovercard-row"><span className="hc-key">MAC</span><span className="hc-val mac">{r[2]}</span></div>
                        <div className="hovercard-row"><span className="hc-key">IP</span><span className="hc-val mac">{r[3]}</span></div>
                        <div className="hovercard-row"><span className="hc-key">Uptime</span><span className="hc-val">{r[4]}</span></div>
                        <div className="hovercard-row"><span className="hc-key">Status</span><span className="hc-val" style={{ color: r[8] }}>{r[7]}</span></div>
                      </>
                    }
                  >
                    <div className="name-cell">
                      <span className="nc-thumb">{r[9]}</span>
                      <div>
                        <div style={{ fontSize: 13, color: '#fff' }}>{r[0]}</div>
                        <div className="mac" style={{ fontSize: 10 }}>
                          {r[1]}
                        </div>
                      </div>
                    </div>
                  </HoverCard>
                </td>
                {visibleCols.has('mac') && (
                  <td>
                    <div className="mac">{r[2]}</div>
                    <div className="mac" style={{ fontSize: 10, color: '#4A4B53' }}>{r[3]}</div>
                  </td>
                )}
                {visibleCols.has('site') && <td style={{ color: '#A4A7B5' }}>Edge Gateway</td>}
                {visibleCols.has('uptime') && <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{r[4]}</td>}
                {visibleCols.has('clients') && <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#A4A7B5' }}>{r[5]}</td>}
                {visibleCols.has('signal') && <td style={{ textAlign: 'right' }}>{r[10] ? <Signal weak={r[10] === 'weak'} /> : '—'}</td>}
                {visibleCols.has('status') && (
                  <td>
                    <StatusIndicator color={r[6]} text={r[7]} textColor={r[8]} />
                  </td>
                )}
                <td style={{ textAlign: 'right', width: 32 }}>
                  <ActionMenu items={DEVICE_ACTIONS} onAction={(id) => { if (id === 'details') setDrawerDevice(r); if (id === 'forget') setForgetDevice(r); }} label={`Actions for ${r[0]}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <Select
            label="Rows per page"
            options={PER_PAGE_OPTIONS}
            value={String(pageSize)}
            onChange={(v) => { setPageSize(Number(v)); setPage(1); }}
          />
          <Pagination page={page} pageSize={pageSize} total={DEVICES.length} onChange={setPage} />
        </div>
      </div>
      )}
      <ConfirmDialog
        open={forgetDevice !== null}
        title="Forget device?"
        description={forgetDevice ? `${forgetDevice[0]} will be removed from this site and will need to be re-adopted.` : undefined}
        confirmLabel="Forget"
        variant="danger"
        onConfirm={() => setForgetDevice(null)}
        onCancel={() => setForgetDevice(null)}
      />
      <Drawer open={drawerDevice !== null} title={drawerDevice?.[0] ?? ''} onClose={() => setDrawerDevice(null)}>
        {drawerDevice && (
          <>
            <KVTable
              caption={`${drawerDevice[0]} properties`}
              rows={[
                { label: 'Model', value: drawerDevice[1] },
                { label: 'MAC', value: <span className="mac">{drawerDevice[2]}</span> },
                { label: 'IP', value: <span className="mac">{drawerDevice[3]}</span> },
                { label: 'Uptime', value: drawerDevice[4] },
                { label: 'Clients', value: drawerDevice[5] },
                { label: 'Status', value: <span style={{ color: drawerDevice[8] }}>{drawerDevice[7]}</span> },
              ]}
            />
            <div style={{ fontSize: 11, color: '#6E7079', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Configuration</div>
            <JsonViewer
              label={`${drawerDevice[0]} configuration`}
              data={{ model: drawerDevice[1], mac: drawerDevice[2], ip: drawerDevice[3], uptime: drawerDevice[4], clients: drawerDevice[5], firmware: '9.4.21', features: { vlan: true, qos: false, ipv6: true }, ports: { count: 8, poe: 4, sfp: 2 } }}
              maxDepth={2}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
