<script module lang="ts">
  export interface FDNode {
    id: string;
    label?: string;
    color?: string;
    r?: number;
  }
  export interface FDLink {
    source: string;
    target: string;
  }
</script>

<script lang="ts">

  interface Props {
    nodes?: FDNode[];
    links?: FDLink[];
    height?: number;
    ariaLabel?: string;
  }

  let {
    nodes = [],
    links = [],
    height = 260,
    ariaLabel = 'Force-directed network graph'
  }: Props = $props();

  const PALETTE = ['#006FFF', '#00C875', '#FF7B7B', '#F5C26B', '#A78BFA', '#34D399'];
  const VW = 340;
  const ITERS = 300;

  type State = { x: number; y: number; vx: number; vy: number };

  function layout(W: number, H: number): { x: number; y: number }[] {
    const idxById: Record<string, number> = {};
    nodes.forEach((n, i) => { idxById[n.id] = i; });
    const edges = links
      .map((l) => [idxById[l.source], idxById[l.target]] as [number, number])
      .filter(([a, b]) => a !== undefined && b !== undefined);

    const cx = W / 2;
    const cy = H / 2;
    const step = (2 * Math.PI) / nodes.length;
    const r0 = Math.min(W, H) * 0.35;

    const state: State[] = nodes.map((_, i) => ({
      x: cx + r0 * Math.cos(i * step),
      y: cy + r0 * Math.sin(i * step),
      vx: 0,
      vy: 0,
    }));

    for (let iter = 0; iter < ITERS; iter++) {
      for (const [a, b] of edges) {
        const dx = state[b].x - state[a].x;
        const dy = state[b].y - state[a].y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = 0.04 * (d - 80) / d;
        state[a].vx += dx * f;
        state[a].vy += dy * f;
        state[b].vx -= dx * f;
        state[b].vy -= dy * f;
      }
      for (let i = 0; i < state.length; i++) {
        for (let j = i + 1; j < state.length; j++) {
          const dx = state[j].x - state[i].x;
          const dy = state[j].y - state[i].y;
          const d2 = dx * dx + dy * dy || 1;
          const d = Math.sqrt(d2);
          const f = 600 / d2;
          state[i].vx -= (dx / d) * f;
          state[i].vy -= (dy / d) * f;
          state[j].vx += (dx / d) * f;
          state[j].vy += (dy / d) * f;
        }
      }
      for (const s of state) {
        s.vx += (cx - s.x) * 0.008;
        s.vy += (cy - s.y) * 0.008;
        s.vx *= 0.85;
        s.vy *= 0.85;
        s.x += s.vx;
        s.y += s.vy;
      }
    }

    return state.map((s) => ({ x: s.x, y: s.y }));
  }

  let pos = $derived(nodes.length > 0 ? layout(VW, height) : []);
  let idxById = $derived(Object.fromEntries(nodes.map((n, i) => [n.id, i])));
</script>

{#if nodes.length > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each links as l, li (li)}
        {@const si = idxById[l.source]}
        {@const ti = idxById[l.target]}
        {#if si !== undefined && ti !== undefined}
          <line x1={pos[si].x} y1={pos[si].y} x2={pos[ti].x} y2={pos[ti].y} stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
        {/if}
      {/each}
      {#each nodes as n, ni (ni)}
        {@const r = n.r ?? 10}
        {@const color = n.color ?? PALETTE[ni % PALETTE.length]}
        <g>
          <circle cx={pos[ni].x} cy={pos[ni].y} r={r} fill={color} fill-opacity="0.85" />
          <text x={pos[ni].x} y={pos[ni].y + r + 11} fill="#A4A7B5" font-size="8" text-anchor="middle" font-family="inherit">{n.label ?? n.id}</text>
        </g>
      {/each}
    </svg>
  </div>
{/if}
