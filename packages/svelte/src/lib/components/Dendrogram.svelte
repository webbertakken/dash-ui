<script module lang="ts">
  export interface DendrogramNode {
    id: string;
    label: string;
    children?: DendrogramNode[];
    color?: string;
  }
</script>

<script lang="ts">

  interface PlacedNode {
    id: string;
    label: string;
    x: number;
    y: number;
    color: string;
    isLeaf: boolean;
    children: PlacedNode[];
  }

  const CHILD_COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342'];
  const PAD_L = 12;
  const PAD_V = 10;
  const LABEL_LEAF_W = 130;

  function countLeaves(n: DendrogramNode): number {
    if (!n.children?.length) return 1;
    return n.children.reduce((s, c) => s + countLeaves(c), 0);
  }

  function treeDepth(n: DendrogramNode): number {
    if (!n.children?.length) return 0;
    return 1 + Math.max(...n.children.map(treeDepth));
  }

  function placeNodes(
    n: DendrogramNode,
    depth: number,
    cw: number,
    rh: number,
    counter: { v: number },
    color: string,
  ): PlacedNode {
    const nodeColor = n.color ?? color;
    const isLeaf = !n.children?.length;
    if (isLeaf) {
      const y = counter.v * rh + rh / 2;
      counter.v++;
      return { id: n.id, label: n.label, x: depth * cw, y, color: nodeColor, isLeaf: true, children: [] };
    }
    const children = n.children!.map((c, i) =>
      placeNodes(c, depth + 1, cw, rh, counter, CHILD_COLORS[i % CHILD_COLORS.length]),
    );
    const y = (children[0].y + children[children.length - 1].y) / 2;
    return { id: n.id, label: n.label, x: depth * cw, y, color: nodeColor, isLeaf: false, children };
  }

  function iterNodes(n: PlacedNode): PlacedNode[] {
    return [n, ...n.children.flatMap(iterNodes)];
  }

  function iterLinks(n: PlacedNode): Array<[PlacedNode, PlacedNode]> {
    return n.children.flatMap((c) => [[n, c] as [PlacedNode, PlacedNode], ...iterLinks(c)]);
  }

  function compute(root: DendrogramNode, colWidth: number, rowHeight: number) {
    const counter = { v: 0 };
    const raw = placeNodes(root, 0, colWidth, rowHeight, counter, '#8B909E');
    const leafCount = counter.v;
    const placed: PlacedNode = {
      ...raw,
      x: raw.x + PAD_L,
      y: raw.y + PAD_V,
      children: shiftChildren(raw.children, PAD_L, PAD_V),
    };
    const maxDepth = treeDepth(root);
    return {
      placed,
      svgW: PAD_L + (maxDepth + 1) * colWidth + LABEL_LEAF_W,
      svgH: leafCount * rowHeight + PAD_V * 2,
      nodes: iterNodes(placed),
      links: iterLinks(placed),
    };
  }

  function shiftChildren(children: PlacedNode[], dx: number, dy: number): PlacedNode[] {
    return children.map((c) => ({
      ...c,
      x: c.x + dx,
      y: c.y + dy,
      children: shiftChildren(c.children, dx, dy),
    }));
  }

  interface Props {
    root: DendrogramNode;
    colWidth?: number;
    rowHeight?: number;
    ariaLabel?: string;
  }

  let {
    root,
    colWidth = 130,
    rowHeight = 28,
    ariaLabel = 'Dendrogram'
  }: Props = $props();

  let { svgW, svgH, nodes, links } = $derived(compute(root, colWidth, rowHeight));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;overflow-x:auto">
  <svg
    viewBox="0 0 {svgW} {svgH}"
    style="width:100%;height:{svgH}px;display:block"
    aria-hidden="true"
    focusable="false"
  >
    {#each links as [parent, child], i (i)}
      {@const mx = (parent.x + child.x) / 2}
      <path
        d="M{parent.x},{parent.y} C{mx},{parent.y} {mx},{child.y} {child.x},{child.y}"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        stroke-width="1.5"
      />
    {/each}
    {#each nodes as n (n.id)}
      <circle cx={n.x} cy={n.y} r={4} fill={n.color} />
      {#if n.isLeaf}
        <text x={n.x + 10} y={n.y + 4} fill="#C8CDD9" font-size="10" font-family="inherit">{n.label}</text>
      {:else if n.x === PAD_L}
        <text x={n.x + 10} y={n.y + 4} fill="#8B909E" font-size="9" font-family="inherit">{n.label}</text>
      {:else}
        <text x={n.x} y={n.y - 7} fill="#8B909E" font-size="9" font-family="inherit" text-anchor="middle">{n.label}</text>
      {/if}
    {/each}
  </svg>
</div>
