<script module lang="ts">
  export interface CdfSeries {
    label: string;
    color: string;
    values: number[];
  }
</script>

<script lang="ts">

  interface Props {
    series?: CdfSeries[];
    guides?: number[];
    height?: number;
    unit?: string;
    ariaLabel?: string;
  }

  let {
    series = [],
    guides = [50, 95],
    height = 160,
    unit = '',
    ariaLabel = 'Cumulative distribution chart'
  }: Props = $props();

  const W = 400, PL = 38, PR = 12, PT = 14, PB = 28;

  let allVals = $derived(series.flatMap((s) => s.values));
  let xMin = $derived(allVals.length ? Math.min(...allVals) : 0);
  let xMax = $derived(allVals.length ? Math.max(...allVals) : 1);
  let xRange = $derived((xMax - xMin) || 1);
  let cW = $derived(W - PL - PR);
  let cH = $derived(height - PT - PB);

  function toX(v: number) { return PL + ((v - xMin) / xRange) * cW; }
  function toY(p: number) { return PT + (1 - p) * cH; }

  let paths = $derived(series.map((s) => {
    const sorted = [...s.values].sort((a, b) => a - b);
    const n = sorted.length;
    let d = `M${toX(xMin).toFixed(1)},${toY(0).toFixed(1)}`;
    sorted.forEach((v, i) => {
      d += ` H${toX(v).toFixed(1)} V${toY((i + 1) / n).toFixed(1)}`;
    });
    d += ` H${toX(xMax).toFixed(1)}`;
    return { label: s.label, color: s.color, d };
  }));

  let yTicks = $derived([0, 0.25, 0.5, 0.75, 1].map((p) => ({ y: toY(p), label: `${Math.round(p * 100)}%` })));
  let xStep = $derived(xRange / 4);
  let xTicks = $derived(Array.from({ length: 5 }, (_, i) => {
    const v = xMin + xStep * i;
    return { x: toX(v), label: `${Math.round(v)}${unit}` };
  }));
  let guideLines = $derived(guides.map((g) => ({ p: g, y: toY(g / 100) })));
</script>

{#if allVals.length}
<div role="img" aria-label={ariaLabel} style="line-height:0;">
  <svg viewBox="0 0 {W} {height}" width="100%" height={height} aria-hidden="true" focusable="false">
    {#each yTicks as t (t.label)}
      <line x1={PL} x2={W - PR} y1={t.y} y2={t.y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each guideLines as g (g.p)}
      <line x1={PL} x2={W - PR} y1={g.y} y2={g.y} stroke="rgba(255,255,255,0.18)" stroke-width="1" stroke-dasharray="4 3" />
      <text x={W - PR - 2} y={g.y - 3} text-anchor="end" fill="#6E7079" font-size="9" font-family="inherit">p{g.p}</text>
    {/each}
    {#each paths as s (s.label)}
      <path d={s.d} fill="none" stroke={s.color} stroke-width="2" stroke-linejoin="round" />
    {/each}
    {#each yTicks as t (t.label)}
      <text x={PL - 4} y={t.y + 4} text-anchor="end" fill="#6E7079" font-size="9" font-family="inherit">{t.label}</text>
    {/each}
    {#each xTicks as t, i (i)}
      <text x={t.x} y={height - PB + 14} text-anchor="middle" fill="#6E7079" font-size="9" font-family="inherit">{t.label}</text>
    {/each}
  </svg>
</div>
{/if}
