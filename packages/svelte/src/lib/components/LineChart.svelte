<script context="module" lang="ts">
  export interface LineChartSeries {
    label: string;
    color: string;
    values: number[];
  }
</script>

<script lang="ts">

  export let series: LineChartSeries[] = [];
  export let labels: string[] = [];
  export let height: number = 160;
  export let ariaLabel: string = 'Line chart';

  const VW = 400;
  const PAD = { t: 12, r: 8, b: 28, l: 8 };

  $: allValues = series.flatMap((s) => s.values);
  $: minV = allValues.length ? Math.min(...allValues) : 0;
  $: maxV = allValues.length ? Math.max(...allValues) : 1;
  $: range = maxV - minV || 1;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: n = series[0]?.values.length ?? 0;

  function toX(i: number): number {
    return PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  }
  function toY(v: number): number {
    return PAD.t + chartH - ((v - minV) / range) * chartH;
  }

  $: gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);

  $: paths = series.map((s) => {
    const pts = s.values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
    return { color: s.color, label: s.label, d: `M ${pts.join(' L ')}` };
  });

  $: areas = series.map((s) => {
    const pts = s.values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
    const bot = (PAD.t + chartH).toFixed(1);
    return {
      color: s.color,
      label: s.label,
      d: `M ${toX(0).toFixed(1)},${bot} L ${pts.join(' L ')} L ${toX(n - 1).toFixed(1)},${bot} Z`,
    };
  });
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as y}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each areas as s (s.label)}
      <path d={s.d} fill={s.color} fill-opacity="0.1" />
    {/each}
    {#each paths as s (s.label)}
      <path d={s.d} fill="none" stroke={s.color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    {/each}
    {#if labels.length > 0}
      {#each labels as lbl, i}
        {@const x = PAD.l + (labels.length > 1 ? (i / (labels.length - 1)) * chartW : chartW / 2)}
        <text x={x} y={height - 4} text-anchor="middle" fill="#6E7079" font-size="9">{lbl}</text>
      {/each}
    {/if}
  </svg>
</div>
