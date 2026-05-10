<script lang="ts">
  export interface BoxSeries {
    label: string;
    q0: number;
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    color?: string;
  }

  export let series: BoxSeries[] = [];
  export let yRange: [number, number] | undefined = undefined;
  export let height: number = 160;
  export let ariaLabel: string = 'Box plot';

  const VW = 400;
  const PAD = { t: 12, r: 8, b: 28, l: 8 };

  $: allVals = series.flatMap((s) => [s.q0, s.q1, s.q2, s.q3, s.q4]);
  $: y0 = yRange ? yRange[0] : allVals.length ? Math.min(...allVals) : 0;
  $: y1 = yRange ? yRange[1] : allVals.length ? Math.max(...allVals) : 1;
  $: ySpan = y1 - y0 || 1;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: slotW = series.length > 0 ? chartW / series.length : chartW;

  $: gridLines = [0.25, 0.5, 0.75, 1].map((f) => (PAD.t + (1 - f) * chartH).toFixed(1));

  $: boxes = series.map((s, i) => {
    const cx = PAD.l + (i + 0.5) * slotW;
    const bw = slotW * 0.4;
    const ty = (v: number) => PAD.t + chartH - ((v - y0) / ySpan) * chartH;
    return {
      key: String(i),
      cx: cx.toFixed(1),
      color: s.color ?? '#006FFF',
      label: s.label,
      whiskerY0: ty(s.q0).toFixed(1),
      whiskerY4: ty(s.q4).toFixed(1),
      capX0: (cx - bw / 2).toFixed(1),
      capX1: (cx + bw / 2).toFixed(1),
      boxX: (cx - bw / 2).toFixed(1),
      boxW: bw.toFixed(1),
      boxY: ty(s.q3).toFixed(1),
      boxH: (ty(s.q1) - ty(s.q3)).toFixed(1),
      medY: ty(s.q2).toFixed(1),
    };
  });
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as y}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each boxes as b (b.key)}
      <line x1={b.cx} y1={b.whiskerY4} x2={b.cx} y2={b.whiskerY0} stroke={b.color} stroke-width="1.5" stroke-opacity="0.6" />
      <line x1={b.capX0} y1={b.whiskerY0} x2={b.capX1} y2={b.whiskerY0} stroke={b.color} stroke-width="1.5" stroke-opacity="0.6" />
      <line x1={b.capX0} y1={b.whiskerY4} x2={b.capX1} y2={b.whiskerY4} stroke={b.color} stroke-width="1.5" stroke-opacity="0.6" />
      <rect x={b.boxX} y={b.boxY} width={b.boxW} height={b.boxH} fill={b.color} fill-opacity="0.2" stroke={b.color} stroke-width="1.5" stroke-opacity="0.8" rx="2" />
      <line x1={b.capX0} y1={b.medY} x2={b.capX1} y2={b.medY} stroke={b.color} stroke-width="2.5" />
      <text x={b.cx} y={height - 4} text-anchor="middle" fill="#6E7079" font-size="9" font-family="inherit">{b.label}</text>
    {/each}
  </svg>
</div>
