<script lang="ts">
  const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342'];

  export interface ParallelAxis {
    label: string;
    min: number;
    max: number;
    unit?: string;
    invert?: boolean;
  }

  export interface ParallelSeries {
    label: string;
    color?: string;
    values: number[];
  }

  export let axes: ParallelAxis[] = [];
  export let series: ParallelSeries[] = [];
  export let height: number = 200;
  export let ariaLabel: string = 'Parallel coordinates chart';

  const VW = 380;
  $: VH = height;
  const PAD_L = 28;
  const PAD_R = 28;
  const PAD_T = 32;
  const PAD_B = 20;

  $: TRACK_W = VW - PAD_L - PAD_R;
  $: TRACK_H = VH - PAD_T - PAD_B;
  $: nAxes = axes.length;

  function axisX(i: number, tw: number, n: number): number {
    return PAD_L + (n > 1 ? i * (tw / (n - 1)) : tw / 2);
  }

  function valueY(axis: ParallelAxis, v: number, th: number): number {
    const t = Math.max(0, Math.min(1, (v - axis.min) / (axis.max - axis.min)));
    return axis.invert ? PAD_T + t * th : PAD_T + (1 - t) * th;
  }

  function seriesPath(s: ParallelSeries, tw: number, th: number, n: number): string {
    return axes
      .map((axis, i) => {
        const x = axisX(i, tw, n).toFixed(1);
        const y = valueY(axis, s.values[i] ?? axis.min, th).toFixed(1);
        return i === 0 ? `M${x},${y}` : `L${x},${y}`;
      })
      .join(' ');
  }

  const TICKS = [0, 0.5, 1];

  $: paths = series.map((s, si) => ({
    d: seriesPath(s, TRACK_W, TRACK_H, nAxes),
    stroke: s.color ?? COLORS[si % COLORS.length],
  }));

  $: axisData = axes.map((axis, i) => {
    const x = axisX(i, TRACK_W, nAxes);
    const ticks = TICKS.map(t => {
      const v = axis.invert
        ? axis.min + t * (axis.max - axis.min)
        : axis.max - t * (axis.max - axis.min);
      const y = PAD_T + t * TRACK_H;
      return { t, v, y };
    });
    return { axis, x, ticks };
  });
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {VW} {VH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each axisData as { axis, x, ticks } (axis.label)}
      <line x1={x} y1={PAD_T} x2={x} y2={VH - PAD_B} stroke="rgba(255,255,255,0.2)" stroke-width="1" />
      <text x={x} y={PAD_T - 8} fill="#A4A7B5" font-size="8" text-anchor="middle" font-family="inherit">{axis.label}</text>
      {#if axis.unit}
        <text x={x} y={PAD_T - 1} fill="#6E7079" font-size="7" text-anchor="middle" font-family="inherit">{axis.unit}</text>
      {/if}
      {#each ticks as tick (tick.t)}
        <line x1={x - 3} y1={tick.y} x2={x + 3} y2={tick.y} stroke="rgba(255,255,255,0.25)" stroke-width="1" />
        <text x={x - 5} y={tick.y + 3} fill="#6E7079" font-size="7" text-anchor="end" font-family="inherit">
          {tick.v % 1 === 0 ? tick.v.toFixed(0) : tick.v.toFixed(1)}
        </text>
      {/each}
    {/each}

    {#each paths as p, si (si)}
      <path d={p.d} fill="none" stroke={p.stroke} stroke-width="1.5" opacity="0.75" />
    {/each}
  </svg>
</div>
