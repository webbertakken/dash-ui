<script context="module" lang="ts">
  export interface ParetoItem {
    label: string;
    value: number;
    color?: string;
  }
</script>

<script lang="ts">

  export let items: ParetoItem[] = [];
  export let height: number = 160;
  export let ariaLabel: string = 'Pareto chart';
  export let barColor: string = '#006FFF';
  export let lineColor: string = '#F5A623';
  export let threshold: number = 0.8;

  const VW = 400;
  const PAD = { t: 12, r: 40, b: 28, l: 8 };

  $: sorted = [...items].sort((a, b) => b.value - a.value);
  $: total = sorted.reduce((s, it) => s + it.value, 0) || 1;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: bot = PAD.t + chartH;
  $: maxV = sorted[0]?.value || 1;
  $: barW = sorted.length > 0 ? chartW / sorted.length : chartW;
  $: gap = barW * 0.15;
  $: bw = Math.max(barW - gap * 2, 1);

  $: gridLines = [0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);

  $: bars = sorted.map((item, i) => {
    const bh = (item.value / maxV) * chartH;
    const x = PAD.l + i * barW + gap;
    return {
      x: x.toFixed(1),
      y: (bot - bh).toFixed(1),
      w: bw.toFixed(1),
      h: bh.toFixed(1),
      label: item.label,
      color: item.color ?? barColor,
      key: `b${i}`,
    };
  });

  $: linePoints = (() => {
    let cumSum = 0;
    const pts: string[] = [`${PAD.l},${bot}`];
    sorted.forEach((item, i) => {
      cumSum += item.value;
      const pct = cumSum / total;
      const x = PAD.l + (i + 1) * barW;
      const y = PAD.t + (1 - pct) * chartH;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    });
    return pts.join(' ');
  })();

  $: thresholdY = threshold > 0 ? (PAD.t + (1 - threshold) * chartH).toFixed(1) : null;

  $: pctLabels = [0, 50, 100].map((pct) => ({
    label: `${pct}%`,
    y: (PAD.t + (1 - pct / 100) * chartH + 3).toFixed(1),
  }));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as y}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each bars as b (b.key)}
      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} fill-opacity="0.85" rx="2" />
    {/each}
    {#if thresholdY}
      <line x1={PAD.l} y1={thresholdY} x2={VW - PAD.r} y2={thresholdY}
        stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="4 3" />
    {/if}
    <polyline points={linePoints} fill="none" stroke={lineColor} stroke-width="1.5" stroke-linejoin="round" />
    {#each pctLabels as pl}
      <text x={VW - PAD.r + 4} y={pl.y} fill="#6E7079" font-size="8">{pl.label}</text>
    {/each}
    {#each bars as b, i (b.key)}
      {@const cx = (parseFloat(b.x) + parseFloat(b.w) / 2).toFixed(1)}
      <text x={cx} y={height - 4} text-anchor="middle" fill="#6E7079" font-size="9">
        {b.label.length > 8 ? `${b.label.slice(0, 7)}…` : b.label}
      </text>
    {/each}
  </svg>
</div>
