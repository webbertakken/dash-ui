<script context="module" lang="ts">
  export interface ErrorBandSeries {
    label: string;
    color: string;
    mean: number[];
    lower: number[];
    upper: number[];
  }
</script>

<script lang="ts">

  export let series: ErrorBandSeries[] = [];
  export let xLabels: string[] = [];
  export let yRange: [number, number] | undefined = undefined;
  export let height = 180;
  export let unit = '';
  export let ariaLabel = 'Error band chart';

  const VW = 340;
  const PAD_L = 28;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 20;
  const PLOT_W = VW - PAD_L - PAD_R;

  $: n = series.length ? series[0].mean.length : 0;
  $: PLOT_H = height - PAD_T - PAD_B;
  $: allVals = series.flatMap((s) => [...s.lower, ...s.upper]);
  $: minV = yRange ? yRange[0] : allVals.length ? Math.min(...allVals) : 0;
  $: maxV = yRange ? yRange[1] : allVals.length ? Math.max(...allVals) : 1;
  $: vRange = maxV - minV || 1;
  $: yTicks = [minV, (minV + maxV) / 2, maxV];

  function tx(i: number): number {
    return PAD_L + (i / (n - 1 || 1)) * PLOT_W;
  }

  function ty(v: number): number {
    return PAD_T + (1 - (v - minV) / vRange) * PLOT_H;
  }

  function bandPath(lower: number[], upper: number[]): string {
    const top = upper.map((v, i) => `${i === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');
    const bot = [...lower].reverse().map((v, i) => `L${tx(n - 1 - i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');
    return `${top} ${bot} Z`;
  }

  function linePath(mean: number[]): string {
    return mean.map((v, i) => `${i === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');
  }
</script>

{#if series.length && n > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each yTicks as v, i (i)}
        <line x1={PAD_L} y1={ty(v)} x2={PAD_L + PLOT_W} y2={ty(v)} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <text x={PAD_L - 4} y={ty(v) + 4} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{Math.round(v)}{unit}</text>
      {/each}

      {#each series as s, si (si)}
        <path d={bandPath(s.lower, s.upper)} fill={s.color} opacity="0.12" />
        <path d={linePath(s.mean)} fill="none" stroke={s.color} stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
      {/each}

      {#each xLabels as lbl, i (i)}
        <text x={PAD_L + (i / (xLabels.length - 1 || 1)) * PLOT_W} y={height - 4} fill="#6E7079" font-size="9" text-anchor="middle" font-family="inherit">{lbl}</text>
      {/each}
    </svg>
  </div>
{/if}
