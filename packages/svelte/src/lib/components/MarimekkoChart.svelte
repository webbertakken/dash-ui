<script context="module" lang="ts">
  export interface MarimekkoSegment {
    label: string;
    value: number;
    color?: string;
  }
  export interface MarimekkoColumn {
    label: string;
    segments: MarimekkoSegment[];
  }
</script>

<script lang="ts">


  export let columns: MarimekkoColumn[];
  export let height = 160;
  export let ariaLabel = 'Marimekko chart';

  const PALETTE = ['#006FFF', '#00C875', '#F5A623', '#A78BFA', '#FF7B7B', '#00C8C8', '#FB923C'];
  const VW = 340;
  const LABEL_H = 22;
  const GAP = 2;

  interface Cell { x: number; y: number; w: number; h: number; color: string; label: string; }
  interface Header { x: number; w: number; label: string; }

  $: layout = (() => {
    const colTotals = columns.map(col => col.segments.reduce((s, seg) => s + seg.value, 0));
    const grandTotal = colTotals.reduce((s, t) => s + t, 0);
    if (grandTotal === 0) return { cells: [] as Cell[], headers: [] as Header[] };

    const chartH = height - LABEL_H;
    const cells: Cell[] = [];
    const headers: Header[] = [];

    let cx = 0;
    columns.forEach((col, ci) => {
      const colTotal = colTotals[ci];
      const colW = (colTotal / grandTotal) * VW;
      headers.push({ x: cx, w: colW, label: col.label });

      let sy = LABEL_H;
      col.segments.forEach((seg, si) => {
        const segH = colTotal > 0 ? (seg.value / colTotal) * chartH : 0;
        cells.push({
          x: cx, y: sy, w: colW, h: segH,
          color: seg.color ?? PALETTE[si % PALETTE.length],
          label: seg.label,
        });
        sy += segH;
      });
      cx += colW;
    });
    return { cells, headers };
  })();
</script>

{#if layout.cells.length > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each layout.headers as h, i (i)}
        {#if h.w > GAP * 2}
          <text
            x={h.x + h.w / 2}
            y={LABEL_H - 6}
            text-anchor="middle"
            font-size={Math.min(10, h.w / 6)}
            fill="#A4A7B5"
            font-family="inherit"
          >{h.label}</text>
        {/if}
      {/each}
      {#each layout.cells as cell, i (i)}
        {#if cell.w > GAP * 2 && cell.h > GAP * 2}
          <g>
            <rect
              x={cell.x + GAP / 2}
              y={cell.y + GAP / 2}
              width={Math.max(0, cell.w - GAP)}
              height={Math.max(0, cell.h - GAP)}
              fill={cell.color}
              fill-opacity={0.8}
              rx={2}
            />
            {#if cell.w > 36 && cell.h > 14}
              <text
                x={cell.x + cell.w / 2}
                y={cell.y + cell.h / 2 + 4}
                text-anchor="middle"
                font-size={Math.min(9, (cell.w - GAP) / 8, cell.h - 6)}
                fill="#fff"
                font-family="inherit"
              >{cell.label}</text>
            {/if}
          </g>
        {/if}
      {/each}
      {#each layout.headers.slice(0, -1) as h, i (i)}
        <line
          x1={h.x + h.w}
          y1={LABEL_H}
          x2={h.x + h.w}
          y2={height}
          stroke="rgba(255,255,255,0.12)"
          stroke-width={1}
        />
      {/each}
    </svg>
  </div>
{/if}
