import { useMemo } from 'react';

export interface TreeMapNode {
  label: string;
  value: number;
  color?: string;
}

export interface TreeMapProps {
  nodes: TreeMapNode[];
  height?: number;
  ariaLabel?: string;
}

const VW = 320;
const PAD = 4;
const GAP = 2;
const PALETTE = ['#006FFF', '#00C875', '#F04949', '#A78BFA', '#F5A623', '#50B8E7'];

interface LayoutRect {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  value: number;
  color: string;
}

function layout(
  nodes: { label: string; value: number; color: string }[],
  x: number,
  y: number,
  w: number,
  h: number,
): LayoutRect[] {
  if (!nodes.length) return [];
  if (nodes.length === 1) return [{ x, y, w: Math.max(w, 0), h: Math.max(h, 0), ...nodes[0] }];
  const total = nodes.reduce((s, n) => s + n.value, 0);
  let acc = 0;
  let split = nodes.length - 1;
  for (let i = 0; i < nodes.length - 1; i++) {
    acc += nodes[i].value;
    if (acc / total >= 0.5) {
      split = i + 1;
      break;
    }
  }
  const ratio = nodes.slice(0, split).reduce((s, n) => s + n.value, 0) / total;
  if (w > h) {
    const w1 = Math.max((w - GAP) * ratio, 0);
    return [
      ...layout(nodes.slice(0, split), x, y, w1, h),
      ...layout(nodes.slice(split), x + w1 + GAP, y, Math.max(w - w1 - GAP, 0), h),
    ];
  }
  const h1 = Math.max((h - GAP) * ratio, 0);
  return [
    ...layout(nodes.slice(0, split), x, y, w, h1),
    ...layout(nodes.slice(split), x, y + h1 + GAP, w, Math.max(h - h1 - GAP, 0)),
  ];
}

export function TreeMap({ nodes, height = 160, ariaLabel = 'Treemap chart' }: TreeMapProps) {
  const rects = useMemo(() => {
    if (!nodes.length) return [];
    const sorted = [...nodes]
      .sort((a, b) => b.value - a.value)
      .map((n, i) => ({ ...n, color: n.color ?? PALETTE[i % PALETTE.length] }));
    return layout(sorted, PAD, PAD, VW - PAD * 2, height - PAD * 2);
  }, [nodes, height]);

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {rects.map((r, i) => {
          const showLabel = r.w >= 36 && r.h >= 22;
          const fs = Math.min(10, Math.max(7, Math.floor(r.w / 6)));
          return (
            <g key={i}>
              <rect
                x={r.x.toFixed(1)}
                y={r.y.toFixed(1)}
                width={r.w.toFixed(1)}
                height={r.h.toFixed(1)}
                fill={r.color}
                fillOpacity={0.85}
                rx={3}
              />
              {showLabel && (
                <>
                  <text
                    x={(r.x + r.w / 2).toFixed(1)}
                    y={(r.y + r.h / 2 - 4).toFixed(1)}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={fs}
                    fontFamily="inherit"
                    fontWeight={600}
                  >
                    {r.label}
                  </text>
                  <text
                    x={(r.x + r.w / 2).toFixed(1)}
                    y={(r.y + r.h / 2 + 9).toFixed(1)}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.65)"
                    fontSize={Math.max(fs - 1, 7)}
                    fontFamily="inherit"
                  >
                    {r.value}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
