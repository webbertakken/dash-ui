<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Button, IconButton, Pill, SearchBox, HealthBar, DownloadIcon, Tooltip, TreeView, ContextMenu, Dendrogram } from '@w5-ui/svelte';
  import type { TreeNode, ContextMenuEntry, DendrogramNode } from '@w5-ui/svelte';
  import { NODES, LINKS, NODE_LABEL, type TopologyNode } from '../data';

  const NODE_CTX_ITEMS: ContextMenuEntry[] = [
    { id: 'details', label: 'View details' },
    { id: 'configure', label: 'Configure' },
    { id: 'restart', label: 'Restart device' },
    { separator: true },
    { id: 'forget', label: 'Forget device', danger: true },
  ];

  const TYPE_COLORS: Record<string, string> = {
    isp: '#6E7079',
    gateway: '#006FFF',
    switch: '#00C8C8',
    ap: '#F5A623',
    cam: '#A878F5',
  };

  let selected = $state('gw');
  let view: 'map' | 'list' | 'tree' = $state('map');
  let ctxMenu: { x: number; y: number } | null = $state(null);
  let canvas: HTMLDivElement = $state();
  let svg: SVGSVGElement = $state();

  function buildTree(nodes: typeof NODES, links: typeof LINKS): TreeNode[] {
    const children = new Map<string, string[]>();
    const hasParent = new Set<string>();
    for (const link of links) {
      if (!children.has(link.a)) children.set(link.a, []);
      children.get(link.a)!.push(link.b);
      hasParent.add(link.b);
    }
    const roots = nodes.filter((n) => !hasParent.has(n.id));
    function buildNode(id: string): TreeNode {
      const node = nodes.find((n) => n.id === id)!;
      const childIds = children.get(id) ?? [];
      return {
        id: node.id,
        label: node.name,
        meta: node.meta,
        children: childIds.length ? childIds.map(buildNode) : undefined,
      };
    }
    return roots.map((r) => buildNode(r.id));
  }

  function buildDendrogram(nodes: typeof NODES, links: typeof LINKS): DendrogramNode {
    const children = new Map<string, string[]>();
    const hasParent = new Set<string>();
    for (const link of links) {
      if (!children.has(link.a)) children.set(link.a, []);
      children.get(link.a)!.push(link.b);
      hasParent.add(link.b);
    }
    const roots = nodes.filter((n) => !hasParent.has(n.id));
    function buildNode(id: string): DendrogramNode {
      const node = nodes.find((n) => n.id === id)!;
      const childIds = children.get(id) ?? [];
      return {
        id: node.id,
        label: node.name,
        color: TYPE_COLORS[node.type],
        children: childIds.length ? childIds.map(buildNode) : undefined,
      };
    }
    return roots.length === 1
      ? buildNode(roots[0].id)
      : { id: '__root', label: 'Network', children: roots.map((r) => buildNode(r.id)) };
  }

  const treeNodes = buildTree(NODES, LINKS);
  const dendrogramRoot = buildDendrogram(NODES, LINKS);

  function draw() {
    if (!canvas || !svg) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const byId = Object.fromEntries(NODES.map((n) => [n.id, n] as const));
    svg.innerHTML = LINKS.map((l) => {
      const a = byId[l.a];
      const b = byId[l.b];
      const x1 = a.x * w;
      const y1 = a.y * h + 22;
      const x2 = b.x * w;
      const y2 = b.y * h - 22;
      const my = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
      const lblX = (x1 + x2) / 2;
      const lblY = my;
      return `<path class="topo-link ${l.cls}" d="${d}"/><rect x="${lblX - 22}" y="${lblY - 7}" width="44" height="14" rx="3" fill="#0A0A0B" stroke="rgba(255,255,255,0.10)"/><text class="link-label" x="${lblX}" y="${lblY + 3}">${l.speed}</text>`;
    }).join('');
  }

  $effect(() => {
    if (view === 'map') {
      if (canvas && svg) draw();
    }
  });

  onMount(() => {
    draw();
    window.addEventListener('resize', draw);
  });
  onDestroy(() => {
    window.removeEventListener('resize', draw);
  });

  let sel = $derived(NODES.find((n) => n.id === selected) ?? NODES[1]);
  function toLabel(n: TopologyNode) {
    return NODE_LABEL[n.type] ?? '';
  }
</script>

<div class="ph-bar">
  <div class="ph-title">Topology</div>
  <div class="ph-actions">
    <SearchBox placeholder="Search devices…" />
    <Button>Auto-arrange</Button>
    <Button iconOnly title="Export"><DownloadIcon /></Button>
  </div>
</div>
<div class="topo">
  <div class="topo-toolbar">
    <Tooltip label="Map view" placement="bottom">
      <IconButton title="Map" aria-pressed={view === 'map'} on:click={() => (view = 'map')}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="3" r="1.4" stroke="currentColor" stroke-width="1.4" />
          <circle cx="3" cy="11" r="1.4" stroke="currentColor" stroke-width="1.4" />
          <circle cx="11" cy="11" r="1.4" stroke="currentColor" stroke-width="1.4" />
          <path d="M7 4.4v3M5.8 8.4l-2 1.6M8.2 8.4l2 1.6" stroke="currentColor" stroke-width="1.4" />
        </svg>
      </IconButton>
    </Tooltip>
    <Tooltip label="List view" placement="bottom">
      <IconButton title="List" aria-pressed={view === 'list'} on:click={() => (view = 'list')}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3.5h8M3 7h8M3 10.5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </IconButton>
    </Tooltip>
    <Tooltip label="Tree view" placement="bottom">
      <IconButton title="Tree" aria-pressed={view === 'tree'} on:click={() => (view = 'tree')}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="2.5" cy="7" r="1.5" stroke="currentColor" stroke-width="1.2" />
          <circle cx="11.5" cy="3" r="1.5" stroke="currentColor" stroke-width="1.2" />
          <circle cx="11.5" cy="11" r="1.5" stroke="currentColor" stroke-width="1.2" />
          <path d="M4 7h2.5c0-2 .5-2.5 3.5-4M4 7h2.5c0 2 .5 2.5 3.5 4" stroke="currentColor" stroke-width="1.2" />
        </svg>
      </IconButton>
    </Tooltip>
    <div class="sep"></div>
    <IconButton title="Show clients">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="5" r="2.2" stroke="currentColor" stroke-width="1.5" />
        <path d="M2.5 11.5c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </IconButton>
    <IconButton title="Show RF">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 6c2-2 8-2 10 0M3.5 8.2c1.5-1.4 5.5-1.4 7 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="7" cy="10.5" r="0.9" fill="currentColor" />
      </svg>
    </IconButton>
  </div>

  <div class="topo-zoom">
    <Tooltip label="Zoom in" placement="left">
      <IconButton title="Zoom in">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 3v8M3 7h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </IconButton>
    </Tooltip>
    <Tooltip label="Zoom out" placement="left">
      <IconButton title="Zoom out">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </IconButton>
    </Tooltip>
    <Tooltip label="Fit to screen" placement="left">
      <IconButton title="Fit">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5V3h2M11 5V3H9M3 9v2h2M11 9v2H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </IconButton>
    </Tooltip>
  </div>

  {#if view === 'map'}
    <div class="topo-legend">
      <div class="row"><span class="swatch tenG"></span>10 GbE</div>
      <div class="row"><span class="swatch fiveG"></span>2.5 GbE</div>
      <div class="row"><span class="swatch oneG"></span>1 GbE</div>
      <div class="row"><span class="swatch wifi"></span>Wireless</div>
    </div>

    <div class="topo-canvas" bind:this={canvas}>
      <svg class="topo-svg" bind:this={svg}></svg>
      {#each NODES as n (n.id)}
        <div
          class="node {selected === n.id ? 'selected' : ''}"
          style="left:{n.x * 100}%;top:{n.y * 100}%;transform:translate(-50%,-50%);"
          onclick={() => (selected = n.id)}
          oncontextmenu={(e) => { e.preventDefault(); ((e) => { selected = n.id; ctxMenu = { x: e.clientX, y: e.clientY }; })(e); }}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selected = n.id; } }}
          role="button"
          tabindex="0"
          aria-label={`${n.name}, ${n.status === 'good' ? 'online' : n.status === 'warn' ? 'warning' : 'offline'}`}
          aria-pressed={selected === n.id}
          aria-haspopup="menu"
        >
          <div class="node-card {n.type === 'gateway' ? 'gateway' : ''}">
            {#if n.type !== 'isp'}
              <span class="node-status {n.status === 'good' ? '' : n.status}"></span>
            {/if}
            {#if n.type === 'isp'}
              <div class="node-img" style="width:60px;height:38px;display:flex;align-items:center;justify-content:center;font-size:9px;">🌐 WAN</div>
            {:else}
              <div class="node-img {n.type}">{toLabel(n)}</div>
            {/if}
            <div class="node-name">{n.name}</div>
            <div class="node-meta">{n.meta}</div>
            {#if n.clients !== undefined}
              <div class="node-clients">{n.clients} clients</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else if view === 'list'}
    <div class="topo-list">
      <TreeView
        nodes={treeNodes}
        bind:selected
        defaultExpanded={['isp', 'gw', 'sw1', 'sw2']}
        label="Network hierarchy"
      />
    </div>
  {:else}
    <div class="topo-list" style="padding:16px;">
      <Dendrogram
        root={dendrogramRoot}
        ariaLabel="Network topology tree"
        colWidth={120}
        rowHeight={30}
      />
    </div>
  {/if}

  <div class="drawer">
    <div class="dr-h">
      <div class="dr-thumb">{NODE_LABEL[sel.type]}</div>
      <div class="info">
        <h2>{sel.name}</h2>
        <div class="sub">f4:b1:00:11:22:33 · {sel.meta}</div>
      </div>
      <Pill variant={sel.status === 'good' ? 'success' : sel.status === 'warn' ? 'warn' : 'danger'}>
        {sel.status === 'good' ? 'Online' : sel.status === 'warn' ? 'Warning' : 'Offline'}
      </Pill>
    </div>
    <div class="dr-b">
      <dl class="dr-list">
        <div class="dr-row"><dt class="k">Model</dt><dd class="v">EG-X1</dd></div>
        <div class="dr-row"><dt class="k">Firmware</dt><dd class="v">9.4.21</dd></div>
        <div class="dr-row"><dt class="k">Uptime</dt><dd class="v">24d 14h 02m</dd></div>
        <div class="dr-row"><dt class="k">CPU</dt><dd class="v">41%</dd></div>
        <div class="dr-row"><dt class="k">Memory</dt><dd class="v">6.2 / 16 GB</dd></div>
        <div class="dr-row"><dt class="k">Temperature</dt><dd class="v">52 °C</dd></div>
      </dl>

      <div class="dr-section">Throughput</div>
      <div style="margin:6px 0 4px;display:flex;justify-content:space-between;font-size:11px;color:#A4A7B5;">
        <span>↓ 847 Mbps</span><span>↑ 312 Mbps</span>
      </div>
      <HealthBar value={78} />

      <div class="dr-section">Ports · 8 × 1 GbE + 2 × 10 GbE SFP+</div>
      <div class="ports">
        <div class="port up">1</div><div class="port up">2</div><div class="port up">3</div><div class="port up">4</div>
        <div class="port poe">5</div><div class="port poe">6</div><div class="port up">7</div><div class="port">8</div>
        <div class="port tenG" style="grid-column:span 2;">SFP+1 · 10G</div>
        <div class="port tenG" style="grid-column:span 2;">SFP+2 · 10G</div>
      </div>

      <div class="dr-section">Connected Apps</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <Pill variant="info">Network</Pill>
        <Pill variant="info">Protect</Pill>
        <Pill variant="neutral">Talk</Pill>
        <Pill variant="neutral">Access</Pill>
      </div>
    </div>
  </div>
</div>

<ContextMenu
  items={NODE_CTX_ITEMS}
  x={ctxMenu?.x ?? 0}
  y={ctxMenu?.y ?? 0}
  open={ctxMenu !== null}
  on:close={() => (ctxMenu = null)}
  on:action={() => (ctxMenu = null)}
  label="Device actions"
/>
