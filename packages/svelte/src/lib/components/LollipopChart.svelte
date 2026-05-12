<script context="module" lang="ts">
  export interface LollipopItem {
    label: string;
    value: number;
    color?: string;
  }
</script>

<script lang="ts">

  export let items: LollipopItem[] = [];
  export let unit: string = '';
  export let color: string = '#006FFF';
  export let ariaLabel: string = 'Lollipop chart';

  const VW = 340;
  const LABEL_W = 110;
  const VAL_W = 36;
  const PAD_R = 4;
  const TRACK_W = VW - LABEL_W - VAL_W - PAD_R;
  const DOT_R = 5;
  const ROW_H = 26;
  const PAD_T = 6;
  const AXIS_H = 18;
  const TICKS = 4;

  $: maxVal = Math.max(...items.map((it) => it.value), 1);
  $: svgH = PAD_T + items.length * ROW_H + AXIS_H;
  $: ticks = Array.from({ length: TICKS + 1 }, (_, i) => Math.round((i / TICKS) * maxVal));

  function tx(v: number): number {
    return LABEL_W + (v / maxVal) * TRACK_W;
  }
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {VW} {svgH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each ticks as t, i (i)}
      <g>
        <line
          x1={tx(t)} y1={PAD_T}
          x2={tx(t)} y2={PAD_T + items.length * ROW_H}
          stroke="rgba(255,255,255,0.06)" stroke-width="1"
        />
        <text
          x={tx(t)} y={PAD_T + items.length * ROW_H + 13}
          fill="#6E7079" font-size="9" text-anchor="middle" font-family="inherit"
        >{t}{unit}</text>
      </g>
    {/each}

    {#each items as item, i (item.label)}
      {@const cy = PAD_T + i * ROW_H + ROW_H / 2}
      {@const cx = tx(item.value)}
      {@const c = item.color ?? color}
      <g>
        <text
          x={LABEL_W - 6} y={cy + 4}
          fill="#A4A7B5" font-size="10" text-anchor="end" font-family="inherit"
        >{item.label}</text>

        <line
          x1={LABEL_W} y1={cy}
          x2={cx} y2={cy}
          stroke={c} stroke-width="1.5" opacity="0.5"
        />

        <circle cx={cx} cy={cy} r={DOT_R} fill={c} />

        <text
          x={cx + DOT_R + 4} y={cy + 4}
          fill="#A4A7B5" font-size="9" font-family="inherit"
        >{item.value}{unit}</text>
      </g>
    {/each}
  </svg>
</div>
