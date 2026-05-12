<script context="module" lang="ts">
  export interface BeeswarmSeries {
    label: string;
    points: number[];
    color?: string;
  }
</script>

<script lang="ts">

  export let series: BeeswarmSeries[] = [];
  export let yRange: [number, number] | undefined = undefined;
  export let height = 200;
  export let unit = '';
  export let dotRadius = 4;
  export let ariaLabel = 'Beeswarm chart';

  const PALETTE = ['#006FFF', '#00C875', '#FF7B7B', '#F5C26B', '#A78BFA', '#34D399'];
  const VW = 340;
  const PAD_L = 28;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 24;

  function swarmedPositions(values: number[], tyFn: (v: number) => number, r: number, halfWidth: number): { x: number; y: number }[] {
    const pts: { x: number; y: number }[] = [];
    const sorted = [...values].sort((a, b) => a - b);
    const step = r * 2 + 0.5;
    for (const v of sorted) {
      const cy = tyFn(v);
      let chosen = 0;
      let found = false;
      for (let dist = 0; dist <= halfWidth && !found; dist += step) {
        const candidates = dist === 0 ? [0] : [dist, -dist];
        for (const cx of candidates) {
          if (pts.every((p) => Math.hypot(cx - p.x, cy - p.y) >= r * 2)) {
            chosen = cx;
            found = true;
            break;
          }
        }
      }
      pts.push({ x: chosen, y: cy });
    }
    return pts;
  }

  $: PLOT_W = VW - PAD_L - PAD_R;
  $: PLOT_H = height - PAD_T - PAD_B;
  $: n = series.length || 1;
  $: colWidth = PLOT_W / n;
  $: halfWidth = colWidth / 2 - dotRadius;
  $: allPts = series.flatMap((s) => s.points);
  $: minV = yRange ? yRange[0] : allPts.length ? Math.min(...allPts) : 0;
  $: maxV = yRange ? yRange[1] : allPts.length ? Math.max(...allPts) : 1;
  $: vRange = maxV - minV || 1;
  $: yTicks = [minV, (minV + maxV) / 2, maxV];

  function ty(v: number): number {
    return PAD_T + (1 - (v - minV) / vRange) * PLOT_H;
  }

  function colCx(i: number): number {
    return PAD_L + (i + 0.5) * colWidth;
  }

  $: swarmed = series.map((s) => swarmedPositions(s.points, ty, dotRadius, halfWidth));
</script>

{#if series.length > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each yTicks as v, i (i)}
        <line x1={PAD_L} y1={ty(v)} x2={PAD_L + PLOT_W} y2={ty(v)} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <text x={PAD_L - 4} y={ty(v) + 4} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{Math.round(v)}{unit}</text>
      {/each}

      {#each series as s, si (si)}
        {@const cx = colCx(si)}
        {@const color = s.color ?? PALETTE[si % PALETTE.length]}
        {@const pts = swarmed[si]}
        <g>
          {#each pts as p, pi (pi)}
            <circle cx={cx + p.x} cy={p.y} r={dotRadius} fill={color} fill-opacity="0.75" />
          {/each}
          <text x={cx} y={height - 4} fill="#6E7079" font-size="9" text-anchor="middle" font-family="inherit">{s.label}</text>
        </g>
      {/each}
    </svg>
  </div>
{/if}
