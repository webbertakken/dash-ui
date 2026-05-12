<script context="module" lang="ts">
  export interface WaterfallBar {
    label: string;
    value: number;
    type?: 'start' | 'delta' | 'total';
  }
</script>

<script lang="ts">

  export let bars: WaterfallBar[] = [];
  export let height: number = 160;
  export let ariaLabel: string = 'Waterfall chart';

  const VW = 320;
  const PAD = { t: 12, r: 8, b: 24, l: 8 };
  const COLOR_START = '#006FFF';
  const COLOR_POS = '#00C875';
  const COLOR_NEG = '#F04949';
  const COLOR_TOTAL = '#A78BFA';

  $: chartH = height - PAD.t - PAD.b;
  $: chartW = VW - PAD.l - PAD.r;
  $: n = bars.length;
  $: colW = n > 0 ? chartW / n : chartW;
  $: gap = colW * 0.15;
  $: barW = colW - gap * 2;

  $: cumBases = (() => {
    const result: number[] = [];
    let acc = 0;
    for (const b of bars) {
      if (b.type === 'start' || b.type === 'total') {
        result.push(0);
        acc = b.value;
      } else {
        result.push(acc);
        acc += b.value;
      }
    }
    return result;
  })();

  $: tops = bars.map((b, i) => {
    if (b.type === 'start' || b.type === 'total') return b.value;
    return cumBases[i] + b.value;
  });

  $: allVals = [0, ...cumBases, ...tops];
  $: minV = allVals.length ? Math.min(...allVals) : 0;
  $: maxV = allVals.length ? Math.max(...allVals) : 1;
  $: range = maxV - minV || 1;

  function toY(v: number): number {
    return PAD.t + (1 - (v - minV) / range) * chartH;
  }

  $: bot = PAD.t + chartH;

  $: rects = bars.map((b, i) => {
    const base = cumBases[i];
    const top = b.type === 'start' || b.type === 'total' ? b.value : base + b.value;
    const y0 = toY(Math.max(base, top));
    const y1 = toY(Math.min(base, top));
    const x = PAD.l + i * colW + gap;
    const color = b.type === 'start' ? COLOR_START : b.type === 'total' ? COLOR_TOTAL : b.value >= 0 ? COLOR_POS : COLOR_NEG;
    return { x: x.toFixed(1), y: y0.toFixed(1), w: barW.toFixed(1), h: Math.max(y1 - y0, 1).toFixed(1), color };
  });

  $: connectors = rects.slice(0, -1).map((r, i) => {
    const nextX = PAD.l + (i + 1) * colW + gap;
    return { x1: parseFloat(r.x), x2: nextX + barW + gap, y: parseFloat(r.y) };
  });

  $: labels = bars.map((b, i) => ({
    x: (PAD.l + (i + 0.5) * colW).toFixed(1),
    y: (bot + 10).toFixed(1),
    label: b.label,
  }));

  $: gridLines = [0.25, 0.5, 0.75, 1].map((f) => (PAD.t + (1 - f) * chartH).toFixed(1));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as y}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each connectors as c}
      <line x1={c.x1} y1={c.y} x2={c.x2} y2={c.y} stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="2 2" />
    {/each}
    {#each rects as r, i}
      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} fill-opacity="0.85" rx="2" />
    {/each}
    {#each labels as l}
      <text x={l.x} y={l.y} text-anchor="middle" fill="#6E7079" font-size="9" font-family="inherit">{l.label}</text>
    {/each}
  </svg>
</div>
