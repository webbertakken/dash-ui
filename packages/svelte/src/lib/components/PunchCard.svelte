<script module>
  let _n = 0;
</script>
<script lang="ts">
  const _uid = `pc${_n++}`;

  interface Props {
    data: number[][];
    rowLabels?: string[] | undefined;
    colLabels?: string[] | undefined;
    color?: string;
    height?: number;
    ariaLabel?: string;
  }

  let {
    data,
    rowLabels = undefined,
    colLabels = undefined,
    color = '#006FFF',
    height = 180,
    ariaLabel = 'Punch card chart'
  }: Props = $props();

  const VW = 400;
  const PAD = { t: 16, r: 8, b: 28, l: 28 };
  const DEFAULT_ROWS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let rows = $derived(data.length);
  let cols = $derived(data[0]?.length ?? 0);
  let chartW = $derived(VW - PAD.l - PAD.r);
  let chartH = $derived(height - PAD.t - PAD.b);
  let cellW = $derived(chartW / (cols || 1));
  let cellH = $derived(chartH / (rows || 1));
  let maxR = $derived(Math.min(cellW, cellH) / 2 * 0.85);
  let maxVal = $derived(Math.max(...data.flat(), 1));
  let rLabels = $derived(rowLabels ?? DEFAULT_ROWS.slice(0, rows));
  let cLabels = $derived(colLabels ?? Array.from({ length: cols }, (_, i) =>
    i % 6 === 0 ? String(i).padStart(2, '0') : ''
  ));
  let dots = $derived(data.flatMap((row, ri) =>
    row.map((val, ci) => ({
      ri, ci,
      r: Math.sqrt(val / maxVal) * maxR,
      cx: PAD.l + (ci + 0.5) * cellW,
      cy: PAD.t + (ri + 0.5) * cellH,
    }))
  ).filter(d => d.r >= 0.4));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%">
  <svg
    viewBox="0 0 {VW} {height}"
    style="width:100%;height:auto;display:block"
    aria-hidden="true"
    focusable="false"
  >
    {#each rLabels as lbl, ri (ri)}
      <text
        x={PAD.l - 4}
        y={PAD.t + (ri + 0.5) * cellH + 3}
        font-size="8"
        fill="#6E7079"
        text-anchor="end"
        font-family="inherit"
      >{lbl}</text>
    {/each}
    {#each cLabels as lbl, ci (ci)}
      {#if lbl}
        <text
          x={PAD.l + (ci + 0.5) * cellW}
          y={height - 6}
          font-size="7"
          fill="#6E7079"
          text-anchor="middle"
          font-family="inherit"
        >{lbl}</text>
      {/if}
    {/each}
    {#each dots as { cx, cy, r, ri, ci } (`${ri}-${ci}`)}
      <circle {cx} {cy} {r} fill={color} fill-opacity="0.72" />
    {/each}
  </svg>
</div>
