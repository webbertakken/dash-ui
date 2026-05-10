<script lang="ts">
  export type UptimeStatus = 'up' | 'degraded' | 'down';

  export interface UptimeSegment {
    from: number;
    to: number;
    status: UptimeStatus;
  }

  export interface UptimeSeries {
    label: string;
    segments: UptimeSegment[];
  }

  export let series: UptimeSeries[] = [];
  export let xLabels: string[] = [];
  export let ariaLabel: string = 'Uptime timeline';

  const VW = 400;
  const LABEL_W = 88;
  const PAD_R = 10;
  const PAD_T = 6;
  const ROW_H = 14;
  const ROW_GAP = 8;
  const XLBL_H = 16;
  const LEG_H = 16;
  const PAD_B = XLBL_H + LEG_H + 4;

  const STATUS_COLOR: Record<UptimeStatus, string> = {
    up: '#00C875',
    degraded: '#F5A623',
    down: '#F03E3E',
  };

  const LEGEND: { status: UptimeStatus; label: string }[] = [
    { status: 'up', label: 'Up' },
    { status: 'degraded', label: 'Degraded' },
    { status: 'down', label: 'Down' },
  ];

  $: trackW = VW - LABEL_W - PAD_R;
  $: rowsH = series.length * (ROW_H + ROW_GAP) - ROW_GAP;
  $: totalH = PAD_T + rowsH + PAD_B;
  $: xlblY = PAD_T + rowsH + XLBL_H;
  $: legY = xlblY + LEG_H;

  $: rows = series.map((s, si) => ({
    label: s.label,
    y: PAD_T + si * (ROW_H + ROW_GAP),
    midY: PAD_T + si * (ROW_H + ROW_GAP) + ROW_H / 2 + 4,
    segs: s.segments.map((seg) => ({
      x: LABEL_W + seg.from * trackW,
      w: (seg.to - seg.from) * trackW,
      color: STATUS_COLOR[seg.status],
    })),
  }));

  $: xlbls = xLabels.map((lbl, i) => ({
    lbl,
    x: LABEL_W + (xLabels.length > 1 ? i / (xLabels.length - 1) : 0) * trackW,
    anchor: i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle',
  }));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {totalH}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each rows as row}
      <text x={LABEL_W - 8} y={row.midY} text-anchor="end" fill="#A4A7B5" font-size="11" font-family="inherit">
        {row.label}
      </text>
      <rect x={LABEL_W} y={row.y} width={trackW} height={ROW_H} fill="rgba(255,255,255,0.04)" rx="3" />
      {#each row.segs as seg}
        <rect x={seg.x} y={row.y} width={seg.w} height={ROW_H} fill={seg.color} rx="2" fill-opacity="0.85" />
      {/each}
    {/each}

    {#each xlbls as { lbl, x, anchor }}
      <text {x} y={xlblY} text-anchor={anchor} fill="#6E7079" font-size="10" font-family="inherit">{lbl}</text>
    {/each}

    {#each LEGEND as { status, label }, i}
      <rect x={LABEL_W + i * 80} y={legY - 8} width="12" height="8" fill={STATUS_COLOR[status]} rx="2" fill-opacity="0.85" />
      <text x={LABEL_W + i * 80 + 16} y={legY} fill="#6E7079" font-size="10" font-family="inherit">{label}</text>
    {/each}
  </svg>
</div>
