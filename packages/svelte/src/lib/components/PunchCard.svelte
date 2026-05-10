<script context="module">
  let _n = 0;
</script>
<script lang="ts">
  const _uid = `pc${_n++}`;

  export let data: number[][];
  export let rowLabels: string[] | undefined = undefined;
  export let colLabels: string[] | undefined = undefined;
  export let color: string = '#006FFF';
  export let height: number = 180;
  export let ariaLabel: string = 'Punch card chart';

  const VW = 400;
  const PAD = { t: 16, r: 8, b: 28, l: 28 };
  const DEFAULT_ROWS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  $: rows = data.length;
  $: cols = data[0]?.length ?? 0;
  $: chartW = VW - PAD.l - PAD.r;
  $: chartH = height - PAD.t - PAD.b;
  $: cellW = chartW / (cols || 1);
  $: cellH = chartH / (rows || 1);
  $: maxR = Math.min(cellW, cellH) / 2 * 0.85;
  $: maxVal = Math.max(...data.flat(), 1);
  $: rLabels = rowLabels ?? DEFAULT_ROWS.slice(0, rows);
  $: cLabels = colLabels ?? Array.from({ length: cols }, (_, i) =>
    i % 6 === 0 ? String(i).padStart(2, '0') : ''
  );
  $: dots = data.flatMap((row, ri) =>
    row.map((val, ci) => ({
      ri, ci,
      r: Math.sqrt(val / maxVal) * maxR,
      cx: PAD.l + (ci + 0.5) * cellW,
      cy: PAD.t + (ri + 0.5) * cellH,
    }))
  ).filter(d => d.r >= 0.4);
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
