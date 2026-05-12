<script context="module" lang="ts">
  export interface DotPlotItem {
    label: string;
    value: number;
    compare?: number;
    color?: string;
  }
</script>

<script lang="ts">

  export let items: DotPlotItem[] = [];
  export let min: number = 0;
  export let max: number | undefined = undefined;
  export let unit: string = '';
  export let valueLegend: string | undefined = undefined;
  export let compareLegend: string | undefined = undefined;
  export let ariaLabel: string = 'Dot plot';

  const VW = 380;
  const LABEL_W = 132;
  const VALUE_W = 32;
  const PAD_R = 6;
  const TRACK_W = VW - LABEL_W - VALUE_W - PAD_R;
  const DOT_R = 5;
  const ROW_H = 28;
  const PAD_T = 8;
  const AXIS_H = 18;
  const LEG_H = 18;
  const TICKS = 5;

  $: hasCompare = items.some((it) => it.compare !== undefined);
  $: maxVal = max ?? Math.max(...items.map((it) => Math.max(it.value, it.compare ?? 0)));
  $: range = Math.max(maxVal - min, 1);
  $: svgH =
    PAD_T +
    items.length * ROW_H +
    AXIS_H +
    (hasCompare && (valueLegend || compareLegend) ? LEG_H + 4 : 0);
  $: ticks = Array.from({ length: TICKS }, (_, i) => min + (i / (TICKS - 1)) * range);
  $: legY = PAD_T + items.length * ROW_H + AXIS_H + 4;

  function tx(v: number): number {
    return LABEL_W + ((v - min) / range) * TRACK_W;
  }

  function fmtTick(t: number): string {
    return (Number.isInteger(t) ? t : t.toFixed(1)) + unit;
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
        >{fmtTick(t)}</text>
      </g>
    {/each}

    {#each items as item, i (item.label)}
      {@const cy = PAD_T + i * ROW_H + ROW_H / 2}
      {@const cx = tx(item.value)}
      {@const ccx = item.compare !== undefined ? tx(item.compare) : null}
      {@const color = item.color ?? '#006FFF'}
      <g>
        <text
          x={LABEL_W - 8} y={cy + 4}
          fill="#A4A7B5" font-size="10" text-anchor="end" font-family="inherit"
        >{item.label}</text>

        <line
          x1={LABEL_W} y1={cy} x2={LABEL_W + TRACK_W} y2={cy}
          stroke="rgba(255,255,255,0.06)" stroke-width="1"
        />

        {#if ccx !== null}
          <line
            x1={Math.min(cx, ccx)} y1={cy}
            x2={Math.max(cx, ccx)} y2={cy}
            stroke={color} stroke-width="1.5" opacity="0.35"
          />
          <circle cx={ccx} cy={cy} r={DOT_R - 1} fill="none" stroke="#A4A7B5" stroke-width="1.5" />
        {/if}

        <circle cx={cx} cy={cy} r={DOT_R} fill={color} />

        <text
          x={LABEL_W + TRACK_W + 6} y={cy + 4}
          fill="#A4A7B5" font-size="9" font-family="inherit"
        >{item.value}{unit}</text>
      </g>
    {/each}

    {#if hasCompare && (valueLegend || compareLegend)}
      {#if valueLegend}
        <circle cx={LABEL_W} cy={legY + 5} r="4" fill="#006FFF" />
        <text x={LABEL_W + 10} y={legY + 9} fill="#A4A7B5" font-size="9" font-family="inherit">{valueLegend}</text>
      {/if}
      {#if compareLegend}
        <circle
          cx={LABEL_W + (valueLegend ? 80 : 0)} cy={legY + 5}
          r="3" fill="none" stroke="#A4A7B5" stroke-width="1.5"
        />
        <text
          x={LABEL_W + (valueLegend ? 90 : 10)} y={legY + 9}
          fill="#A4A7B5" font-size="9" font-family="inherit"
        >{compareLegend}</text>
      {/if}
    {/if}
  </svg>
</div>
