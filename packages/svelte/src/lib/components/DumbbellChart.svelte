<script module lang="ts">
  export interface DumbbellItem {
    label: string;
    start: number;
    end: number;
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    items?: DumbbellItem[];
    unit?: string;
    color?: string;
    ariaLabel?: string;
  }

  let {
    items = [],
    unit = '',
    color = '#006FFF',
    ariaLabel = 'Dumbbell chart'
  }: Props = $props();

  const VW = 340;
  const LABEL_W = 110;
  const PAD_R = 8;
  const TRACK_W = VW - LABEL_W - PAD_R;
  const DOT_R = 5;
  const ROW_H = 26;
  const PAD_T = 6;
  const AXIS_H = 18;
  const TICKS = 4;

  let allValues = $derived(items.flatMap((it) => [it.start, it.end]));
  let minVal = $derived(allValues.length ? Math.min(...allValues) : 0);
  let maxVal = $derived(allValues.length ? Math.max(...allValues) : 1);
  let range = $derived(maxVal - minVal || 1);
  let svgH = $derived(PAD_T + items.length * ROW_H + AXIS_H);

  function tx(v: number): number {
    return LABEL_W + ((v - minVal) / range) * TRACK_W;
  }

  let ticks = $derived(Array.from({ length: TICKS + 1 }, (_, i) =>
    Math.round(minVal + (i / TICKS) * range),
  ));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {svgH}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each ticks as t, i}
      <line x1={tx(t)} y1={PAD_T} x2={tx(t)} y2={PAD_T + items.length * ROW_H} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x={tx(t)} y={PAD_T + items.length * ROW_H + 13} fill="#6E7079" font-size="9" text-anchor="middle" font-family="inherit">{t}{unit}</text>
    {/each}
    {#each items as item, i}
      {@const cy = PAD_T + i * ROW_H + ROW_H / 2}
      {@const cx1 = tx(item.start)}
      {@const cx2 = tx(item.end)}
      {@const c = item.color ?? color}
      <text x={LABEL_W - 6} y={cy + 4} fill="#A4A7B5" font-size="10" text-anchor="end" font-family="inherit">{item.label}</text>
      <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke={c} stroke-width="2" opacity="0.4" />
      <circle cx={cx1} cy={cy} r={DOT_R} fill="#13131A" stroke={c} stroke-width="1.5" />
      <circle cx={cx2} cy={cy} r={DOT_R} fill={c} />
    {/each}
  </svg>
</div>
