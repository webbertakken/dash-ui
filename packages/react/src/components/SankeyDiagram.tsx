import { useMemo } from 'react';

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyNode {
  id: string;
  label: string;
  color?: string;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  ariaLabel?: string;
}

const VW = 320;
const NODE_W = 10;
const NODE_GAP = 8;
const PAD = 16;
const PALETTE = ['#006FFF', '#00C875', '#A78BFA', '#F5A623', '#50B8E7', '#F04949'];

interface PositionedNode {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  h: number;
  side: 'left' | 'right';
}

export function SankeyDiagram({ nodes, links, height = 180, ariaLabel = 'Sankey diagram' }: SankeyDiagramProps) {
  const { positioned, paths } = useMemo(() => {
    if (!nodes.length || !links.length) return { positioned: [] as PositionedNode[], paths: [] as { d: string; color: string }[] };

    const nodeMap = new Map(nodes.map((n, i) => [n.id, { ...n, color: n.color ?? PALETTE[i % PALETTE.length] }]));
    const outflow = new Map<string, number>();
    const inflow = new Map<string, number>();
    for (const l of links) {
      outflow.set(l.source, (outflow.get(l.source) ?? 0) + l.value);
      inflow.set(l.target, (inflow.get(l.target) ?? 0) + l.value);
    }

    const leftIds = [...new Set(links.map((l) => l.source))].filter((id) => !inflow.has(id));
    const rightIds = [...new Set(links.map((l) => l.target))].filter((id) => !outflow.has(id));
    const totalFlow = links.reduce((s, l) => s + l.value, 0);

    const leftAvailH = height - PAD * 2 - (leftIds.length - 1) * NODE_GAP;
    const rightAvailH = height - PAD * 2 - (rightIds.length - 1) * NODE_GAP;

    const positioned: PositionedNode[] = [];

    let y = PAD;
    for (const id of leftIds) {
      const n = nodeMap.get(id)!;
      const h = Math.max(4, ((outflow.get(id) ?? 0) / totalFlow) * leftAvailH);
      positioned.push({ id, label: n.label, color: n.color, x: PAD, y, h, side: 'left' });
      y += h + NODE_GAP;
    }

    y = PAD;
    for (const id of rightIds) {
      const n = nodeMap.get(id)!;
      const h = Math.max(4, ((inflow.get(id) ?? 0) / totalFlow) * rightAvailH);
      positioned.push({ id, label: n.label, color: n.color, x: VW - PAD - NODE_W, y, h, side: 'right' });
      y += h + NODE_GAP;
    }

    const sourcePort = new Map<string, number>(positioned.filter((n) => n.side === 'left').map((n) => [n.id, n.y]));
    const targetPort = new Map<string, number>(positioned.filter((n) => n.side === 'right').map((n) => [n.id, n.y]));

    const paths: { d: string; color: string }[] = [];
    for (const l of links) {
      const srcNode = positioned.find((n) => n.id === l.source);
      const tgtNode = positioned.find((n) => n.id === l.target);
      if (!srcNode || !tgtNode) continue;

      const lh = Math.max(1, (l.value / totalFlow) * leftAvailH);
      const sy = sourcePort.get(l.source)!;
      const ty = targetPort.get(l.target)!;
      sourcePort.set(l.source, sy + lh);
      targetPort.set(l.target, ty + lh);

      const x1 = srcNode.x + NODE_W;
      const x2 = tgtNode.x;
      const cx = (x1 + x2) / 2;
      const d = `M${x1},${sy.toFixed(1)} C${cx},${sy.toFixed(1)} ${cx},${ty.toFixed(1)} ${x2},${ty.toFixed(1)} L${x2},${(ty + lh).toFixed(1)} C${cx},${(ty + lh).toFixed(1)} ${cx},${(sy + lh).toFixed(1)} ${x1},${(sy + lh).toFixed(1)} Z`;
      paths.push({ d, color: srcNode.color });
    }

    return { positioned, paths };
  }, [nodes, links, height]);

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} fillOpacity={0.35} />
        ))}
        {positioned.map((n) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y.toFixed(1)} width={NODE_W} height={n.h.toFixed(1)} fill={n.color} rx={2} />
            <text
              x={n.side === 'left' ? n.x + NODE_W + 5 : n.x - 5}
              y={(n.y + n.h / 2 + 4).toFixed(1)}
              textAnchor={n.side === 'left' ? 'start' : 'end'}
              fill="#C8C9D0"
              fontSize={9}
              fontFamily="inherit"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
