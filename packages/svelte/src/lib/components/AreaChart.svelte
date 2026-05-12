<script context="module" lang="ts">
  export interface AreaChartSeries {
    label: string;
    color: string;
    values: number[];
  }
</script>

<script lang="ts">

  export let series: AreaChartSeries[] = [];
  export let labels: string[] = [];
  export let height: number = 160;
  export let ariaLabel: string = 'Area chart';

  const VW = 400;
  const PAD = { t: 12, r: 8, b: 28, l: 8 };

  $: n = series[0]?.values.length ?? 0;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;

  $: totals = Array.from({ length: n }, (_, i) =>
    series.reduce((acc, s) => acc + (s.values[i] ?? 0), 0),
  );
  $: maxV = totals.length ? Math.max(...totals, 1) : 1;

  function toX(i: number): number {
    return PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  }
  function toY(v: number): number {
    return PAD.t + chartH - (v / maxV) * chartH;
  }

  $: gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);

  $: areas = n > 0
    ? series.map((s, j) => {
        const bottoms = Array.from({ length: n }, (_, i) =>
          series.slice(0, j).reduce((acc, sr) => acc + (sr.values[i] ?? 0), 0),
        );
        const tops = bottoms.map((b, i) => b + (s.values[i] ?? 0));
        const topPts = tops.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
        const botPts = bottoms
          .map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
          .reverse();
        return { color: s.color, label: s.label, d: `M ${topPts.join(' L ')} L ${botPts.join(' L ')} Z` };
      })
    : [];
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as y}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each areas as s (s.label)}
      <path d={s.d} fill={s.color} fill-opacity="0.75" />
    {/each}
    {#if labels.length > 0}
      {#each labels as lbl, i}
        {@const x = PAD.l + (labels.length > 1 ? (i / (labels.length - 1)) * chartW : chartW / 2)}
        <text x={x} y={height - 4} text-anchor="middle" fill="#6E7079" font-size="9" font-family="inherit">{lbl}</text>
      {/each}
    {/if}
  </svg>
</div>
