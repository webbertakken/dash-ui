<script module lang="ts">
  export interface FunnelSegment {
    label: string;
    value: number;
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    segments?: FunnelSegment[];
    height?: number;
    ariaLabel?: string;
  }

  let { segments = [], height = 160, ariaLabel = 'Funnel chart' }: Props = $props();

  const VW = 320;
  const PAD = { t: 4, r: 8, b: 4, l: 8 };
  const SEP = 2;
  const DEFAULT_COLORS = ['#006FFF', '#0092FF', '#00B4C2', '#00C875', '#F5A623'];

  let maxVal = $derived(segments.length ? Math.max(...segments.map((s) => s.value)) : 1);
  let n = $derived(segments.length);
  let chartH = $derived(height - PAD.t - PAD.b);
  let slotH = $derived(n > 0 ? (chartH - SEP * (n - 1)) / n : chartH);
  let chartW = $derived(VW - PAD.l - PAD.r);
  let cx = $derived(PAD.l + chartW / 2);
  let widths = $derived(segments.map((s) => (s.value / (maxVal || 1)) * chartW));

  let shapes = $derived(segments.map((s, i) => {
    const tw = widths[i];
    const bw = i + 1 < n ? widths[i + 1] : widths[i] * 0.7;
    const y0 = PAD.t + i * (slotH + SEP);
    const y1 = y0 + slotH;
    return {
      points: `${(cx - tw / 2).toFixed(1)},${y0.toFixed(1)} ${(cx + tw / 2).toFixed(1)},${y0.toFixed(1)} ${(cx + bw / 2).toFixed(1)},${y1.toFixed(1)} ${(cx - bw / 2).toFixed(1)},${y1.toFixed(1)}`,
      color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      label: s.label,
      value: s.value,
      cx: cx.toFixed(1),
      cy: ((y0 + y1) / 2).toFixed(1),
    };
  }));
</script>

<div role="img" aria-label={ariaLabel} style="width:100%;">
  <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
    {#each shapes as s, i (i)}
      <polygon points={s.points} fill={s.color} fill-opacity="0.75" />
      <text x={s.cx} y={s.cy} text-anchor="middle" dominant-baseline="central" fill="rgba(255,255,255,0.9)" font-size="10" font-family="inherit" font-weight="500">
        {s.label} · {s.value}
      </text>
    {/each}
  </svg>
</div>
