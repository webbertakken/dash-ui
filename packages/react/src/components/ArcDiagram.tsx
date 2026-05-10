import { useMemo } from 'react';

export interface ArcNode {
  id: string;
  label: string;
  color?: string;
}

export interface ArcLink {
  source: string;
  target: string;
  value?: number;
  color?: string;
}

export interface ArcDiagramProps {
  nodes: ArcNode[];
  links: ArcLink[];
  height?: number;
  ariaLabel?: string;
}

const PALETTE = ['#006FFF', '#00C875', '#F5A623', '#A78BFA', '#FF7B7B', '#00C8C8', '#FB923C'];
const VW = 400;
const PAD = { t: 12, r: 20, b: 36, l: 20 };

export function ArcDiagram({ nodes, links, height = 180, ariaLabel = 'Arc diagram' }: ArcDiagramProps) {
  const layout = useMemo(() => {
    const n = nodes.length;
    if (!n) return null;
    const chartW = VW - PAD.l - PAD.r;
    const baseY = height - PAD.b;
    const maxArcH = baseY - PAD.t;

    const xMap: Record<string, number> = {};
    const colorMap: Record<string, string> = {};

    const dots = nodes.map((node, i) => {
      const x = n > 1 ? PAD.l + (i / (n - 1)) * chartW : VW / 2;
      xMap[node.id] = x;
      const color = node.color ?? PALETTE[i % PALETTE.length];
      colorMap[node.id] = color;
      return { x, y: baseY, color, label: node.label };
    });

    const arcs = links.flatMap((link) => {
      const x1 = xMap[link.source];
      const x2 = xMap[link.target];
      if (x1 == null || x2 == null) return [];
      const midX = (x1 + x2) / 2;
      const dist = Math.abs(x2 - x1);
      const arcH = Math.min(dist * 0.45, maxArcH * 0.9);
      const ctl = baseY - arcH;
      const color = link.color ?? colorMap[link.source] ?? PALETTE[0];
      const sw = link.value != null ? Math.max(1, Math.min(4, link.value / 10)) : 1.5;
      return [{ d: `M ${x1} ${baseY} Q ${midX} ${ctl} ${x2} ${baseY}`, color, sw }];
    });

    return { dots, arcs, baseY };
  }, [nodes, links, height]);

  if (!layout) return null;

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        <line
          x1={PAD.l} y1={layout.baseY}
          x2={VW - PAD.r} y2={layout.baseY}
          stroke="rgba(255,255,255,0.08)" strokeWidth={1}
        />
        {layout.arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth={arc.sw}
            strokeOpacity={0.6}
          />
        ))}
        {layout.dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={5} fill={dot.color} />
        ))}
        {layout.dots.map((dot, i) => (
          <text
            key={i}
            x={dot.x}
            y={layout.baseY + 18}
            textAnchor="middle"
            fontSize={9}
            fill="#A4A7B5"
            fontFamily="inherit"
          >
            {dot.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
