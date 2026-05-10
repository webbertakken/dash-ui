<script lang="ts">
  export interface QuadrantPoint {
    x: number;
    y: number;
    label?: string;
    color?: string;
  }

  export let points: QuadrantPoint[] = [];
  export let xThreshold: number;
  export let yThreshold: number;
  export let xRange: [number, number] | undefined = undefined;
  export let yRange: [number, number] | undefined = undefined;
  /** Labels: [top-left, top-right, bottom-left, bottom-right] */
  export let quadrantLabels: [string, string, string, string] = ['', '', '', ''];
  export let quadrantColors: [string, string, string, string] = [
    'rgba(0,200,117,0.06)',
    'rgba(245,166,35,0.07)',
    'rgba(0,111,255,0.06)',
    'rgba(255,123,123,0.09)',
  ];
  export let xLabel: string | undefined = undefined;
  export let yLabel: string | undefined = undefined;
  export let height = 200;
  export let ariaLabel = 'Quadrant chart';

  const VW = 360;
  const PAD = { t: 8, r: 8, b: 28, l: 36 };

  $: xs = points.map((p) => p.x);
  $: ys = points.map((p) => p.y);
  $: x0 = xRange ? xRange[0] : Math.min(...xs, xThreshold - 1);
  $: x1 = xRange ? xRange[1] : Math.max(...xs, xThreshold + 1);
  $: y0 = yRange ? yRange[0] : Math.min(...ys, yThreshold - 1);
  $: y1 = yRange ? yRange[1] : Math.max(...ys, yThreshold + 1);
  $: xSpan = x1 - x0 || 1;
  $: ySpan = y1 - y0 || 1;
  $: cw = VW - PAD.l - PAD.r;
  $: ch = height - PAD.t - PAD.b;

  function toX(x: number) { return PAD.l + ((x - x0) / xSpan) * cw; }
  function toY(y: number) { return PAD.t + ch - ((y - y0) / ySpan) * ch; }

  $: tx = toX(xThreshold);
  $: ty = toY(yThreshold);
  $: xTicks = [x0, xThreshold, x1];
  $: yTicks = [y0, yThreshold, y1];

  $: dots = points.map((p) => ({
    cx: toX(p.x),
    cy: toY(p.y),
    color: p.color ?? '#006FFF',
    label: p.label,
  }));
</script>

{#if points.length > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block" aria-hidden="true" focusable="false">
      <!-- Quadrant zones -->
      <rect x={PAD.l} y={PAD.t} width={tx - PAD.l} height={ty - PAD.t} fill={quadrantColors[0]} />
      <rect x={tx} y={PAD.t} width={PAD.l + cw - tx} height={ty - PAD.t} fill={quadrantColors[1]} />
      <rect x={PAD.l} y={ty} width={tx - PAD.l} height={PAD.t + ch - ty} fill={quadrantColors[2]} />
      <rect x={tx} y={ty} width={PAD.l + cw - tx} height={PAD.t + ch - ty} fill={quadrantColors[3]} />

      <!-- Grid border -->
      <rect x={PAD.l} y={PAD.t} width={cw} height={ch} fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

      <!-- Threshold lines -->
      <line x1={tx} y1={PAD.t} x2={tx} y2={PAD.t + ch} stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="4 3" />
      <line x1={PAD.l} y1={ty} x2={PAD.l + cw} y2={ty} stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="4 3" />

      <!-- Quadrant labels -->
      {#if quadrantLabels[0]}
        <text x={PAD.l + 5} y={PAD.t + 11} fill="rgba(255,255,255,0.22)" font-size="9" font-family="inherit">{quadrantLabels[0]}</text>
      {/if}
      {#if quadrantLabels[1]}
        <text x={PAD.l + cw - 5} y={PAD.t + 11} fill="rgba(255,255,255,0.22)" font-size="9" font-family="inherit" text-anchor="end">{quadrantLabels[1]}</text>
      {/if}
      {#if quadrantLabels[2]}
        <text x={PAD.l + 5} y={PAD.t + ch - 5} fill="rgba(255,255,255,0.22)" font-size="9" font-family="inherit">{quadrantLabels[2]}</text>
      {/if}
      {#if quadrantLabels[3]}
        <text x={PAD.l + cw - 5} y={PAD.t + ch - 5} fill="rgba(255,255,255,0.22)" font-size="9" font-family="inherit" text-anchor="end">{quadrantLabels[3]}</text>
      {/if}

      <!-- Y-axis ticks -->
      {#each yTicks as v, i (i)}
        <text x={PAD.l - 4} y={toY(v) + 3} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{Math.round(v)}</text>
      {/each}

      <!-- X-axis ticks -->
      {#each xTicks as v, i (i)}
        <text x={toX(v)} y={height - 4} fill="#6E7079" font-size="8" text-anchor="middle" font-family="inherit">{Math.round(v)}</text>
      {/each}

      <!-- Axis labels -->
      {#if xLabel}
        <text x={PAD.l + cw / 2} y={height - 2} fill="#6E7079" font-size="8" text-anchor="middle" font-family="inherit">{xLabel}</text>
      {/if}
      {#if yLabel}
        <text
          x={8}
          y={PAD.t + ch / 2}
          fill="#6E7079"
          font-size="8"
          text-anchor="middle"
          font-family="inherit"
          transform="rotate(-90, 8, {PAD.t + ch / 2})"
        >{yLabel}</text>
      {/if}

      <!-- Points -->
      {#each dots as { cx, cy, color, label }, i (i)}
        <circle {cx} {cy} r="5" fill={color} fill-opacity="0.85" />
        {#if label}
          <text x={cx + 7} y={cy + 3} fill="#CDD0DB" font-size="8" font-family="inherit">{label}</text>
        {/if}
      {/each}
    </svg>
  </div>
{/if}
