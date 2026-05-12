<script context="module" lang="ts">
  export interface DualAxisSeries {
    label: string;
    color: string;
    values: number[];
  }
</script>

<script lang="ts">

  export let bars: DualAxisSeries;
  export let line: DualAxisSeries;
  export let labels: string[] = [];
  export let height = 160;
  export let ariaLabel = 'Dual axis chart';

  const VW = 400;
  const PAD = { t: 16, r: 44, b: 28, l: 44 };

  function fmtTick(n: number): string {
    if (n >= 1000) return `${Math.round(n / 1000)}k`;
    return String(Math.round(n));
  }

  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: bot = PAD.t + chartH;
  $: n = bars.values.length;
  $: gw = n > 0 ? chartW / n : chartW;
  $: barW = gw * 0.55;
  $: barMax = Math.max(...bars.values, 1);
  $: lineMin = Math.min(...line.values);
  $: lineMax = Math.max(...line.values, lineMin + 1);
  $: lineRange = lineMax - lineMin || 1;
  $: gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);
  $: leftTicks = [0, 0.5, 1].map((f) => ({ y: PAD.t + (1 - f) * chartH, label: fmtTick(barMax * f) }));
  $: rightTicks = [0, 0.5, 1].map((f) => ({ y: PAD.t + (1 - f) * chartH, label: fmtTick(lineMin + lineRange * f) }));
  $: barRects = bars.values.map((v, i) => ({
    x: (PAD.l + i * gw + gw / 2 - barW / 2).toFixed(1),
    y: (bot - (v / barMax) * chartH).toFixed(1),
    w: barW.toFixed(1),
    h: ((v / barMax) * chartH).toFixed(1),
  }));
  $: linePoints = line.values.map((v, i) =>
    `${(PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2)).toFixed(1)},${(PAD.t + chartH - ((v - lineMin) / lineRange) * chartH).toFixed(1)}`
  );
  $: linePath = linePoints.length ? `M ${linePoints.join(' L ')}` : '';
  $: lineArea = linePoints.length
    ? `M ${PAD.l.toFixed(1)},${bot.toFixed(1)} L ${linePoints.join(' L ')} L ${(PAD.l + (n > 1 ? chartW : 0)).toFixed(1)},${bot.toFixed(1)} Z`
    : '';
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each gridLines as y}
      <line x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each leftTicks as t}
      <text x={PAD.l - 4} y={t.y + 4} text-anchor="end" fill={bars.color} font-size="9" font-family="inherit" fill-opacity="0.8">{t.label}</text>
    {/each}
    {#each rightTicks as t}
      <text x={VW - PAD.r + 4} y={t.y + 4} text-anchor="start" fill={line.color} font-size="9" font-family="inherit" fill-opacity="0.8">{t.label}</text>
    {/each}
    {#each barRects as b}
      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={bars.color} fill-opacity="0.75" rx="2" />
    {/each}
    {#if lineArea}<path d={lineArea} fill={line.color} fill-opacity="0.12" />{/if}
    {#if linePath}<path d={linePath} fill="none" stroke={line.color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />{/if}
    {#each labels as lbl, i}
      <text x={(PAD.l + (i + 0.5) * gw).toFixed(1)} y={height - 4} text-anchor="middle" fill="#6E7079" font-size="9" font-family="inherit">{lbl}</text>
    {/each}
  </svg>
  <div style="display:flex;gap:16px;justify-content:center;font-size:11px;color:#A4A7B5;margin-top:4px;">
    <span style="display:flex;align-items:center;gap:4px;">
      <span style="display:inline-block;width:10px;height:10px;background:{bars.color};border-radius:2px;opacity:0.75;"></span>
      {bars.label}
    </span>
    <span style="display:flex;align-items:center;gap:4px;">
      <span style="display:inline-block;width:16px;height:2px;background:{line.color};border-radius:1px;"></span>
      {line.label}
    </span>
  </div>
</div>
