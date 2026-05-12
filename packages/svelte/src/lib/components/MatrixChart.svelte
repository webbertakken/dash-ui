<script lang="ts">
  interface Props {
    rows?: string[];
    cols?: string[];
    values?: number[][];
    unit?: string;
    ariaLabel?: string;
  }

  let {
    rows = [],
    cols = [],
    values = [],
    unit = '',
    ariaLabel = 'Matrix chart'
  }: Props = $props();

  const LEFT = 80;
  const TOP = 60;
  const CELL = 38;

  function cellColor(t: number): string {
    const alpha = 0.07 + t * 0.88;
    return `rgba(0,111,255,${alpha.toFixed(2)})`;
  }

  function fmt(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  }

  let allVals = $derived(values.flat());
  let max = $derived(Math.max(...allVals, 1));
  let W = $derived(LEFT + cols.length * CELL);
  let H = $derived(TOP + rows.length * CELL);
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {W} {H}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each cols as col, ci}
      {@const cx = LEFT + ci * CELL + CELL / 2}
      <text x={cx} y={TOP - 8} fill="#A4A7B5" font-size="10" text-anchor="end" font-family="inherit" transform="rotate(-40, {cx}, {TOP - 8})">{col}</text>
    {/each}

    {#each rows as row, ri}
      {@const cy = TOP + ri * CELL + CELL / 2}
      <text x={LEFT - 8} y={cy + 4} fill="#A4A7B5" font-size="10" text-anchor="end" font-family="inherit">{row}</text>
    {/each}

    {#each rows as _, ri}
      {#each cols as _, ci}
        {@const v = values[ri]?.[ci] ?? 0}
        {@const t = v / max}
        {@const x = LEFT + ci * CELL}
        {@const y = TOP + ri * CELL}
        {@const cx = x + CELL / 2}
        {@const cy = y + CELL / 2}
        <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx="3" fill={cellColor(t)} />
        {#if v > 0}
          <text x={cx} y={cy + 4} fill={t > 0.5 ? '#fff' : '#A4A7B5'} font-size="9" text-anchor="middle" font-family="inherit">{fmt(v)}{unit}</text>
        {/if}
      {/each}
    {/each}
  </svg>
</div>
