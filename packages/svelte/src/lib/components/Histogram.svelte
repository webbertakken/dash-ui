<script context="module" lang="ts">
  export interface HistogramBin {
    x0: number;
    x1: number;
    count: number;
  }
</script>

<script lang="ts">

  export let bins: HistogramBin[] = [];
  export let height: number = 160;
  export let color: string = '#006FFF';
  export let xUnit: string = '';
  export let ariaLabel: string = 'Histogram';

  const VW = 320;
  const PAD_L = 36;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 28;

  $: PLOT_W = VW - PAD_L - PAD_R;
  $: PLOT_H = height - PAD_T - PAD_B;
  $: maxCount = Math.max(...bins.map((b) => b.count), 1);
  $: barW = PLOT_W / bins.length;

  $: yTicks = [0, 1, 2, 3].map((i) => Math.round((maxCount * i) / 3));

  $: xStep = bins.length <= 6 ? 1 : Math.ceil(bins.length / 5);
  $: xLabels = (() => {
    const labels: { x: number; label: string }[] = [];
    bins.forEach((bin, i) => {
      if (i % xStep === 0) {
        labels.push({ x: PAD_L + i * barW, label: String(bin.x0) + xUnit });
      }
    });
    labels.push({ x: PAD_L + PLOT_W, label: String(bins[bins.length - 1].x1) + xUnit });
    return labels;
  })();

  function bh(count: number): number {
    return (count / maxCount) * PLOT_H;
  }
  function by(count: number): number {
    return PAD_T + PLOT_H - bh(count);
  }
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {VW} {height}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each yTicks as tick, i (i)}
      {@const ty = PAD_T + PLOT_H - (tick / maxCount) * PLOT_H}
      <g>
        <line
          x1={PAD_L} y1={ty}
          x2={PAD_L + PLOT_W} y2={ty}
          stroke="rgba(255,255,255,0.06)" stroke-width="1"
        />
        <text
          x={PAD_L - 4} y={ty + 4}
          fill="#6E7079" font-size="9" text-anchor="end" font-family="inherit"
        >{tick}</text>
      </g>
    {/each}

    {#each bins as bin, i (i)}
      <rect
        x={PAD_L + i * barW + 1}
        y={by(bin.count)}
        width={Math.max(barW - 2, 1)}
        height={bh(bin.count)}
        fill={color}
        opacity="0.85"
      />
    {/each}

    <line
      x1={PAD_L} y1={PAD_T + PLOT_H}
      x2={PAD_L + PLOT_W} y2={PAD_T + PLOT_H}
      stroke="rgba(255,255,255,0.12)" stroke-width="1"
    />

    {#each xLabels as lbl, i (i)}
      <text
        x={lbl.x} y={PAD_T + PLOT_H + 14}
        fill="#6E7079" font-size="9" text-anchor="middle" font-family="inherit"
      >{lbl.label}</text>
    {/each}
  </svg>
</div>
