<script lang="ts">
  export interface ScatterPoint {
    x: number;
    y: number;
    color?: string;
    r?: number;
    key?: string;
  }

  export let points: ScatterPoint[] = [];
  export let xRange: [number, number] | undefined = undefined;
  export let yRange: [number, number] | undefined = undefined;
  export let height: number = 160;
  export let ariaLabel: string = 'Scatter plot';

  const VW = 400;
  const PAD = { t: 12, r: 8, b: 12, l: 8 };

  $: xs = points.map((p) => p.x);
  $: ys = points.map((p) => p.y);
  $: x0 = xRange ? xRange[0] : xs.length ? Math.min(...xs) : 0;
  $: x1 = xRange ? xRange[1] : xs.length ? Math.max(...xs) : 1;
  $: y0 = yRange ? yRange[0] : ys.length ? Math.min(...ys) : 0;
  $: y1 = yRange ? yRange[1] : ys.length ? Math.max(...ys) : 1;
  $: xSpan = x1 - x0 || 1;
  $: ySpan = y1 - y0 || 1;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;

  $: gridLines = [0.25, 0.5, 0.75].map((f) => ({
    gx: (PAD.l + f * chartW).toFixed(1),
    gy: (PAD.t + (1 - f) * chartH).toFixed(1),
  }));

  $: dots = points.map((p, i) => ({
    cx: (PAD.l + ((p.x - x0) / xSpan) * chartW).toFixed(1),
    cy: (PAD.t + chartH - ((p.y - y0) / ySpan) * chartH).toFixed(1),
    r: p.r ?? 5,
    color: p.color ?? '#006FFF',
    key: p.key ?? String(i),
  }));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as g}
      <line x1={g.gx} y1={PAD.t} x2={g.gx} y2={PAD.t + chartH} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <line x1={PAD.l} y1={g.gy} x2={VW - PAD.r} y2={g.gy} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each dots as d (d.key)}
      <circle cx={d.cx} cy={d.cy} r={d.r} fill={d.color} fill-opacity="0.8" />
    {/each}
  </svg>
</div>
