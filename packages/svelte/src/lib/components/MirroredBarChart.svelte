<script module lang="ts">
  export interface MirroredBarItem {
    label: string;
    left: number;
    right: number;
  }
</script>

<script lang="ts">

  interface Props {
    items?: MirroredBarItem[];
    leftLabel?: string;
    rightLabel?: string;
    leftColor?: string;
    rightColor?: string;
    unit?: string;
    ariaLabel?: string;
  }

  let {
    items = [],
    leftLabel = 'Download',
    rightLabel = 'Upload',
    leftColor = '#006FFF',
    rightColor = '#00C8C8',
    unit = '',
    ariaLabel = 'Mirrored bar chart'
  }: Props = $props();

  const VW = 340;
  const LABEL_W = 80;
  const PAD_T = 20;
  const PAD_B = 8;
  const ROW_H = 26;
  const HALF_W = (VW - LABEL_W) / 2;
  const CX = VW / 2;

  let svgH = $derived(PAD_T + items.length * ROW_H + PAD_B);
  let maxVal = $derived(Math.max(...items.flatMap((it) => [it.left, it.right]), 1));

  function bw(val: number): number {
    return (val / maxVal) * HALF_W;
  }
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {VW} {svgH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    <text
      x={CX - LABEL_W / 2 - 6}
      y={13}
      fill="#6E7079"
      font-size="9"
      text-anchor="end"
      font-family="inherit"
    >{leftLabel}</text>

    <text
      x={CX + LABEL_W / 2 + 6}
      y={13}
      fill="#6E7079"
      font-size="9"
      text-anchor="start"
      font-family="inherit"
    >{rightLabel}</text>

    <line
      x1={CX} y1={PAD_T - 4}
      x2={CX} y2={PAD_T + items.length * ROW_H}
      stroke="rgba(255,255,255,0.12)" stroke-width="1"
    />

    {#each items as item, i (i)}
      {@const y = PAD_T + i * ROW_H}
      {@const midY = y + ROW_H / 2}
      {@const bh = ROW_H - 8}
      {@const by = y + 4}
      {@const lw = bw(item.left)}
      {@const rw = bw(item.right)}
      <g>
        <rect
          x={CX - LABEL_W / 2 - lw}
          y={by}
          width={lw}
          height={bh}
          fill={leftColor}
          opacity="0.85"
          rx="2"
        />
        <rect
          x={CX + LABEL_W / 2}
          y={by}
          width={rw}
          height={bh}
          fill={rightColor}
          opacity="0.85"
          rx="2"
        />
        <text
          x={CX}
          y={midY + 4}
          fill="#CDD0DB"
          font-size="10"
          text-anchor="middle"
          font-family="inherit"
        >{item.label}</text>
        {#if lw >= 28}
          <text
            x={CX - LABEL_W / 2 - lw + 4}
            y={midY + 4}
            fill="rgba(255,255,255,0.55)"
            font-size="9"
            text-anchor="start"
            font-family="inherit"
          >{item.left}{unit}</text>
        {/if}
        {#if rw >= 28}
          <text
            x={CX + LABEL_W / 2 + rw - 4}
            y={midY + 4}
            fill="rgba(255,255,255,0.55)"
            font-size="9"
            text-anchor="end"
            font-family="inherit"
          >{item.right}{unit}</text>
        {/if}
      </g>
    {/each}
  </svg>
</div>
