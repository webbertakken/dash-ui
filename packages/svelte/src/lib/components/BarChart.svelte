<script module lang="ts">
  export interface BarChartSeries {
    label: string;
    color: string;
    values: number[];
  }
</script>

<script lang="ts">

  interface Props {
    series?: BarChartSeries[];
    labels?: string[];
    height?: number;
    ariaLabel?: string;
  }

  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Bar chart'
  }: Props = $props();

  const VW = 400;
  const PAD = { t: 12, r: 8, b: 28, l: 8 };

  let n = $derived(series[0]?.values.length ?? 0);
  let m = $derived(series.length);
  let maxV = $derived(series.length ? Math.max(...series.flatMap((s) => s.values)) || 1 : 1);
  let chartW = $derived(VW - PAD.l - PAD.r);
  let chartH = $derived(height - PAD.t - PAD.b);
  let bot = $derived(PAD.t + chartH);
  let gw = $derived(n > 0 ? chartW / n : chartW);
  let gap = $derived(gw * 0.15);
  let barW = $derived(Math.max((gw - gap * (m + 1)) / m, 1));

  let gridLines = $derived([0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH));

  let bars = $derived(series.flatMap((s, si) =>
    s.values.map((v, gi) => {
      const x = PAD.l + gi * gw + gap * (si + 1) + barW * si;
      const bh = (v / maxV) * chartH;
      return { x: x.toFixed(1), y: (bot - bh).toFixed(1), w: barW.toFixed(1), h: bh.toFixed(1), color: s.color, key: `${si}-${gi}` };
    }),
  ));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as y}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each bars as b (b.key)}
      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} fill-opacity="0.9" rx="2" />
    {/each}
    {#if labels.length > 0}
      {#each labels as lbl, i}
        {@const x = (PAD.l + (i + 0.5) * gw).toFixed(1)}
        <text x={x} y={height - 4} text-anchor="middle" fill="#6E7079" font-size="9">{lbl}</text>
      {/each}
    {/if}
  </svg>
</div>
