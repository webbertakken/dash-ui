<script module lang="ts">
  export interface ViolinSeries {
    label: string;
    values: number[];
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    series?: ViolinSeries[];
    yRange?: [number, number] | undefined;
    height?: number;
    ariaLabel?: string;
  }

  let {
    series = [],
    yRange = undefined,
    height = 160,
    ariaLabel = 'Violin plot'
  }: Props = $props();

  const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342'];
  const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);
  const NUM_PTS = 60;

  function bw(vals: number[]): number {
    const n = vals.length;
    const m = vals.reduce((a, b) => a + b, 0) / n;
    const s = Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / n);
    return Math.max(0.9 * s * Math.pow(n, -0.2), 0.5);
  }

  function kde(vals: number[], h: number, pts: number[]): number[] {
    const n = vals.length;
    const c = 1 / (n * h * SQRT_TWO_PI);
    return pts.map(y => c * vals.reduce((acc, x) => {
      const z = (y - x) / h;
      return acc + Math.exp(-0.5 * z * z);
    }, 0));
  }

  function med(vals: number[]): number {
    const s = [...vals].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  const VW = 380;
  let VH = $derived(height);
  const PAD_L = 28;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 20;

  let allVals = $derived(series.flatMap(s => s.values));
  let yMin = $derived(yRange ? yRange[0] : Math.min(...allVals));
  let yMax = $derived(yRange ? yRange[1] : Math.max(...allVals));

  let TRACK_W = $derived(VW - PAD_L - PAD_R);
  let TRACK_H = $derived(VH - PAD_T - PAD_B);
  let slotW = $derived(TRACK_W / series.length);
  let maxHalfW = $derived(slotW * 0.38);

  let evalPts = $derived(Array.from({ length: NUM_PTS }, (_, i) =>
    yMin + (i / (NUM_PTS - 1)) * (yMax - yMin)
  ));

  function ySvg(v: number): number {
    return PAD_T + ((yMax - v) / (yMax - yMin)) * TRACK_H;
  }

  let violins = $derived(series.map((s, si) => {
    const h = bw(s.values);
    const dens = kde(s.values, h, evalPts);
    const maxD = Math.max(...dens, 1e-9);
    const cx = PAD_L + si * slotW + slotW / 2;
    const pts = evalPts.map((v, i) => ({ x: (dens[i] / maxD) * maxHalfW, y: ySvg(v) }));
    const right = pts.map(p => `${(cx + p.x).toFixed(1)},${p.y.toFixed(1)}`);
    const left = [...pts].reverse().map(p => `${(cx - p.x).toFixed(1)},${p.y.toFixed(1)}`);
    const d = `M${cx},${ySvg(yMin)} L${right.join(' L')} L${left.join(' L')} Z`;
    const median = med(s.values);
    return {
      d,
      cx,
      medY: ySvg(median),
      maxHalfW,
      color: s.color ?? COLORS[si % COLORS.length],
      label: s.label,
    };
  }));

  let ticks = $derived([0, 0.25, 0.5, 0.75, 1].map(t => {
    const v = yMin + t * (yMax - yMin);
    return { v, y: ySvg(v) };
  }));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg
    viewBox="0 0 {VW} {VH}"
    style="width:100%;height:auto;display:block;"
    aria-hidden="true"
    focusable="false"
  >
    {#each ticks as tick (tick.v)}
      <line x1={PAD_L} y1={tick.y} x2={VW - PAD_R} y2={tick.y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x={PAD_L - 3} y={tick.y + 3} fill="#6E7079" font-size="8" text-anchor="end" font-family="inherit">{tick.v.toFixed(0)}</text>
    {/each}
    {#each violins as v, si (si)}
      <path d={v.d} fill={v.color} opacity="0.72" />
      <line
        x1={v.cx - v.maxHalfW * 0.45}
        y1={v.medY}
        x2={v.cx + v.maxHalfW * 0.45}
        y2={v.medY}
        stroke="#fff"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <text x={v.cx} y={VH - 5} fill="#6E7079" font-size="8" text-anchor="middle" font-family="inherit">{v.label}</text>
    {/each}
  </svg>
</div>
