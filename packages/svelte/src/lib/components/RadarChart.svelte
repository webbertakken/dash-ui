<script module lang="ts">
  export interface RadarSeries {
    label: string;
    color: string;
    values: number[];
  }
</script>

<script lang="ts">

  interface Props {
    series?: RadarSeries[];
    axes?: string[];
    height?: number;
    ariaLabel?: string;
  }

  let {
    series = [],
    axes = [],
    height = 200,
    ariaLabel = 'Radar chart'
  }: Props = $props();

  const VW = 400;
  const PAD = 36;

  function pt(cx: number, cy: number, r: number, angle: number): [number, number] {
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function makePts(coords: [number, number][]): string {
    return coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  }

  let n = $derived(axes.length);
  let cx = $derived(VW / 2);
  let cy = $derived(height / 2);
  let R = $derived(Math.min(cx, cy) - PAD);
  let angles = $derived(axes.map((_, i) => (2 * Math.PI * i) / n - Math.PI / 2));

  let rings = $derived(n >= 3
    ? [0.25, 0.5, 0.75, 1.0].map((f) => makePts(angles.map((a) => pt(cx, cy, R * f, a))))
    : []);

  let axisLines = $derived(n >= 3
    ? angles.map((a) => { const [x, y] = pt(cx, cy, R, a); return { x: x.toFixed(1), y: y.toFixed(1) }; })
    : []);

  let axisLabels = $derived(n >= 3
    ? axes.map((label, i) => {
        const [x, y] = pt(cx, cy, R + 16, angles[i]);
        const cos = Math.cos(angles[i]);
        const anchor = Math.abs(cos) < 0.3 ? 'middle' : cos < 0 ? 'end' : 'start';
        return { x: x.toFixed(1), y: y.toFixed(1), label, anchor };
      })
    : []);

  let polygons = $derived(n >= 3
    ? series.map((s) => ({
        pts: makePts(angles.map((a, i) => pt(cx, cy, R * Math.max(0, Math.min(1, s.values[i] ?? 0)), a))),
        color: s.color,
        label: s.label,
      }))
    : []);
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each rings as p}
      <polygon points={p} fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    {/each}
    {#each axisLines as end}
      <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    {/each}
    {#each polygons as p (p.label)}
      <polygon points={p.pts} fill={p.color} fill-opacity="0.12" stroke={p.color} stroke-width="1.5" stroke-linejoin="round" />
    {/each}
    {#each axisLabels as l (l.label)}
      <text x={l.x} y={l.y} text-anchor={l.anchor} fill="#6E7079" font-size="9" font-family="inherit" dominant-baseline="middle">{l.label}</text>
    {/each}
  </svg>
</div>
