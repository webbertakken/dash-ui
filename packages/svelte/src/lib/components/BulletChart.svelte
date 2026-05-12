<script module lang="ts">
  export interface BulletItem {
    label: string;
    value: number;
    target?: number;
    ranges?: [number, number];
    unit?: string;
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    items?: BulletItem[];
    max?: number;
    ariaLabel?: string;
  }

  let { items = [], max = 100, ariaLabel = 'Bullet chart' }: Props = $props();

  const VW = 400;
  const LABEL_W = 110;
  const VAL_W = 44;
  const TRACK_H = 10;
  const RANGE_H = 18;
  const ROW_H = 34;
  const PAD = 8;

  let trackW = $derived(VW - LABEL_W - VAL_W);
  let totalH = $derived(items.length * ROW_H + PAD * 2);

  let rows = $derived(items.map((item, i) => {
    const y = PAD + i * ROW_H;
    const midY = y + ROW_H / 2;
    const rangeY = midY - RANGE_H / 2;
    const trackY = midY - TRACK_H / 2;
    const [r1, r2] = item.ranges ?? [50, 75];
    const r1w = (r1 / max) * trackW;
    const r2w = (r2 / max) * trackW;
    const valW = Math.min(item.value / max, 1) * trackW;
    const targetX = item.target != null ? (Math.min(item.target, max) / max) * trackW : null;
    return {
      midY,
      rangeY,
      trackY,
      r1w,
      r2w,
      valW,
      targetX,
      color: item.color ?? '#006FFF',
      unit: item.unit ?? '%',
      label: item.label,
      value: item.value,
    };
  }));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {totalH}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each rows as row}
      <text x={LABEL_W - 8} y={row.midY + 4} text-anchor="end" fill="#A4A7B5" font-size="11" font-family="inherit">
        {row.label}
      </text>
      <rect x={LABEL_W} y={row.rangeY} width={trackW} height={RANGE_H} fill="rgba(255,255,255,0.04)" rx="2" />
      <rect x={LABEL_W + row.r1w} y={row.rangeY} width={trackW - row.r1w} height={RANGE_H} fill="rgba(255,255,255,0.07)" rx="2" />
      <rect x={LABEL_W + row.r2w} y={row.rangeY} width={trackW - row.r2w} height={RANGE_H} fill="rgba(255,255,255,0.10)" rx="2" />
      <rect x={LABEL_W} y={row.trackY} width={row.valW} height={TRACK_H} fill={row.color} fill-opacity="0.9" rx="2" />
      {#if row.targetX != null}
        <rect x={LABEL_W + row.targetX - 1.5} y={row.rangeY} width="3" height={RANGE_H} fill="rgba(255,255,255,0.85)" rx="1" />
      {/if}
      <text x={LABEL_W + trackW + 6} y={row.midY + 4} fill="#fff" font-size="11" font-family="inherit" style="font-variant-numeric: tabular-nums">
        {row.value}{row.unit}
      </text>
    {/each}
  </svg>
</div>
