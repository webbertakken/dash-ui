import { useEffect, useRef, useState } from 'react';
import { Button, IconButton, Pill, SearchBox, HealthBar, DownloadIcon } from '@dash-ui/react';
import { NODES, LINKS, NODE_LABEL, type TopologyNode } from '../data.js';

export function Topology() {
  const [selected, setSelected] = useState('udm');
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    function draw() {
      const canvas = canvasRef.current;
      const svg = svgRef.current;
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
        return `<path class="topo-link ${l.cls}" d="${d}"/><rect x="${
          lblX - 22
        }" y="${lblY - 7}" width="44" height="14" rx="3" fill="#0A0A0B" stroke="rgba(255,255,255,0.10)"/><text class="link-label" x="${lblX}" y="${lblY + 3}">${l.speed}</text>`;
      }).join('');
    }
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  const sel = NODES.find((n) => n.id === selected) ?? NODES[1];

  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Topology</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search devices…" />
          <Button>Auto-arrange</Button>
          <Button iconOnly title="Export">
            <DownloadIcon />
          </Button>
        </div>
      </div>
      <div className="topo">
        <div className="topo-toolbar">
          <IconButton title="Map">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="3" r="1.4" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="3" cy="11" r="1.4" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="11" cy="11" r="1.4" stroke="currentColor" strokeWidth="1.4" />
              <path d="M7 4.4v3M5.8 8.4l-2 1.6M8.2 8.4l2 1.6" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </IconButton>
          <IconButton title="List">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3.5h8M3 7h8M3 10.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </IconButton>
          <div className="sep" />
          <IconButton title="Show clients">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2.5 11.5c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </IconButton>
          <IconButton title="Show RF">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 6c2-2 8-2 10 0M3.5 8.2c1.5-1.4 5.5-1.4 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="10.5" r="0.9" fill="currentColor" />
            </svg>
          </IconButton>
        </div>

        <div className="topo-zoom">
          <IconButton title="Zoom in">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </IconButton>
          <IconButton title="Zoom out">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </IconButton>
          <IconButton title="Fit">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5V3h2M11 5V3H9M3 9v2h2M11 9v2H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>

        <div className="topo-legend">
          <div className="row"><span className="swatch tenG" />10 GbE</div>
          <div className="row"><span className="swatch fiveG" />2.5 GbE</div>
          <div className="row"><span className="swatch oneG" />1 GbE</div>
          <div className="row"><span className="swatch wifi" />Wireless</div>
        </div>

        <div className="topo-canvas" ref={canvasRef}>
          <svg className="topo-svg" ref={svgRef} />
          {NODES.map((n) => (
            <TopologyNodeView key={n.id} node={n} selected={selected === n.id} onClick={() => setSelected(n.id)} />
          ))}
        </div>

        <div className="drawer">
          <div className="dr-h">
            <div className="dr-thumb">{NODE_LABEL[sel.type]}</div>
            <div className="info">
              <h2>{sel.name}</h2>
              <div className="sub">f4:b1:00:11:22:33 · {sel.meta}</div>
            </div>
            <Pill variant={sel.status === 'good' ? 'success' : sel.status === 'warn' ? 'warn' : 'danger'}>
              {sel.status === 'good' ? 'Online' : sel.status === 'warn' ? 'Warning' : 'Offline'}
            </Pill>
          </div>
          <div className="dr-b">
            <dl className="dr-list">
              <DrRow k="Model" v="EG-X1" />
              <DrRow k="Firmware" v="9.4.21" />
              <DrRow k="Uptime" v="24d 14h 02m" />
              <DrRow k="CPU" v="41%" />
              <DrRow k="Memory" v="6.2 / 16 GB" />
              <DrRow k="Temperature" v="52 °C" />
            </dl>

            <div className="dr-section">Throughput</div>
            <div style={{ margin: '6px 0 4px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#A4A7B5' }}>
              <span>↓ 847 Mbps</span>
              <span>↑ 312 Mbps</span>
            </div>
            <HealthBar value={78} />

            <div className="dr-section">Ports · 8 × 1 GbE + 2 × 10 GbE SFP+</div>
            <div className="ports">
              <div className="port up">1</div>
              <div className="port up">2</div>
              <div className="port up">3</div>
              <div className="port up">4</div>
              <div className="port poe">5</div>
              <div className="port poe">6</div>
              <div className="port up">7</div>
              <div className="port">8</div>
              <div className="port tenG" style={{ gridColumn: 'span 2' }}>SFP+1 · 10G</div>
              <div className="port tenG" style={{ gridColumn: 'span 2' }}>SFP+2 · 10G</div>
            </div>

            <div className="dr-section">Connected Apps</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Pill variant="info">Network</Pill>
              <Pill variant="info">Protect</Pill>
              <Pill variant="neutral">Talk</Pill>
              <Pill variant="neutral">Access</Pill>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DrRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="dr-row">
      <dt className="k">{k}</dt>
      <dd className="v">{v}</dd>
    </div>
  );
}

function TopologyNodeView({
  node,
  selected,
  onClick,
}: {
  node: TopologyNode;
  selected: boolean;
  onClick: () => void;
}) {
  const statusText = node.status === 'good' ? 'online' : node.status === 'warn' ? 'warning' : 'offline';
  return (
    <div
      className={`node ${selected ? 'selected' : ''}`}
      style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%`, transform: 'translate(-50%, -50%)' }}
      role="button"
      tabIndex={0}
      aria-label={`${node.name}, ${statusText}`}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={`node-card ${node.type === 'gateway' ? 'gateway' : ''}`}>
        {node.type !== 'isp' && (
          <span className={`node-status ${node.status === 'good' ? '' : node.status}`} />
        )}
        {node.type === 'isp' ? (
          <div className="node-img" style={{ width: 60, height: 38, fontSize: 9 }}>
            🌐 WAN
          </div>
        ) : (
          <div className={`node-img ${node.type}`}>{NODE_LABEL[node.type] ?? ''}</div>
        )}
        <div className="node-name">{node.name}</div>
        <div className="node-meta">{node.meta}</div>
        {node.clients !== undefined && <div className="node-clients">{node.clients} clients</div>}
      </div>
    </div>
  );
}
