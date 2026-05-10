<script lang="ts">
  export let labels: string[] = [];
  export let data: number[][] = [];
  export let cellSize: number = 52;
  export let ariaLabel: string = 'Correlation matrix';

  const LABEL_W = 68;
  const LABEL_H = 26;
  const DARK = [26, 29, 43];
  const BLUE = [0, 111, 255];
  const RED  = [255, 59, 48];

  function lerp(a: number, b: number, t: number): number {
    return Math.round(a + (b - a) * t);
  }

  function cellColor(v: number): string {
    const t = Math.max(0, Math.min(1, Math.abs(v)));
    const [r0, g0, b0] = DARK;
    if (v >= 0) {
      const [r1, g1, b1] = BLUE;
      return `rgb(${lerp(r0, r1, t)},${lerp(g0, g1, t)},${lerp(b0, b1, t)})`;
    }
    const [r1, g1, b1] = RED;
    return `rgb(${lerp(r0, r1, t)},${lerp(g0, g1, t)},${lerp(b0, b1, t)})`;
  }

  $: n = labels.length;
  $: svgW = LABEL_W + n * cellSize;
  $: svgH = LABEL_H + n * cellSize;
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {svgW} {svgH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each labels as label, j (j)}
      <text
        x={LABEL_W + j * cellSize + cellSize / 2}
        y={LABEL_H - 4}
        text-anchor="middle"
        font-size="9"
        fill="#A4A7B5"
        font-family="inherit"
      >{label}</text>
    {/each}

    {#each labels as label, i (i)}
      <text
        x={LABEL_W - 4}
        y={LABEL_H + i * cellSize + cellSize / 2}
        text-anchor="end"
        dominant-baseline="middle"
        font-size="9"
        fill="#A4A7B5"
        font-family="inherit"
      >{label}</text>
    {/each}

    {#each data as row, i (i)}
      {#each row as v, j (`${i}-${j}`)}
        {@const x = LABEL_W + j * cellSize}
        {@const y = LABEL_H + i * cellSize}
        <g>
          <rect
            x={x + 1}
            y={y + 1}
            width={cellSize - 2}
            height={cellSize - 2}
            fill={cellColor(v)}
            rx="3"
          />
          <text
            x={x + cellSize / 2}
            y={y + cellSize / 2}
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="10"
            fill={Math.abs(v) >= 0.5 ? '#fff' : '#A4A7B5'}
            font-family="inherit"
            font-weight={i === j ? '700' : '400'}
          >{v.toFixed(2)}</text>
        </g>
      {/each}
    {/each}
  </svg>
</div>
