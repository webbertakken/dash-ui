<script lang="ts">
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

  export let nodes: ArcNode[];
  export let links: ArcLink[];
  export let height = 180;
  export let ariaLabel = 'Arc diagram';

  const PALETTE = ['#006FFF', '#00C875', '#F5A623', '#A78BFA', '#FF7B7B', '#00C8C8', '#FB923C'];
  const VW = 400;
  const PAD = { t: 12, r: 20, b: 36, l: 20 };

  $: layout = (() => {
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
  })();
</script>

{#if layout}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      <line x1={PAD.l} y1={layout.baseY} x2={VW - PAD.r} y2={layout.baseY} stroke="rgba(255,255,255,0.08)" stroke-width={1} />
      {#each layout.arcs as arc, i (i)}
        <path d={arc.d} fill="none" stroke={arc.color} stroke-width={arc.sw} stroke-opacity={0.6} />
      {/each}
      {#each layout.dots as dot, i (i)}
        <circle cx={dot.x} cy={dot.y} r={5} fill={dot.color} />
      {/each}
      {#each layout.dots as dot, i (i)}
        <text x={dot.x} y={layout.baseY + 18} text-anchor="middle" font-size={9} fill="#A4A7B5" font-family="inherit">{dot.label}</text>
      {/each}
    </svg>
  </div>
{/if}
