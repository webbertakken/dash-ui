export interface GanttTask {
  label: string
  start: number
  end: number
  color?: string
}

export interface GanttChartProps {
  tasks: GanttTask[]
  xLabels?: string[]
  ariaLabel?: string
}

const VW = 340
const LABEL_W = 100
const PAD_R = 8
const TRACK_W = VW - LABEL_W - PAD_R
const ROW_H = 28
const BAR_H = 14
const PAD_T = 6
const AXIS_H = 18

export function GanttChart({ tasks, xLabels = [], ariaLabel = 'Gantt chart' }: GanttChartProps) {
  const svgH = PAD_T + tasks.length * ROW_H + AXIS_H
  const ticks = xLabels.length
    ? xLabels.map((lbl, i) => ({ x: LABEL_W + (i / (xLabels.length - 1 || 1)) * TRACK_W, lbl }))
    : []

  const tx = (v: number) => LABEL_W + v * TRACK_W

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {ticks.map(({ x, lbl }, i) => (
          <g key={i}>
            <line
              x1={x}
              y1={PAD_T}
              x2={x}
              y2={PAD_T + tasks.length * ROW_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={x}
              y={PAD_T + tasks.length * ROW_H + 13}
              fill="#6E7079"
              fontSize={9}
              textAnchor="middle"
              fontFamily="inherit"
            >
              {lbl}
            </text>
          </g>
        ))}

        {tasks.map((task, i) => {
          const cy = PAD_T + i * ROW_H + ROW_H / 2
          const x1 = tx(task.start)
          const x2 = tx(task.end)
          const barW = Math.max(x2 - x1, 4)
          const color = task.color ?? '#006FFF'

          return (
            <g key={i}>
              <text
                x={LABEL_W - 6}
                y={cy + 4}
                fill="#A4A7B5"
                fontSize={10}
                textAnchor="end"
                fontFamily="inherit"
              >
                {task.label}
              </text>
              <rect
                x={x1}
                y={cy - BAR_H / 2}
                width={barW}
                height={BAR_H}
                rx={3}
                fill={color}
                opacity={0.85}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
