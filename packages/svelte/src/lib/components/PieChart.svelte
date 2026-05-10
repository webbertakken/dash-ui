<script lang="ts">
  export interface PieSlice {
    label: string;
    value: number;
    color?: string;
  }

  export let slices: PieSlice[] = [];
  export let size: number = 140;
  export let ariaLabel: string = 'Pie chart';

  const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#A878F5', '#FF6B6B', '#00C875', '#7FB6FF', '#6E7079'];
  const TAU = 2 * Math.PI;
  const START = -Math.PI / 2;

  function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
  }

  $: total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  $: cx = size / 2;
  $: cy = size / 2;
  $: r = (size / 2) * 0.82;
  $: LEGEND_ROW = 18;
  $: legendH = Math.ceil(slices.length / 2) * LEGEND_ROW + 6;
  $: VH = size + legendH;

  $: segments = (() => {
    const result: { path: string; color: string; mid: number }[] = [];
    let angle = START;
    for (let i = 0; i < slices.length; i++) {
      const sl = slices[i];
      const span = (sl.value / total) * TAU;
      const color = sl.color ?? COLORS[i % COLORS.length];
      result.push({ path: arcPath(cx, cy, r, angle, angle + span), color, mid: angle + span / 2 });
      angle += span;
    }
    return result;
  })();
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {size} {VH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each segments as seg, i (i)}
      <path d={seg.path} fill={seg.color} stroke="#1a1d2b" stroke-width="1.5" />
    {/each}

    {#each slices as sl, i (sl.label)}
      {@const pct = Math.round((sl.value / total) * 100)}
      {#if pct >= 5}
        {@const mid = segments[i].mid}
        {@const lr = r * 0.6}
        <text
          x={(cx + lr * Math.cos(mid)).toFixed(1)}
          y={(cy + lr * Math.sin(mid)).toFixed(1)}
          fill="#fff"
          font-size="9"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="inherit"
          font-weight="600"
        >{pct}%</text>
      {/if}
    {/each}

    {#each slices as sl, i (sl.label + 'leg')}
      {@const cols = Math.ceil(slices.length / 2)}
      {@const col = Math.floor(i / cols)}
      {@const row = i % cols}
      {@const colW = size / 2}
      {@const lx = col * colW + 10}
      {@const ly = size + 6 + row * LEGEND_ROW}
      {@const c = sl.color ?? COLORS[i % COLORS.length]}
      <g>
        <rect x={lx} y={ly + 2} width="8" height="8" rx="2" fill={c} />
        <text x={lx + 12} y={ly + 9} fill="#A4A7B5" font-size="9" font-family="inherit"
          >{sl.label} ({sl.value})</text>
      </g>
    {/each}
  </svg>
</div>
