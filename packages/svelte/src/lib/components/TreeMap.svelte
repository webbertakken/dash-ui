<script lang="ts">
  export interface TreeMapNode {
    label: string;
    value: number;
    color?: string;
  }

  export let nodes: TreeMapNode[] = [];
  export let height: number = 160;
  export let ariaLabel: string = 'Treemap chart';

  const VW = 320;
  const PAD = 4;
  const GAP = 2;
  const PALETTE = ['#006FFF', '#00C875', '#F04949', '#A78BFA', '#F5A623', '#50B8E7'];

  interface LayoutRect {
    x: number; y: number; w: number; h: number;
    label: string; value: number; color: string;
  }

  function layout(
    ns: { label: string; value: number; color: string }[],
    x: number, y: number, w: number, h: number
  ): LayoutRect[] {
    if (!ns.length) return [];
    if (ns.length === 1) return [{ x, y, w: Math.max(w, 0), h: Math.max(h, 0), ...ns[0] }];
    const total = ns.reduce((s, n) => s + n.value, 0);
    let acc = 0;
    let split = ns.length - 1;
    for (let i = 0; i < ns.length - 1; i++) {
      acc += ns[i].value;
      if (acc / total >= 0.5) { split = i + 1; break; }
    }
    const ratio = ns.slice(0, split).reduce((s, n) => s + n.value, 0) / total;
    if (w > h) {
      const w1 = Math.max((w - GAP) * ratio, 0);
      return [...layout(ns.slice(0, split), x, y, w1, h), ...layout(ns.slice(split), x + w1 + GAP, y, Math.max(w - w1 - GAP, 0), h)];
    }
    const h1 = Math.max((h - GAP) * ratio, 0);
    return [...layout(ns.slice(0, split), x, y, w, h1), ...layout(ns.slice(split), x, y + h1 + GAP, w, Math.max(h - h1 - GAP, 0))];
  }

  $: rects = (() => {
    if (!nodes.length) return [] as LayoutRect[];
    const sorted = [...nodes]
      .sort((a, b) => b.value - a.value)
      .map((n, i) => ({ ...n, color: n.color ?? PALETTE[i % PALETTE.length] }));
    return layout(sorted, PAD, PAD, VW - PAD * 2, height - PAD * 2);
  })();
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each rects as r, i (i)}
      {@const showLabel = r.w >= 36 && r.h >= 22}
      {@const fs = Math.min(10, Math.max(7, Math.floor(r.w / 6)))}
      <g>
        <rect
          x={r.x.toFixed(1)}
          y={r.y.toFixed(1)}
          width={r.w.toFixed(1)}
          height={r.h.toFixed(1)}
          fill={r.color}
          fill-opacity="0.85"
          rx="3"
        />
        {#if showLabel}
          <text
            x={(r.x + r.w / 2).toFixed(1)}
            y={(r.y + r.h / 2 - 4).toFixed(1)}
            text-anchor="middle"
            fill="#fff"
            font-size={fs}
            font-family="inherit"
            font-weight="600"
          >{r.label}</text>
          <text
            x={(r.x + r.w / 2).toFixed(1)}
            y={(r.y + r.h / 2 + 9).toFixed(1)}
            text-anchor="middle"
            fill="rgba(255,255,255,0.65)"
            font-size={Math.max(fs - 1, 7)}
            font-family="inherit"
          >{r.value}</text>
        {/if}
      </g>
    {/each}
  </svg>
</div>
