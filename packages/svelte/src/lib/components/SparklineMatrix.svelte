<script module lang="ts">
  export interface SparklineMatrixRow {
    label: string;
    values: number[];
    unit?: string;
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    rows?: SparklineMatrixRow[];
    height?: number;
    ariaLabel?: string;
  }

  let { rows = [], height = 160, ariaLabel = 'Sparkline matrix' }: Props = $props();

  const VW = 380;
  const PAD_L = 76;
  const PAD_R = 44;
  const SPARK_PAD_X = 8;
  const SPARK_PAD_Y = 5;
  const PALETTE = ['#006FFF', '#00C875', '#7FB6FF', '#F5A623', '#FF7B7B', '#A78BFA'];

  let rowH = $derived(height / (rows.length || 1));
  let sparkX0 = $derived(PAD_L + SPARK_PAD_X);
  let sparkW = $derived(VW - PAD_L - PAD_R - SPARK_PAD_X * 2);
  let sparkH = $derived(rowH - SPARK_PAD_Y * 2);

  let computed = $derived(rows.map((row, i) => {
    const y0 = i * rowH + SPARK_PAD_Y;
    const color = row.color ?? PALETTE[i % PALETTE.length];
    const min = Math.min(...row.values);
    const max = Math.max(...row.values);
    const range = max - min || 1;
    const lastVal = row.values[row.values.length - 1];

    const d =
      row.values.length < 2
        ? ''
        : row.values
            .map((v, j) => {
              const x = sparkX0 + (j / (row.values.length - 1)) * sparkW;
              const y = y0 + sparkH - ((v - min) / range) * sparkH;
              return `${j === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

    const dotY = y0 + sparkH - ((lastVal - min) / range) * sparkH;
    return { color, lastVal, d, dotX: sparkX0 + sparkW, dotY, midY: i * rowH + rowH / 2 };
  }));
</script>

{#if rows.length}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg
      viewBox="0 0 {VW} {height}"
      style="width:100%;height:auto;display:block;"
      aria-hidden="true"
      focusable="false"
    >
      {#each rows as row, i}
        <g>
          {#if i > 0}
            <line
              x1={0} y1={i * rowH} x2={VW} y2={i * rowH}
              stroke="rgba(255,255,255,0.06)" stroke-width="1"
            />
          {/if}
          <text
            x={PAD_L - 6} y={computed[i].midY + 3.5} text-anchor="end"
            fill="#6E7079" font-size="9" font-family="inherit"
          >{row.label}</text>
          {#if computed[i].d}
            <path
              d={computed[i].d} fill="none" stroke={computed[i].color} stroke-width="1.5"
              stroke-linejoin="round" stroke-linecap="round"
            />
          {/if}
          <circle cx={computed[i].dotX} cy={computed[i].dotY} r="2.5" fill={computed[i].color} />
          <text
            x={VW - PAD_R + 6} y={computed[i].midY + 3.5} text-anchor="start"
            fill={computed[i].color} font-size="9" font-family="inherit"
          >{Math.round(computed[i].lastVal)}{row.unit ?? ''}</text>
        </g>
      {/each}
    </svg>
  </div>
{/if}
