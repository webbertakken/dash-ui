<script module lang="ts">
  export interface WaffleSegment {
    label: string;
    value: number;
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    segments?: WaffleSegment[];
    total?: number | undefined;
    cols?: number;
    rows?: number;
    gap?: number;
    ariaLabel?: string;
  }

  let {
    segments = [],
    total = undefined,
    cols = 10,
    rows = 10,
    gap = 2,
    ariaLabel = 'Waffle chart'
  }: Props = $props();

  const COLORS = ['#006FFF', '#00C7A8', '#F5A623', '#FF6B6B', '#A78BFA'];
  const VW = 280;
  const LEGEND_H = 24;

  let sum = $derived(total ?? segments.reduce((s, seg) => s + seg.value, 0));
  let cellSize = $derived((VW - gap * (cols - 1)) / cols);
  let gridH = $derived(rows * cellSize + gap * (rows - 1));
  let svgH = $derived(gridH + LEGEND_H + 6);
  let totalCells = $derived(cols * rows);

  let cellMap = $derived((() => {
    const map: number[] = new Array(totalCells).fill(-1);
    let cursor = 0;
    segments.forEach((seg, si) => {
      const count = Math.round((seg.value / sum) * totalCells);
      for (let j = 0; j < count && cursor < totalCells; j++, cursor++) {
        map[cursor] = si;
      }
    });
    return map;
  })());

  let cells = $derived(Array.from({ length: totalCells }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (cellSize + gap);
    const y = row * (cellSize + gap);
    const si = cellMap[i];
    const fill = si >= 0 ? (segments[si].color ?? COLORS[si % COLORS.length]) : 'rgba(255,255,255,0.06)';
    return { x, y, fill, width: cellSize, height: cellSize };
  }));

  let legendItems = $derived(segments.map((seg, si) => ({
    color: seg.color ?? COLORS[si % COLORS.length],
    pct: Math.round((seg.value / sum) * 100),
    label: seg.label,
    lx: si * (VW / segments.length),
    ly: gridH + 8,
  })));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {svgH}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each cells as cell}
      <rect x={cell.x} y={cell.y} width={cell.width} height={cell.height} fill={cell.fill} rx="1" />
    {/each}
    {#each legendItems as item}
      <rect x={item.lx} y={item.ly} width="8" height="8" fill={item.color} rx="1" />
      <text x={item.lx + 11} y={item.ly + 7.5} fill="#A4A7B5" font-size="9" font-family="inherit">
        {item.label} {item.pct}%
      </text>
    {/each}
  </svg>
</div>
