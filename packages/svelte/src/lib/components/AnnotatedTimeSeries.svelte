<script lang="ts">
  export interface TimeSeriesAnnotation {
    index: number;
    label: string;
    color?: string;
  }

  export let data: number[] = [];
  export let labels: string[] = [];
  export let annotations: TimeSeriesAnnotation[] = [];
  export let color = '#006FFF';
  export let height = 160;
  export let ariaLabel = 'Annotated time series';

  const VW = 400;
  const PAD = { t: 16, r: 8, b: 28, l: 32 };

  $: n = data.length;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: minV = n >= 2 ? Math.min(...data) : 0;
  $: maxV = n >= 2 ? Math.max(...data) || 1 : 1;
  $: range = maxV - minV || 1;
  $: bot = PAD.t + chartH;

  function toX(i: number): number {
    return PAD.l + (i / (n - 1)) * chartW;
  }
  function toY(v: number): number {
    return PAD.t + chartH - ((v - minV) / range) * chartH;
  }

  $: pts = n >= 2 ? data.map((v, i) => [toX(i), toY(v)] as [number, number]) : [];

  $: linePath = pts.length
    ? pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    : '';

  $: areaPath = pts.length
    ? `${linePath} L${pts[n - 1][0].toFixed(1)},${bot} L${pts[0][0].toFixed(1)},${bot} Z`
    : '';

  $: gridLines = [0, 0.5, 1].map((f) => ({
    y: PAD.t + (1 - f) * chartH,
    label: String(Math.round(minV + f * range)),
  }));

  $: stride = n <= 8 ? 1 : Math.ceil(n / 6);
  $: xLabels = n >= 2
    ? data
        .map((_, i) => ({ x: toX(i), text: labels[i] ?? String(i), i }))
        .filter(({ i }) => i % stride === 0 || i === n - 1)
    : [];

  $: markers = annotations.map((a) => ({
    x: toX(Math.max(0, Math.min(n - 1, a.index))),
    label: a.label,
    color: a.color ?? '#F5A623',
  }));
</script>

{#if n >= 2}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each gridLines as g, i (i)}
        <line x1={PAD.l} y1={g.y} x2={VW - PAD.r} y2={g.y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <text x={PAD.l - 4} y={g.y + 3} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{g.label}</text>
      {/each}

      <path d={areaPath} fill={color} fill-opacity="0.08" />
      <path d={linePath} fill="none" stroke={color} stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />

      {#each markers as m, i (i)}
        <line x1={m.x} y1={PAD.t} x2={m.x} y2={PAD.t + chartH} stroke={m.color} stroke-width="1" stroke-dasharray="3,2" opacity="0.85" />
        <text x={m.x + 2} y={PAD.t + 8} fill={m.color} font-size="7" font-family="inherit">{m.label}</text>
      {/each}

      {#each xLabels as l (l.i)}
        <text
          x={l.x}
          y={height - 6}
          fill="#6E7079"
          font-size="8"
          text-anchor={l.i === 0 ? 'start' : l.i === n - 1 ? 'end' : 'middle'}
          font-family="inherit"
        >{l.text}</text>
      {/each}
    </svg>
  </div>
{/if}
