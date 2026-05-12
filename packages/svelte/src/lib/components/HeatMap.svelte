<script lang="ts">
  interface Props {
    data?: number[][];
    colors?: string[];
    xLabels?: string[];
    height?: number;
    cellGap?: number;
    ariaLabel?: string;
  }

  let {
    data = [],
    colors = ['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B'],
    xLabels = [],
    height = 160,
    cellGap = 1,
    ariaLabel = 'Heat map'
  }: Props = $props();

  const VW = 400;
  const PAD_BASE = { t: 4, r: 4, l: 4 };

  function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function interpolateColor(cs: string[], t: number): string {
    if (cs.length === 1) return cs[0];
    const scaled = Math.max(0, Math.min(1, t)) * (cs.length - 1);
    const i = Math.min(Math.floor(scaled), cs.length - 2);
    const f = scaled - i;
    const [r1, g1, b1] = hexToRgb(cs[i]);
    const [r2, g2, b2] = hexToRgb(cs[i + 1]);
    return `rgb(${Math.round(r1 + f * (r2 - r1))},${Math.round(g1 + f * (g2 - g1))},${Math.round(b1 + f * (b2 - b1))})`;
  }

  let rows = $derived(data.length);
  let cols = $derived(data[0]?.length ?? 0);
  let padB = $derived(xLabels.length ? 16 : 4);
  let chartW = $derived(VW - PAD_BASE.l - PAD_BASE.r);
  let chartH = $derived(height - PAD_BASE.t - padB);
  let cellW = $derived(cols > 0 ? (chartW - (cols - 1) * cellGap) / cols : 0);
  let cellH = $derived(rows > 0 ? (chartH - (rows - 1) * cellGap) / rows : 0);

  let rects = $derived(rows > 0 && cols > 0
    ? data.flatMap((rowData, row) =>
        rowData.map((val, col) => ({
          key: `${row}-${col}`,
          x: (PAD_BASE.l + col * (cellW + cellGap)).toFixed(2),
          y: (PAD_BASE.t + row * (cellH + cellGap)).toFixed(2),
          w: cellW.toFixed(2),
          h: cellH.toFixed(2),
          fill: interpolateColor(colors, val),
        }))
      )
    : []);

  let labelNodes = $derived(xLabels.map((lbl, i) => ({
    lbl,
    x: (PAD_BASE.l + (xLabels.length > 1 ? (i / (xLabels.length - 1)) * chartW : chartW / 2)).toFixed(1),
    y: height - 2,
  })));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each rects as r (r.key)}
      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
    {/each}
    {#each labelNodes as { lbl, x, y }}
      <text {x} {y} text-anchor="middle" fill="#6E7079" font-size="9">{lbl}</text>
    {/each}
  </svg>
</div>
