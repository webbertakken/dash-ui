<script lang="ts">
  export interface StackedBarSeries {
    label: string;
    color: string;
    values: number[];
  }

  export let series: StackedBarSeries[] = [];
  export let labels: string[] = [];
  export let height = 180;
  export let normalized = false;
  export let ariaLabel = 'Stacked bar chart';

  const VW = 400;
  const PAD = { t: 10, r: 8, b: 28, l: 36 };

  $: n = series.length && series[0].values.length ? series[0].values.length : 0;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: bot = PAD.t + chartH;
  $: barW = n > 0 ? (chartW / n) * 0.72 : 0;
  $: gap = n > 0 ? (chartW / n) * 0.28 : 0;

  $: totals = Array.from({ length: n }, (_, i) =>
    series.reduce((s, ser) => s + (ser.values[i] ?? 0), 0)
  );

  $: maxTotal = normalized ? 1 : (totals.length ? Math.max(...totals) : 1) || 1;

  $: stacks = Array.from({ length: n }, (_, gi) => {
    let y = bot;
    const total = totals[gi] || 1;
    return series.map((ser) => {
      const raw = ser.values[gi] ?? 0;
      const v = normalized ? raw / total : raw;
      const bh = (v / maxTotal) * chartH;
      const rect = {
        x: PAD.l + gi * (barW + gap) + gap / 2,
        y: y - bh,
        w: barW,
        h: bh,
        color: ser.color,
        key: `${gi}-${ser.label}`,
      };
      y -= bh;
      return rect;
    });
  });

  $: gridFracs = [0.25, 0.5, 0.75, 1];
  $: gridLines = gridFracs.map((f) => ({
    y: PAD.t + (1 - f) * chartH,
    label: normalized ? `${Math.round(f * 100)}%` : String(Math.round(f * maxTotal)),
  }));

  $: xLabels = Array.from({ length: n }, (_, i) => ({
    x: PAD.l + i * (barW + gap) + gap / 2 + barW / 2,
    text: labels[i] ?? String(i),
  }));
</script>

{#if n > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each gridLines as g, i (i)}
        <line x1={PAD.l} y1={g.y} x2={VW - PAD.r} y2={g.y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <text x={PAD.l - 4} y={g.y + 3} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{g.label}</text>
      {/each}

      {#each stacks as rects, gi (gi)}
        {#each rects as r (r.key)}
          {#if r.h > 0}
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} fill-opacity="0.9" />
          {/if}
        {/each}
      {/each}

      {#each xLabels as l, i (i)}
        <text x={l.x} y={height - 6} fill="#6E7079" font-size="8" text-anchor="middle" font-family="inherit">{l.text}</text>
      {/each}
    </svg>
  </div>
{/if}
