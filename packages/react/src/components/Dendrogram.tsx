export interface DendrogramNode {
  id: string
  label: string
  children?: DendrogramNode[]
  color?: string
}

export interface DendrogramProps {
  root: DendrogramNode
  colWidth?: number
  rowHeight?: number
  ariaLabel?: string
}

interface PlacedNode {
  id: string
  label: string
  x: number
  y: number
  color: string
  isLeaf: boolean
  children: PlacedNode[]
}

const CHILD_COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342']

function placeNodes(
  n: DendrogramNode,
  depth: number,
  colWidth: number,
  rowHeight: number,
  counter: { v: number },
  color: string,
): PlacedNode {
  const nodeColor = n.color ?? color
  const isLeaf = !n.children?.length
  if (isLeaf) {
    const y = counter.v * rowHeight + rowHeight / 2
    counter.v++
    return {
      id: n.id,
      label: n.label,
      x: depth * colWidth,
      y,
      color: nodeColor,
      isLeaf: true,
      children: [],
    }
  }
  const children = n.children!.map((c, i) =>
    placeNodes(c, depth + 1, colWidth, rowHeight, counter, CHILD_COLORS[i % CHILD_COLORS.length]),
  )
  const y = (children[0].y + children[children.length - 1].y) / 2
  return {
    id: n.id,
    label: n.label,
    x: depth * colWidth,
    y,
    color: nodeColor,
    isLeaf: false,
    children,
  }
}

function treeDepth(n: DendrogramNode): number {
  if (!n.children?.length) return 0
  return 1 + Math.max(...n.children.map(treeDepth))
}

function* iterNodes(n: PlacedNode): Generator<PlacedNode> {
  yield n
  for (const c of n.children) yield* iterNodes(c)
}

function* iterLinks(n: PlacedNode): Generator<[PlacedNode, PlacedNode]> {
  for (const c of n.children) {
    yield [n, c]
    yield* iterLinks(c)
  }
}

function shiftNode(n: PlacedNode, dx: number, dy: number): PlacedNode {
  return { ...n, x: n.x + dx, y: n.y + dy, children: n.children.map((c) => shiftNode(c, dx, dy)) }
}

export function Dendrogram({
  root,
  colWidth = 130,
  rowHeight = 28,
  ariaLabel = 'Dendrogram',
}: DendrogramProps) {
  const PAD_L = 12
  const PAD_V = 10
  const LABEL_LEAF_W = 130

  const counter = { v: 0 }
  const rawRoot = placeNodes(root, 0, colWidth, rowHeight, counter, '#8B909E')
  const placed = shiftNode(rawRoot, PAD_L, PAD_V)

  const maxDepth = treeDepth(root)
  const svgW = PAD_L + (maxDepth + 1) * colWidth + LABEL_LEAF_W
  const svgH = counter.v * rowHeight + PAD_V * 2

  const nodes = [...iterNodes(placed)]
  const links = [...iterLinks(placed)]

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: '100%', height: svgH, display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {links.map(([parent, child], i) => {
          const mx = (parent.x + child.x) / 2
          const d = `M${parent.x},${parent.y} C${mx},${parent.y} ${mx},${child.y} ${child.x},${child.y}`
          return (
            <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1.5} />
          )
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={4} fill={n.color} />
            {n.isLeaf ? (
              <text x={n.x + 10} y={n.y + 4} fill="#C8CDD9" fontSize={10} fontFamily="inherit">
                {n.label}
              </text>
            ) : n.children.length === 0 || n.x === PAD_L ? (
              <text x={n.x + 10} y={n.y + 4} fill="#8B909E" fontSize={9} fontFamily="inherit">
                {n.label}
              </text>
            ) : (
              <text
                x={n.x}
                y={n.y - 7}
                fill="#8B909E"
                fontSize={9}
                fontFamily="inherit"
                textAnchor="middle"
              >
                {n.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
