export interface SparklineMatrixRow {
  label: string;
  values: number[];
  unit?: string;
  color?: string;
}

export interface SparklineMatrixProps {
  rows: SparklineMatrixRow[];
  height?: number;
  ariaLabel?: string;
}

const VW = 380;
const PAD_L = 76;
const PAD_R = 44;
const SPARK_PAD_X = 8;
const SPARK_PAD_Y = 5;
const PALETTE = ['#006FFF', '#00C875', '#7FB6FF', '#F5A623', '#FF7B7B', '#A78BFA'];

export function SparklineMatrix({
  rows,
  height = 160,
  ariaLabel = 'Sparkline matrix',
}: SparklineMatrixProps) {
  if (!rows.length) return null;

  const rowH = height / rows.length;
  const sparkX0 = PAD_L + SPARK_PAD_X;
  const sparkW = VW - PAD_L - PAD_R - SPARK_PAD_X * 2;
  const sparkH = rowH - SPARK_PAD_Y * 2;

  const computed = rows.map((row, i) => {
    const y0 = i * rowH + SPARK_PAD_Y;
    const color = row.color ?? PALETTE[i % PALETTE.length];
    const min = Math.min(...row.values);
    const max = Math.max(...row.values);
    const range = max - min || 1;
    const lastVal = row.values[row.values.length - 1];

    const d =
      row.values.length < 2
        ? ''
        : row.values
            .map((v, j) => {
              const x = sparkX0 + (j / (row.values.length - 1)) * sparkW;
              const y = y0 + sparkH - ((v - min) / range) * sparkH;
              return `${j === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

    const dotY = y0 + sparkH - ((lastVal - min) / range) * sparkH;
    return { color, lastVal, d, dotX: sparkX0 + sparkW, dotY };
  });

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {rows.map((row, i) => {
          const midY = i * rowH + rowH / 2;
          const { color, lastVal, d, dotX, dotY } = computed[i];
          return (
            <g key={i}>
              {i > 0 && (
                <line
                  x1={0} y1={i * rowH} x2={VW} y2={i * rowH}
                  stroke="rgba(255,255,255,0.06)" strokeWidth={1}
                />
              )}
              <text
                x={PAD_L - 6} y={midY + 3.5} textAnchor="end"
                fill="#6E7079" fontSize={9} fontFamily="inherit"
              >
                {row.label}
              </text>
              {d && (
                <path
                  d={d} fill="none" stroke={color} strokeWidth={1.5}
                  strokeLinejoin="round" strokeLinecap="round"
                />
              )}
              <circle cx={dotX} cy={dotY} r={2.5} fill={color} />
              <text
                x={VW - PAD_R + 6} y={midY + 3.5} textAnchor="start"
                fill={color} fontSize={9} fontFamily="inherit"
              >
                {Math.round(lastVal)}{row.unit ?? ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
