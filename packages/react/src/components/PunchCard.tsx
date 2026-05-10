export interface PunchCardProps {
  data: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  color?: string;
  height?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD = { t: 16, r: 8, b: 28, l: 28 };
const DEFAULT_ROWS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function PunchCard({
  data,
  rowLabels,
  colLabels,
  color = '#006FFF',
  height = 180,
  ariaLabel = 'Punch card chart',
}: PunchCardProps) {
  if (!data.length || !data[0]?.length) return null;

  const rows = data.length;
  const cols = data[0].length;
  const chartW = VW - PAD.l - PAD.r;
  const chartH = height - PAD.t - PAD.b;
  const cellW = chartW / cols;
  const cellH = chartH / rows;
  const maxR = Math.min(cellW, cellH) / 2 * 0.85;
  const maxVal = Math.max(...data.flat(), 1);

  const rLabels = rowLabels ?? DEFAULT_ROWS.slice(0, rows);
  const cLabels = colLabels ?? Array.from({ length: cols }, (_, i) =>
    i % 6 === 0 ? String(i).padStart(2, '0') : ''
  );

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {rLabels.map((lbl, ri) => (
          <text
            key={ri}
            x={PAD.l - 4}
            y={PAD.t + (ri + 0.5) * cellH + 3}
            fontSize={8}
            fill="#6E7079"
            textAnchor="end"
            fontFamily="inherit"
          >
            {lbl}
          </text>
        ))}
        {cLabels.map((lbl, ci) =>
          lbl ? (
            <text
              key={ci}
              x={PAD.l + (ci + 0.5) * cellW}
              y={height - 6}
              fontSize={7}
              fill="#6E7079"
              textAnchor="middle"
              fontFamily="inherit"
            >
              {lbl}
            </text>
          ) : null
        )}
        {data.flatMap((row, ri) =>
          row.map((val, ci) => {
            const r = Math.sqrt(val / maxVal) * maxR;
            if (r < 0.4) return null;
            return (
              <circle
                key={`${ri}-${ci}`}
                cx={PAD.l + (ci + 0.5) * cellW}
                cy={PAD.t + (ri + 0.5) * cellH}
                r={r}
                fill={color}
                fillOpacity={0.72}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
