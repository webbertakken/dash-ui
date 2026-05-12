<script module lang="ts">
  export interface HorizonSeries {
    label: string;
    values: number[];
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    series?: HorizonSeries[];
    xLabels?: string[] | undefined;
    bands?: number;
    ariaLabel?: string;
  }

  let {
    series = [],
    xLabels = undefined,
    bands = 3,
    ariaLabel = 'Horizon chart'
  }: Props = $props();

  const LABEL_W = 72;
  const ROW_H = 24;
  const ROW_GAP = 3;
  const X_H = 14;
  const W = 400;

  let n = $derived(series[0]?.values.length ?? 0);
  let allVals = $derived(series.flatMap((s) => s.values));
  let maxVal = $derived(Math.max(...allVals, 1));
  let step = $derived(maxVal / bands);
  let chartW = $derived(W - LABEL_W);
  let colW = $derived(chartW / Math.max(n, 1));
  let totalH = $derived(series.length * (ROW_H + ROW_GAP) - ROW_GAP + (xLabels ? X_H + 4 : 0));

  interface Band { x: number; y: number; w: number; h: number; alpha: number; color: string; }
  interface Row { rowY: number; color: string; label: string; bands: Band[]; }

  let rows = $derived(series.map((s, si) => {
    const rowY = si * (ROW_H + ROW_GAP);
    const color = s.color ?? '#006FFF';
    const rowBands: Band[] = [];
    s.values.forEach((v, ti) => {
      for (let k = 0; k < bands; k++) {
        const lo = k * step;
        const fill = Math.min(Math.max(v - lo, 0), step) / step;
        if (fill <= 0) continue;
        const alpha = 0.25 + 0.3 * k;
        const rH = fill * ROW_H;
        rowBands.push({ x: LABEL_W + ti * colW, y: rowY + ROW_H - rH, w: Math.max(colW - 0.5, 0.5), h: rH, alpha, color });
      }
    });
    return { rowY, color, label: s.label, bands: rowBands } as Row;
  }));

  let xTickPositions = $derived(xLabels
    ? xLabels.map((label, i) => ({
        label,
        x: LABEL_W + (i / Math.max(xLabels!.length - 1, 1)) * chartW,
        anchor: i === 0 ? 'start' : i === xLabels!.length - 1 ? 'end' : 'middle',
      }))
    : []);
</script>

{#if series.length}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {W} {totalH}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each rows as row, si (si)}
        <text x={LABEL_W - 6} y={row.rowY + ROW_H / 2 + 4} text-anchor="end" fill="#C8C9D0" font-size="9" font-family="inherit">{row.label}</text>
        <rect x={LABEL_W} y={row.rowY} width={chartW} height={ROW_H} fill="rgba(255,255,255,0.04)" rx="2" />
        {#each row.bands as b, bi (bi)}
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} opacity={b.alpha} rx="1" />
        {/each}
      {/each}
      {#each xTickPositions as tick, i (i)}
        <text x={tick.x} y={totalH} text-anchor={tick.anchor} fill="#6E7079" font-size="8" font-family="inherit">{tick.label}</text>
      {/each}
    </svg>
  </div>
{/if}
