<script module lang="ts">
  export interface FlameNode {
    label: string;
    value?: number;
    color?: string;
    children?: FlameNode[];
  }
</script>

<script lang="ts">

  interface Props {
    root: FlameNode;
    height?: number;
    ariaLabel?: string;
  }

  let { root, height = 160, ariaLabel = 'Flame graph' }: Props = $props();

  const PALETTE = ['#006FFF', '#FF7B2E', '#F5A623', '#FB923C', '#F97316', '#EF4444', '#A78BFA'];
  const VW = 340;
  const GAP = 1.5;

  interface FlatCell {
    x: number; y: number; w: number; h: number;
    label: string; color: string; depth: number;
  }

  function nodeValue(node: FlameNode): number {
    if (node.children?.length) return node.children.reduce((s, c) => s + nodeValue(c), 0);
    return node.value ?? 1;
  }

  function treeDepth(node: FlameNode): number {
    if (!node.children?.length) return 0;
    return 1 + Math.max(...node.children.map(treeDepth));
  }

  function flatten(node: FlameNode, x: number, depth: number, w: number, levelH: number, totalHeight: number, inheritColor: string, colorIdx: { n: number }): FlatCell[] {
    let color = node.color ?? '';
    if (!color) {
      if (depth === 0) color = 'rgba(255,255,255,0.10)';
      else if (depth === 1) color = PALETTE[colorIdx.n++ % PALETTE.length];
      else color = inheritColor;
    }
    const y = totalHeight - (depth + 1) * levelH;
    const cells: FlatCell[] = [{ x, y, w, h: levelH, label: node.label, color, depth }];
    if (node.children?.length && w > 0) {
      const total = nodeValue(node);
      let cx = x;
      for (const child of node.children) {
        const cw = total > 0 ? (nodeValue(child) / total) * w : 0;
        cells.push(...flatten(child, cx, depth + 1, cw, levelH, totalHeight, color, colorIdx));
        cx += cw;
      }
    }
    return cells;
  }

  let depth = $derived(treeDepth(root));
  let levelH = $derived(height / (depth + 1));
  let cells = $derived(flatten(root, 0, 0, VW, levelH, height, PALETTE[0], { n: 0 }));
</script>

{#if cells.length > 0}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each cells as cell, i (i)}
        {#if cell.w > GAP * 2}
          <g>
            <rect
              x={cell.x + GAP / 2}
              y={cell.y + GAP / 2}
              width={Math.max(0, cell.w - GAP)}
              height={Math.max(0, cell.h - GAP)}
              fill={cell.color}
              fill-opacity={cell.depth === 0 ? 1 : cell.depth === 1 ? 0.7 : 0.85}
              rx={2}
            />
            {#if cell.w > 32}
              <text
                x={cell.x + cell.w / 2}
                y={cell.y + cell.h / 2 + 4}
                text-anchor="middle"
                font-size={Math.min(10, (cell.w - GAP) / 6, cell.h - 4)}
                fill="#fff"
                font-family="inherit"
              >{cell.label}</text>
            {/if}
          </g>
        {/if}
      {/each}
    </svg>
  </div>
{/if}
